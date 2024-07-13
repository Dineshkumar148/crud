import { Component, Inject } from '@angular/core';import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface ConfirmationData {
  title?: string;
  message?: string;
}

@Component({
  selector: 'app-delete-alert-dialog',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule,  FormsModule],
  templateUrl: './delete-alert.component.html',
  styleUrls: ['./delete-alert.component.scss']
})
export class DeleteAlertDialogComponent {
  item: ConfirmationData = {};
  constructor(
    public dialogRef: MatDialogRef<DeleteAlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationData
  ) {
    this.item = this.data;
  }
  confirm() {
    this.dialogRef.close(true);
  }

}
