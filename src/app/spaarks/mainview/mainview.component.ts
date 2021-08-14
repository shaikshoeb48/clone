import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  NgZone,
} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { Subscription, Subject } from "rxjs";
import { SpaarksService } from "../../spaarks.service";
import { Router } from "@angular/router";
import { AllpurposeserviceService } from "../../allpurposeservice.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Location } from "@angular/common";
import { ChatService } from "src/app/chat.service";
import { ShortNumberPipe } from "src/app/short-number.pipe";
import { MatSnackBar } from "@angular/material/snack-bar";

export interface Vegetable {
  name: string;
}
@Component({
  selector: "app-mainview",
  templateUrl: "mainview.component.html",
  styleUrls: ["mainview.component.scss"],
})
export class MainView implements OnInit, OnDestroy {
  openModal = false;
  askPermission = false;
  rightClickCount = 0;
  rightClickSectionCount = 0;
  reviewCardClickCount = 0;
  statusCardClickCount = 0;
  selectedLang;
  showtext: boolean = false;
  showEngText: boolean;
  constructor(
    private spaark: SpaarksService,
    private http: HttpClient,
    private location: Location,
    private router: Router,
    private allPurposeService: AllpurposeserviceService,
    private chatServ: ChatService,
    public _zone: MatSnackBar,
    private _zoneone: NgZone
  ) {
    this.isMobileVersion = this.spaark.isMobileVersion;
    // localStorage.getItem("lang")
    this.selectedLang = localStorage.getItem("lang");
    console.log(this.selectedLang);
    if (this.selectedLang == "en") {
      this.showtext = false;
      this.showEngText = true;
    } else if (this.selectedLang == "hi" || this.selectedLang == "te") {
      this.showtext = true;
      this.showEngText = false;
    } else {
      this.showtext = false;
    }

    try {
      if (localStorage.getItem("weblocation")) {
        let loc = JSON.parse(localStorage.getItem("weblocation"));
        console.log(loc);
        // loc = JSON.parse(loc);
        this.spaark.latitude = loc.lat;
        this.spaark.longitude = loc.long;
      } else {
        this.spaark.checkforLocation();
        // console.log(this.onShare);

        if (this.onShare == true) {
          this.spaark.latitude = this.coordinates[0];
          this.spaark.longitude = this.coordinates[1];
          localStorage.setItem(
            "weblocation",
            JSON.stringify({
              long: this.spaark.longitude,
              lat: this.spaark.latitude,
            })
          );
        }
      }
    } catch {
      (err) => {
        this.spaark.catchInternalErrs(err);
        this.spaark.checkforLocation();
      };
    }

    try {
      if (localStorage.getItem("askname")) {
        let getNameVal = localStorage.getItem("askname");
        if (getNameVal == "true") {
          //  this.spaark.triggerLogin();
        }
      }
    } catch {}
  }

  onShare: boolean;
  fName;

  isAuthed = this.spaark.isJai;
  isMobileVersion;
  shareData = undefined;
  showModal = false;
  currentFeature = "user";
  showContact = false;
  showRecentChats = false;
  listtoShowAno = [];
  listtoshowChatFinal = [];
  noBeyoundSpaarks = false;
  refrListSubs: Subscription;
  sliderValue;
  type;
  kilometer = 5;
  noSpaarkWithin = false;
  radius;
  sortType = localStorage.getItem("type");
  rangeSubj = new Subject();
  loading2 = false;

  @ViewChild("allMarketTab") allMarketTab: ElementRef;
  scrollLeftSide() {
    this.allMarketTab.nativeElement.scrollLeft -= 151;
  }
  scrollRightSide() {
    this.allMarketTab.nativeElement.scrollLeft += 200;
  }

  multipurpSubs: Subscription;
  searchedArr = [];
  listtoShowNorm = [];
  showSparkAnonymus = false;
  fullViewChats = false;
  initValChats = 4;
  showPillsArray = false;
  coordinates;
  hideStatus = true;
  ngOnChanges() {
    // console.log(this.chipcolor);
  }

