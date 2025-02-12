import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/service/configuration.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  terminology: string;

  constructor(private configService: ConfigurationService) {
    this.terminology = this.configService.getTerminology();
  }

  ngOnInit(): void {
  }

}
