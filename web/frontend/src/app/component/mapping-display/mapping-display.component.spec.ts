import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingDisplayComponent } from './mapping-display.component';

describe('MappingDisplayComponent', () => {
  let component: MappingDisplayComponent;
  let fixture: ComponentFixture<MappingDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappingDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
