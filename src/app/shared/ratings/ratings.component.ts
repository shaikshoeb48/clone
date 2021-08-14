import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-ratings",
  templateUrl: "./ratings.component.html",
  styleUrls: ["./ratings.component.scss"],
})
export class RatingsComponent implements OnInit {
  constructor() {}

  @Input("rating") rating;

  charLimit = 40;
  showMore = true;

  ngOnInit(): void {}

  showMoreOrLess(val) {
    if (val == "more") {
      if (this.rating.content.length > 40) {
        this.charLimit = this.rating.content.length + 1;
        this.showMore = !this.showMore;
      }
    } else {
      this.charLimit = 40;
      this.showMore = !this.showMore;
    }
  }
}
