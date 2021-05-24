import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ConfigurationService } from 'src/app/service/configuration.service';

@Component({
  selector: 'app-alldocs',
  templateUrl: './alldocs.component.html',
  styleUrls: ['./alldocs.component.css']
})
export class AlldocsComponent {

  constructor(private configService: ConfigurationService) {}

}
