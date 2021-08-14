import { style } from "@angular/animations";
import { Directive, ElementRef, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appImgHold]",
})
export class ImgHoldDirective {
  arr = [
    "../../../assets/loadingImages/blue.png",
    "../../../assets/loadingImages/pink.png",
    "../../../assets/loadingImages/green.png",
    "../../../assets/loadingImages/cream.png",
  ];

  constructor(element: ElementRef, private render: Renderer2) {
    var index: number = Math.floor(Math.random() * 4 + 0);

    // element.nativeElement.style.background.url(this.arr[index]);
    // element.nativeElement.style.backgroundImage = url(this.arr[index])
    this.render.setStyle(
      element.nativeElement,
      "background-image",
      "url('" + this.arr[index] + "')"
    );
  }
}
