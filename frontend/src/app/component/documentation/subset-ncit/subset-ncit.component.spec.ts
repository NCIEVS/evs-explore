import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubsetNcitComponent } from './subset-ncit.component';

import { NotificationService } from '../../../service/notification.service';

import { provideHttpClient } from '@angular/common/http';
import { provideRouter, RouterModule } from '@angular/router';

describe('SubsetNcitComponent', () => {
  let component: SubsetNcitComponent;
  let fixture: ComponentFixture<SubsetNcitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsetNcitComponent ],
      imports: [
        RouterModule
      ],
      providers: [
        NotificationService,
        provideHttpClient(),
        provideRouter([])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsetNcitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
