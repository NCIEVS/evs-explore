import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QualifiersComponent } from './qualifiers.component';

// Testing for QualifiersComponent
describe('QualifiersComponent', () => {
  let component: QualifiersComponent;
  let fixture: ComponentFixture<QualifiersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QualifiersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualifiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
