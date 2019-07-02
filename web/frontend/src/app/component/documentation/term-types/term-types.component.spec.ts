import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermTypesComponent } from './term-types.component';

describe('TermTypesComponent', () => {
  let component: TermTypesComponent;
  let fixture: ComponentFixture<TermTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
