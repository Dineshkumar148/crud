import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../services/toast-message/toast.service';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css',
})
export class EmployeeDetailsComponent {
  empDetails: any;
  employeeId!: number;
  #toastService = inject(ToastService);
  #empService = inject(EmployeeService);
  #route = inject(ActivatedRoute);

  ngOnInit() {
    this.#route.params.subscribe((params) => {
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
        this.empDetails = employee;
      }
    } catch (error: unknown) {
      this.#toastService.showMessage(
        (error as HttpErrorResponse)?.error?.message ??
          'Failed to load employee details',
        'error'
      );
    }
  }
}
