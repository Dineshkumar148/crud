import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  #snackBar = inject(MatSnackBar);
  constructor() { }
  showMessage(message: string, type: 'success' | 'error'): void {
    const panelClass = type === 'success' ? 'toast-success' : 'toast-error';
    this.#snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: [panelClass],
    });
  }
}
