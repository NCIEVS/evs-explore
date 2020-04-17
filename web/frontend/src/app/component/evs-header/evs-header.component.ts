import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../service/configuration.service';

// Header component
@Component({
  selector: 'app-evs-header',
  templateUrl: './evs-header.component.html',
  styleUrls: ['./evs-header.component.css']
})
export class EvsHeaderComponent implements OnInit {
  versionInfo = null;
  constructor() { }

  ngOnInit() {
    this.versionInfo = '(Version: ' + ConfigurationService.terminology.version
      + '; Release Date: ' + ConfigurationService.terminology.date + ')';
  }

}
