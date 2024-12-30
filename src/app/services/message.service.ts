import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

const API_BASE_URL = environment.serverUrl + '/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  http = inject(HttpClient);
  constructor() {}

  sendMessage(
    recipientId: string | undefined,
    messageBody: string | undefined,
    qrCodeId: string | undefined,
    presetId: string | null
  ) {
    return this.http.post(API_BASE_URL + '/new/' + recipientId, {
      message: messageBody,
      presetId: presetId,
      qrCodeId: qrCodeId,
    });
  }

  getMessagePresets() {
    return this.http.get(API_BASE_URL + '/presets');
  }
}
