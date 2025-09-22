import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveUrlsComponent } from './approve-urls';

describe('ApproveUrls', () => {
  let component: ApproveUrlsComponent;
  let fixture: ComponentFixture<ApproveUrlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveUrlsComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveUrlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
