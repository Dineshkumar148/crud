import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';

export const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
  },
  {
    path: 'createemployee',
    component: CreateEmployeeComponent,
  }
];
