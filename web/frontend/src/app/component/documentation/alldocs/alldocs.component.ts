import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/service/configuration.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-alldocs',
  templateUrl: './alldocs.component.html',
  styleUrls: ['./alldocs.component.css']
})
export class AlldocsComponent {

  terminology = null;

  constructor(private titleService: Title) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.titleService.setTitle('EVS Explore - All Documentation');
  }
}
