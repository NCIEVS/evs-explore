import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { DefinitionTypesComponent } from './definition-types.component';

import { NotificationService } from '../../../service/notification.service';

import { provideHttpClient } from '@angular/common/http';

// Testing for DefinitionTypesComponent (default tests)
describe('DefinitionTypesComponent', () => {
  let component: DefinitionTypesComponent;
  let fixture: ComponentFixture<DefinitionTypesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DefinitionTypesComponent],
      providers: [
        NotificationService,
        provideHttpClient()
      ]
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
