import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

interface ConfirmationData {
  title?: string;
}

@Component({
  selector: 'app-update-confirmation-alert',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule
],
  templateUrl: './update-confirmation-alert.component.html',
  styleUrl: './update-confirmation-alert.component.scss'
})
export class UpdateConfirmationAlertComponent {
  item: ConfirmationData = {};
  constructor(
    public dialogRef: MatDialogRef<UpdateConfirmationAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationData
  ) {
    this.item = this.data;
  }
  confirm() {
    this.dialogRef.close(true);
  }
}
