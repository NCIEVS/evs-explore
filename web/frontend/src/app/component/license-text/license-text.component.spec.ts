import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseTextComponent } from './license-text.component';

describe('LicenseTextComponent', () => {
  let component: LicenseTextComponent;
  let fixture: ComponentFixture<LicenseTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
