import { User } from './user.model';

export interface QrCode {
  id: string;
  code: string | null | undefined;

  itemName: string | null | undefined;
  itemDetails?: string | null | undefined;
  itemCategoryId?: string | null | undefined;
  isClaimed?: boolean;

  user_id?: string;
  user?: User;
}
