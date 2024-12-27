import { Component, inject, OnInit } from '@angular/core';
import { QrCodeService } from '../services/qr-code.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-claim-qr',
  standalone: true,
  imports: [],
  templateUrl: './claim-qr.component.html',
  styleUrl: './claim-qr.component.css',
})
export class ClaimQrComponent implements OnInit {
  private qrCodeService = inject(QrCodeService);
  private route = inject(ActivatedRoute);
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
