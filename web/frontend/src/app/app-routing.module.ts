import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent} from './component/error/error.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { GeneralSearchComponent } from './component/general-search/general-search.component';
import { ConceptDisplayComponent } from './component/concept-display/concept-display.component';
import { HierarchyDisplayComponent } from './component/hierarchy-display/hierarchy-display.component';
import { MappingsComponent } from './component/mappings/mappings.component';
import { ValueSetsComponent } from './component/value-sets/value-sets.component';
import { AssociationsComponent } from './component/documentation/associations/associations.component';

const routes: Routes = [
  { path: 'search', component: GeneralSearchComponent },
  { path: 'concept/:code', component: ConceptDisplayComponent },  
  { path: 'hierarchy/:code', component: HierarchyDisplayComponent },
  { path: 'mappings', component: MappingsComponent },
  { path: 'valuesets', component: ValueSetsComponent },
  { path: 'associations', component: AssociationsComponent },
  { path: 'error', component: ErrorComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
