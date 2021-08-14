import { Directive, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appbottomnavdir]'
})
export class BottomnavDirDirective {

  constructor(private element: ElementRef, private router: Router) {

    // console.log(this.element);

    if (
      // this.router.url.includes('profile') ||
      this.router.url.includes('BussinessEnq') ||
      this.router.url.includes('connectwithus') ||
      this.router.url.includes('faqs') ||
      this.router.url.includes('home/seller') ||
      this.router.url.includes('ticket') ||

      // this.router.url.includes('newspaark') ||
      this.router.url.includes('exploreMap') ||
      // this.router.url.includes('requests') ||
      // this.router.url.includes('home/chat') ||
      this.router.url.includes('settings')) {

      if (window.innerWidth < 951) {
        console.log(window.innerWidth);
        element.nativeElement.style.height = '10%';
      }
      else {
        element.nativeElement.style.height = '0%';
      }


    }

    else {
      if (window.innerWidth < 951) {
        console.log(window.innerWidth);
        element.nativeElement.style.height = '10%';
      }
      else {
        element.nativeElement.style.height = '0%';

      }
    }

  }

}
