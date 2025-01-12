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
// import { MessagePreset } from '../models/message-preset.entity';
import { MatButtonModule } from '@angular/material/button';
import { MessageService } from '../services/message.service';
import { QrCode } from '../models/qrcode.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationType } from '../models/notification-type.entity';
import { NotificationService } from '../services/notification.service';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularPhoneNumberInput } from 'angular-phone-number-input';

const MESSAGE_PLACEHOLDER = 'I have found your lost item. Please call me.';
@Component({
  selector: 'app-claim-qr',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    AngularPhoneNumberInput,
  ],
  templateUrl: './claim-qr.component.html',
  styleUrl: './claim-qr.component.css',
})
export class ClaimQrComponent implements OnInit {
  private qrCodeService = inject(QrCodeService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);

  messageForm!: FormGroup;

  notificationTypes!: NotificationType[];
  // presets!: MessagePreset[];
  // selectedPreset: string = '';
  scannedQrCode!: QrCode;
  isQrClaimed?: boolean = false;
  qrCodeId!: string;
  userId?: string;
  messageId?: string;
  isButtonDisabled: boolean = false;

  isMessageSent: boolean = false;
  isLoading: boolean = false;
  ngOnInit(): void {
    this.isLoading = true;
    this.messageForm = new FormGroup({
      message: new FormControl(MESSAGE_PLACEHOLDER, [Validators.required]),
      senderPhoneNumber: new FormControl('', [Validators.required]),
    });
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

    // this.messageService.getMessagePresets().subscribe({
    //   next: (data: any) => {
    //     this.presets = data.items;
    //   },
    // });
  }

  onSendMessage() {
    this.isLoading = true;
    if (!this.messageForm?.valid) return;
    const messageText = this.messageForm.value.message;
    const phoneNumber = this.messageForm.value.senderPhoneNumber;
    console.log(this.messageForm.value);
    this.messageService
      .sendMessage(
        this.scannedQrCode.user_id,
        messageText,
        this.scannedQrCode.id,
        null,
        phoneNumber
      )
      .subscribe({
        next: (data: any) => {
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

  // getSelectedPreset() {
  //   return this.presets.find((preset) => preset.id == this.selectedPreset)
  //     ?.presetText;
  // }
}
