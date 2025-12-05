import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../../service/configuration.service';

@Component({
  selector: 'app-subset-ncit',
  templateUrl: './subset-ncit.component.html',
  styleUrls: ['./subset-ncit.component.css'],
  standalone: false
})
export class SubsetNcitComponent implements OnInit {

  constructor(
    private configService: ConfigurationService
  ) { }

  ngOnInit(): void {
  }

}
