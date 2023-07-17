import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSearchComponent } from './multi-search.component';

describe('MultiSearchComponent', () => {
  let component: MultiSearchComponent;
  let fixture: ComponentFixture<MultiSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
