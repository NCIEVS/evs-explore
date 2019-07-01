import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvsHeaderComponent } from './evs-header.component';

describe('EvsHeaderComponent', () => {
  let component: EvsHeaderComponent;
  let fixture: ComponentFixture<EvsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
