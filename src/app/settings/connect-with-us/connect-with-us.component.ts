import { Component, OnInit } from "@angular/core";
import { SpaarksService } from "src/app/spaarks.service";

@Component({
  selector: "app-connect-with-us",
  templateUrl: "./connect-with-us.component.html",
  styleUrls: ["./connect-with-us.component.scss"],
})
export class ConnectWithUsComponent implements OnInit {
  constructor(private spaarksService: SpaarksService) {
    this.isMobileVersion = this.spaarksService.isMobileVersion;
  }

  ngOnInit(): void {}
  isMobileVersion;

  ngOnDestroy(){
    //console.log("aaaaaaaaaa");
    this.spaarksService.checkforLocation();

  }
}
