import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingDetailsComponent } from './mapping-details.component';

describe('MappingDetailsComponent', () => {
  let component: MappingDetailsComponent;
  let fixture: ComponentFixture<MappingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MappingDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
