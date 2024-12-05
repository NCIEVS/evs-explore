import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './component/error/error.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { GeneralSearchComponent } from './component/general-search/general-search.component';
import { ConceptDisplayComponent } from './component/concept-display/concept-display.component';
import { HierarchyDisplayComponent } from './component/hierarchy-display/hierarchy-display.component';
import { MappingsComponent } from './component/mappings/mappings.component';
import { SubsetsComponent } from './component/subsets/subsets.component';
import { AssociationsComponent } from './component/documentation/associations/associations.component';
import { PropertiesComponent } from './component/documentation/properties/properties.component';
import { QualifiersComponent } from './component/documentation/qualifiers/qualifiers.component';
import { OverviewComponent } from './component/documentation/overview/overview.component';
import { TermTypesComponent } from './component/documentation/term-types/term-types.component';
import { SourcesComponent } from './component/documentation/sources/sources.component';
import { SourceStatsComponent } from './component/source-stats/source-stats.component';
import { RolesComponent } from './component/documentation/roles/roles.component';
import { ContactUsComponent } from './component/contact-us/contact-us.component';
import { DefinitionTypesComponent } from './component/documentation/definition-types/definition-types.component';
import { SubsetDetailsComponent } from './component/subset-details/subset-details.component';
import { SynonymTypesComponent } from './component/documentation/synonym-types/synonym-types.component';
import { AlldocsComponent } from './component/documentation/alldocs/alldocs.component';
import { SubsetNcitComponent } from './component/documentation/subset-ncit/subset-ncit.component';
import { EvsApiComponent } from './component/evs-api/evs-api.component';
import { MappingDetailsComponent } from './component/mapping-details/mapping-details.component';
import { TermSuggestionFormComponent } from './component/term-suggestion-form/term-suggestion-form.component';
import {HierarchyPopoutComponent} from './component/hierarchy-popout/hierarchy-popout.component';
// import { WelcomeComponent } from './component/welcome/welcome.component';

// Routes defined
const routes: Routes = [
  { path: 'search', component: GeneralSearchComponent },
  { path: 'concept/:terminology/:code', component: ConceptDisplayComponent },
  { path: 'concept/:code', redirectTo: 'concept/ncit/:code' },
  { path: 'hierarchy/:terminology/:code', component: HierarchyDisplayComponent },
  { path: 'hierarchy/:code', redirectTo: 'hierarchy/:terminology/:code' },
  { path: 'hierarchy-popout/:terminology/:code', component: HierarchyPopoutComponent },
  { path: 'hierarchy-popout/:code', redirectTo: 'hierarchy-popout/:terminology/:code' },
  { path: 'subset/:terminology/:code', component: SubsetDetailsComponent },
  { path: 'subset/:code', redirectTo: 'subset/ncit/:code' },
  { path: 'mappings', component: MappingsComponent },
  { path: 'mappings/:code', component: MappingDetailsComponent },
  { path: 'subsets/:terminology', component: SubsetsComponent },
  { path: 'subsets', redirectTo: 'subsets/ncit' },
  { path: 'associations', redirectTo: 'associations/ncit', pathMatch: 'full' },
  { path: 'associations/:terminology', component: AssociationsComponent },
  { path: 'properties/:terminology', component: PropertiesComponent },
  { path: 'properties', redirectTo: 'properties/ncit', pathMatch: 'full' },
  { path: 'qualifiers/:terminology', component: QualifiersComponent },
  { path: 'qualifiers', redirectTo: 'qualifiers/ncit', pathMatch: 'full' },
  { path: 'overview', component: OverviewComponent },
  { path: 'termtypes', redirectTo: 'termtypes/ncit', pathMatch: 'full' },
  { path: 'termtypes/:terminology', component: TermTypesComponent },
  { path: 'definitiontypes/:terminology', component: DefinitionTypesComponent },
  { path: 'definitiontypes', redirectTo: 'definitiontypes/ncit', pathMatch: 'full' },
  { path: 'synonymtypes/:terminology', component: SynonymTypesComponent },
  { path: 'synonymtpyes', redirectTo: 'synonymtypes/ncit', pathMatch: 'full' },
  { path: 'alldocs', redirectTo: 'alldocs/ncit', pathMatch: 'full' },
  { path: 'alldocs/:terminology', component: AlldocsComponent },
  { path: 'sources/:terminology', component: SourcesComponent },
  { path: 'sources/:terminology/:source', component: SourceStatsComponent },
  { path: 'sources', redirectTo: 'sources/ncit', pathMatch: 'full' },
  { path: 'roles/:terminology', component: RolesComponent },
  { path: 'roles', redirectTo: 'roles/ncit', pathMatch: 'full' },
  { path: 'welcome', component: GeneralSearchComponent },
  { path: 'subsetncit', component: SubsetNcitComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'evsapi', component: EvsApiComponent },
  { path: 'termform', component: TermSuggestionFormComponent},
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
