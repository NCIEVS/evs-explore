import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlldocsComponent } from './alldocs.component';
import { AssociationsComponent } from '../associations/associations.component';
import { PropertiesComponent } from '../properties/properties.component';
import { QualifiersComponent } from '../qualifiers/qualifiers.component';
import { RolesComponent } from '../roles/roles.component';
import { TermTypesComponent } from '../term-types/term-types.component';
import { SourcesComponent } from '../sources/sources.component';
import { DefinitionTypesComponent } from '../definition-types/definition-types.component';
import { SynonymTypesComponent } from '../synonym-types/synonym-types.component';
import { AppModule } from '../../../app.module';

describe('AlldocsComponent', () => {
  let component: AlldocsComponent;
  let fixture: ComponentFixture<AlldocsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlldocsComponent ],
      imports: [
        // AppModule
      ]
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
