import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8000/api/employees';

  constructor(private http: HttpClient) {}

  getParColorsDev(): Promise<any> {
    return lastValueFrom(this.http.get<any>(this.apiUrl));
  }

  createEmployee(data: any) {
    return lastValueFrom(this.http.post(this.apiUrl, data));
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
