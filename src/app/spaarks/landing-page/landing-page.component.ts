import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SpaarksService } from "../../spaarks.service";

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
})
export class LandingPageComponent implements OnInit {
  constructor(private router: Router, private spaarks: SpaarksService) {
    this.isMobileVersion = this.spaarks.isMobileVersion;
  }
  isMobileVersion;
  ngOnInit(): void {}

  // go to language screen
  goToLang() {
    localStorage.setItem("alreadyvisited", "true");
    this.router.navigateByUrl("/home/language");
  }
}
