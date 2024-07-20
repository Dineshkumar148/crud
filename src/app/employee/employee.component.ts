import { Component, inject, OnInit, signal } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { ToastService } from '../services/toast-message/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DeleteAlertDialogComponent } from '../delete-alert/delete-alert.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatMenuModule, MatIconModule, MatPaginatorModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  employee: any[] = [];
  pageSize = 10;
  pageIndex = 0;
  totalEmployee = signal(0);
  #empService = inject(EmployeeService);
  #toastService = inject(ToastService);
  #dialog = inject(MatDialog);

  ngOnInit() {
    this.getEmployee();
  }

  handlePagination(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getEmployee();
  }

  deleteConfirmDialog(id: number) {
    const ref = this.#dialog.open(DeleteAlertDialogComponent, {
      data: {
        data: id,
        title: 'Are you sure want to Delete Employee Details?',
      },
      disableClose: true,
      maxHeight: '240px',
      maxWidth: '500px',
      panelClass: 'own-css',
    });
    ref.afterClosed().subscribe((userConfirmed) => {
      if (userConfirmed) {
        this.deleteEmployeeDetails(id);
      }
    });
  }

  async deleteEmployeeDetails(id: number) {
    try {
      await this.#empService.deleteEmployee(id);
      this.#toastService.showMessage('Employee deleted successfully', 'success');
      this.getEmployee();
    } catch (error: unknown) {
      this.#toastService.showMessage((error as HttpErrorResponse)?.error?.error ?? 'Failed to delete employee', 'error');
    }
  }

  async getEmployee() {
    try {
      const result = await this.#empService.getParColorsDev(this.pageIndex * this.pageSize, this.pageSize);
      if (result) {
        this.employee = result.employees;
        this.totalEmployee.set(result.count);
      }
    } catch (error: unknown) {
      this.#toastService.showMessage((error as HttpErrorResponse)?.error?.error ?? 'Failed to get employee', 'error');
    }
  }
}
