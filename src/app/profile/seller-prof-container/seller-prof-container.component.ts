import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { SpaarksService } from "../../spaarks.service";

@Component({
  selector: "app-seller-prof-container",
  templateUrl: "./seller-prof-container.component.html",
  styleUrls: ["./seller-prof-container.component.scss"],
})
export class SellerProfContainerComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private spaarksService: SpaarksService
  ) {
    this.isMobileVersion = this.spaarksService.isMobileVersion;
  }

  routeSub: Subscription;
  isMobileVersion;
  timer = true;
  profile = "normal";
  sellerprofiledata = undefined;

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      console.log(params); //log the entire params object
      console.log(params["id"]); //log the value of id

      this.spaarksService
        .getSellerProfile(params["id"])
        .subscribe((suc: any) => {
          console.log(suc);
          this.sellerprofiledata = suc;
          this.timer = false;
        });
    });
  }

  changeProfile(event) {
    console.log(event);
    // if(event){
    //   if(event.changeTo){
    //     if(event.changeTo=='seller'){
    //       this.profile='sellerprofile';
    //     }
    //   }
    // }
  }

  ngOnDestroy() {
    try {
      if (this.routeSub) {
        this.routeSub.unsubscribe();
      }
    } catch {}
  }
}
