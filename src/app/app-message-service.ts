import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AppMessageService {
  private readonly messageService = inject(MessageService);

  addErrorMessage(error: HttpErrorResponse, summary: string): void;

  addErrorMessage(error: HttpErrorResponse, summary: string, defaultDetail: string): void;

  addErrorMessage(error: HttpErrorResponse, summary: string, defaultDetail?: string): void {
    let detail: string;
    if (defaultDetail) {
      detail = defaultDetail!;
    } else {
      detail = 'An unexpected error occurred.';
    }

    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: this.parseHttpError(error, detail),
    });
  }

  addSuccessMessage(summary: string, detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: summary,
      detail: detail,
    });
  }

  private parseHttpError(error: HttpErrorResponse, defaultDetail: string): string {
    if (error.error?.message) {
      return error.error.message;
    } else if (error.status === 0) {
      return 'Cannot connect to the server. Please check your internet connection.';
    }
    return defaultDetail;
  }
}
