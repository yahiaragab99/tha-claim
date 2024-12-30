import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { QrCode } from '../models/qrcode.model';

const API_BASE_URL = environment.serverUrl + '/qrcode';
@Injectable({
  providedIn: 'root',
})
export class QrCodeService {
  private http = inject(HttpClient);

  constructor() {}

  isQrClaimed(qrCodeId: string) {
    return this.http.post<QrCode>(API_BASE_URL + '/isclaimed/' + qrCodeId, {
      withCredentials: true,
    });
  }
}
