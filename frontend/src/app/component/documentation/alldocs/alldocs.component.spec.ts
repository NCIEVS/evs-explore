import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlldocsComponent } from './alldocs.component';

describe('AlldocsComponent', () => {
  let component: AlldocsComponent;
  let fixture: ComponentFixture<AlldocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlldocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlldocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
