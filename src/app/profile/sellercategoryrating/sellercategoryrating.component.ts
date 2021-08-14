import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
//import { CommentStmt } from "@angular/compiler";

@Component({
  selector: "app-sellercategoryrating",
  templateUrl: "./sellercategoryrating.component.html",
  styleUrls: ["./sellercategoryrating.component.scss"],
})
export class SellercategoryratingComponent implements OnInit, OnChanges {
  constructor() {}

  categoryIndImg = "assets/testingMedia/1.jpeg";

  imageFailed(event) {
    event.target.src =
      "../../../assets/catsubcatimages/categoryimages/" +
      this.profile.categoryId +
      ".png";
  }
  statusClass = "selectProfileunClicked";
  @Input("profile") profile = undefined;
  @Input("profileIndex") profileIndex = "0";
  @Input("clickedIndex") clickedIndex = "0";
  @Output() valueChange = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    this.clickedIndex = changes.clickedIndex.currentValue;
  }

  ngOnInit(): void {
    // console.log("heyyyyyyyyy",this.profile)
    // console.log(this.profileIndex);
    // this.profileIndex="0";
    // this.clickedIndex = "0";
    // if(this.clickedIndex==this.profileIndex)
    // this.statusClass = "selectProfileClicked";
    console.log(this.profile);
    if (this.profile && this.profile.categoryId) {
      this.profile.categoryId = this.profile.categoryId.toLowerCase();
    }
    if (this.profile && this.profile.subCategoryId) {
      this.profile.subCategoryId = this.profile.subCategoryId.toLowerCase();
    }
  }

  onClick() {
    //  console.log(this.prof.nativeElement.index);
    this.valueChange.emit(this.profileIndex);
    // console.log(this.profile)
    // console.log("ClickedIndex",this.clickedIndex)
    this.statusClass = "selectProfileClicked";
  }
}