  ngOnInit(): void {
    if (localStorage.getItem("phoneData")) {
      var Data = localStorage.getItem("phoneData");
      if (Data == "false") {
        setTimeout(() => {
          this.spaark.getPhoneData().subscribe(() => {
            localStorage.setItem("phoneData", "true");
          });
        }, 6000);
      }
    }

    try {
      if (localStorage.getItem("cookieAccess")) {
        let val = localStorage.getItem("cookieAccess");
        if (val == "true") {
        }
      } else {
        this.CookiePolicy();
      }
    } catch {}

    console.log(this.pillsArr);
    this.spaark.statusCardSub.subscribe((x: number) => {
      this.workStatusData.splice(x, 1);
      if (x == 0) this.activeStatusCarousel = 0;
      else if (x > this.workStatusData.length - 1)
        this.activeStatusCarousel = this.workStatusData.length - 1;
      else this.activeStatusCarousel = x;
      console.log(this.workStatusData);
      console.log(this.activeStatusCarousel);
      if (this.workStatusData.length == 0) this.hideStatus = true;
    });

    this.spaark.tabChanged.subscribe(() => {
      // alert("ee")
      //this pills colors are code
      if (this.chipcolor) {
        if (this.chipcolor.nativeElement) {
          if (this.chipcolor.nativeElement.nextElementSibling) {
            setTimeout(() => {
              this.chipcolor.nativeElement.nextElementSibling.style.backgroundColor =
                "#FFFFFF";
              this.chipcolor.nativeElement.nextElementSibling.style.color =
                "black";
            }, 100);
          }
        }
      }
    });
    this.spaark.clickedPillFormCard.subscribe((eve) => {
      // alert("aaaaa")
      console.log(eve);
      if (this.isMobileVersion) {
        this.clickedCat(eve, false);
      }
    });

    // if(localStorage.getItem('askname'))
    // {
    //   var noName=localStorage.getItem('askname');
    //   if(noName!='true')
    //   {
    //     this.allPurposeService.triggerModal.next({
    //       type: "openName",
    //       modal: true,

    //     });

    //   }

    // }
    // if(this.allPurposeService.isOpenNameModal){
    //   this.allPurposeService.triggerModal.next({
    //     type: "openName",
    //     modal: true,

    //   });
    // }
    this.spaark.reqErrorSubj.subscribe((a) => {
      console.log(a);
    });
    if (!localStorage.getItem("radius")) {
      localStorage.setItem("radius", "5");
    }
    if (!localStorage.getItem("type")) {
      localStorage.setItem("type", "Distance");
    }
    this.radius = localStorage.getItem("radius");
    console.log(this.chipcolor);

    console.log(this.shareData);
    this.spaark.allPurposeSubject.subscribe((succ) => {
      // console.log(succ);

      if (this.spaark.featName == "") {
        this.spaark.featName = "user";
      }

      if ((this.spaark.featName, this.spaark.featCat)) {
        console.log("featName", this.spaark.featName);
        this.category = this.spaark.featCat;
        // alert('called from ngoninit')
        this.getPosts(this.spaark.featName);
      }
    });
    // console.log('mainview onini');

    this.pillsArr.unshift("All");
    if (this.spaark.fName) {
      this.spaark.featName = this.spaark.fName;
    }

    this.spaark.addSearchPill.subscribe((pillsArray: any) => {
      console.log(pillsArray);

      console.log(this.chipcolor);
      // alert('inside subscription')
      //this.chipcolor.nativeElement.style.backgroundColor="red";
      this.clickedPillFromList = true;
      this.pillsArr = [];
      let searchedArr = [];
      searchedArr = pillsArray;
      // this.pillsArr=searchedArr
      //this.searchedArr.push(pill);

      if (this.currentFeature == "") {
        this.currentFeature = "user";
      }

      searchedArr.forEach((val2, ind2) => {
        this.pillsArr.push(val2.subCategoryFinal);
        // if (val2.subCategoryFinal == pill.subCategoryFinal) {
        //   this.searchedArr.slice(ind2, 1);
        // } else this.pillsArr.push(val2.subCategoryFinal);
      });

      this.pillsArr.unshift("All");
      if (this.pillsArr.length > 1) {
        this.showPillsArray = true;
      }
      setTimeout(() => {
        if (this.preveve) {
          this.preveve.target.style.backgroundColor = "#FFFFFF";
          this.preveve.target.style.color = "black";
        }

        console.log(this.chipcolor);
        if (this.chipcolor.nativeElement) {
          if (this.chipcolor.nativeElement.nextElementSibling) {
            setTimeout(() => {
              this.chipcolor.nativeElement.nextElementSibling.style.backgroundColor =
                "#6FA4E9";
              this.chipcolor.nativeElement.nextElementSibling.style.color =
                "#FFFFFF";
            }, 100);
          }
        }

        if (
          this.chipcolor.nativeElement.nextElementSibling.nextElementSibling
        ) {
          setTimeout(() => {
            this.chipcolor.nativeElement.nextElementSibling.nextElementSibling.style.backgroundColor =
              "#FFFFFF";
            this.chipcolor.nativeElement.nextElementSibling.nextElementSibling.style.color =
              "black";
          }, 100);
        }
        this.clickedPillFromList = true;
      }, 200);

      //this.pillsArr.splice(1, 0, pill.subCategoryFinal);
      console.log(this.chipcolor);
      //this.chipcolor._results[2].nativeElement.previousSibling.style.backgroundColor="red";
      // this.chipcolor.first.nativeElement.nextElementSibling.style.backgroundColor="red"
      //    this.chipcolor.last.nativeElement.style.backgroundColor="red"
      //     this.chipcolor.results[1].nativeElement.style.backgroundColor="red"
      // this.chipcolor.toArray()[0].nativeElement.style.backgroundColor="red";
    });
    // this.searchedArr.array.forEach(val => {
    //     if(this.searchedArr!==)
    //     {
    //         this.pillsArr.push[this.searchedArr.subCategory];
    //     }
    // });

    if (this.spaark.featName == "") {
      this.spaark.featName = "user";
    }
    //
    if ((this.spaark.featName, this.spaark.featCat)) {
      if (this.spaark.latitude && this.spaark.longitude) {
        // console.log("featName", this.spaark.featName)
        this.category = this.spaark.featCat;
        // alert('called from ngoninit222')

        this.getPosts(this.spaark.featName);
      }
    }

    this.spaark.showContactScreen.subscribe((val) => {
      this.showContact = val;
    });

    try {
      this.multipurpSubs = this.allPurposeService.multiPurposeSubj.subscribe(
        (succe: any) => {
          // console.log(succe)
          let found = "no";
          if (succe) {
            if (succe.type) {
              if (succe.type == "greetreqUpdate") {
                this.slicedPosts.forEach((val, ind) => {
                  if (val._id) {
                    if (val._id == succe.id) {
                      console.log(val);
                      val.requested = true;
                      found = "yes";
                    }
                  }
                });

                if (found == "no") {
                  this.slicedBeyondPosts.forEach((val, ind) => {
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
        }
      );
    } catch {}

    this.onShare = this.spaark.onShared;
    // console.log(this.onShare);

    if (this.onShare == true && this.spaark.shareId != "") {
      var shareSubs = this.spaark.getOnePost(this.spaark.shareId).subscribe(
        (succ) => {
          // alert('llllll')
          console.log(succ);

          this.shareData = succ;
          console.log(this.shareData);
          try {
            if (shareSubs) {
              shareSubs.unsubscribe();
            }
          } catch (error) {}
        },
        (err) => {
          this.onShare = false;
        }
      );
    }

    if (localStorage.getItem("searchedArr")) {
      this.searchedArr = JSON.parse(localStorage.getItem("searchedArr"));

      this.searchedArr.forEach((val, ind) => {
        if (val.subCategoryFinal) this.pillsArr.push(val.subCategoryFinal);
      });
      if (this.pillsArr.length > 1) {
        this.showPillsArray = true;
      }
    }

    this.spaark.locationSubj.subscribe((succ) => {
      // console.log(succ);
      if (succ == "Yes") {
        this.openModal = false;
      }
    });
    // this.category = 'all';
    // this.getPosts('user');

    // alert(this.spaark.featName)

    // this.allPurposeService.triggerModal.subscribe((succ:any)=>{

    //     if(succ.type=="openGreetRequest"){
    //         console.log('DID CLICKED ON CHAT');
    //         this.showModal=!this.showModal;
    //     }

    // })

    // console.log(JSON.parse((localStorage.getItem('searchedArr'))));
    if (localStorage.getItem("searchedArr")) {
      //this.pillsArr = JSON.parse((localStorage.getItem('searchedArr')))
    } else {
      // this.pillsArr = []
    }
    if (this.isAuthed) {
      try {
        // this.spaark.getPendingRequests();
      } catch {
        (err) => {
          this.spaark.catchInternalErrs(err);
        };
      }

      try {
        this.spaark.currentFeatureSubj.subscribe((succ: any) => {
          this.currentFeature = succ;

          if (this.currentFeature == "" || this.currentFeature == undefined) {
            this.currentFeature = "user";
          }
        });
      } catch {
        (err) => {
          this.spaark.catchInternalErrs(err);
        };
      }
    }

    if (this.router.url.includes("feed")) {
      ChatService.jidEmitter.next([]);

      if (
        this.chatServ.chatLoadedArr.loadedArr.includes("ano") &&
        this.chatServ.chatLoadedArr.loadedArr.includes("norm")
      ) {
        try {
          this.listtoShowNorm = [];
          this.listtoShowNorm.push(...ChatService.myChats);
          this.listtoShowNorm.forEach((val, ind) => {
            val.account = "1";
          });
          console.log(this.listtoShowNorm);

          this.listtoShowAno.push(...ChatService.myAnoChats);
          this.listtoShowAno.forEach((val, ind) => {
            val.account = "2";
          });
          // console.log(this.listtoShowNorm);

          let finaArr = this.listtoShowAno.concat(this.listtoShowNorm);
          // console.log(finaArr);

          this.listtoshowChatFinal = ChatService.mergeSort(finaArr);

          // console.log(this.listtoshowChatFinal);
          // if(this.listtoshowChatFinal.length>5){

          //     this.listtoshowChatFinal = this.listtoshowChatFinal.slice(0,3);

          // }
          if (this.listtoshowChatFinal.length > 0) {
            this.showRecentChats = true;
            console.log(this.showRecentChats);
          }
          if (!this.showRecentChats) {
            //this.showSparkAnonymus = true;
          }
        } catch (exc) {
          console.log(exc);
        }
      }

      this.refrListSubs = ChatService.refreshList.subscribe(
        (succ) => {
          if (succ.refresh) {
            try {
              if (succ.refresh == "jai") {
                this.listtoShowNorm = [];
                this.listtoShowNorm.push(...ChatService.myChats);
                this.listtoShowNorm.forEach((val, ind) => {
                  val.account = "1";
                });
                // console.log(this.listtoShowNorm);
              } else if (succ.refresh == "jaiano") {
                this.listtoShowAno.push(...ChatService.myAnoChats);
                this.listtoShowAno.forEach((val, ind) => {
                  val.account = "2";
                });
                // console.log(this.listtoShowNorm);
              }

              let finaArr = this.listtoShowAno.concat(this.listtoShowNorm);
              // console.log(finaArr);

              this.listtoshowChatFinal = ChatService.mergeSort(finaArr);
              // console.log(this.listtoshowChatFinal);
              // if(this.listtoshowChatFinal.length>5){

              //     this.listtoshowChatFinal = this.listtoshowChatFinal.slice(0,5);
              // }

              if (this.listtoshowChatFinal.length > 0) {
                this.showRecentChats = true;
                this.spaark.noChats.next("1");

                console.log(this.showRecentChats);
              }
              if (!this.showRecentChats) {
                this.spaark.noChats.next("0");
              }
            } catch (exc) {
              console.log(exc);
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }

    this.spaark.workStatusSubj.subscribe((succ) => {
      // console.log(succ);
      this.checkWorkStatus = false;
    });
    if (this.spaark.routeToexplore) {
      console.log("navigate is true");
      this.router.navigateByUrl("explore");
    }

    this.spaark.sortSubj.subscribe((a: any) => {
      console.log(a.sliderValue);
      if (a) {
        // this.radius = a.sliderValue;
        localStorage.setItem("radius", a.sliderValue);
        localStorage.setItem("type", a.type);
        //  this.rangeSubj.next(localStorage.getItem("radius"));
        this.radius = localStorage.getItem("radius");
        this.sortType = localStorage.getItem("type");
        this.slicedPosts = [];
        this.slicedBeyondPosts = [];
        this.pageWithin = 0;
        this.pageBeyond = 0;
        this.postsReachedEnd = false;
        //  this.postsBeyondReachedEnd = false;
        this.getWithinPosts();
      }
      // if(a){
      //   this.spaark.getSortPostsWithin(this.spaark.latitude,
      //     this.spaark.longitude,
      //     this.category,
      //     this.subCategory,
      //     "en",
      //     this.spaark.featName,
      //     1,
      //     a.sliderValue,
      //     a.type).subscribe((succ:any)=>{
      //       console.log(succ.data.post);
      //       this.slicedPosts = [];
      //       this.slicedPosts = succ.data.post;
      //       this.kilometer = a.sliderValue;
      //       if(!succ.data.post.length){
      //         this.noSpaarkWithin = true;
      //         this.loading = false;
      //         this.getBeyondPosts();
      //         this.showBeyondPost = true;
      //       }else{
      //         this.noSpaarkWithin = false;
      //       }
      //     })
      // }
    });
  }
  CookiePolicy() {
    this._zoneone.run((submitMessege) => {
      if (localStorage.getItem("lang")) {
        let language = localStorage.getItem("lang");
        if (language == "hi") {
          this._zone
            .open("ओके करने से आप कुकी पॉलिसी स्वीकार कर रहे हैं.", "Ok", {
              duration: 1000000,
            })
            .afterDismissed()
            .subscribe((succ) => {
              localStorage.setItem("cookieAccess", "true");
            });
        } else if (language == "te") {
          this._zone
            .open(
              "సరే క్లిక్ చేయడం ద్వారా మీరు మా కుకీ పాలసీలను అంగీకరించడానికి అంగీకరిస్తున్నారు.",
              "Ok",
              {
                duration: 1000000,
              }
            )
            .afterDismissed()
            .subscribe((succ) => {
              localStorage.setItem("cookieAccess", "true");
            });
        } else {
          this._zone
            .open(
              "By clicking “OK” you are agreeing to accept our cookie policies.",
              "Ok",
              {
                duration: 1000000,
              }
            )
            .afterDismissed()
            .subscribe((succ) => {
              localStorage.setItem("cookieAccess", "true");
            });
        }
      }
    });
  }
  viewAllChats() {
    this.fullViewChats = !this.fullViewChats;
    if (this.fullViewChats == true) {
      this.initValChats = 15;
      // console.log('Inside IF')
    } else {
      this.initValChats = 4;
      // console.log('Inside else')
    }
  }

  getLocFromCard(eve) {
    console.log(eve);
    this.coordinates = eve;
    if (this.onShare == true) {
      if (!localStorage.getItem("weblocation")) {
        this.spaark.latitude = this.coordinates[1];
        this.spaark.longitude = this.coordinates[0];
      }
      // showing posts using temporary location of shared post
      this.getPosts("user");
      this.spaark.onShared = false;
    }
  }

  checkWorkStatus = true;

  images = [
    "../../../assets/testingMedia/sample1.jpeg",
    "../../../assets/testingMedia/sample_02.jpeg",
    "../../../assets/testingMedia/sample_03.jpg",
    "../../../assets/testingMedia/sample_04.jpg",
    "../../../assets/testingMedia/sample_05.jpeg",
  ];
  activeSlide = 0;

  getLocationUserAccessSubs: Subscription;

  clickedLocation(event) {
    if (event == "null") {
      this.openModal = false;
      return;
    }
    this.initializeWebLocation();
  }

  ngOnDestroy() {
    if (this.getLocationUserAccessSubs) {
      this.getLocationUserAccessSubs.unsubscribe();
    }
    if (this.multipurpSubs) {
      this.multipurpSubs.unsubscribe();
    }
  }
  pillsArr = [];
  //  pillsArr=["Arts","medicine","dance","music","Arts","medicine","dance","music","Arts","medicine","dance","music"];
  changeTab = true;
  searchCall = false;
  clickedCat(eve, canTrigger = true) {
    // console.log(this.currentFeature);]
    console.log(eve);
    // alert("aaaa")
    // if(eve==)
    this.searchCall = true;
    this.category = eve.category;
    this.subCategory = eve.subCategoryFinal;
    this.spaark.featCat = eve.category;

    if (this.category == "" && this.subCategory != "") {
      this.category = this.subCategory;
    }
    // console.log(this.spaark.searchedCatArr);
    // console.log(localStorage.getItem(JSON.parse('searchedArr')));

    // this.changeTab=!this.changeTab;
    // console.log(this.changeTab);
    this.slicedPosts = [];
    this.spaark.mainTabTrigger.next("clicked");

    this.clickedPill(this.subCategory, canTrigger);
  }

  contactRequest() {
    this.spaark.showContactScreen.next(false);
  }
  initializeWebLocation() {
    // console.log('get location')
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
          this.openModal = false;
          //alert('got location and saved in localstorage');
          //   this.checkNote = positionInfo;
          // this.activeService.originalLocation = [position.coords.longitude,position.coords.latitude];
          // this.loadMaps(position.coords.latitude,position.coords.longitude);
          // this.getNotifications([position.coords.latitude,position.coords.longitude])
          //   this.modalService.locationFromWebSubj.next({show:false})
        },
        (err) => {
          this.allPurposeService.triggerModal.next({
            type: "alertModal",
            modal: true,
            modalMsg:
              "Oops! Without location you cannot use this application. Refresh or grant location permission.",
          });
          // alert(
          //   "Oops!, without location you cannot use this application. Refresh or/and grant location permission "
          // );
          // console.log(err)
          this.showSearchLocation = true;
        }
      );
    } else {
      this.allPurposeService.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "Sorry, your browser does not support HTML5 geolocation.",
      });
      // this.spaark.showAlert(
      //   "Sorry, your browser does not support HTML5 geolocation."
      // );
      this.showSearchLocation = true;
    }
    //navigator.geolocation.getCurrentPosition(this.setLocationFromWeb,this.showError);
  }

  //pagination code end
  direction = "";
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  showSearchLocation = false;
  array = [];
  sum = 20;
  // jaidiv;

  showSearch = false;
  hideSearchBar = true;
  //****checkTabIndex start****
  //**** returns the tab index ****n//
  currentFeat = "user";
  checkTabIndex(event) {
    // this.searchCall=true;
    // alert("aaaaaaaaaaaaaaa")
    if (this.subCategory == "All") {
      this.category = "all";
      this.subCategory = "";
    }
    this.currentFeat = event;
    this.postsBeyondReachedEnd = false;
    this.postsReachedEnd = false;
    this.gotData = true;
    this.pageBeyond = 0;
    this.pageWithin = 0;
    this.slicedPosts = [];
    this.slicedBeyondPosts = [];
    this.showTop = false;
    // alert('mainview')
    console.log(event);
    console.log("jjjjjj");
    if (event == "showtime" || event == "greet") {
      this.hideSearchBar = false;
    } else this.hideSearchBar = true;
    console.log("slectedev", event);
    console.log("slectedev", this.category);
    if (!this.category) {
      this.category = "";
      this.subCategory = "";
    }
    // this.category = "";
    // this.subCategory = "";
    this.spaark.featName = event;
    this.spaark.currentFeatureSubj.next(event);
    // alert('called from tabindex')

    this.getPosts(event);

    // let locUrll = document.URL;
    if (event == "market") {
      this.showSearch = true;
      this.getSellerRating();
      // alert('heloooo');
    } else {
      this.showSearch = false;
    }
  }

  //****checkTabIndex end****

  clickedSearch() {
    this.allPurposeService.triggerModal.next({
      type: "searchModal",
      modal: true,
    });
  }
  colors = ["darkgray", "cornflowerblue", "cadetblue", "blue", "black"];
  allposts;
  posts = [];
  postsBeyond;
  allSellerPosts;
  lat = Number(this.spaark.latitude);
  lng = Number(this.spaark.longitude);

  category = "";
  subCategory = "";
  lastFeat = "user";
  sellerRatingData;
  workStatusData;
  showWorkStatus = false;
  showRatings = false;
  ratingData;
  getSellerRating() {
    if (this.isAuthed) {
      try {
        this.spaark.getSellerRatings().subscribe((succ: any) => {
          console.log(succ);
          this.ratingData = succ.data;
          // console.log(this.ratingData);
          if (this.ratingData.length != 0) {
            this.showRatings = true;
          }
          this.allPurposeService.triggerModal.next({
            type: "showRatingsModal",
            data: succ,
            modal: true,
          });
        });
      } catch {}
    }
  }
  loading = false;
  slicedPosts = [];
  slicedBeyondPosts = [];
  banners;
  showsortmodal = true;

  sort() {
    this.allPurposeService.triggerModal.next({
      type: "sorting",
      modal: this.showsortmodal,
    });
  }
  getPosts(fName) {
    console.log("inside getposts");
    console.log(fName);
    this.noSpaarkWithin = false;
    if (fName) {
      this.lastFeat = fName;
      this.spaark.featName = fName;
    }
    // console.log("gtepost", fName, this.category, this.subCategory);
    this.loading = true;
    console.log(this.category);
    console.log(this.subCategory);
    console.log(this.spaark.featName);

    if (!(this.spaark.latitude && this.spaark.longitude)) {
      return;
    }
    // console.log(this.postsReachedEnd);
    // console.log(this.get);
    // console.log(this.gotData);
    if (this.postsReachedEnd == false) {
      console.log("calling within");
      this.getWithinPosts();
      this.noSpaarkWithin = false;
    }

    if (this.postsBeyondReachedEnd == false && this.postsReachedEnd == true) {
      console.log("calling beyomnds");
      this.getBeyondPosts();
    }

    //         //     // if (succ.data.work_status) {
    //         //     //     if (succ.data.work_status.length != 0) {
    //         //     //         this.workStatusData = succ.data.work_status;
    //         //     //         if (this.workStatusData.length > 1) {
    //         //     //             this.showWorkStatus = true;
    //         //     //         }
    //         //     //         // console.log(this.workStatusData);
    //         //     //         this.allPurposeService.triggerModal.next({ type: 'WorkStatus', workData: succ.data.work_status, modal: true });
    //         //     //     }
    //         //     // }
    //         // })
    //     }

    //     // if (succ.data.work_status) {
    //     //     if (succ.data.work_status.length != 0) {
    //     //         this.workStatusData = succ.data.work_status;
    //     //         if (this.workStatusData.length > 1) {
    //     //             this.showWorkStatus = true;
    //     //         }
    //     //         // console.log(this.workStatusData);
    //     //         this.allPurposeService.triggerModal.next({ type: 'WorkStatus', workData: succ.data.work_status, modal: true });
    //     //     }

    try {
      this.spaark
        .getSellerPosts(this.spaark.latitude, this.spaark.longitude)
        .subscribe((succ: any) => {
          this.allSellerPosts = succ.data;
        });
    } catch {}
  }

  multioutputFromspaarkCard(eve) {
    if (eve) {
      if (eve.type) {
        if (eve.type == "blocksuccess") {
          this.getPosts(this.lastFeat);
        }
      }
    }
  }

  // switchSlide(ind) {
  //   // console.log(ind)
  //   this.activeSlide = ind;
  // }

  content = "";

  pressedkey(eve) {
    // console.log(eve)
    if (this.content) {
      if (this.content.length == 0) {
        this.listofsearches = [];
        // console.log('no searches')
        return;
      }
    }

    this.http
      .get("https://staging-api.ososweb.com/search/" + this.content)
      .subscribe((succe: any) => {
        // console.log(succe);
        this.listofsearches = succe;
      });
  }

  listofsearches = [];

  marketTab = this.spaark.marketTab;

  selectedCat(i, txt) {
    this.spaark.selectedCat(i, txt);
  }

  @ViewChild("allSellerCard") allSellerCard: ElementRef;
  @ViewChild("allMarketCard") allMarketCard: ElementRef;
  @ViewChild("allReviewCard") allReviewCard: ElementRef;
  @ViewChild("allStatusCard") allStatusCard: ElementRef;

  activeCarousel = 0;
  activeGetStartedCarousel = 0;
  activeStatusCarousel = 0;
  activeReviewCarousel = 0;

  scrollCarousel(side: number = 0, type: string = "post") {
    if (type == "post") {
      if (side == 0) {
        this.activeCarousel -= 1;
      } else if (side == 1) {
        this.activeCarousel += 1;
      }
    } else if (type == "getStarted") {
      if (side == 0) {
        this.activeGetStartedCarousel -= 1;
      } else if (side == 1) {
        this.activeGetStartedCarousel += 1;
      }
    } else if (type == "status") {
      if (side == 0) {
        this.activeStatusCarousel -= 1;
      } else if (side == 1) {
        this.activeStatusCarousel += 1;
      }
    } else if (type == "review") {
      if (side == 0) {
        this.activeReviewCarousel -= 1;
      } else if (side == 1) {
        this.activeReviewCarousel += 1;
      }
    }
  }
  scrollLeft(eve) {
    if (eve == "seller") {
      if (this.rightClickSectionCount > 0) this.rightClickSectionCount--;
      this.allSellerCard.nativeElement.scrollLeft -= 171;
    } else if (eve == "create") {
      if (this.rightClickCount > 0) this.rightClickCount--;
      this.allMarketCard.nativeElement.scrollLeft -= 161;
    } else if (eve == "review") {
      if (this.reviewCardClickCount > 0) this.reviewCardClickCount--;
      this.allReviewCard.nativeElement.scrollLeft -= 161;
    } else if (eve == "status") {
      if (this.statusCardClickCount > 0) this.statusCardClickCount--;
      this.allStatusCard.nativeElement.scrollLeft -= 240;
    }
  }

  scrollRight(eve, clickCount = 4) {
    if (eve == "seller") {
      if (this.rightClickSectionCount < clickCount)
        this.rightClickSectionCount++;
      this.allSellerCard.nativeElement.scrollLeft += 171;
    } else if (eve == "create") {
      if (this.rightClickCount < clickCount) this.rightClickCount++;

      this.allMarketCard.nativeElement.scrollLeft += 161;
    } else if (eve == "review") {
      if (this.reviewCardClickCount < clickCount) this.reviewCardClickCount++;

      this.allReviewCard.nativeElement.scrollLeft += 161;
    } else if (eve == "status") {
      if (this.statusCardClickCount < clickCount) this.statusCardClickCount++;

      this.allStatusCard.nativeElement.scrollLeft += 240;
    }
  }

  @ViewChild("chipcolor") chipcolor: ElementRef;

  preveve;
  clickedPillFromList = false;
  eve;
  colorChange(eve) {
    this.eve = eve;
    if (this.clickedPillFromList) {
      this.chipcolor.nativeElement.nextElementSibling.style.backgroundColor =
        "#FFFFFF";
      this.chipcolor.nativeElement.nextElementSibling.style.color = "black";
    }
    if (this.preveve) {
      this.preveve.target.style.backgroundColor = "#FFFFFF";
      this.preveve.target.style.color = "black";
    }
    eve.target.style.backgroundColor = "#6FA4E9";
    eve.target.style.color = "#FFFFFF";

    this.preveve = eve;
  }
  addedfromsearch = false;
  clickedPill(selectedPill, check = false) {
    console.log("aaa");
    // if (selectedPill == 'All') {
    //   this.spaark.mainTabTrigger.next(selectedPill);
    //   return
    // }
    this.showPillsArray = true;
    console.log(selectedPill);
    console.log(this.chipcolor);
    console.log(this.clickedPillFromList);
    if (this.allMarketTab) {
      this.allMarketTab.nativeElement.scrollLeft = 0;
    }
    this.postsBeyondReachedEnd = false;
    this.postsReachedEnd = false;
    this.gotData = true;
    this.pageBeyond = 0;
    this.pageWithin = 0;
    this.slicedPosts = [];
    this.slicedBeyondPosts = [];
    console.log(this.searchedArr);

    this.subCategory = selectedPill;
    this.spaark.noPillSelected = false;
    if (this.subCategory == "All") {
      console.log("all");
      // this.getPosts("user");
      this.spaark.mainTabTrigger.next(selectedPill);
      return;
    } else {
      this.searchedArr.forEach((val) => {
        if (val.subCategoryFinal == this.subCategory) {
          this.category = val.category;
          console.log(val);
          console.log(this.category);
        }
      });
      if (check == false) {
        // alert("bbbbbbbbbbbbbb")
        this.getPosts("market");
      }
    }
  }

  back(): void {
    this.location.back();
  }

  identify(index, item) {
    return item._id;
  }

  previousScrl = 0;
  verticalScroll;
  previousoffsetHeight = 350;
  previousScrl2 = 0;
  showBeyondPost = false;
  postsReachedEnd = false;
  postsBeyondReachedEnd = false;
  pageWithin = 0;
  pageBeyond = 0;
  //call backend?
  gotData = true;

  goToTop() {
    document.getElementById("scroller").scrollTop = 0;
    this.showTop = false;
  }

  showTop = false;
  onScroll(event) {
    // console.log(
    //   document.getElementById("scroller").scrollHeight,
    //   document.getElementById("scroller").scrollTop,
    //   document.getElementById("scroller").offsetHeight,
    //   document.getElementById("scroller").offsetHeight
    // );
    if (document.getElementById("scroller").scrollTop > 80) {
      this.showTop = true;
    } else {
      this.showTop = false;
    }
    if (
      document.getElementById("scroller").scrollHeight -
        (document.getElementById("scroller").scrollTop +
          document.getElementById("scroller").offsetHeight) <
      document.getElementById("scroller").offsetHeight
    ) {
      // console.log('trigger add posts');
      // console.log(this.postsReachedEnd)
      // console.log(this.postsBeyondReachedEnd)
      // console.log(this.gotData)

      if (
        this.postsReachedEnd == false &&
        this.gotData &&
        this.searchCall == false
      ) {
        this.loading2 = true;
        this.getWithinPosts();
      }
      if (this.searchCall) this.searchCall = false;

      if (
        this.postsBeyondReachedEnd == false &&
        this.postsReachedEnd == true &&
        this.gotData == true
      ) {
        // console.log(this.postsReachedEnd)
        // console.log(this.postsBeyondReachedEnd)
        // console.log(this.gotData)
        this.loading2 = true;
        this.getBeyondPosts();
      }
      // if (this.postsReachedEnd) {
      //     this.getBeyondPosts();
      // }
    }
    //this.showTop=true;
  }

  getBeyondPosts() {
    console.log("...........");
    this.loading2 = true;
    if (
      (this.postsBeyondReachedEnd == false &&
        this.postsReachedEnd == true &&
        this.gotData == true) ||
      this.noSpaarkWithin == true
    ) {
      // alert('inside beyond posts')
      console.log("inside postsbeyond");
      this.gotData = false;
      this.spaark
        .getPostsBeyond(
          this.spaark.latitude,
          this.spaark.longitude,
          this.category,
          this.subCategory,
          "en",
          this.spaark.featName,
          ++this.pageBeyond,
          localStorage.getItem("radius"),
          this.sortType
        )
        .subscribe((succ: any) => {
          this.loading2 = false;
          this.gotData = true;

          console.log(succ.data.post);
          this.slicedBeyondPosts = this.slicedBeyondPosts.concat(
            succ.data.post
          );
          console.log(this.slicedBeyondPosts);
          this.spaark.postForMarkers.next({
            posts: this.slicedBeyondPosts,
            count: this.slicedBeyondPosts.length,
          });

          if (succ.data.post.length == 0) {
            //    this.noSpaarkWithin = true;
            // this.noBeyoundSpaarks = true;
            this.slicedBeyondPosts = this.slicedBeyondPosts.concat(
              succ.data.post
            );
            this.postsBeyondReachedEnd = true;

            console.log(this.slicedBeyondPosts);
            if (this.slicedBeyondPosts.length == 0) {
              this.noBeyoundSpaarks = true;
            }
          } else {
            // this.getBeyondPosts();
            this.noBeyoundSpaarks = false;
          }
        });
      console.log(this.slicedBeyondPosts);
    }
  }

  getWithinPosts() {
    console.log(this.postsReachedEnd);
    console.log("i came");
    if (this.loading2 == false) {
      this.loading = true;
    }
    if (this.loading == false) {
      this.loading2 = true;
    }
    if (this.gotData == false) {
      console.log("i came");
      return;
    }

    console.log(this.category);
    console.log(this.postsReachedEnd);
    console.log(this.gotData);
    if (this.postsReachedEnd == false && this.gotData == true) {
      //Backend request just sent,, response not received so dont call again until response is received
      if (this.loading2 == false) {
        this.loading = true;
      }
      if (this.loading == false) {
        this.loading2 = true;
      }

      if (this.spaark.noPillSelected && this.spaark.featName == "market") {
        this.category = "all";
        this.subCategory = "";
      }

      this.gotData = false;
      this.spaark
        .getPostsWithin(
          this.spaark.latitude,
          this.spaark.longitude,
          this.category,
          this.subCategory,
          "en",
          this.spaark.featName,
          ++this.pageWithin,
          localStorage.getItem("radius"),
          this.sortType
        )
        .subscribe((succ: any) => {
          this.loading = false;
          this.loading2 = false;
          this.gotData = true;
          this.slicedPosts = this.slicedPosts.concat(succ.data.post);
          this.spaark.postForMarkers.next({
            posts: this.slicedPosts,
            count: this.slicedPosts.length,
          });

          this.workStatusData = succ.data.work_status;
          if (this.workStatusData.length > 0) {
            this.showWorkStatus = true;
          }
          // console.log(this.slicedPosts);

          this.banners = succ.data.banner;

          if (succ.data.post.length == 0) {
            //     console.log('calling within');
            if (this.slicedPosts.length == 0) {
              this.loading = false;
              this.noSpaarkWithin = true;
            }
            this.slicedPosts = this.slicedPosts.concat(succ.data.post);
            console.log("i cameeeee");
            this.postsReachedEnd = true;
            this.showBeyondPost = true;
            this.getBeyondPosts();
          } else {
            this.noSpaarkWithin = false;
            console.log("1053");
            if (this.slicedPosts.length < 5) {
              this.getWithinPosts();
            }
            console.log(this.slicedPosts);
          }
        });
    } else if (this.postsBeyondReachedEnd == false && this.gotData == true) {
      console.log("2 beyond");
      // this.getBeyondPosts();
    }
  }

  // onMakeFriends() {

  //   this.spaark.redirectToNewspark = "greet";
  //   this.router.navigate(["/newspaark"]);

  // }

  clickedChat(item) {
    //alert("from main view");
    console.log(item);
    this.spaark.selectedChatFromRecentChats = { chatitem: item };
    this.router.navigateByUrl("chat");
  }
}
