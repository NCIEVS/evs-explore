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
import { TermGroupsComponent } from './component/documentation/term-groups/term-groups.component';
import { SourcesComponent } from './component/documentation/sources/sources.component';
import { RolesComponent } from './component/documentation/roles/roles.component';
import { ContactUsComponent } from './component/contact-us/contact-us.component';
import { DefinitionTypesComponent } from './component/documentation/definition-types/definition-types.component';
import { SubsetDetailsComponent } from './component/subset-details/subset-details.component';
import { SynonymTypesComponent } from './component/documentation/synonym-types/synonym-types.component';
import { AlldocsComponent } from './component/documentation/alldocs/alldocs.component';
import { SubsetNcitComponent } from './component/documentation/subset-ncit/subset-ncit.component';
import { EvsApiComponent } from './component/evs-api/evs-api.component';
// import { WelcomeComponent } from './component/welcome/welcome.component';

// Routes defined
const routes: Routes = [
  { path: 'search', component: GeneralSearchComponent },
  { path: 'concept/:terminology/:code', component: ConceptDisplayComponent },
  { path: 'concept/:code', redirectTo: 'concept/ncit/:code' },
  { path: 'hierarchy/:terminology/:code', component: HierarchyDisplayComponent },
  { path: 'hierarchy/:code', redirectTo: 'hierarchy/:terminology/:code' },
  { path: 'subset/:terminology/:code', component: SubsetDetailsComponent },
  { path: 'subset/:code', redirectTo: 'subset/ncit/:code' },
  { path: 'mappings', component: MappingsComponent },
  { path: 'subsets/:terminology', component: SubsetsComponent },
  { path: 'subsets', redirectTo: 'subsets/ncit' },
  { path: 'associations', component: AssociationsComponent },
  { path: 'properties', component: PropertiesComponent },
  { path: 'qualifiers', component: QualifiersComponent },
  { path: 'overview', component: OverviewComponent },
  { path: 'termgroups', component: TermGroupsComponent },
  { path: 'definitiontypes', component: DefinitionTypesComponent },
  { path: 'synonymtypes', component: SynonymTypesComponent },
  { path: 'alldocs', component: AlldocsComponent },
  { path: 'sources', component: SourcesComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'welcome', component: GeneralSearchComponent },
  { path: 'subsetncit', component: SubsetNcitComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'evsapi', component: EvsApiComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
