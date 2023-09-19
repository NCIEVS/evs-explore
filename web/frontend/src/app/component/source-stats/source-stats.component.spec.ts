import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceStatsComponent } from './source-stats.component';

describe('SourceStatsComponent', () => {
  let component: SourceStatsComponent;
  let fixture: ComponentFixture<SourceStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
