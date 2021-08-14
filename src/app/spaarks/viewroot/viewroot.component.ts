import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgZone } from "@angular/core";
import { Subscription } from "rxjs";
import { SpaarksService } from "../../spaarks.service";

@Component({
  selector: "app-viewroott",
  templateUrl: "./viewroot.component.html",
  styleUrls: ["./viewroot.component.scss"],
})
export class ViewRoott implements OnInit {
  routeSub: Subscription;

  constructor(
    private router: Router,
    public zone: NgZone,
    private route: ActivatedRoute,
    private spaarksService: SpaarksService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      console.log(params); //log the entire params object
      console.log(params["id"]); //log the value of id
      console.log(!(params == undefined));

      if (!(params == undefined)) {
        this.spaarksService.onShared = true;
        this.spaarksService.shareId = params["id"];
        this.router.navigateByUrl("home/feed");
      }
    });
  }
}
