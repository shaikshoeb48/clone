import {
  Component,
  Output,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectorRef,
} from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { SpaarksService } from "../../spaarks.service";
import { HttpClient } from "@angular/common/http";
import { Subscription, Subject, from } from "rxjs";
import { AllpurposeserviceService } from "../../allpurposeservice.service";
import { ChatService } from "../../chat.service";
import * as L from "leaflet";
import { environment } from "src/environments/environment";
import { Location } from "@angular/common";

@Component({
  selector: "app-rightfeed",
  templateUrl: "rightfeed.component.html",
  styleUrls: ["rightfeed.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
@HostListener("window:keyup", ["$event"])
export class RightFeed implements OnChanges, OnDestroy {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private allPurposeService: AllpurposeserviceService,
    private location: Location,
    private changeDetectorRef: ChangeDetectorRef,
    private spaarks: SpaarksService,
    private http: HttpClient,
    private chatServ: ChatService
  ) {
    if (localStorage.getItem("propic")) {
      this.profilePic = localStorage.getItem("propic");
    } else {
    }
  }

  timer;
  showLogin = true;
  pendingRequests = [];
  @Input("fromRequests") fromRequests;
  @Input("dynamicinp") dynamicinp = null;
  showSparkAnonymus = true;
  showRecentChats = false;

  @ViewChild("allMarketTab") allMarketTab: ElementRef;

  movedRight = 0;

  featureName;
  showSearchBar = false;
  listtoShowNorm = [];
  listtoShowAno = [];
  listtoshowChatFinal = [];
  mapPostsArr = [];
  markerIcon = "../../../assets/marker22.svg";

  mapmarkericon = null;
  refrListSubs: Subscription;
  profilePic = "../../../assets/profile.svg";

  imagesArr = [
    "../../../assets/rightbar/1.png",
    "../../../assets/rightbar/2.png",
    "../../../assets/rightbar/3.png",
    "../../../assets/rightbar/4.png",
    "../../../assets/rightbar/5.png",
    "../../../assets/rightbar/6.png",
    "../../../assets/rightbar/7.png",
  ];

  dummyReqst = [1, 2, 3, 4, 5, 6];
  initVal = 4;
  fullView = false;

  initSpaarks = 4;
  fullSpaarks = false;

  initCategories = 4;
  fullCategories = false;

  fullViewChats = false;
  initValChats = 10;

  allSentRequests = [];
  isAuthed = this.spaarks.authData.isAuthenticated;
  fullViewRequest = false;
  intiRequest = 3;

  @Output("showCat") showCat = new EventEmitter();
  showTabs = false;
  showPills = false;
  content = "";
  listofSellers = [];
  listofsearches = [];
  listofPosts = [];
  marker;
  markers = [];

  mapMarkers = [];
  scrolltoview = null;
  markedPost;

  isCreate = false;
  showSearch = false;
  showGetStarted = true;
  marketTab;
  map;
  lat = this.spaarks.latitude;
  lng = this.spaarks.longitude;

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    if (changes) {
      if (changes.dynamicinp) {
        if (changes.dynamicinp.currentValue) {
          this.dynamicinp = changes.dynamicinp.currentValue;
        }
      }
    }
  }

  ngOnInit(): void {
    if (this.router.url.includes("create")) {
      this.showSparkAnonymus = false;
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes("create")) {
          this.showSparkAnonymus = false;
        } else if (event.url.includes("newspaark")) {
          this.showSparkAnonymus = true;
        }
      }
    });

    this.spaarks.clickedPillFormCard.subscribe((x) => {
      console.log(x);
      this.selectedClick(x);
    });

    if (!this.isAuthed) {
      this.showSparkAnonymus = true;
      //alert(this.showSparkAnonymus)
    }

    // this.router.events.filter(event => event instanceof NavigationEnd)
    // .subscribe(event =>
    //  {
    //     this.currentRoute = event.url;
    //     console.log(event);
    //  });

    this.marketTab = this.spaarks.marketTab;
    this.spaarks.postForMarkers.subscribe((x: any) => {
      //alert("hiiiiii")
      this.placeMarkers(x.posts);
    });
    console.log(this.marketTab, "uscucvduvcduvduvduvduvduvu");

    this.spaarks.SkeletonTimer.subscribe((succ) => {
      // console.log(succ)
      this.timer = succ;
      //  alert(succ);
    });
    // console.log(this.router.url)
    if (this.router.url.includes("feed")) {
      this.showSearch = true;
    }
    this.spaarks.noChats.subscribe((x) => {
      if (x == "0") this.showSparkAnonymus = true;
      else this.showSparkAnonymus = false;
    });
    if (this.lat && this.lng) {
      this.renderLeafletMap();
    }

    if (this.router.url == "/home/profile") {
      this.showLogin = false;
    } else {
      this.showLogin = true;
    }

    if (this.router.url.includes("newspaark")) {
      this.isCreate = true;
      this.showGetStarted = false;
    }
    if (this.router.url.includes("nearby")) {
      this.showSearch = true;
    }
    this.spaarks.proPicSubj.subscribe((succ: any) => {
      // console.log(succ);
      localStorage.setItem("propic", succ.profilePic);
      this.profilePic = localStorage.getItem("propic");
    });

    this.spaarks.currentFeatureSubj.subscribe((suc) => {
      console.log(suc);
      this.featureName = suc;
    });

    if (this.isAuthed) {
      this.openRequests();
      this.spaarks.allPurposeSubject.subscribe((success: any) => {
        console.log(success);
        if (success.type == "refreshrequests") {
          // this.getGreetRequests();
          // this.requestsArrayFiltered=[];
          this.openRequests();
          this.allSentRequests = [];
        }
      });
    }

    console.log(this.chatServ.chatLoadedArr.loadedArr);
    let locUrll = document.URL;

    // if (this.router.url.includes("feed")) {
    //   ChatService.jidEmitter.next([]);

    //   if (
    //     this.chatServ.chatLoadedArr.loadedArr.includes("ano") &&
    //     this.chatServ.chatLoadedArr.loadedArr.includes("norm")
    //   ) {
    //     try {
    //       this.listtoShowNorm = [];
    //       this.listtoShowNorm.push(...ChatService.myChats);
    //       this.listtoShowNorm.forEach((val, ind) => {
    //         val.account = "1";
    //       });
    //       console.log(this.listtoShowNorm);

    //       this.listtoShowAno.push(...ChatService.myAnoChats);
    //       this.listtoShowAno.forEach((val, ind) => {
    //         val.account = "2";
    //       });
    //       // console.log(this.listtoShowNorm);

    //       let finaArr = this.listtoShowAno.concat(this.listtoShowNorm);
    //       // console.log(finaArr);

    //       this.listtoshowChatFinal = ChatService.mergeSort(finaArr);

    //       // console.log(this.listtoshowChatFinal);
    //       // if(this.listtoshowChatFinal.length>5){

    //       //     this.listtoshowChatFinal = this.listtoshowChatFinal.slice(0,3);

    //       // }
    //       if (this.listtoshowChatFinal.length > 0) {
    //         this.showRecentChats = true;
    //         console.log(this.showRecentChats);
    //       }
    //       if (!this.showRecentChats) {
    //         this.showSparkAnonymus = true;
    //       }
    //     } catch (exc) {
    //       console.log(exc);
    //     }
    //   }

    //   this.refrListSubs = ChatService.refreshList.subscribe(
    //     (succ) => {
    //       if (succ.refresh) {
    //         try {
    //           if (succ.refresh == "jai") {
    //             this.listtoShowNorm = [];
    //             this.listtoShowNorm.push(...ChatService.myChats);
    //             this.listtoShowNorm.forEach((val, ind) => {
    //               val.account = "1";
    //             });
    //             // console.log(this.listtoShowNorm);
    //           } else if (succ.refresh == "jaiano") {
    //             this.listtoShowAno.push(...ChatService.myAnoChats);
    //             this.listtoShowAno.forEach((val, ind) => {
    //               val.account = "2";
    //             });
    //             // console.log(this.listtoShowNorm);
    //           }

    //           let finaArr = this.listtoShowAno.concat(this.listtoShowNorm);
    //           // console.log(finaArr);

    //           this.listtoshowChatFinal = ChatService.mergeSort(finaArr);
    //           // console.log(this.listtoshowChatFinal);
    //           // if(this.listtoshowChatFinal.length>5){

    //           //     this.listtoshowChatFinal = this.listtoshowChatFinal.slice(0,5);
    //           // }

    //           if (this.listtoshowChatFinal.length > 0) {
    //             this.showRecentChats = true;

    //             console.log(this.showRecentChats);
    //           }
    //           if (!this.showRecentChats) {
    //             this.showSparkAnonymus = true;
    //           }
    //         } catch (exc) {
    //           console.log(exc);
    //         }
    //       }
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
    // }
  }

  renderLeafletMap() {
    // console.log(this.map);
    var marker;
    const myIcon = L.icon({
      iconUrl: "../../../assets/defaultmarker.svg",
      iconSize: [31, 41], // size of the icon
      iconAnchor: [15, 31], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -51], // point from which the popup should open relative to the iconAnchor
      // ...
    });
    this.mapmarkericon = myIcon;

    this.map = L.map("mapR", { minZoom: 12, maxZoom: 13 }).setView(
      [this.lat, this.lng],
      12
    );
    L.tileLayer(environment.baseMap + "{z}/{x}/{y}.png").addTo(this.map);
    // console.log(this.map);
    marker = L.marker([this.lat, this.lng], { icon: myIcon }).addTo(this.map);
    var name = localStorage.getItem("name");
    var img = localStorage.getItem("propic");
    if (name) {
      name = name.substring(0, 9);

      if (name.length > 8) name += "...";
    }

    marker.bindPopup(
      "<img src=" +
        img +
        ">" +
       
        "<span>" +
        (name != null ? name : "Your Location") +
        "</span>"
    );

    marker.on("click", (e) => {
      var popup = e.target.getPopup();
      var content = popup.getContent();
      // console.log(id);
    });

    marker.on("mouseover", (e) => {
      var popup = e.target.openPopup();
    });
    marker.on("mouseout", (e) => {
      var popup = e.target.closePopup();
      // var content = popup.getContent();
    });

    var circle = L.circle([this.lat, this.lng], {
      color: "#6886C5",
      fillColor: "#6886C5",
      fillOpacity: 0.2,
      radius: 5000,
    }).addTo(this.map);

    // this.spaarks
    //   .getPostsWithin(this.lat, this.lng, "all", "", "en", "user", 1, 5, "Distance")
    //   .subscribe((succ: any) => {
    //     this.mapPostsArr = succ.data.post;
    //     console.log(this.mapPostsArr);
    //     this.mapPostsArr.forEach((element) => {
    //       console.log(element.locationStatic.coordinates[1]);
    //       var marker = L.marker(
    //         [
    //           element.locationStatic.coordinates[1],
    //           element.locationStatic.coordinates[0],
    //         ],
    //         {
    //           icon: myIcon2,
    //         }
    //       ).addTo(this.map);
    //       marker.bindPopup("<span>" + element.uservisibility.name + "</span>");

    //       marker.on("mouseover", (e) => {
    //         var popup = e.target.openPopup();
    //       });
    //       marker.on("mouseout", (e) => {
    //         var popup = e.target.closePopup();
    //         // var content = popup.getContent();
    //       });
    //     });
    //   });

    // this.map = L.map("mapR", { minZoom: 11, maxZoom: 13 }).setView(
    //   [this.lat, this.lng],
    //   12
    // );
    // L.tileLayer(environment.baseMap + "{z}/{x}/{y}.png").addTo(this.map);
    // var circle = L.circle([this.lat, this.lng], {
    //   color: "blue",
    //   fillColor: "#6FA4E9",
    //   fillOpacity: 0.2,
    //   radius: 5000,
    //   stroke: false,
    // }).addTo(this.map);

    // const myIcon = L.icon({
    //   iconUrl: "../../../assets/defaultmarker.svg",
    //   iconSize: [31, 41], // size of the icon
    //   iconAnchor: [15, 31], // point of the icon which will correspond to marker's location
    //   popupAnchor: [0, -51], // point from which the popup should open relative to the iconAnchor
    //   // ...
    // });

    // var marker = L.marker([this.lat, this.lng], {
    //   icon: myIcon,
    // }).addTo(this.map);
    // var name = localStorage.getItem("name");
    // marker.bindPopup("<span>" + name + "</span>");

    // marker.on("click", (e) => {
    //   var popup = e.target.getPopup();
    //   var content = popup.getContent();
    //   // console.log(id);
    // });

    // marker.on("mouseover", (e) => {
    //   var popup = e.target.openPopup();
    // });
    // marker.on("mouseout", (e) => {
    //   var popup = e.target.closePopup();
    //   // var content = popup.getContent();
    // });

    // const myIcon2 = L.icon({
    //   iconUrl: "../../../assets/marker2.svg",
    //   iconSize: [31, 41], // size of the icon
    //   iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
    //   // popupAnchor: [0, -51], // point from which the popup should open relative to the iconAnchor
    // });
  }

  onSlideRangeChange(eve) {
    // console.log(eve);
  }

  viewAll(key = "") {
    if (key == "Categories") {
      this.fullCategories = !this.fullCategories;
      if (this.fullCategories == true) {
        this.initCategories = this.listofsearches.length;
        // console.log('Inside IF')
      } else {
        this.initCategories = 4;
        // console.log('Inside else')
      }
      return;
    } else if (key == "spaarks") {
      this.fullSpaarks = !this.fullSpaarks;
      if (this.fullSpaarks == true) {
        this.initSpaarks = this.listofPosts.length;
        // console.log('Inside IF')
      } else {
        this.initSpaarks = 4;
        // console.log('Inside else')
      }
      return;
    }
    this.fullView = !this.fullView;
    if (this.fullView == true) {
      this.initVal = this.listofSellers.length;
      // console.log('Inside IF')
    } else {
      this.initVal = 4;
      // console.log('Inside else')
    }
  }

  scrollLeft() {
    this.allMarketTab.nativeElement.scrollLeft -= 151;
    //console.log("moved left",this.allMarketTab.nativeElement.scrollLeft);
    this.movedRight = this.allMarketTab.nativeElement.scrollLeft;
  }

  onMakeFriends() {
    this.spaarks.selectedCat(2, "Make Friends", true);
    // var isAnonymous = true;
    // var txt = "Make Friends";
    // this.spaarks.selectedCreate = {
    //   ...this.spaarks.defaultCreate,
    // };
    // this.spaarks.selectedCreate.selectedSubCategory = "";
    // this.spaarks.CreateSpaarkSteps = {
    //   ...this.spaarks.DefaultSpaarkSteps,
    // };
    // this.spaarks.selectedCreate.content = "";

    // console.log(this.spaarks.selectedCreate);
    // console.log(this.spaarks.CreateSpaarkSteps);
    // this.spaarks.createSpaarksMain.pageone = txt;
    // if (this.spaarks.authData.isAuthenticated == false) {
    //   this.spaarks.triggerLogin();

    //   return;
    // }

    // this.spaarks.selectedCreate.featureSelected = "greet";
    // this.spaarks.selectedCreate.questionNo = "2";
    // this.spaarks.selectedCreate.location = false;

    // this.spaarks.selectedCreate.isAnonymous = isAnonymous;
    // this.spaarks.selectedCreate.selectedQuestion = txt;

    //Navigating user to the route, home/newspaark/create/i-offer-a-service
    //by splitting the spaces and join with -
    // if(this.action){
    //   this.location.back();
    //   return
    // }
    // this.router.navigateByUrl("newspaark/create/" + txt.split(" ").join("-"));

    // this.selected(2, "Make Friends",true);

    // this.spaarks.redirectToNewspark.next("greet");

    // if (this.router.url != "/newspaark"){
    //   this.router.navigate(["/newspaark", { action:'anonymous' }]);
    // }
  }

  selected(i, txt, isAnonymous = false) {
    this.spaarks.selectedCreate = {
      ...this.spaarks.defaultCreate,
    };
    this.spaarks.selectedCreate.selectedSubCategory = "";
    this.spaarks.CreateSpaarkSteps = {
      ...this.spaarks.DefaultSpaarkSteps,
    };
    this.spaarks.selectedCreate.content = "";

    console.log(this.spaarks.selectedCreate);
    console.log(this.spaarks.CreateSpaarkSteps);
    this.spaarks.createSpaarksMain.pageone = txt;
    if (this.spaarks.authData.isAuthenticated == false) {
      this.spaarks.triggerLogin();

      return;
    }

    this.spaarks.selectedCreate.featureSelected = "greet";
    this.spaarks.selectedCreate.questionNo = "2";

    this.spaarks.selectedCreate.isAnonymous = isAnonymous;
    this.spaarks.selectedCreate.selectedQuestion = txt;

    //Navigating user to the route, home/newspaark/create/i-offer-a-service
    //by splitting the spaces and join with -
    // if(this.action){
    //   this.location.back();
    //   return
    // }
    this.router.navigateByUrl("newspaark/create/" + txt.split(" ").join("-"));

    // this.spaarksservice.allPurposeSubject.next({action:'firststep',index:i,text:txt})
  }

  scrollRight() {
    this.allMarketTab.nativeElement.scrollLeft += 151;
    this.movedRight = 151 + this.allMarketTab.nativeElement.scrollLeft;
    //console.log("moved Right",this.movedRight);
  }

  //   viewAllChats() {
  //     this.fullViewChats = !this.fullViewChats;
  //     if (this.fullViewChats == true) {
  //       this.initValChats = this.listtoshowChatFinal.length;
  //       // console.log('Inside IF')
  //     } else {
  //       this.initValChats = 10;
  //       // console.log('Inside else')
  //     }
  //   }
  openRequests() {
    if (!this.isAuthed) return;
    this.spaarks.getRequestsbyPost().subscribe((succ: any) => {
      console.log(succ);
      //this.allSentRequests = succ.message;
      succ.forEach((ele) => {
        ele.greetRequest.forEach((ele2) => {
          if (ele2.status == "Pending") {
            this.allSentRequests.push(ele2);
          }
        });
      });
    });
    console.log(this.allSentRequests);
  }

  viewAllRequests() {
    this.fullViewRequest = !this.fullViewRequest;
    if (this.fullViewRequest == true) {
      this.intiRequest = this.allSentRequests.length;
      // console.log('Inside IF')
    } else {
      this.intiRequest = 3;
      // console.log('Inside else')
    }
  }

  pressedkey(eve) {
    console.log(eve);
    if (this.content) {
      if (this.content.length == 0) {
        this.listofsearches = [];
        // console.log('no searches')
        return;
      }
    }
    this.http;
    this.spaarks.searchRight(this.content).subscribe((succe: any) => {
      // console.log(succe);
      if (this.content != "") {
        this.listofsearches = succe.categories;
        this.listofPosts = succe.posts.reverse();
        var prof = succe.profiles.reverse();
        var offer = succe.serviceOfferings;
        this.listofSellers = [];
        for (
          let i = 0;
          i < (prof.length > offer.length ? prof.length : offer.length);
          i++
        ) {
          if (prof[i]) {
            this.listofSellers.push(prof[i]);
          }
          if (offer[i]) this.listofSellers.push(offer[i]);
        }
        //   this.listofSellers=succe.profiles.reduce(function(arr, v, i) {
        //     return arr.concat(v, succe.serviceOfferings[i]);
        //  }, []);
        this.showTabs = true;
        console.log(this.listofSellers);
      }
    });
  }

  clickedProfileSearch(result) {
    // ['/profile/seller/'+((fun.profilePic)?fun._id:fun.userId._id),((fun.subCategory)?{section:fun.subCategory}:'')]
    if (result.profilePic) {
      this.router.navigateByUrl("/profile/seller/" + result._id);
    } else {
      this.router.navigate([
        "/profile/seller/" + result.userId._id,
        { section: result.subCategory },
      ]);
    }
  }

  clickedPostSearch(spaark) {
    // console.log(spaark);
    this.allPurposeService.triggerModal.next({
      type: "spaarkinmodal",
      post: spaark,
      modal: true,
    });
  }

  inputChanged(change) {
    // if (change.data == null) {
    //     // alert('Heloooo');
    //     this.listofsearches = [];
    //     return;
    // }

    // console.log(this.content)
    if (this.content == "") {
      //console.log(change)
      this.listofsearches = [];
      this.listofSellers = [];
      this.listofPosts = [];
      return;
    }
    this.pressedkey("k");
  }

  selectedClick(eve) {
    console.log(eve);
    this.spaarks.showContactScreen.next(true);
    // this.showCat.emit(eve);
    let previousSearcehes = [];

    if (localStorage.getItem("searchedArr")) {
      previousSearcehes = JSON.parse(localStorage.getItem("searchedArr"));
      previousSearcehes.forEach((val, ind) => {
        console.log(val);
        if (eve.subCategoryFinal == val.subCategoryFinal) {
          previousSearcehes.splice(ind, 1);
        }
      });

      previousSearcehes = [eve, ...previousSearcehes];
      this.spaarks.currentSearchedCat = eve;
      this.spaarks.searchedCatArr = previousSearcehes;
      localStorage.setItem("searchedArr", JSON.stringify(previousSearcehes));
      this.showCat.emit(eve);
      this.spaarks.addSearchPill.next(previousSearcehes);
    } else {
      previousSearcehes = [eve, ...previousSearcehes];
      this.spaarks.currentSearchedCat = eve;
      this.spaarks.searchedCatArr = previousSearcehes;
      localStorage.setItem("searchedArr", JSON.stringify(previousSearcehes));
      this.showCat.emit(eve);
      this.spaarks.addSearchPill.next(previousSearcehes);
    }
    // console.log(this.spaarks.showContactScreen);
    // console.log(eve);
    //  this.showCat.emit(eve);
    // let arrays = [];
    // try {
    //   if (localStorage.getItem("searchedArr")) {
    //     arrays = JSON.parse(localStorage.getItem("searchedArr"));
    //   }
    //   else {
    //     arrays = [];
    //   }
    // } catch {}
    // let gun = [];
    // if (arrays.length > 0) {
    //   arrays.forEach((val, ind) => {
    //     if (val.subCategoryId) {
    //       if (val.subCategoryFinal == eve.subCategoryFinal) {
    //         gun.push(eve);
    //         arrays.slice(ind, 1);
    //       }
    //     }
    //   });
    // } else {
    //   //gun.push(eve);
    // }

    // if (gun) {
    //   if (gun.length == 0) {
    //     arrays = [eve, ...arrays];
    //     localStorage.setItem("searchedCat", JSON.stringify(eve));

    //     this.spaarks.currentSearchedCat = eve;
    //     this.spaarks.searchedCatArr = arrays;
    //     // console.log((this.spaarks.searchedCatArr));

    //     localStorage.setItem("searchedArr", JSON.stringify(arrays));
    //     this.showCat.emit(eve);

    //     this.spaarks.addSearchPill.next(eve);
    //   }
    //   this.spaarks.addSearchPill.next(eve);

    // }
  }

  closeSearch() {
    this.listofsearches = [];
    this.content = "";
    this.showTabs = false;
  }

  getUpdatedSentReq(eve) {
    // console.log(eve);
  }

  selectedCat(i, txt) {
    console.log(i + 1);
    this.spaarks.selectedCreate.questionNo = String(i + 1);
    this.spaarks.createSpaarksMain.pageone = txt;

    if (txt == "Announce") {
      this.spaarks.selectedCreate.featureSelected = "showtime";
    } else if (txt.includes("Friends")) {
      this.spaarks.selectedCreate.featureSelected = "greet";
    } else {
      this.spaarks.selectedCreate.featureSelected = "market";
    }
    this.spaarks.selectedCreate.selectedQuestion = txt;

    this.router.navigateByUrl("newspaark/create/" + txt.split(" ").join("-"));
    // this.spaarksservice.allPurposeSubject.next({action:'firststep',index:i,text:txt})
  }

  openTags() {
    this.showPills = true;
  }

  clickJob() {
    this.selectedClick({
      preview: "Job",
      category: "Job",
      subCategory: "Job",
      subCategoryFinal: "Job",
    });
  }

  clickWork() {
    this.selectedClick({
      preview: "Work",
      category: "Work",
      subCategory: "Work",
      subCategoryFinal: "Work",
    });
  }

  markerOnClick() {
    //   alert("het");
    // this.allPurposeService.triggerModal.next({
    //   type: "spaarkinmodal",
    //   post: this.markedPost,
    //   modal: true,
    // });
    // console.log(element);
  }

  placeMarkers(arr, cnt?) {
    const myIcon = L.icon({
      iconUrl: this.markerIcon,
      iconSize: [22, 32], // size of the icon
      iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
      // popupAnchor: [0, -51], // point from which the popup should open relative to the iconAnchor
    });
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    let newarray = [];
    // for logged in
    if (cnt) {
      newarray = arr.slice(0, cnt);
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

          this.marker.on("click", (e) => {
            var popup = e.target.getPopup();
            var content = popup.getContent();
            console.log(markerItem.id);
            this.scrolltoview = { id: markerItem.id };
          });
          console.log(markerItem);
          this.marker.on("mouseover", (e) => {
            var popup = e.target.openPopup();
          });
          this.marker.on("mouseout", (e) => {
            var popup = e.target.closePopup();
            // var content = popup.getContent();
          });
        } catch {
          (err) => {
            console.log(err);
            this.spaarks.catchInternalErrs(err);
          };
        }
      });
    }
    // for not logged in
    else {
      newarray = arr;
      newarray.forEach((element) => {
        //  alert("hyyyyyyyyyyy")
        let markerItem = {
          id: element._id,
          lng: element.locationStatic.coordinates[0],
          lat: element.locationStatic.coordinates[1],
          draggable: false,
          name: element.uservisibility.name,
          profilePic: element.uservisibility.profilePic,
        };
        this.markers.push(markerItem);
        this.markedPost = element;
        this.marker = L.marker([markerItem.lat, markerItem.lng], {
          icon: myIcon,
        })
          .on("click", this.markerOnClick)
          .addTo(this.map);
        //   .on('click', function(e) {
        //    alert("het");

        //     // this.allPurposeService.triggerModal.next({
        //     //   type: "spaarkinmodal",
        //     //   post: element,
        //     //   modal: true,
        //     // });
        //     console.log(element);
        // });
        this.mapMarkers.push(this.marker);
        var name = markerItem.name;
        name = name.substring(0, 9);

        if (markerItem.name.length > 8) name += "...";
        this.marker.bindPopup(
          "<img src=" +
            markerItem.profilePic +
            ">" +
            "<span>" +
            (name != null ? name : "Your Location") +
            "</span>"
        );
        // console.log(markerItem);
        this.marker.on(
          "click",
          (e) => {
            // console.log(e);

            //  this.markerOnclick(markerItem.id);
          }
          // var popup = e.target.getPopup();
          // var content = popup.getContent();
          // this.scrolltoview = { id: markerItem.id };
          // console.log(markerItem.id)
        );

        this.marker.on("mouseover", (e) => {
          var popup = e.target.openPopup();
        });
        this.marker.on("mouseout", (e) => {
          var popup = e.target.closePopup();
          // var content = popup.getContent();
        });
      });
    }
  }

  ngOnDestroy() {
    if (this.refrListSubs) {
      this.refrListSubs.unsubscribe();
    }
  }
}
