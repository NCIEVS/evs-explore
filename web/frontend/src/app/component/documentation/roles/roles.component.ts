import { Component, OnInit } from '@angular/core';
import { FileLoadingService } from './../../../service/file-loading.service';

// Documentation roles component
// BAC - looks like not used
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  roles: any;

  constructor(
    private fileLoadingService: FileLoadingService
  ) { }

  ngOnInit() {
    this.fileLoadingService.getDataFromFile('roles.json')
      .subscribe(response => {
        this.roles = response;
      });
  }

}
