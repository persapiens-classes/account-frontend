import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

export function addMessageService(messageService: MessageService,
  error: HttpErrorResponse,
  summary: string): void

export function addMessageService(messageService: MessageService,
  error: HttpErrorResponse,
  summary: string,
  defaultDetail: string): void

export function addMessageService(messageService: MessageService,
  error: HttpErrorResponse,
  summary: string,
  defaultDetail?: string): void {

  let detail: string
  if (defaultDetail) {
    detail = defaultDetail!
  }
  else {
    detail = 'An unexpected error occurred.'
  }

  messageService.add({
    severity: 'error',
    summary: summary,
    detail: parseHttpError(error, detail)
  })
}

function parseHttpError(error: HttpErrorResponse, defaultDetail: string): string {
  if (error.error?.message) {
    return error.error.message
  } else if (error.status === 0) {
    return 'Cannot connect to the server. Please check your internet connection.'
  }
  return defaultDetail
}
