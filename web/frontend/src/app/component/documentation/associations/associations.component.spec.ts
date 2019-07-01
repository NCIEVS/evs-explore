import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationsComponent } from './associations.component';

describe('AssociationsComponent', () => {
  let component: AssociationsComponent;
  let fixture: ComponentFixture<AssociationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
