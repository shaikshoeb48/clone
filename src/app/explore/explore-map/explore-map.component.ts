import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SpaarksService } from "../../spaarks.service";
import { isString, log } from "util";
import { AllpurposeserviceService } from "../../allpurposeservice.service";
import { Router } from "@angular/router";
import { Subscription, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import "leaflet";
import "leaflet-routing-machine";
declare let L;
@Component({
  selector: "app-explore-map",
  templateUrl: "./explore-map.component.html",
  styleUrls: ["./explore-map.component.scss"],
})
export class ExploreMapComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private spaarksservice: SpaarksService,
    private allPurposeService: AllpurposeserviceService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.isMobileVersion = this.spaarksservice.isMobileVersion;

    if (!localStorage.getItem("weblocation")) {
      this.spaarksservice.checkforLocation();
    } else {
      this.lat = JSON.parse(localStorage.getItem("weblocation")).lat;
      this.lng = JSON.parse(localStorage.getItem("weblocation")).long;
    }
    if (localStorage.getItem("locationfrom")) {
      this.locationType = localStorage.getItem("locationfrom");
    }
  }
  isMobileVersion;
  locationType;
  isDesk = false;
  initVal = 20;
  postArrCpy = [];
  isMapSection = false;
  latitude;
  longitude;
  showDirections = false;

  lat = this.spaarksservice.latitude;
  lng = this.spaarksservice.longitude;
  zoom = 13;

  mapMarkers = [];
  markers = [];
  locationicon = "../../../assets/marker2.svg";
  isList = true;

  marker;
  scrolltoview = null;

  map;
  idFromSpcard;
  markerIcon = "../../../assets/marker22.svg";
  mapmarkericon = null;
  multipurpSubs: Subscription;

  postsarr = [];
  featureName;
  selectedpostsArray = [];

  showNoPosts = false;

  ngOnInit(): void {
    // this.router.onSameUrlNavigation:reload;
    // console.log('pppppppppppp');

    this.spaarksservice.sendToExplore.subscribe((x: any) => {
      this.spaarksservice
        .getPostsWithin(
          this.lat,
          this.lng,
          x.category,
          x.subCategory,
          "en",
          "market",
          1,
          5,
          "time"
        )
        .subscribe((op: any) => {
          this.postsarr = op.data.post;
          if (this.postsarr && this.postsarr.length < 0) {
            this.showNoPosts = true;
          }

          //console.log( this.postsarr);
        });
    });

    this.spaarksservice.routeToexplore = false;

    this.spaarksservice.exploreDrawLine.subscribe((x: any) => {
      this.latitude = x.lat;
      this.longitude = x.long;
      this.drawLine(x.lat, x.long, x.uservisibility.name);

      this.showDirections = true;
    });
    //this.spaarksservice.exploreDrawLine=new Subject();

    this.spaarksservice.checkforLocation();
    if (window.innerWidth > 920) {
      this.isDesk = true;
    } else {
      this.isDesk = false;
    }

    if (this.router.url.includes("explore") && window.innerWidth < 951) {
      this.isMapSection = true;
    }

    this.spaarksservice.allPurposeSubject.subscribe((succ) => {
      // console.log(succ);
      this.lat = this.spaarksservice.latitude;
      this.lng = this.spaarksservice.longitude;

      //detectChanges is important for rendering map correctly
      //otherwise need to give timeout for rendering and then logics
      this.changeDetectorRef.detectChanges();
      this.renderLeafletMap();
    });
    if (this.spaarksservice.latitude && this.spaarksservice.longitude) {
      this.changeDetectorRef.detectChanges();

      this.renderLeafletMap();
    }
    if (this.spaarksservice.fName) {
      this.spaarksservice.featName = this.spaarksservice.fName;
    }
    try {
      if (this.lat && this.lng) {
        // console.log(this.spaarksservice.latitude);
        this.spaarksservice
          .getAllPosts(this.spaarksservice.featName)
          .subscribe((suc: any) => {
            // console.log(suc.post)

            //filtering posts which have location enabled
            try {
              let mainposts = suc.data.post.filter((vall) => {
                if (vall.uservisibility.location) {
                  return vall;
                }
              });

              let beyposts = suc.data.postBeyond.filter((vall) => {
                if (vall.uservisibility.location) {
                  return vall;
                }
              });
              this.postsarr = mainposts;

              //max posts shown can be 30
              if (this.postsarr.length > 30) {
                this.postsarr = mainposts.slice(0, 29);
                this.placeMarkers(this.postsarr, 29);
                this.selectedpostsArray = [];
                this.postsarr.forEach((val, ind) => {
                  // console.log(val._id)
                  this.selectedpostsArray.push(val._id);
                });
              } else {
                this.postsarr = mainposts.concat(
                  beyposts.slice(0, 30 - this.postsarr.length)
                );
                this.placeMarkers(this.postsarr);
                this.selectedpostsArray = [];
                this.postsarr.forEach((val, ind) => {
                  // console.log(val._id)
                  this.selectedpostsArray.push(val._id);
                });
              }

              this.postsarr = this.postsarr.slice();
              // console.log(this.postsarr);
              if (
                this.spaarksservice.currentPost != null &&
                this.spaarksservice.postForMap == true
              ) {
                console.log(this.spaarksservice.currentPost);
                this.spaarksservice.postForMap = false;
                this.postsarr.unshift(this.spaarksservice.currentPost);
                if (
                  !this.selectedpostsArray.includes(
                    this.spaarksservice.currentPost._id
                  )
                ) {
                  let marker = L.marker([this.lat, this.lng], {
                    icon: this.mapmarkericon,
                  }).addTo(this.map);
                }
                console.log(this.postsarr);
                if (this.isDesk) {
                  this.clickedDesktop({ index: JSON.stringify(0) });
                } else {
                  this.allPurposeService.triggerModal.next({
                    type: "spaarkinmodal",
                    post: this.postsarr[0],
                    modal: true,
                  });
                }
              }
              if (this.spaarksservice.idFromExplore) {
                
                var curPost = this.spaarksservice.currentPost;
                this.idFromSpcard = this.spaarksservice.currentPost._id;
                this.markerOnclick(this.idFromSpcard);
                this.drawLine(curPost.locationStatic.coordinates[1],curPost.locationStatic.coordinates[0],"ddddd");
                console.log("explore");
              }
            } catch {
              (err) => {
                this.spaarksservice.catchInternalErrs(err);
              };
            }
          });
      }
    } catch { }

    // this.spaarksservice.exploretriggerSubj.subscribe(id => {
    //   this.idFromSpcard = id;
    //   this.markerOnclick(this.idFromSpcard);
    // })

    this.multipurpSubs = this.allPurposeService.multiPurposeSubj.subscribe(
      (succe: any) => {
        console.log(succe);
        let found = "no";
        if (succe) {
          if (succe.type) {
            if (succe.type == "greetreqUpdate") {
              this.postsarr.forEach((val, ind) => {
                if (val._id) {
                  if (val._id == succe.id) {
                    console.log(val);
                    val.requested = true;
                    found = "yes";
                  }
                }
              });
            }
          }
        }
      }
    );

    //  this.changeDetectorRef.detectChanges();
  }

  /** renderLeafletMap will render the map with marker */
  renderLeafletMap() {
    var marker;

    /**  myIcon will have the dimensions to point to the lat long and its relative position*/
    const myIcon = L.icon({
      iconUrl: "../../../assets/defaultmarker.svg",
      iconSize: [25, 35], // size of the icon
      iconAnchor: [15, 31], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -51], // point from which the popup should open relative to the iconAnchor
    });

    this.mapmarkericon = myIcon;

    /** map is initialized with specific lat long and zoom level
     * The id of map should be unique.Here mapA is the id
     */
    this.map = L.map("mapA", {
      minZoom: 11,
      maxZoom: 13,
    }).setView([this.lat, this.lng], 13);

    /**tilelayer will add map with given address.
     * Here environment.basemap will provide the url for osos map.
     */
    L.tileLayer(environment.baseMap + "{z}/{x}/{y}.png").addTo(this.map);

    //adding marker with custom icon with lat long to map
    marker = L.marker([this.lat, this.lng], { icon: myIcon }).addTo(this.map);

    var name = localStorage.getItem("name");
    var img = localStorage.getItem("propic");
    if (name) {
      name = name.substring(0, 9);

      if (name.length > 8) name += "...";
    }

    //Popup content for marker
    marker.bindPopup(
      ((img != null) ? ("<img src=" +
        img +
        ">") : '') +
      "<span>" +
      (name != null ? name : "Your Location") +
      "</span>"
    );

    //opening popup on marker click
    marker.on("click", (e) => {
      var popup = e.target.getPopup();
      var content = popup.getContent();
    });

    /** For hover of marker, openPopup function should be used for starting
     * closePopup for ending
     */
    marker.on("mouseover", (e) => {
      var popup = e.target.openPopup();
    });

    marker.on("mouseout", (e) => {
      var popup = e.target.closePopup();
      // var content = popup.getContent();
    });

    /** drawing circle with respect to specific lat long
     * color will be for the outline of circle
     * fillcolor for inside color
     * opacity for inside color
     * radius will be required parameter and will be meters
     */
    var circle = L.circle([this.lat, this.lng], {
      color: "#6886C5",
      fillColor: "#6886C5",
      fillOpacity: 0.2,
      radius: 5000,
    }).addTo(this.map);
  }

  goToLocation() {
    //opening location modal for changing location
    this.allPurposeService.triggerModal.next({
      type: "locationModal",
      step: "default",
      modal: true,
      from: "explore",
    });
  }

  resetMap() {
    this.map.setView([this.lat, this.lng], 13);
  }

  clickedDesktop(eve) {
    // console.log(eve);
    // alert("clicked desktop");

    if (eve) {
      if (typeof eve.index == "string") {
        this.clickOnCard(eve.index);
      } else {
        if (eve.index) {
          this.clickOnCard(JSON.stringify(eve.index));
        }
      }
    }
  }

  placeMarkers(arr, cnt?) {
    const myIcon = L.icon({
      iconUrl: this.markerIcon,
      iconSize: [25, 35], // size of the icon
      iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
      // popupAnchor: [0, -51], // point from which the popup should open relative to the iconAnchor
    });
    if (this.marker) {
      // remove previous markers
      this.map.removeLayer(this.marker);
    }

    let newarray = [];
    // for logged in
    if (cnt) {
      newarray = arr.slice(0, cnt);
      // console.log(newarray);
      newarray.forEach((element) => {
        try {
          let markerItem = {
            id: element._id,
            lng: element.locationStatic.coordinates[0],
            lat: element.locationStatic.coordinates[1],
            draggable: false,
            name: element.uservisibility.name,
            profilePic: element.uservisibility.profilePic,
          };
          this.markers.push(markerItem);
          this.marker = L.marker([markerItem.lat, markerItem.lng], {
            icon: myIcon,
          }).addTo(this.map);

          // push all markers in 1 array
          this.mapMarkers.push(this.marker);
          // console.log(element);
          var name = markerItem.name;
          name = name.substring(0, 9);

          if (markerItem.name.length > 8) name += "...";
          this.marker.bindPopup(
            "<img src=" +
            markerItem.profilePic +
            ">" +
            "<span>" +
            name +
            "</span>"
          );
          // marker.bindPopup("<img"+ "src="+ +">");

          this.marker.on("click", (e) => {
            var popup = e.target.getPopup();
            var content = popup.getContent();
            // console.log(markerItem.id);
            this.scrolltoview = { id: markerItem.id };
          });

          this.marker.on("mouseover", (e) => {
            //console.log(e);
            var popup = e.target.openPopup();
          });
          this.marker.on("mouseout", (e) => {
            var popup = e.target.closePopup();
            // var content = popup.getContent();
          });
        } catch {
          (err) => {
            this.spaarksservice.catchInternalErrs(err);
          };
        }
      });
    }
    // for not logged in
    else {
      newarray = arr;
      //console.log(newarray);

      newarray.forEach((element) => {
        try {
          let markerItem = {
            id: element._id,
            lng: element.locationStatic.coordinates[0],
            lat: element.locationStatic.coordinates[1],
            draggable: false,
            name: element.uservisibility.name,
            profilePic: element.uservisibility.profilePic,
          };
          this.markers.push(markerItem);
          this.marker = L.marker([markerItem.lat, markerItem.lng], {
            icon: myIcon,
          }).addTo(this.map);
          this.mapMarkers.push(this.marker);
          var name = markerItem.name.substring(0, 9);

          if (name.length > 8) name += "...";
          this.marker.bindPopup(
            "<img src=" +
            markerItem.profilePic +
            ">" +
            "<span>" +
            name +
            "</span>",
            {}
          );
          this.marker.on(
            "click",
            (e) => {
              // console.log(e);
              // var popup = e.target.getPopup();
              // var content = popup.getContent();
              this.markerOnclick(markerItem.id);
            }

            // this.scrolltoview = { id: markerItem.id };
            // console.log(markerItem.id)
          );

          this.marker.on("mouseover", (e) => {
            // console.log(e);
            var popup = e.target.openPopup();
          });
          this.marker.on("mouseout", (e) => {
            var popup = e.target.closePopup();
            // var content = popup.getContent();
          });
        } catch {
          (err) => {
            this.spaarksservice.catchInternalErrs(err);
          };
        }
      });
    }
  }

  polyline;
  oldmarker;
  routingMarker;
  //this will called to draw line for route
  drawLine(p1, p2, name: string) {
    if (this.oldmarker) {
      this.map.removeControl(this.oldmarker);
    }

    if (this.routingMarker) {
      this.map.removeLayer(this.routingMarker);
    }
    // this.oldmarker = L.marker([p1, p2]).addTo(this.maps).bindPopup("other user's location");
    //this.recenter(); //
    //  this.closeNav();

    var latLong: any = JSON.parse(localStorage.getItem("weblocation"));
    //all are the option of drawing map.
    
    this.oldmarker = L.Routing.control({
      waypoints: [L.latLng(latLong.lat, latLong.long), L.latLng(p1, p2)],
      routeWhileDragging: false,
      showAlternatives: false,
      lineOptions: {
        addWaypoints: false,
        extendToWaypoints: false,
        missingRouteTolerance: 0,
      },
//Adding route to our map
      router: new L.Routing.OSRMv1({
        serviceUrl: "https://routing.spaarksweb.com/route/v1",
      }),
    }).addTo(this.map);
    this.routingMarker = L.marker([p1, p2], {
      draggable: false,
      riseOnHover: true,
    })
      .addTo(this.map)
      .bindPopup(name + "'s location");
      this.showDirections=true;

    //polyline.remove()
    //  console.log(this.polyline);
    //  if(this.polyline)
    //  {
    //   //  alert("heyy");
    //   // this.polyline.remove(this.map);
    //   // alert("12121");
    //   this.map.removeLayer(this.polyline);
    //  }
    //   var latLong:any=JSON.parse(localStorage.getItem('weblocation'));
    //   console.log(lat,long);
    //   alert(latLong.lat);
    //   alert( latLong.long);
    //   this.polyline= L.polyline([
    //     [latLong.lat, latLong.long],
    // [lat,long],
    //     ],
    //     {
    //         color: 'blue',
    //         weight: 5,
    //         opacity: .7,
    //         dashArray: '10,15',
    //         lineJoin: 'round'
    //     }
    //     ).addTo(this.map);
  }

  markerOnclick(id) {
    //scrolling to the specific id post on clicking of marker in mobile version
    this.scrolltoview = { id: id };
  }

  checkTabIndex(event) {
    // this function is called on every tab change

    if (this.mapMarkers) {
      /** Removing previous markers on tab change
       * all markers are listed in variable mapMarkers
       */
      for (var i = 0; i < this.mapMarkers.length; i++) {
        this.map.removeLayer(this.mapMarkers[i]);
      }
    }
    //changing the featurename
    this.featureName = event;

    if (this.isList == false) {
      this.changeBacktoList();
    }

    this.spaarksservice.getAllPosts(event).subscribe((suc: any) => {
      // console.log(suc.post)

      //getting all posts which have location enabled
      try {
        let mainposts = suc.data.post.filter((vall) => {
          if (vall.uservisibility.location) {
            return vall;
          }
        });

        let beyposts = suc.data.postBeyond.filter((vall) => {
          if (vall.uservisibility.location) {
            return vall;
          }
        });

        this.postsarr = mainposts;

        //Need to show only 30 posts in the list
        if (this.postsarr.length > 30) {
          this.postsarr = mainposts.slice(0, 29);
          this.placeMarkers(this.postsarr, 29);
          this.selectedpostsArray = [];
          this.postsarr.forEach((val, ind) => {
            this.selectedpostsArray.push(val._id);
          });
        } else {
          this.postsarr = mainposts.concat(
            beyposts.slice(0, 30 - this.postsarr.length)
          );
          this.placeMarkers(this.postsarr);
          this.selectedpostsArray = [];
          this.postsarr.forEach((val, ind) => {
            this.selectedpostsArray.push(val._id);
          });
        }
        console.log(this.postsarr);

        this.postsarr = this.postsarr.slice();

        // if (this.spaarksservice.currentPost != null && this.spaarksservice.postForMap == true) {
        //   this.postsarr.unshift(this.spaarksservice.currentPost);
        //   console.log(this.postsarr);
        //   if (this.isDesk) {

        //     this.clickedDesktop({ index: JSON.stringify(0) });
        //   } else {
        //     this.allPurposeService.triggerModal.next({ type: "spaarkinmodal", post: this.postsarr[0], modal: true });
        //   }
        if (this.spaarksservice.idFromExplore) {
          this.idFromSpcard = this.spaarksservice.currentPost._id;
          this.markerOnclick(this.idFromSpcard);
          // console.log('explorets');
        }

        // }
      } catch {
        (err) => {
          this.spaarksservice.catchInternalErrs(err);
        };
      }
    });
  }

  changeBacktoList() {
    this.isList = true;
    this.markers.splice(
      this.specificPostMarker.index,
      0,
      this.specificPostMarker.value
    );
  }

  specificPostMarker = {
    index: null,
    value: null,
    post: null,
    markervalue: null,
  };
  clickOnCard(ind) {
    let gun;
    if (isString(ind)) {
      gun = JSON.parse(ind);
    } else {
      gun = ind;
    }
    if (this.isDesk) {
      this.specificPostMarker.index = gun;
      this.specificPostMarker.value = this.markers[gun];
      this.specificPostMarker.post = this.postsarr[gun];
      this.specificPostMarker.markervalue = this.markers.splice(gun, 1);
      this.isList = false;
    } else {
      // this.triggerClickOnmapCard=true
    }
  }

  triggerClickOnmapCard = false;

  clickedMarker(label, i) { }
  markerDragEnd(m, eve) { }

  content = "";
  pressedkey(eve) {
    console.log(eve);
    if (this.content) {
      if (this.content.length == 0) {
        this.listofsearches = [];
        console.log("no searches");
        return;
      }
    }

    this.http
      .get("https://staging-api.ososweb.com/search/" + this.content)
      .subscribe((succe: any) => {
        console.log(succe);
        this.listofsearches = succe;
      });
  }
  listofsearches = [];
  presentMarker;

  postHover(post) {
    /**
     * this function used to popup marker when user hover on post card
     */

    this.markers.forEach((val, ind) => {
      if (val.id == post._id) {
        //checking pushed post for markers array
        this.presentMarker = this.mapMarkers[ind]; //adding marker from mapMarkers to present marker
      }
    });
    var name = post.uservisibility.name;
    name = name.substring(0, 9);
    if (name.length > 8) name += "...";
    // console.log(name);
    this.presentMarker.bindPopup(
      "<img src=" +
      post.uservisibility.profilePic +
      ">" +
      "<span>" +
      name +
      "</span>",
      {}
    ); //binding name to marker

    if (post.distance > 5000) {
      // changing the current lat long to other post location
      this.map.flyTo(
        [
          post.locationStatic.coordinates[1],
          post.locationStatic.coordinates[0],
        ],
        12
      );
    } else {
      this.map.flyTo([this.lat, this.lng], 13);
    }

    this.presentMarker.openPopup();
  }

  postHoverOut() {
    if (this.presentMarker) this.presentMarker.closePopup();
  }
}

// Agm map used earlier
// <agm-map [zoom]="zoom" [latitude]="lat" [longitude]="lng">
// <ng-container *ngIf="featureName!='greet'">
//     <agm-marker *ngFor="let m of markers; let i = index" (markerClick)="clickedMarker(m.label, i)"
//         [latitude]="m.lat" [longitude]="m.lng" [label]="m.label" [markerDraggable]="m.draggable"
//         (dragEnd)="markerDragEnd(m, $event)mapMarkers">
//         <agm-info-window>{{m.name}}</agm-info-window>
//     </agm-marker>
// </ng-container>
// <agm-circle [latitude]="lat" [longitude]="lng" [radius]="5000" [fillColor]="'#448AFF'">
// </agm-circle>

// <agm-marker [latitude]="lat" [longitude]="lng" [iconUrl]="locationicon">
//     <agm-info-window>You</agm-info-window>
// </agm-marker>

// <div *ngIf="!isList">
//     <agm-marker [latitude]="this.specificPostMarker.value.lat"
//         [longitude]="this.specificPostMarker.value.lng" [iconUrl]="locationicon">
//         <agm-info-window>{{this.specificPostMarker.post.uservisibility.name}}</agm-info-window>
//     </agm-marker>
// </div>
// </agm-map>
