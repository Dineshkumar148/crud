import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { WhatsappComponent } from './whatsapp/whatsapp.component';

export const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    title: 'Employee',
  },
  {
    path: 'createemployee',
    component: CreateEmployeeComponent,
    title: 'Create | Employee',
  },
  {
    path: 'employees/edit/:id',
    component: EditEmployeeComponent,
    title: 'Edit | Employee',
  },
  {
    path: 'employee/details/:id',
    component: EmployeeDetailsComponent,
    title: 'Employee | Details',
  },
  {
    path: 'whatsapp',
    component: WhatsappComponent,
    title: 'Whatsapp | Message',
  },
];
