import { Component, OnInit, Input } from "@angular/core";
import { SpaarksService } from "../../spaarks.service";

@Component({
  selector: "app-sellercard",
  templateUrl: "./sellercard.component.html",
  styleUrls: ["./sellercard.component.scss"],
})
export class SellercardComponent implements OnInit {
  @Input("sellerPost") sellerPost;
  rating;
  subCategory;

  constructor(private spaarksService: SpaarksService) {}

  ngOnInit(): void {
    try {
      this.rating = this.sellerPost.user.market.categories[1].rating;
      this.subCategory = this.sellerPost.user.market.categories[1].subCategory;
    } catch {
      (err) => {
        this.spaarksService.catchInternalErrs(err);
      };
    }
  }
}
