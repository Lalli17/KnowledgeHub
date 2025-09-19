import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseUrls } from './browse-urls';

describe('BrowseUrls', () => {
  let component: BrowseUrls;
  let fixture: ComponentFixture<BrowseUrls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseUrls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseUrls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
