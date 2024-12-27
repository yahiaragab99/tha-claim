import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimQrComponent } from './claim-qr.component';

describe('ClaimQrComponent', () => {
  let component: ClaimQrComponent;
  let fixture: ComponentFixture<ClaimQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimQrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClaimQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
