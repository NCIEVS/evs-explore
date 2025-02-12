import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralSearchComponent } from './general-search.component';

describe('GeneralSearchComponent', () => {
  let component: GeneralSearchComponent;
  let fixture: ComponentFixture<GeneralSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
