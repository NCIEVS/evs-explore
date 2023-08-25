import { Component, TemplateRef, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ConfigurationService } from './service/configuration.service';

declare var gtag

// Application component
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('licenseModal', { static: true }) licenseModal: TemplateRef<any>;
  licenseText: string;
  private subscription = null;

  constructor(private router: Router, private modalService: NgbModal, private configService: ConfigurationService, private cookieService: CookieService) {
    const navEndEvent$ = router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    );
    navEndEvent$.subscribe((e: NavigationEnd) => {
      // Only report google tags in prod mode
      if (environment.production && environment.productionHost == location.hostname) {
        gtag('config', environment.code, { 'page_path': e.urlAfterRedirects });
      }
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + environment.code;
    document.head.prepend(script);
  }

  // Scroll to top whenever route changes
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      if (this.router.url.indexOf('#') == -1) {
        window.scrollTo(0, 0);
      }
    });

    // Subscribe to terminology chagnes and check license text
    this.subscription = this.configService.getSubject().subscribe(terminology => {
      this.checkLicenseText();
    });

    // BAC: this is all beign handled by individual controllers
    // var pathLength = window.location.pathname.split('/').length;
    // if (pathLength > 2) {
    //   let terminology = window.location.pathname.split('/')[pathLength - 1];
    //   this.configService.setTerminology(this.configService.getTerminologyByName(terminology));
    // }
    // else if (window.location.search) {
    //   let terminology = window.location.search.split('=')[1];
    //   this.configService.setTerminology(this.configService.getTerminologyByName(terminology));
    // }
    // // default terminology in config
    // else this.configService.setTerminology(this.configService.getTerminologyByName(this.configService.getDefaultTerminologyName()));
  }

  // After initializing view, check license text
  ngAfterViewInit(): void {
    var terminology = this.configService.getTerminology();
    if (terminology && terminology.metadata && terminology.metadata.licenseText) {
      this.checkLicenseText();
    }
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  // Check license text and show banner
  checkLicenseText(term = null) {
    let terminology = null;
    if (term != null) {
      terminology = this.configService.getTerminologyByName(term);
    }
    else {
      terminology = this.configService.getTerminology();
    }
    if (terminology.metadata.licenseText && !this.cookieService.check(terminology.terminology + 'License')) {
      this.licenseText = terminology.metadata.licenseText;
      var modalref = this.modalService.open(this.licenseModal, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
      modalref.result.then((result) => {
        this.cookieService.set(terminology.terminology + 'License', 'accepted', 365);
        console.log('License Text');
        modalref.close();
      });
    }
  }
}
