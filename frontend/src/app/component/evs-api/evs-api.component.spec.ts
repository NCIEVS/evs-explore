import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvsApiComponent } from './evs-api.component';

describe('EvsApiComponent', () => {
  let component: EvsApiComponent;
  let fixture: ComponentFixture<EvsApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvsApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvsApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
