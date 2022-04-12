import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TermGroupsComponent } from './term-groups.component';

// Testing for TermGroupssComponent (default tests)
describe('TermGroupsComponent', () => {
  let component: TermGroupsComponent;
  let fixture: ComponentFixture<TermGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TermGroupsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
