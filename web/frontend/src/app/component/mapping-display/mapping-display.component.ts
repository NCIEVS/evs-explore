import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from 'src/app/service/configuration.service';

@Component({
  selector: 'app-mapping-display',
  templateUrl: './mapping-display.component.html',
  styleUrls: ['./mapping-display.component.css']
})
export class MappingDisplayComponent implements OnInit {

  avoidLazyLoading = true;
  mapsetCode: string;

  mapsetMappings: any;

  pageSize = 10;
  fromRecord = 0;
  total = 0;

  constructor(private route: ActivatedRoute,
    private configService: ConfigurationService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      console.log(params.code)
      this.mapsetCode = params.code
      this.configService.getMapsetMappings("ncit", this.mapsetCode).subscribe(response => {
        this.mapsetMappings = response["maps"];
        this.total = response["total"];
        console.log(this.mapsetMappings);
        console.log(this.total);
      });
    });
  }

  // Handle lazy loading of table
  onLazyLoadData(event) {
    if (this.avoidLazyLoading) {
      this.avoidLazyLoading = false;
    } else {
      const pageSize = event.rows;
      const fromRecord = event.first;
      this.configService.getMapsetMappings('ncit', this.mapsetCode, pageSize, fromRecord)
        .subscribe(response => {
          this.mapsetMappings = response["maps"];
          this.total = response["total"];
          console.log(this.mapsetMappings);
          console.log(this.total);
        });
      this.fromRecord = fromRecord;
      this.pageSize = pageSize;
    }
  }

}
