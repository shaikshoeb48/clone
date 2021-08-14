import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { AllpurposeserviceService } from "../../allpurposeservice.service";
import { SpaarksService } from "../../spaarks.service";

@Component({
  selector: "app-map-card",
  templateUrl: "./map-card.component.html",
  styleUrls: ["./map-card.component.scss"],
})
export class MapCardComponent implements OnInit, OnChanges {
  constructor(
    private allPurposeService: AllpurposeserviceService,
    private spaarks: SpaarksService
  ) {}

  pillColor = "";
  ngOnInit(): void {
    // 673px

    if (window.innerWidth > 920) {
      this.isDesk = true;
    } else {
      this.isDesk = false;
    }
    if (this.post.tags) {
      if (this.post.tags.length > 0) {
        this.pillColor = this.post.tags[0].color;
      }
    } else {
      this.pillColor = "chocolate";
    }
  }

  images = [
    "../../../assets/testingMedia/sample1.jpeg",
    "../../../assets/testingMedia/sample_02.jpeg",
    "../../../assets/testingMedia/sample_03.jpg",
    "../../../assets/testingMedia/sample_04.jpg",
    "../../../assets/testingMedia/sample_05.jpeg",
  ];

  @Input("postIndex") postIndex = undefined;
  @Input("post") post = undefined;

  @Input("scrolltoview") scrolltoview = null;
  @ViewChild("target") target: ElementRef;
  @Input("triggerClickOnmapCard") triggerClickOnmapCard = false;
  @Output("clickedDesktop") clickedDesktop = new EventEmitter();

  isDesk = true;
  activeSlide = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.triggerClickOnmapCard) {
        if (changes.triggerClickOnmapCard.currentValue) {
          if (changes.triggerClickOnmapCard.currentValue == true) {
            this.clickedOnMobileCard();
          }
        }
      }
      if (changes.scrolltoview) {
        if (changes.scrolltoview.currentValue) {
          // console.log(changes.scrolltoview.currentValue)
          // console.log(this.target);
          // console.log(changes.scrolltoview.currentValue.id);
          // console.log(this.post._id);
          if (
            String(changes.scrolltoview.currentValue.id) ==
            String(this.post._id)
          ) {
            //scrolling to the particular post
            if (this.target) {
              this.target.nativeElement.scrollIntoView({
                behavior: "smooth",
                inline: "start",
              });
            }
          }
        }
      }
    }
  }

  switchSlide(ind) {
    this.activeSlide = ind;
  }

  clickedOnMobileCard() {
    if (this.isDesk == true) {
      this.clickedDesktop.emit({
        post: this.post,
        index: JSON.stringify(this.postIndex),
      });
    } else {
      //opening modal for showing post in mobile
      this.allPurposeService.triggerModal.next({
        type: "spaarkinmodal",
        post: this.post,
        modal: true,
      });
    }
  }
  clickOnDir(event){
    event.stopPropagation();
  }
}
