import { Component, OnInit } from '@angular/core';
import { CommonDataService } from '../../service/common-data.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  error: any;
  constructor(
    private commonDataService: CommonDataService
    ) { }

  ngOnInit() {
    this.commonDataService.currentMessage.subscribe(error => {
      this.error = error;
    });

  }

}
