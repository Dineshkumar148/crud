import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../services/toast-message/toast.service';
import { EmployeeService } from '../services/employee.service';
import { UpdateConfirmationAlertComponent } from '../update-confirmation-alert/update-confirmation-alert.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
})
export class EditEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId!: number;
  #fb = inject(FormBuilder);
  #toastService = inject(ToastService);
  #empService = inject(EmployeeService);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #dialog = inject(MatDialog);

  constructor() {
    this.employeeForm = this.#fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      designation: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.#route.params.subscribe(params => {
      this.employeeId = params['id'];
      if (this.employeeId) {
        this.loadEmployeeData(this.employeeId);
      }
    });
  }

  async loadEmployeeData(id: number) {
    try {
      const employee = await this.#empService.getEmployeeById(id);
      if (employee) {
        this.employeeForm.patchValue(employee);
      }
    } catch (error: unknown) {
      this.#toastService.showMessage(
        (error as HttpErrorResponse)?.error?.message ?? 'Failed to load employee data',
        'error'
      );
    }
  }

  async updateEmployeeDialog()  {
    const ref = this.#dialog.open(UpdateConfirmationAlertComponent, {
      data: {
        title: 'Are you sure want to update the Employee Details?',
      },
      disableClose: true,
      maxHeight: '240px',
      maxWidth: '500px',
      panelClass: 'own-css',
    });
    ref.afterClosed().subscribe((userConfirmed) => {
      if (userConfirmed) {
        this.updateEmployee();
      }
    });
  }

  async updateEmployee() {
    try {
      if (this.employeeForm.invalid) {
        return;
      }
      const employee = await this.#empService.updateEmployee(this.employeeId, this.employeeForm.value);
      if (employee) {
        this.#toastService.showMessage('Employee updated successfully', 'success');
        this.#router.navigate(['../']);
      }
    } catch (error: unknown) {
      this.#toastService.showMessage(
        (error as HttpErrorResponse)?.error?.message ?? 'Failed to update the employee',
        'error'
      );
    }
  }
}
