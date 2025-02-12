import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SynonymTypesComponent } from './synonym-types.component';

// Testing for SynonymTypesComponent (default tests)
describe('SynonymTypesComponent', () => {
  let component: SynonymTypesComponent;
  let fixture: ComponentFixture<SynonymTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SynonymTypesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynonymTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
