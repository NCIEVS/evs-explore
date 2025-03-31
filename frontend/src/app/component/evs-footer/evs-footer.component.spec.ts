import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvsFooterComponent } from './evs-footer.component';

// Testing for EvsFooterComponent (default tests)
describe('EvsFooterComponent', () => {
  let component: EvsFooterComponent;
  let fixture: ComponentFixture<EvsFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvsFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
