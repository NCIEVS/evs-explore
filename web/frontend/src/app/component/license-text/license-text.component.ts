import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-license-text',
  templateUrl: './license-text.component.html',
  styleUrls: ['./license-text.component.css']
})
export class LicenseTextComponent implements OnInit {

  constructor(private cookieService: CookieService) { }

  ngOnInit(): void {
  }

  checkLicenseText(terminology, licenseText) {
    if (this.cookieService.check(terminology + 'License')) {
      return true;
    }
    alert(licenseText)
    this.cookieService.set(terminology + 'License', 'accepted', 365);
    return true;
  }

}
