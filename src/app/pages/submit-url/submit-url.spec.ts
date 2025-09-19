import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitUrl } from './submit-url';

describe('SubmitUrl', () => {
  let component: SubmitUrl;
  let fixture: ComponentFixture<SubmitUrl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitUrl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitUrl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
