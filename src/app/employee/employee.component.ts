import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { ToastService } from '../services/toast-message/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent implements OnInit {
  employee: any[] = [];
  #empService = inject(EmployeeService);
  #toastService = inject(ToastService);

  ngOnInit() {
    this.getEmployee();
  }

  async getEmployee() {
    try {
      const result = await this.#empService.getParColorsDev();
      if (result) {
        this.employee = result;
      }
    } catch (error: unknown) {
      this.#toastService.showMessage(
        (error as HttpErrorResponse)?.error?.error ?? 'Failed to get employee',
        'error'
      );
    }
  }
}
