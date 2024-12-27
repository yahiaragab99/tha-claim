import { Component, inject, OnInit } from '@angular/core';
import { QrCodeService } from '../services/qr-code.service';
import { ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MessagePreset } from '../models/message-preset.entity';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-claim-qr',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './claim-qr.component.html',
  styleUrl: './claim-qr.component.css',
})
export class ClaimQrComponent implements OnInit {
  private qrCodeService = inject(QrCodeService);
  private route = inject(ActivatedRoute);
  presets: MessagePreset[] = [
    {
      id: '1',
      name: 'Option 1',
      message: 'Option 1 message',
    },
    {
      id: '2',
      name: 'Option 2',
      message: 'Option 2 message',
    },
    {
      id: '3',
      name: 'Option 3',
      message: 'Option 3 message',
    },
  ];
  selectedPreset: string = '';
  isClaimed!: boolean;
  qrCodeId!: string;
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.qrCodeId = params['id'];
      this.checkClaim(this.qrCodeId);
    });
  }

  checkClaim(qrCodeId: string) {
    this.qrCodeService.isQrClaimed(qrCodeId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.isClaimed = data;
      },
    });
  }
}
