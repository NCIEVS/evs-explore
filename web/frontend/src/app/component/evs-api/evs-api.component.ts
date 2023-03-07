import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-evs-api',
  templateUrl: './evs-api.component.html',
  styleUrls: ['./evs-api.component.css']
})
export class EvsApiComponent implements OnInit {

  apiUrl: any;
  constructor(private sanitizer: DomSanitizer, private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('EVS Explore API');
    this.apiUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.swagger);
  }

}
