import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DefinitionTypesComponent } from './definition-types.component';

// Testing for DefinitionTypesComponent (default tests)
describe('DefinitionTypesComponent', () => {
  let component: DefinitionTypesComponent;
  let fixture: ComponentFixture<DefinitionTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DefinitionTypesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinitionTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
