import { QrCode } from './qrcode.model';
export interface User {
  id: string | null | undefined;
  email: string | null | undefined;
  profile_pic_url: string | null | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  phoneNumber: string | null | undefined;

  qrCodes: QrCode[];
}
