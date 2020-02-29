// Angular Modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
// import { Injector, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split'

// Facebook modules
import { FacebookModule } from 'ngx-facebook';

// Primeng Modules, Services
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ChipsModule } from 'primeng/chips';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TreeTableModule } from 'primeng/treetable';
import { ToggleButtonModule } from 'primeng/togglebutton';

// ngx
import { NgxSpinnerModule } from 'ngx-spinner';
import { GeneralSearchComponent } from './component/general-search/general-search.component';
import { ConceptDetailComponent } from './component/concept-detail/concept-detail.component';
import { ConceptRelationshipComponent } from './component/concept-relationship/concept-relationship.component';
import { ConceptDisplayComponent } from './component/concept-display/concept-display.component';
import { HierarchyDisplayComponent } from './component/hierarchy-display/hierarchy-display.component';
import { ValueSetsComponent } from './component/value-sets/value-sets.component';
import { MappingsComponent } from './component/mappings/mappings.component';
import { AssociationsComponent } from './component/documentation/associations/associations.component';
import { PropertiesComponent } from './component/documentation/properties/properties.component';
import { OverviewComponent } from './component/documentation/overview/overview.component';
import { RolesComponent } from './component/documentation/roles/roles.component';
import { TermTypesComponent } from './component/documentation/term-types/term-types.component';
import { WelcomeComponent } from './component/welcome/welcome.component';

// Local Modules
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Local components
import { NotificationComponent } from './component/notifications/notifications.component';
import { ErrorComponent } from './component/error/error.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { EvsHeaderComponent } from './component/evs-header/evs-header.component';
import { EvsFooterComponent } from './component/evs-footer/evs-footer.component';
import { LoaderComponent } from './component/loader/loader.component';

// pipes
// BAC - looks like not used
import { DisplayPipe } from './service/display.pipe';

// Local services
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfigurationService } from './service/configuration.service';
import { GlobalErrorHandler } from './service/global-error-handler.service';
import { NotificationService } from './service/notification.service';
import { CommonDataService } from './service/common-data.service';
import { LoadingInterceptor } from './service/loading-interceptor.service';
import { LoaderService } from './service/loader.service';
import { ConceptDetailService } from './service/concept-detail.service';
import { ConvertSearchResultsService } from './service/convert-search-results.service';
import { SearchTermService } from './service/search-term.service';

// Angular configuration for this application
@NgModule({
  declarations: [
    AppComponent,
    EvsHeaderComponent,
    EvsFooterComponent,
    NotificationComponent,
    ErrorComponent,
    PageNotFoundComponent,
    LoaderComponent,
    DisplayPipe,
    GeneralSearchComponent,
    ConceptDetailComponent,
    ConceptRelationshipComponent,
    ConceptDisplayComponent,
    HierarchyDisplayComponent,
    ValueSetsComponent,
    MappingsComponent,
    AssociationsComponent,
    PropertiesComponent,
    OverviewComponent,
    RolesComponent,
    TermTypesComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FacebookModule.forRoot(),
    MessagesModule,
    MessageModule,
    HttpClientModule,
    FormsModule,
    BlockUIModule,
    NgxSpinnerModule,
    ToastModule,
    MultiSelectModule,
    PanelModule,
    AutoCompleteModule,
    ButtonModule,
    RadioButtonModule,
    ChipsModule,
    TooltipModule,
    ToolbarModule,
    TableModule,
    TabViewModule,
    TreeTableModule,
    DropdownModule,
    ToggleButtonModule,
    AngularSplitModule.forRoot()
  ],
  exports: [
    NotificationComponent,
    DisplayPipe
  ],
  providers: [
    NotificationService,
    CommonDataService,
    MessageService,
    LoaderService,
    ConceptDetailService,
    ConvertSearchResultsService,
    SearchTermService,
    GlobalErrorHandler,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    ConfigurationService,
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigurationService) => function () {
        return configService.loadConfig();
      },
      deps: [ConfigurationService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})

// Export this module
export class AppModule { }
