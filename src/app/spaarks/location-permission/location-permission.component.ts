import { SpaarksService } from "../../spaarks.service";
import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { AllpurposeserviceService } from "src/app/allpurposeservice.service";

@Component({
  selector: "app-location-permission",
  templateUrl: "./location-permission.component.html",
  styleUrls: ["./location-permission.component.scss"],
})
export class LocationPermissionComponent implements OnInit {
  constructor(
    private spaark: SpaarksService,
    private multipurposeService: AllpurposeserviceService
  ) {}

  @Output("parentClicked") parentClicked = new EventEmitter();
  @Output("allpurposeEmitter") allpurposeEmitter = new EventEmitter();
  @Input("showSearchLocation") showSearchLocation = false;

  locAcess;
  content = "";

  ngOnInit(): void {}

  changedText(eve) {
    this.parentClicked.emit("null");
  }

  locationAccess(val) {
    if ((val = "Yes")) {
      this.spaark.locationSubj.next("Yes");
      this.locAcess = true;
    }

    if (val == "NO") {
      this.spaark.locationSubj.next("No");
      this.locAcess = false;
    }
  }

  clickedLocationAccess(event) {
    console.log("get location");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          var positionInfo =
            "Your current position is (" +
            "Latitude: " +
            position.coords.latitude +
            ", " +
            "Longitude: " +
            position.coords.longitude +
            ")";
          localStorage.setItem(
            "weblocation",
            JSON.stringify({
              long: position.coords.longitude,
              lat: position.coords.latitude,
            })
          );
        },
        (err) => {
          this.multipurposeService.triggerModal.next({
            type: "alertModal",
            modal: true,
            modalMsg:
              "Oops! Without location you cannot use this application. Refresh or grant location permission.",
          });
          // alert('Oops!, without location you cannot use this application. Refresh or/and grant location permission ')
          console.log(err);
          this.allpurposeEmitter.emit({ key: "locationerror" });
        }
      );
    } else {
      this.multipurposeService.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "Sorry, your browser does not support HTML5 geolocation.",
      });
      // this.spaark.showAlert("Sorry, your browser does not support HTML5 geolocation.");
      this.allpurposeEmitter.emit({ key: "locationerror" });
    }
    //navigator.geolocation.getCurrentPosition(this.setLocationFromWeb,this.showError);
  }
}
