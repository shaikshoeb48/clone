import { Directive, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[apptopbardir]'
})
export class TopbarDirDirective {

  constructor(private element: ElementRef, private router: Router) {
    // console.log(this.element);

    // if(
    //   // this.router.url.includes('profile') ||
    //   this.router.url.includes('business') ||
    //   this.router.url.includes('businessenq') ||
    //   this.router.url.includes('connectwithus') ||
    //   this.router.url.includes('faqs') ||
    //   this.router.url.includes('ticket') ||
    //   this.router.url.includes('home/seller') ||
    //   // this.router.url.includes('newspaark') ||
    //   this.router.url.includes('exploreMap') ||
    //   // this.router.url.includes('requests') ||
    //   // this.router.url.includes('home/chat') ||
    //   this.router.url.includes('settings')) {

    //   if (window.innerWidth < 951) {
    //     element.nativeElement.style.height = '8%';
    //   }

    //   element.nativeElement.style.height = '7%';
    // }

    // else {
      element.nativeElement.style.height = '10%';
    // }

  }




}
