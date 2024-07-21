import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8000/api/employee';

  constructor(private http: HttpClient) {}

  getParColorsDev(skip: number, take: number): Promise<any> {
    return lastValueFrom(this.http.get<any>(`${this.apiUrl}?skip=${skip}&take=${take}`));
  }

  createEmployee(data: any) {
    return lastValueFrom(this.http.post(this.apiUrl, data));
  }

  bulkCreateEmployees(employees: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/bulk`, { employees });
  }
  
  getEmployeeById(id: number): Promise<any> {
    return lastValueFrom(this.http.get<any>(`${this.apiUrl}/${id}`));
  }

  updateEmployee(id: number, data: any) {
    return lastValueFrom(this.http.put(`${this.apiUrl}/${id}`, data));
  }

  deleteEmployee(id: number): Promise<any> {
    return lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  }
}
