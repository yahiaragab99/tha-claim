import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { QrCodeService } from '../services/qr-code.service';
import { ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MessagePreset } from '../models/message-preset.entity';
import { MatButtonModule } from '@angular/material/button';
import { MessageService } from '../services/message.service';
import { QrCode } from '../models/qrcode.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationType } from '../models/notification-type.entity';
import { NotificationService } from '../services/notification.service';
@Component({
  selector: 'app-claim-qr',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './claim-qr.component.html',
  styleUrl: './claim-qr.component.css',
})
export class ClaimQrComponent implements OnInit {
  private qrCodeService = inject(QrCodeService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);

  @ViewChild('messageTextArea') messageTextArea!: ElementRef;

  notificationTypes!: NotificationType[];
  presets!: MessagePreset[];
  selectedPreset: string = '';
  scannedQrCode!: QrCode;
  isQrClaimed?: boolean = false;
  qrCodeId!: string;
  userId?: string;
  messageId?: string;

  isMessageSent: boolean = false;
  isLoading: boolean = false;
  ngOnInit(): void {
    this.isLoading = true;
    this.route.queryParams.subscribe((params) => {
      this.qrCodeId = params['id'];
      this.checkClaim(this.qrCodeId);
      this.isLoading = false;
    });
    this.notificationService.getNotificationTypes().subscribe({
      next: (data: any) => {
        this.notificationTypes = data.items;
      },
    });
  }

  checkClaim(qrCodeId: string) {
    this.qrCodeService.isQrClaimed(qrCodeId).subscribe({
      next: (data: QrCode) => {
        this.scannedQrCode = data;
        this.isQrClaimed = this.scannedQrCode.isClaimed;
        this.userId = this.scannedQrCode.user_id;
      },
    });

    this.messageService.getMessagePresets().subscribe({
      next: (data: any) => {
        this.presets = data.items;
      },
    });
  }

  onSendMessage() {
    this.isLoading = true;
    const messageText = this.messageTextArea.nativeElement.value;
    console.log(messageText);
    this.messageService
      .sendMessage(
        this.scannedQrCode.user_id,
        messageText,
        this.scannedQrCode.id,
        null
      )
      .subscribe({
        next: (data: any) => {
          console.log('h1', data);
          if (data.message == 'Message added') this.isMessageSent = true;
          this.messageId = data.messageId;
          this.notificationService
            .addNotification(
              this.userId,
              this.qrCodeId,
              this.notificationTypes.find((type) => type.title == 'Message')
                ?.id,
              this.messageId
            )
            .subscribe();
          this.isLoading = false;
        },
      });
  }

  getSelectedPreset() {
    return this.presets.find((preset) => preset.id == this.selectedPreset)
      ?.presetText;
  }
}
