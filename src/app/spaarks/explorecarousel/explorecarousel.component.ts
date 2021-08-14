import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  Input,
  OnDestroy,
} from "@angular/core";
import { AllpurposeserviceService } from "../../allpurposeservice.service";
import { SpaarksService } from "../../spaarks.service";

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
}
@Component({
  selector: "app-explorecarousel",
  templateUrl: "./explorecarousel.component.html",
  styleUrls: ["./explorecarousel.component.scss"],
})
export class ExplorecarouselComponent implements OnInit, OnDestroy {
  constructor(
    private renderer: Renderer2,
    private multipurposeService: AllpurposeserviceService,
    private spaarks: SpaarksService
  ) {}

  showWorkStatus;

  data = undefined;
  enlargeImage = false;
  imageRemove;
  onlyImage = true;
  feedVideo;
  @Input("photo") photo = [];
  @Input("video") video = [];
  activeSlide = 0;

  viewStatus;
  targetVideo;

  colors = ["darkgray", "cornflowerblue", "cadetblue"];
  imageStrings = [];
  videoStrings = [];
  @ViewChild("vidd") vidd: ElementRef;

  ngOnInit(): void {
    try {
      if (this.photo) {
        this.photo.forEach((val) => {
          this.imageStrings.push(val.url);
        });
      }

      if (this.video) {
        this.video.forEach((val) => {
          this.videoStrings.push(val.url);
        });
      }
    } catch {}

    //  this.imageRemove = this.multipurposeService.triggerModal.subscribe((succe: any) => {
    //        if (succe.type == "images") {

    //         this.multipurposeService.modalStatus = succe.modal;
    //         this.enlargeImage = succe.modal;
    //         this.data = succe.imgArr;

    //         this.data.index = succe.index;
    //         let videoData=this.data[succe.index]
    //           console.log("vid",videoData)
    //         // if(this.data.includes(".mp4"))
    //         // {
    //         //   alert('hey')
    //         //   this.feedVideo=this.data[this.data.index];
    //         // }
    //         console.log("type of",this.data.length)
    //         console.log(this.data[this.data.index])

    //       }

    //     })
    // console.log(this.videoArr);
  }

  fullScreen(ind) {
    if (this.videoStrings.length > 0 && this.imageStrings.length > 0)
      this.spaarks.sendImageWithIndex(
        [...this.imageStrings, ...this.videoStrings],
        ind
      );
    else {
      if (this.imageStrings.length > 0) {
        this.spaarks.sendImageWithIndex([...this.imageStrings], ind);
      } else this.spaarks.sendImageWithIndex([...this.videoStrings], ind);
    }

    console.log("image data", this.imageStrings);
    console.log("video data", this.videoStrings);

    // //  // this.spaarks.sendAllPhotos(this.video);
    // //   this.enlargeImage=true;
  }

  OnSelectImage() {
    this.enlargeImage = true;
    //  this.spaarks.sendAllPhotos();
    ///*  */ alert("Clicked ON Image");
  }

  // sendEvent(event) {
  //   event.stopPropagation()
  // }
  // move(d: any) {
  //   // console.log(event)
  //   // if(event)
  //   // {
  //   //   event.stopPropagation();
  //   // }

  //   console.log("hello");
  //   console.log(d);
  //   //console.log(this.showModal);

  //   if (this.data) {
  //     var len = this.data.length;

  //     var x = this.data.index;

  //     if (d > 0) {
  //       x = (x + 1) % len;
  //     }
  //     else {
  //       if (x == 0) {
  //         x = len - 1
  //       }
  //       else {
  //         x = x - 1
  //       };
  //     }
  //     this.data.index = x;
  //   }

  // }

  // onCloseImageDiv() {
  //   // this.multipurposeService.modalStatus=false;
  //   this.enlargeImage = false;
  //   console.log("hey")
  //   //this.data=[];
  // }

  switchSlide(ind) {
    // console.log(ind);
    this.activeSlide = ind;
  }

  initVideo() {
    //var playPromise = document.getElementById('exploreVideo');
    var playPromise: any = document.getElementsByTagName("video");
    // playPromise.play();

    if (playPromise !== undefined) {
      playPromise.forEach((elnt) => {
        elnt.play();
      });
      playPromise
        .then((_) => {
          // Automatic playback started!
          // Show playing UI.
          // console.log('Show playing UI.');
          playPromise.pause();
        })
        .catch((error) => {
          // Auto-play was prevented
          // Show paused UI.
          // console.log('Show paused UI.');
        });
    }
  }

  public onIntersection({
    target,
    visible,
  }: {
    target: Element;
    visible: boolean;
  }): void {
    this.renderer.addClass(target, visible ? "active" : "inactive");
    this.renderer.removeClass(target, visible ? "inactive" : "active");
    this.viewStatus = visible;
    // console.log(this.viewStatus);

    this.targetVideo = target;

    if (this.viewStatus) {
      this.vidd.nativeElement.play();
    } else {
      this.vidd.nativeElement.pause();
    }

    var videoRef: any = document.getElementsByTagName("video");
    // for(let i=0; i<videoRef.length; i++) {

    // if(this.viewStatus==true){
    //   try {
    //     videoRef[i].play();
    //   } catch (error) {
    //     console.log("Application is not fully-loaded this will happens only once");
    //   }
    //       }else{
    //         videoRef[i].pause();
    //       }
    // }
  }

  ngOnDestroy() {
    try {
      if (this.imageRemove) {
        this.imageRemove.unsubscribe();
      }
    } catch (err) {}
  }
}
