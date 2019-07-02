import { Component, OnInit } from '@angular/core';

import { FileLoadingService } from './../../../service/file-loading.service';

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
