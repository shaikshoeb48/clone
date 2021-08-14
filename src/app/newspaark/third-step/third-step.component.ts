import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { SpaarksService } from "../../spaarks.service";
import { Router } from "@angular/router";
import { tileLayer, latLng, map, LeafletMouseEvent } from "leaflet";
import { environment } from "src/environments/environment";
import * as L from "leaflet";

@Component({
  selector: "app-third-step",
  templateUrl: "./third-step.component.html",
  styleUrls: ["./third-step.component.scss"],
})
export class ThirdStepComponent implements OnInit {
  constructor(private SpaarkService: SpaarksService, private router: Router) {}
  disableBtn=false;
  defaultMarker;
  markerIcon = "../../../assets/marker2.svg";

  lat = Number(this.SpaarkService.latitude);
  lng = Number(this.SpaarkService.longitude);

  zoom = 12;
  maxradius = 7;

  //Eventemitters to parent
  @Output("clickedNext") clickedNextEmitter = new EventEmitter();
  @Output("clickedPrev") clickedPrevEmitter = new EventEmitter();

  radius = 7000;

  slidervalue = 5;

  DynamicLocation = "true";
  showOnMap;

  ngOnInit(): void {
    // console.log(this.SpaarkService.selectedCreate)
    console.log(this.DynamicLocation);
    document.getElementById("mainElement").scrollTop = 0;
    this.DynamicLocation = this.SpaarkService.selectedCreate.dynamicLocation;

    this.showOnMap = this.SpaarkService.selectedCreate.location;

    const myIcon = L.icon({
      iconUrl: this.markerIcon,
      iconSize: [28, 41], // size of the icon
      iconAnchor: [15, 31], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -51], // point from which the popup should open relative to the iconAnchor
      // ...
    });

    var map = L.map("mapA").setView([this.lat, this.lng], 12);
    //Forming map
    L.tileLayer(environment.baseMap + "{z}/{x}/{y}.png").addTo(map);
    marker = L.marker([this.lat, this.lng], { icon: myIcon }).addTo(map);
    //Drawing radius circle and adding to map
    var circle = L.circle([this.lat, this.lng], {
      color: "#6fa4e9",
      fillColor: "#6FA4E9",
      fillOpacity: 0.2,
      radius: 5000,
    }).addTo(map);

    var marker;
  }

  changeRange(eve) {
    console.log(eve);
    this.radius = eve * 1000;
  }

  DNMLocation(eve) {
    console.log(this.DynamicLocation);

    this.DynamicLocation = eve.value;
    this.SpaarkService.selectedCreate.dynamicLocation = this.DynamicLocation;
    console.log(this.SpaarkService.selectedCreate.dynamicLocation);
  }

  clickedNext() {
    this.disableBtn=true;
    this.clickedNextEmitter.emit({ clicked: "true" });
    this.SpaarkService.allPurposeSubject.next("SubmitForm");
  }

  showlocation(eve) {
    console.log(eve);
    if (eve.value == 3) {
      this.SpaarkService.selectedCreate.location = true;
    } else if (eve.value == 4) {
      this.SpaarkService.selectedCreate.location = false;
    }
  }

  clickedPrevious() {
    // Emiting to parent to change to previous screen
    console.log(this.SpaarkService.selectedCreate);

    this.clickedPrevEmitter.emit({ clicked: "true" });
    // alert('HGeloo');
    // this.router.navigateByUrl('/home/newspaark/create/Offer-a-Service');
    // this.router.navigateByUrl('home/newspaark/create/Offer-a-Service')
    // this.SpaarksService.CreateSpaarkSteps.StepState="three";

    // if(this.SpaarkService.CreateSpaarkSteps.StepState=="two" && this.SpaarkService.CreateSpaarkSteps.currentStep=="second"){
    //   this.SpaarkService.previousSubj.next('BackToFirstPage');
    //   this.clickedPrevEmitter.emit({ clicked: 'true' })
    //   return;
    // }

    // if(this.SpaarkService.CreateSpaarkSteps.StepState=="two" ){
    //   this.SpaarkService.previousSubj.next('BackToCat');
    //   return;
    // }
    // if(this.SpaarkService.CreateSpaarkSteps.firstSkip == true){
    //   this.SpaarkService.previousSubj.next('BackToCat');
    //   return;
    // }

    // if(this.SpaarkService.CreateSpaarkSteps.StepState=="three" ){
    //   this.SpaarkService.previousSubj.next('BackToSubCat');
    //   return;
    // }

    // if(this.SpaarkService.CreateSpaarkSteps.secondSkip == true ){
    //   this.SpaarkService.previousSubj.next('BackToSubCat');
    //   return;
    // }

    // if(this.SpaarkService.CreateSpaarkSteps.Cat=="Make-Friends" || this.SpaarkService.CreateSpaarkSteps.Cat=="Announce-Something"){

    //   this.router.navigateByUrl('home/newspaark');
    //   this.SpaarkService.CreateSpaarkSteps=this.SpaarkService.DefaultSpaarkSteps;
    //   return;
    // }

    //alert("Function Is Ruinning");
  }
}
