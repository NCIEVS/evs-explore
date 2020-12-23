import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective {
  constructor(private host: ElementRef) { }

  ngAfterViewInit() {
    console.log('xxx autofocus');
    setTimeout(() => this.host.nativeElement.focus());
  }
}
