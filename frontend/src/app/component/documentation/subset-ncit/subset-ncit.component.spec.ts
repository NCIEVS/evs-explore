import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsetNcitComponent } from './subset-ncit.component';

describe('SubsetNcitComponent', () => {
  let component: SubsetNcitComponent;
  let fixture: ComponentFixture<SubsetNcitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsetNcitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsetNcitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
