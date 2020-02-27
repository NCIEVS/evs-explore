import { Component, OnInit } from '@angular/core';
import { Inject, AfterViewInit, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// Footer component
@Component({
  selector: 'app-evs-footer',
  templateUrl: './evs-footer.component.html',
  styleUrls: ['./evs-footer.component.css']
})
export class EvsFooterComponent implements OnInit {

  constructor( @Inject(DOCUMENT) private document,
  private elementRef: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const s = this.document.createElement('script');
    s.type = 'text/javascript';
    s.src = '//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9';
    this.elementRef.nativeElement.appendChild(s);
  }

}
