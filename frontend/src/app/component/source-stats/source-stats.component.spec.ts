import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SourceStatsComponent } from './source-stats.component';

import { NotificationService } from '../../service/notification.service';

import { provideHttpClient } from '@angular/common/http';

describe('SourceStatsComponent', () => {
  let component: SourceStatsComponent;
  let fixture: ComponentFixture<SourceStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceStatsComponent ],
      providers: [
        NotificationService,
        provideHttpClient()
      ]
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
