import { Component, TemplateRef, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ConfigurationService } from './service/configuration.service';
import { Title } from '@angular/platform-browser';

declare var gtag;

// Application component
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('licenseModal', { static: true }) licenseModal: TemplateRef<any>;
  licenseText: string;
  private subscription = null;
  private gtagConfig = false;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private configService: ConfigurationService,
    private cookieService: CookieService,
    private titleService: Title,
  ) {
    const navEndEvent$ = router.events.pipe(filter((e) => e instanceof NavigationEnd));
    navEndEvent$.subscribe((e: NavigationEnd) => {
      // Only report where google tags are present and hostname matches expectations
      if (environment.code && environment.host == location.hostname) {
        if (!this.gtagConfig) {
          gtag('config', environment.code);
          this.gtagConfig = true;
        }
        gtag('event', 'page_view', {
          page_title: titleService.getTitle(),
          page_path: e.urlAfterRedirects,
          page_location: this.router.url,
        });
      }
    });

    // Setup google tracking
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

    // Subscribe to terminology changes and check license text
    this.subscription = this.configService.getSubject().subscribe((terminology) => {
      this.checkLicenseText().then((isLicenseAccepted) => {
        if (!isLicenseAccepted) {
          this.router.navigateByUrl('/welcome?terminology=ncit');
        }
      });
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
  async ngAfterViewInit(): Promise<void> {
    const terminology = this.configService.getTerminology();
    if (terminology && terminology.metadata && terminology.metadata.licenseText) {
      const isLicenseAccepted = await this.checkLicenseText();
      if (!isLicenseAccepted) {
        this.router.navigateByUrl('/welcome?terminology=ncit');
      }
    }
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  // Check license text and show banner
  checkLicenseText(term = null): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let terminology = null;
      if (term != null) {
        terminology = this.configService.getTerminologyByName(term);
      } else {
        terminology = this.configService.getTerminology();
      }
      const cookieName = terminology.terminology + 'License';
      if (terminology.metadata.licenseText && !this.cookieService.check(cookieName)) {
        this.licenseText = terminology.metadata.licenseText;
        const modalref = this.modalService.open(this.licenseModal, {
          size: 'lg',
          ariaLabelledBy: 'modal-basic-title',
          backdrop: 'static'
        });
        modalref.result.then((result) => {
          this.cookieService.set(cookieName, 'accepted', 365);
          console.log(cookieName + ' License Text Accepted');
          modalref.close();
          resolve(true);
        }, (result) => {
          this.cookieService.delete(cookieName);
          console.log(cookieName + ' License Text Rejected');
          modalref.close();
          resolve(false);
        });
      } else {
        // There should be no license text, therefore return true
        resolve(true);
      }
    });
  }
}
