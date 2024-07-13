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
    return lastValueFrom(this.http.post(this.apiUrl, data))
  }
}
