// create-employee.component.ts
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

interface Employee {
  id: number;
}

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.css',
})
export class CreateEmployeeComponent {
  employeeForm: FormGroup;
  #fb = inject(FormBuilder);
  #toastService = inject(ToastService);
  #empService = inject(EmployeeService);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  excelData: any[] = [];
  fileName: string = '';
  
  constructor() {
    this.employeeForm = this.#fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.email]],
      designation: ['', [Validators.required]],
    });
  }

  // single employee create

  async createEmployee() {
    try {
      if (this.employeeForm.invalid) {
        return;
      }
      const employee = (await this.#empService.createEmployee(
        this.employeeForm.value
      )) as Employee;
      if (employee) {
        this.#toastService.showMessage(
          'Employee created successfully',
          'success'
        );
        this.#router.navigate(['../'], { relativeTo: this.#route });
      }
    } catch (error: unknown) {
      const errorMessage = (error as HttpErrorResponse)?.error?.error ?? 'Failed to create the employee';
      console.log(errorMessage);
      
      this.#toastService.showMessage(errorMessage, 'error');
    }
  }


  // bulk upload 

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    this.fileName = target.files[0].name;
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
    reader.readAsBinaryString(target.files[0]);
  }

  removeFile() {
    this.fileName = '';
    this.excelData = [];
  }

  removeRow(index: number) {
    this.excelData.splice(index, 1);
  }

  async uploadData() {
    try {
      const result = await lastValueFrom(this.#empService.bulkCreateEmployees(this.excelData));
      if (result) {
        this.#toastService.showMessage('Employees bulk data uploaded successfully', 'success');
        this.#router.navigate(['../'], { relativeTo: this.#route });
      }
    } catch (error: unknown) {
      const errorMessage = (error as HttpErrorResponse)?.error?.error ?? 'Failed to upload the employees bulk data';
      console.log(errorMessage);
      this.#toastService.showMessage(errorMessage, 'error');
    }
  }

}
