import { Component, inject } from '@angular/core';
import { WhatsappService } from '../services/whatsapp.service';
import { ToastService } from '../services/toast-message/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-whatsapp',
  standalone: true,
  imports: [],
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.css'],
})
export class WhatsappComponent {
  appName = 'whatsapp';
  mobileNumber = '919524414213';
  templateName = 'oem_delivery_update';
  languageCode = 'en_US';
  orderNumber = '7639';
  date = 'Jul 19 2024';

  #whatsappService = inject(WhatsappService);
  #toastService = inject(ToastService);

  async sendMessage() {
    const parameters = [this.orderNumber, this.date];
    const data = {
      appName: this.appName,
      mobileNumber: this.mobileNumber,
      templateName: this.templateName,
      languageCode: this.languageCode,
      parameters: parameters,
    };

    try {
      const response = await this.#whatsappService
        .sendMessage(data)
        .toPromise();
      if (response) {
        this.#toastService.showMessage('Message sent successfully', 'success');
      }
      console.log('Message sent successfully', response);
    } catch (error: unknown) {
      const errorMessage =
        (error as HttpErrorResponse)?.error?.error ?? 'Failed to send message';
      console.log(errorMessage);
      this.#toastService.showMessage(errorMessage, 'error');
    }
  }
}
