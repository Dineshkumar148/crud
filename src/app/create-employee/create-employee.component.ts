import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../services/toast-message/toast.service';
import { EmployeeService } from '../services/employee.service';

interface Employee {
  id: number;
}

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
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
  
  constructor() {
    this.employeeForm = this.#fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      designation: ['', [Validators.required]],
    });
  }

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
      this.#toastService.showMessage(
        (error as HttpErrorResponse)?.error?.message ??
          'Failed to create the employee',
        'error'
      );
    }
  }
}
