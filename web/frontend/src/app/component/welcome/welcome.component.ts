import { Component, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// Welcome screen component (simple component wrapper around welcome.component.html)
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements AfterViewInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;

  // Constructor
  constructor(private modalService: NgbModal) { }

  // Post initialization
  ngAfterViewInit() {
    if (sessionStorage.getItem('hhsBanner') == null) {
      this.open(this.content);
    }
  }

  // Open ng-template #content as a modal dialog
  open(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      sessionStorage.setItem('hhsBanner', 'accepted');
      console.log('HHS Banner Accepted');
    }, (result) => {
      sessionStorage.setItem('hhsBanner', 'accepted');
      console.log('HHS Banner Accepted');
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
