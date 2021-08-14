import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SpaarksService } from '../../spaarks.service';

@Component({
  selector: 'app-locationpicker',
  templateUrl: './locationpicker.component.html',
  styleUrls: ['./locationpicker.component.scss']
})
export class LocationpickerComponent implements OnInit {

  constructor(private spaarksService:SpaarksService) { }

  ngOnInit(): void {
    
  }

  @Input ('latitude') latitude = 0;
  @Input ('longitude') longitude = 0;
  @Output('updatecoords') updatecoords = new EventEmitter();

  centerLatitude = this.latitude;
  centerLongitude = this.longitude;

  initialZoom = 14;

  showMap = 'permission'; 

public centerChanged(coords: any) {
    this.centerLatitude = coords.lat;
    this.centerLongitude = coords.lng;
  }

  

public mapReady(map) {
  map.addListener("dragend", () => {
    console.log(this.centerLatitude, this.centerLongitude)
    });
  }

  eventCatcher(event){
    console.log(event);
    if(event){
      if(event.key){
        if(event.key=='locationerror'){
          this.showMap = 'listofcities';
        }
      }
    }
  }

  clickedCity(city){
    console.log(city);
    this.latitude = Number(city.lat);
    this.longitude = Number(city.lon);
    this.showMap='map'
  }

  lists=[];
  cities=this.spaarksService.askLocation;

  clickedList(list){
    console.log(list);
    this.latitude = list.coordinates.latitude;
    this.longitude = list.coordinates.longitude;
    this.showMap='map'
  }

}
