import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

const API_BASE_URL = environment.serverUrl + '/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  http = inject(HttpClient);
  constructor() {}

  getNotificationTypes() {
    return this.http.get(API_BASE_URL + '/types');
  }

  addNotification(
    userId: string | undefined,
    qrCodeId: string,
    notificationTypeId: string | undefined,
    messageId?: string | null
  ) {
    return this.http.post(API_BASE_URL + '/new', {
      userId: userId,
      qrCodeId: qrCodeId,
      notificationTypeId: notificationTypeId,
      messageId: messageId,
    });
  }
}
