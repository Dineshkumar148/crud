import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../services/toast-message/toast.service';
import { EmployeeService } from '../services/employee.service';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { NgCircleProgressModule } from 'ng-circle-progress';

interface Employee {
  id: number;
}

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule, NgCircleProgressModule],
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css'],
})
export class CreateEmployeeComponent {
  employeeForm: FormGroup;
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private empService = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  excelData: any[] = [];
  fileName: string = '';
  allowedFileTypes = ['.xlsx', '.ods', '.csv', '.tsv'];
  uploadProgress: number = 0; // Track upload progress
  isUploading: boolean = false; // Track if upload is in progress

  constructor() {
    this.employeeForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.email]],
      designation: ['', [Validators.required]],
    });
  }

  async createEmployee() {
    try {
      if (this.employeeForm.invalid) {
        return;
      }
      const employee = (await this.empService.createEmployee(this.employeeForm.value)) as Employee;
      if (employee) {
        this.toastService.showMessage('Employee created successfully', 'success');
        this.router.navigate(['../'], { relativeTo: this.route });
      }
    } catch (error: unknown) {
      const errorMessage = (error as HttpErrorResponse)?.error?.error ?? 'Failed to create the employee';
      console.log(errorMessage);
      this.toastService.showMessage(errorMessage, 'error');
    }
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 1) {
      this.toastService.showMessage('Upload a single file at a time', 'error');
      return;
    }
    const file = files[0];
    if (file) {
      this.validateAndHandleFile(file);
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 1) {
      this.toastService.showMessage('Upload a single file at a time', 'error');
      return;
    }
    const file = files ? files[0] : null;
    if (file) {
      this.validateAndHandleFile(file);
    }
  }

  validateAndHandleFile(file: File) {
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!this.allowedFileTypes.includes(fileExtension)) {
      this.toastService.showMessage('File format not supported', 'error');
      return;
    }
    this.handleFile(file);
  }

  handleFile(file: File) {
    this.fileName = file.name;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.excelData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.excelData.shift();
      this.excelData = this.excelData.map(row => ({
        firstname: row[0],
        lastname: row[1],
        email: row[2],
        designation: row[3]
      }));
    };
    reader.readAsBinaryString(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    const dropArea = event.currentTarget as HTMLElement;
    dropArea.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent) {
    const dropArea = event.currentTarget as HTMLElement;
    dropArea.classList.remove('drag-over');
  }

  onFileClick() {
    const fileInput = document.getElementById('excelFile') as HTMLInputElement;
    fileInput.click();
  }

  removeFile() {
    this.fileName = '';
    this.excelData = [];
    this.uploadProgress = 0;
    this.isUploading = false;
  }

  removeRow(index: number) {
    this.excelData.splice(index, 1);
  }

  async uploadData() {
    try {
      this.isUploading = true;
      const totalRows = this.excelData.length;
      for (let i = 0; i < totalRows; i++) {
        await lastValueFrom(this.empService.bulkCreateEmployees([this.excelData[i]]));
        this.uploadProgress = Math.round(((i + 1) / totalRows) * 100);
      }
      this.toastService.showMessage('Employees bulk data uploaded successfully', 'success');
      this.router.navigate(['../'], { relativeTo: this.route });
    } catch (error: unknown) {
      const errorMessage = (error as HttpErrorResponse)?.error?.error ?? 'Failed to upload the employees bulk data';
      console.log(errorMessage);
      this.toastService.showMessage(errorMessage, 'error');
    } finally {
      this.isUploading = false;
      this.uploadProgress = 0;
    }
  }
}
