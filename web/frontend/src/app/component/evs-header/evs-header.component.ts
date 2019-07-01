import { Component, OnInit } from '@angular/core';
import { ConfigurationService} from '../../service/configuration.service';

@Component({
  selector: 'app-evs-header',
  templateUrl: './evs-header.component.html',
  styleUrls: ['./evs-header.component.css']
})
export class EvsHeaderComponent implements OnInit {
  versionInfo = null;
  constructor() { }

  ngOnInit() {
    this.versionInfo = '(Version: ' + ConfigurationService.evsVersionInfo.version 
    + '; Release Date: ' +  ConfigurationService.evsVersionInfo.date + ')';
  }

}
