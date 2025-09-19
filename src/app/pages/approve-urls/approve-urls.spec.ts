import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveUrls } from './approve-urls';

describe('ApproveUrls', () => {
  let component: ApproveUrls;
  let fixture: ComponentFixture<ApproveUrls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveUrls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveUrls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
