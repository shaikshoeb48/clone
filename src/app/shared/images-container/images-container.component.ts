import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-images-container',
  templateUrl: './images-container.component.html',
  styleUrls: ['./images-container.component.scss']
})
export class ImagesContainerComponent implements OnInit,OnChanges {

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes:SimpleChanges){
   
  }
  @Input('imageList') imageList=[];
  @Output('onremove') onremove = new EventEmitter();

  detectOrientation(src){
  

      var orientation,
      img = new Image();
      img.src = src;

      if (img.naturalWidth > img.naturalHeight) {
          orientation = 'landscape';
      } else if (img.naturalWidth < img.naturalHeight) {
          orientation = 'portrait';
      } else {
          orientation = 'even';
      }

      return orientation;

  

  }

}
