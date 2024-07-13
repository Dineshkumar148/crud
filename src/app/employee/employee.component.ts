import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { ToastService } from '../services/toast-message/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAlertDialogComponent } from '../delete-alert/delete-alert.component';
import { Employee } from '../services/types/employeetype';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  employee: any[] = [];
  #empService = inject(EmployeeService);
  #toastService = inject(ToastService);
  selectedEmployeeId!: number;
  #dialog = inject(MatDialog);

  ngOnInit() {
    this.getEmployee();
  }

  deleteConfirmDialog(id: number) {
    const data = (this.selectedEmployeeId = id);
    const ref = this.#dialog.open(DeleteAlertDialogComponent, {
      data: {
        data: data,
        title: 'Are you sure want to Delete Employee Details?',
      },
      disableClose: true,
      maxHeight: '240px',
      maxWidth: '500px',
      panelClass: 'own-css',
    });
    ref.afterClosed().subscribe((userConfirmed) => {
      if (userConfirmed) {
        this.deleteEmployeeDetails();
      }
    });
  }

  async deleteEmployeeDetails() {
    try {
      await this.#empService.deleteEmployee(this.selectedEmployeeId);
      this.#toastService.showMessage('Employee deleted successfully', 'success');
      this.getEmployee(); // Refresh the employee list
    } catch (error: unknown) {
      this.#toastService.showMessage(
        (error as HttpErrorResponse)?.error?.error ?? 'Failed to delete employee',
        'error'
      );
    }
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
