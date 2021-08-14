import {
  Component,
  OnInit,
  Output,
  ElementRef,
  ViewChild,
  Renderer2,
  ChangeDetectorRef,
} from "@angular/core";
import { AllpurposeserviceService } from "../../allpurposeservice.service";
import { SpaarksService } from "../../spaarks.service";
import { Router, NavigationStart } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ChatService } from "../../chat.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, Subscription, Subject } from "rxjs";
import { FormControl, Validators } from "@angular/forms";
import { mergeMap } from "rxjs/operators";
import { RatingChangeEvent, ClickEvent } from "angular-star-rating";
import { environment } from "src/environments/environment";
import * as L from "leaflet";

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
}
@Component({
  selector: "app-spaarksmodal",
  templateUrl: "./spaarksmodal.component.html",
  styleUrls: ["./spaarksmodal.component.scss"],
})
export class SpaarksmodalComponent implements OnInit {
  showsortingmodal = false;
  ignoreData: any;
  shareModal = false;
  showTermsText = false;
  routingEvent;
  disableBtn = false;
  disbleBtn1 = false;
  disbleBtn2 = false;

  constructor(
    private multipurposeService: AllpurposeserviceService,
    private chat: ChatService,
    private renderer: Renderer2,
    public spaarksService: SpaarksService,
    private allPurpose: AllpurposeserviceService,
    private router: Router,
    private http: HttpClient,
    private _zone: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.mypic = localStorage.getItem("propic");
    this.myname = localStorage.getItem("name");
    this.abcd = () => this.spaarksService.updateLocation(this.lat, this.long);
    this.isMobileVersion = this.spaarksService.isMobileVersion;

    this.routingEvent = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.closeModal();
      }
    });

  }

  isMobileVersion;
  abcd: any;
  clickedDistance = false;
  showIgnoreRequest = false;
  data = undefined /*  */;
  showNameModal = false;
  imageListenerSubs: Subscription;
  requestData;
  sendReqData;
  filteredOptions: Observable<any>;
  showWorkStatus;
  WorkData;
  onlyImages = true;
  feedVideo;
  mypic = "";
  myname = "";
  DataSource;
  notifData;
  ratingData;
  locationData = null;
  singleImage = "";
  enlargeSingleImage = false;
  showGif = true;
  showLocationAccess = true;
  requestIsMine = false;
  showConfirmModal = false;
  modalMsg: string;
  localRange = localStorage.getItem("radius");
  localType = localStorage.getItem("type");
  @ViewChild("citiesiterator", { static: true }) citiesiterator: ElementRef<
    any
  >;
  showCharacters = true;
  showCross = false;
  showreviews = false;
  reviews = [];
  fromWhere = "";
  showAlertModal = false;
  showBothCall = false;
  modalAlert = "";
  noBothCall = false;
  phoneNumber = "";
  onlyPhoneCall = false;

  toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  mat = false;

  showPills = true;
  listofsearches = [];
  fromLocateMe = false;
  sortImg = "../../../assets/select.svg";
  content = "";
  searchModal = false;
  todayDate = new Date();
  listofPosts = [];
  listofSellers = [];
  loctionStep = "default";
  showLocationModal = false;
  @ViewChild("myFile") myFile: ElementRef;

  validFormats = [];
  imageArr = [];
  imagePreview;
  imageList = [];
  fileAr = [];
  imgListBuffer = [];
  videoArr = [];
  videoCount = 0;
  showImageIcon = true;
  imageForm: FormControl = new FormControl(null, {
    validators: [Validators.required],
  });
  file = [];
  counter = 0;
  isVideo = false;

  onlySpaarksCall = false;
  shareURL = "";
  userName = "";
  sharePost;

  locationmodalfrom;
  marker;
  searchVal = "";
  filteredCities;
  filteredCitiesList;
  CitiesList = this.multipurposeService.allCitiesData;
  FrontEndList = true;

  today = "../../../assets/today.svg";
  yesterday = "../../../assets/yesterday.svg";
  lastweek = "../../../assets/lastweek.svg";
  lastmonth = "../../../assets/lastmonth.svg";

  clickedCopy = false;

  sliderValue = 1;
  Type:any = localStorage.getItem("type");

  cityName;
  locUrll = document.URL;

  lat;
  long;

  marker2;
  markerIcon = "../../../assets/marker2.svg";
  isCenterChanged = false;
  centerLatitude;
  initialZoom = 13;

  centerLongitude;
  checkLocation;
  changeNameAccount = 1;

  cities = this.spaarksService.askLocation;
  showRatingsModal = false;
  showspaarkModal = false;
  showGreetModal = false;
  showLogin = false;
  post = undefined;
  showPic = "true";
  showName = "true";

  showSellersamplemsg = false;
  sendRating = {};
  count = 250;

  newName = "";
  showRequestContainerModal = false;
  the_placeholder = "";
  wrongtext = false;
  changeNamePayload = null;
  showChangeName = false;
  ratingValue = 1;
  onClickResult;
  enlargeImage = false;
  onRatingChangeResult;

  doesItHaveLetter = false;
  namevalue = "";
  gendervalue = "";
  checkval = false;
  firstval = true;
  statusSubmission = "loading";
  showPostComments = false;
  showMobileNumber=false;
  ngOnInit(): void {

    let locUrll = document.URL;

    this.showTermsText = locUrll.includes("explore");

    this.spaarksService.hideCarousel.subscribe((x) => {
      //Add logic to close carousel

      this.onCloseImageDiv();
    });

    this.mat = this.toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
    
    this.onlyImages = true;
    this.data = undefined;
    this.filteredCities = this.cities;
    if (this.locUrll.includes("exploreMap")) {
      this.showCross = true;
    }
    this.multipurposeService.triggerModal.subscribe((succe: any) => {
      this.mypic = localStorage.getItem("propic");
      console.log(succe.type);
      this.spaarksService.modalType = succe.type;
      if (succe.type == "login") {
        this.showLogin = succe.modal;
        this.multipurposeService.modalStatus = succe.modal;
      } else if (succe.type == "spaarkinmodal") {
        this.showPostComments = false;
        this.showspaarkModal = succe.modal;
        this.showCharacters = false;
        this.post = succe.post;
        this.showPostComments = succe.showComments;
        if (this.DataSource) {
          this.DataSource = null;
        }
        if (succe.source) {
          this.DataSource = succe.source;
          console.log(this.DataSource);
        }
        this.multipurposeService.modalStatus = succe.modal;
      } else if (succe.type == "confirmModal") {
        this.showConfirmModal = true;
        this.modalMsg = succe.modalMsg;
        this.fromWhere = succe.fromWhere;
        //this.multipurposeService.modalStatus = succe.modal;
        //alert(this.showConfirmModal);
      } else if (succe.type == "locationModal") {
        this.locationmodalfrom = succe.from;
        console.log(succe);
        console.log(this.router.url);
        if (
          localStorage.getItem("weblocation") &&
          localStorage.getItem("locationfrom") == "geolocation"
        ) {
          return;
        } else {
          console.log(succe);
          this.showLocationModal = succe.modal;
          console.log(document.URL);
          console.log(this.showLocationModal);
          this.loctionStep = succe.step;
          this.locationData = succe;
          // this.showGif = true;
          this.showLocationAccess = true;
        }
      } else if (succe.type == "sorting") {
        // console.log('sdhfkjsuidfgiu');

        this.showsortingmodal = succe.modal;
        this.localRange = this.localRange ? this.localRange : "5";
        this.sliderValue = parseInt(this.localRange);
        this.localType = this.localType ? this.localType : "Distance";
      //  this.Type = parseInt(this.localType);
          console.log(this.Type);
          if(!localStorage.getItem('type')){
            localStorage.setItem('type','Distance')
          }
          this.Type = localStorage.getItem('type')
      } else if (succe.type == "openGreetRequest") {
        // console.log('DID CLICKED ON CHAT');
        // this.imageList=[];
        this.showName='true';
        this.showPic='true';


        this.multipurposeService.modalStatus = succe.modal;
        this.showGreetModal = succe.modal;
        this.sendReqData = succe.postData;
        try {
          this.content = "";
          this.count = 250;
          this.imageList = [];
          this.myFile.nativeElement.value = null;
          this.myFile.nativeElement.value = "";
          this.myFile.nativeElement.innerHTML = "";
        } catch { }
      } else if (succe.type == "showRatingsModal") {
        console.log("DID CLICKED ON BELL");
        console.log(succe.data);
        this.ratingData = succe.data.data;
        console.log(this.ratingData);
        this.multipurposeService.modalStatus = succe.modal;
        this.showRatingsModal = succe.modal;
        if (this.ratingData.length == 0) {
          // alert("inside 0 length");
          this.multipurposeService.modalStatus = false;
          this.showRatingsModal = false;
        }

        // alert(this.showRatingsModal);
      } else if (succe.type == "opensellersample") {
        console.log("DID CLICKED ON CHAT");
        this.multipurposeService.modalStatus = succe.modal;
        this.showSellersamplemsg = succe.modal;
      } else if (succe.type == "searchModal") {
        this.multipurposeService.modalStatus = succe.modal;
        this.searchModal = succe.modal;
      } else if (succe.type == "RequestContainerModal") {
        this.multipurposeService.modalStatus = succe.modal;
        this.showRequestContainerModal = succe.modal;
        this.requestData = succe.request;
        this.requestIsMine = succe.isMine;
      } else if (succe.type == "changeName") {
        this.multipurposeService.modalStatus = succe.modal;
        this.showChangeName = succe.modal;
        this.changeNameAccount = succe.account;
        this.changeNamePayload = succe.changeNamePayload;
      } else if (succe.type == "images") {
        this.data = [];
        this.onlyImages = true;
        this.multipurposeService.modalStatus = succe.modal;
        this.enlargeImage = succe.modal;
        this.data = succe.imgArr;
        this.data.index = succe.index;

        this.data.forEach((val, ind) => {
          console.log(val);
          if (val.includes(".mp4")) {
            // this.data.splice(ind,1)
            // this.feedVideo=val;
            this.onlyImages = false;
          }
        });

        this.enlargeImage = true;

        console.log(this.data);
        console.log(this.data[this.data.index]);

        this.data.index = succe.index;
      } else if (succe.type == "singleImage") {
        this.singleImage = succe.img;
        this.multipurposeService.modalStatus = succe.modal;
        this.enlargeSingleImage = succe.modal;
        console.log(this.singleImage, this.enlargeSingleImage);
      } else if (succe.type == "WorkStatus") {
        this.multipurposeService.modalStatus = succe.modal;
        this.showWorkStatus = succe.modal;
        this.WorkData = succe.workData;
        console.log(this.WorkData);
      } else if (succe.type == "reviewsmodal") {
        this.showreviews = true;
        this.reviews = succe.post;
      } else if (succe.type == "alertModal") {
        this.showAlertModal = true;
        this.modalAlert = succe.modalMsg;
      } else if (succe.type == "openName") {
        //  alert("213")

        this.showNameModal = true;
      } else if (succe.type == "openBothCall") {
        console.log(succe);
        this.showBothCall = true;
        this.phoneNumber = succe.phoneNumber;
        this.showMobileNumber=false;
        if(!this.mat)
        {
          if(this.phoneNumber!=undefined)
            this.showMobileNumber=true;
          
        }
      } else if (succe.type == "noBothCall") {
        this.noBothCall = true;
      } else if (succe.type == "onlyPhoneCall") {
        this.onlyPhoneCall = true;
        this.phoneNumber = succe.phoneNumber;
        this.showMobileNumber=false;

        if(!this.mat)
        {
          if(this.phoneNumber!=undefined)
            this.showMobileNumber=true;
          
        }
      } else if (succe.type == "openSpaarksCall") {
        this.onlySpaarksCall = true;
      } else if (succe.type == "clickedShare") {
        this.shareModal = true;
        this.sharePost = succe.modalPost;
        this.clickedShare(this.sharePost);
      }
      // else if (succe.type == "updateLocation") {

      // }
    });

    this.spaarksService.triggerSpaarksModal.subscribe((succ: any) => {
      console.log(succ);

      if (succ.type == "login") {
        this.showLogin = succ.modal;
        this.spaarksService.openSpaarksModal = succ.modal;
        this.multipurposeService.modalStatus = succ.modal;
        // this.multipurposeService.modalStatus = succ.modal;
      }
    });
    this.allPurpose.openNameTrigger.subscribe((x) => {
      // alert('triggered');
      this.allPurpose.checkUserName();
      if (this.allPurpose.isOpenNameModal) {
        this.allPurpose.triggerModal.next({
          type: "openName",
          modal: true,
        });
      }
    });
    this.allPurpose.checkUserName();
    if (this.allPurpose.isOpenNameModal) {
      this.allPurpose.triggerModal.next({
        type: "openName",
        modal: true,
      });
    }
    // this.imageListenerSubs = this.spaarksService.images.subscribe(
    //   x => {
    //       console.log(x)
    //       this.data = x;
    //     console.log(this.data.imgArr[this.data.index]);
    //     this.enlargeImage = true;
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // )

    // if (map) {

    // }
  }

  // ngAfterViewInit(): void {
  //   this.allPurpose.checkUserName();
  //   if(this.allPurpose.isOpenNameModal){
  //     this.allPurpose.triggerModal.next({
  //       type: "openName",
  //       modal: true,

  //     });
  //   }
  // }

  clickedShare(val) {
    // let shareId = "";
    // if (val) {
    //   if (val.uservisibility) {
    //     if (val.uservisibility.share) {
    //       shareId = val.uservisibility.share;
    //       shareId = shareId.slice(shareId.lastIndexOf("/") + 1);
    //     } else {
    //       return;
    //     }
    //   } else {
    //     return;
    //   }
    // } else {
    //   return;
    // }

    // if (shareId == "") {
    //   return;
    // }
    // let selBox = document.createElement("textarea");
    // selBox.style.position = "fixed";
    // selBox.style.left = "0";
    // selBox.style.top = "0";
    // selBox.style.opacity = "0";
    // selBox.style.display="none";
    // // www.spaarksweb.com
    // let docurl = document.URL;
    // let splitter = docurl.split("/");
    // let finurl = splitter[0] + "//" + splitter[2];
    // selBox.value = finurl + "/home/spaark/" + shareId;
    // document.body.appendChild(selBox);
    // selBox.focus();
    // selBox.select();
    // this.shareURL = selBox.value;
    let shareId = "";
    if (val) {
      if (val.uservisibility) {
        if (val.uservisibility.share) {
          shareId = val.uservisibility.share;
          shareId = shareId.slice(shareId.lastIndexOf("/") + 1);
        } else {
          return;
        }
      } else {
        return;
      }
    } else {
      return;
    }

    if (shareId == "") {
      return;
    }
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    // www.spaarksweb.com
    let docurl = document.URL;
    let splitter = docurl.split("/");
    let finurl = splitter[0] + "//" + splitter[2];
    selBox.value = finurl + "/home/spaark/" + shareId;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.shareURL = selBox.value;

    if (this.clickedCopy) {
      document.execCommand("copy");
      document.body.removeChild(selBox);
      this.spaarksService.somethingWentWrong("Copied to clipboard");
      this.clickedCopy = false;
    }
  }

  clickedCopyBtn() {
    this.clickedCopy = true;
    this.clickedShare(this.sharePost);
  }

  whatsAppShare(post) {
    var content;
    var postSlogan = "";
    var postName = "";
    var tagName = "";
    var tagName1 = "";

    var postLink = `Post Link:%0a${post.uservisibility.share}%0a`;
    if (post) {
      if (!post.questionNo) {
        this.spaarksService.somethingWentWrong("Something went wrong");
        return;
      }

      if (post.content) {
        content = `Content: %0a${post.content}%0a%0a`;
      } else {
        content = "";
      }

      if (post.questionNo == 1 || post.questionNo == 8) {
        tagName = "";
      } else {
        if (!post.tags[0]) {
          tagName = "";
        } else {
          tagName = `%0a${post.tags[0].name}%0a`;
        }
      }

      if (!(post.questionNo == 5)) {
        tagName1 = "";
      } else {
        if (!post.tags[1]) {
          tagName1 = "";
        } else {
          tagName1 = `%0a${post.tags[1].name}%0a`;
        }
      }

      switch (post.questionNo) {
        case "1":
          console.log("case1");
          postName = `%0aName:* ${post.uservisibility.name.substr(
            0,
            15
          )}%0a%0a`;
          postSlogan =
            "Kuch bhi announce karein. Local area mein batayein. Free. Easy.";
          break;

        case "3":
          postName = `%0aName: ${post.uservisibility.name.substr(0, 15)}%0a%0a`;
          postSlogan =
            "Apni Services Dijiye. Apni income badaiye. Free to use.";
          break;

        case "4":
          postName = `%0aName: ${post.uservisibility.name.substr(0, 15)}%0a%0a`;
          postSlogan =
            "Kuch bhi sell karien. Apne aas paas. Ghar baithe. Easy.";
          break;

        case "5":
          postSlogan =
            "Apne aas pass, Service dene wale ko connect karien. Free. Easy.";
          break;

        case "6":
          postSlogan =
            "Vacancy ko post karien. Staff payein. Ghar baithe. Free to use.";
          break;

        case "7":
          postName = `%0aName:${post.uservisibility.name.substr(0, 15)}%0a%0a`;
          postSlogan = "Job dhoondein. Naukari payein. Ghar baithe.Free. Easy.";
          break;

        case "8":
          postSlogan =
            "Kuch bhi announce karein. Local area mein batayein. Free. Easy.";
      }
    }

    try {
      var b =
        tagName +
        tagName1 +
        postName +
        content +
        postLink +
        "%0aDownload Spaarks App : %0ahttps://cutt.ly/Spaarks-app %0a%0a" +
        postSlogan;
      let url = b;
      return url;
    } catch (err) { }
  }

  clickedFacebook() {
    //this.shareURL=ur+this.shareURL;
    //  var result= this.whatsAppShare(this.sharePost)
    var fakeLink = document.createElement("a");
    fakeLink.setAttribute(
      "href",
      "https://www.facebook.com/sharer/sharer.php?u=" +
      this.sharePost.uservisibility.share
    );
    // fakeLink.setAttribute("data-action", "share/facebook/share");
    //fakeLink.setAttribute("og-image","https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg")
    fakeLink.setAttribute("target", "_blank");
    fakeLink.click();
  }

  clickedTwitter() {
    //this.shareURL=ur+this.shareURL;
    var result = this.whatsAppShare(this.sharePost);
    var fakeLink = document.createElement("a");
    fakeLink.setAttribute(
      "href",
      " https://twitter.com/intent/tweet?url=" + result
    );
    // fakeLink.setAttribute("data-action", "share/facebook/share");
    //fakeLink.setAttribute("og-image","https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg")
    fakeLink.setAttribute("target", "_blank");
    fakeLink.click();
  }

  clickedLinkedIn() {
    var result = this.whatsAppShare(this.sharePost);

    var fakeLink = document.createElement("a");
    fakeLink.setAttribute("href", "mailto:?body=" + result);
    // fakeLink.setAttribute("data-action", "share/facebook/share");
    //fakeLink.setAttribute("og-image","https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg")
    fakeLink.setAttribute("target", "_blank");
    fakeLink.click();
  }

  getSliderTickInterval() { }

  ignoreFun() {
    this.spaarksService.getSellerRatings().subscribe((succ: any) => {
      console.log(succ);
      this.ignoreData = succ.data[0]._id;
      console.log(this.ignoreData);
      this.spaarksService.ignore(this.ignoreData).subscribe((a) => {
        console.log(a);
        this.closeModal();
      });
    });
  }

  changedSearch() {
    console.log(this.searchVal);

    if (this.searchVal === "") {
      this.FrontEndList = true;
      this.filteredCities = this.spaarksService.askLocation;
      this.CitiesList = this.multipurposeService.allCitiesData;
    } else {
      this.FrontEndList = false;
      this.filteredCities = [];

      this.spaarksService
        .getsearchLocation(this.searchVal)
        .subscribe((suc: any) => {
          this.filteredCitiesList = suc;

          console.log(suc.results[0]);
        });
    }
  }

  sortSpaark() {
    console.log(this.sliderValue, this.Type);
    this.spaarksService.sortSubj.next({
      sliderValue: this.sliderValue,
      type: this.Type,
    });
    // this.sliderValue = 1;
    // this.Type = "Distance";
    this.closing();
    return;
  }

  onInputChange(event) {
    console.log(event.value);
    this.sliderValue = event.value;
  }

  DetectType(ev, type) {
    console.log(ev, type);
    if (ev && type == "distance") {
      this.Type = "Distance";
      console.log("distance yes");
    }
    if (ev && type == "time") {
      this.Type = "Time";
      console.log("time yes");
    }
    console.log(this.Type);
  }
  // distanceChange(ev, type) {
  //   console.log(type, ev.target.checked);
  //   if (ev.target.checked == true) {
  //     this.distance = 'distance'
  //   } else {
  //     this.distance = ''
  //   }
  // }
  // timeChange(ev, type) {
  //   console.log(type, ev.target.checked);
  //   if (ev.target.checked == true) {
  //     this.time = 'time'
  //   } else {
  //     this.time = ''
  //   }
  // }

  filterClicked(eve) {
    this.sortImg = "../../../assets/tick1.svg";
    if (eve == "distance") {
      this.clickedDistance = true;
    }
  }

  async _filter(arg) {
    //console.log("from filter"+arg)

    let filtered = [];

    for (let i = 0; i < this.cities.length; i++) {
      // console.log(this.cities[i].name)
      if (this.cities[i].name.toLowerCase().includes(arg)) {
        filtered.push(this.cities[i]);
      }
    }
    console.log(filtered);
    return filtered;
  }

  clickOnProfile(event) {
    event.stopPropagation();
  }

  clickedOutside(eve) {
    if (eve) {
      if (eve == "nickname") {
        this.showChangeName = false;
        this.multipurposeService.modalStatus = false;
      }
    }
  }

  sampleFunc(eve) {
    console.log(eve);
    this.searchVal = eve.option._element.nativeElement.innerText.toLowerCase();
    console.log(this.searchVal);

    this.changedSearch();
  }

  clickedClose() {
    this.multipurposeService.modalStatus = false;
    this.searchModal = false;
    this.listofsearches = [];

    this.listofPosts = [];
    this.listofSellers = [];
    this.content = "";
  }

  takeLocation() {
    if (window.navigator.geolocation) {
      console.log();

      window.navigator.geolocation.getCurrentPosition(
        (position: any) => {
          console.log(position.coords.latitude);
          localStorage.setItem(
            "weblocation",
            JSON.stringify({
              long: position.coords.longitude,
              lat: position.coords.latitude,
            })
          );
          console.log(localStorage.getItem("weblocation"));

          this.spaarksService.updateLocation(
            position.coords.latitude,
            position.coords.longitude
          );
          this.fromLocateMe = true;
          this.spaarksService.allowedGeoLocation = true;

          this.clickedEndLocationPick();
          localStorage.setItem("locationfrom", "geolocation");
        },
        (err) => {
          alert(
            "Oops! Without location you cannot use this application. Refresh or grant location permission."
          );
          console.log(err);
          this.loctionStep = "step2";
          this.citiesiterator.nativeElement.scrollTop = this.citiesiterator.nativeElement.scrollHeight;
        }
      );
    } else {
      this.allPurpose.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "Sorry, your browser does not support HTML5 geolocation.",
      });
      // this.spaarksService.showAlert(
      //   "Sorry, your browser does not support HTML5 geolocation."
      // );
      this.loctionStep = "step2";
      this.citiesiterator.nativeElement.scrollTop = this.citiesiterator.nativeElement.scrollHeight;
    }
    this.showLocationAccess = false;
  }

  clickedcityLocationPick() {
    this.loctionStep = "step2";
    this.showLocationAccess = false;
    // this.citiesiterator.nativeElement.scrollTop = this.citiesiterator.nativeElement.scrollHeight;
  }

  submitForm() {
    // this.disablebtn=true;
    this.disableBtn = true;
    if (this.content == "" || this.content.match(/^\s*$/)) {
      this.spaarksService.somethingWentWrong("Type something to send request");
      this.content = "";
      this.disableBtn = false;


      return;
    }

    let form: FormData = new FormData();

    form.append("uservisibility[name]", "" + this.showName);
    form.append("uservisibility[profilePic]", "" + this.showPic);

    form.append("content", this.content);

    this.fileAr.forEach((photo) => {
      form.append("photo", photo);
    });
    this.sendReqData._id;
    this.spaarksService.sendRequest(this.sendReqData._id, form).subscribe(
      (succ: any) => {
        console.log(succ);
        this.showGreetModal = false;
        this.disableBtn = true;
        this.multipurposeService.multiPurposeSubj.next({
          type: "greetreqUpdate",
          id: succ._id,
        });
        this.spaarksService.somethingWentWrong(
          "Request has been sent successfully"
        );
        this.disableBtn = false;
      },

      (err) => {
        this.disableBtn = false;


        // this.spaarksService.somethingWentWrong("Something went Wrong");
      }

    );


  }

  workStatus(id, userId, status) {
    this.showWorkStatus = false;
    // console.log(id);
    // console.log(userId);

    if (status == "completed") {
      let sendOpt = "CMPT";
      this.spaarksService.sendWorkStatus(id, userId, sendOpt);
    } else if (status == "pending") {
      let sendOpt = "IGN";
      this.spaarksService.sendWorkStatus(id, userId, sendOpt);
    } else if (status == "ignored") {
      let sendOpt = "STG";
      this.spaarksService.sendWorkStatus(id, userId, sendOpt);
    }
  }

  closeWorkModal() {
    this.showWorkStatus = false;
  }

  inputChanged() {
    if (this.content == " ") {
      //  alert('sada')
      this.listofsearches = [];

      this.listofPosts = [];
      this.listofSellers = [];
      return;
    }
    this.pressedkey("k");
  }

  pressedkey(eve) {
    console.log(eve);
    if (this.content) {
      if (this.content.length == 0) {
        this.listofsearches = [];
        console.log("no searches");
        return;
      }
    }

    this.spaarksService.searchRight(this.content).subscribe((succe: any) => {
      console.log(succe);
      this.listofsearches = succe.categories;
      this.listofPosts = succe.posts;

      var prof = succe.profiles;
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
      if (this.listofPosts || this.listofsearches || this.listofsearches) {
        this.showPills = false;
      }
      console.log(this.listofPosts);
    });

    console.log(this.listofsearches);
  }

  closeModal() {
    this.showspaarkModal = false;
    this.showGreetModal = false;
    this.showRequestContainerModal = false;
    this.showRatingsModal = false;
    this.showIgnoreRequest = false;
    this.ratingData = false;
    this.shareModal = false;
    if (this.spaarksService.modalType) {
      this.spaarksService.modalType = "";
    }
  }

  closeModal2() {
    this.showRequestContainerModal = true;

    this.showIgnoreRequest = false;
  }

  addImages() {
    if (this.showGreetModal) {
      this.fileAr = [];
    }
    try {
      this.myFile.nativeElement.value = null;
      this.myFile.nativeElement.value = "";
      this.myFile.nativeElement.innerHTML = "";
    } catch { }

    this.myFile.nativeElement.click();
  }

  onImagePicked(event: Event) {
    this.imageList = [];
    // console.log("this.fileLength", this.file.length);
    if (this.showGreetModal) this.file = [];

    const files = (event.target as HTMLInputElement).files;
    this.file = [...Array.from(files), ...this.file];
    // console.log(".fileLength", this.file.length);
    let fileLength = this.file.length;
    // console.log('files length is', fileLength, files.length);

    this.imageForm.patchValue({ imageForm: this.file });
    this.imageForm.updateValueAndValidity();

    this.validFormats = ["image"];

    if (this.file) {
      if (fileLength == 5) this.showImageIcon = false;
      if (this.file.length > 5) {
        this.file.splice(fileLength, files.length);
        this.allPurpose.triggerModal.next({
          type: "alertModal",
          modal: true,
          modalMsg: "only 5 files",
        });
        // this.spaarksService.showAlert("only 5 files");
        return;
      }
      for (let i = 0; i < this.file.length; i++) {
        if (this.file[i]) {
          if (
            this.validFormats.indexOf(
              this.file[i].type.substring(0, this.file[i].type.indexOf("/"))
            ) == -1
          ) {
            this.allPurpose.triggerModal.next({
              type: "alertModal",
              modal: true,
              modalMsg: "Upload an Image or a Video",
            });
            // this.spaarksService.showAlert("Upload an Image or a Video");
            // this.activeUsersService.alertModalSub.next('Upload an Image or a Video');
            return;
          }
        }
        let type = "";
        if (
          this.isVideo == false &&
          this.file[i].type.substring(0, this.file[i].type.indexOf("/")) ==
          "image"
        ) {
          if (this.file[i]) {
            if (this.file[i].type) {
              if (
                this.file[i].type != "image/jpeg" &&
                this.file[i].type != "image/jpg" &&
                this.file[i].type != "image/png" &&
                this.file[i].type != "image/webp" &&
                this.file[i].type != "image/bmp"
              ) {
                this.allPurpose.triggerModal.next({
                  type: "alertModal",
                  modal: true,
                  modalMsg: "Format not supported",
                });
                //this.spaarksService.showAlert("Format not supported");
                // this.activeUsersService.alertModalSub.next('Format not supported');
                this.file = [];
                return;
              }
            }
          }

          if (this.file[i].size / 1000 / 1000 > 25) {
            this.allPurpose.triggerModal.next({
              type: "alertModal",
              modal: true,
              modalMsg: "Image size cannot exceed 25MB",
            });
            //this.spaarksService.showAlert("Image size cannot exceed 25MB");
            // this.activeUsersService.alertModalSub.next('image size cannot exceed 25MB');
            return;
          }
          this.imageArr.push(this.file[i]);

          let date = Date.now();

          const reader = new FileReader();
          reader.onload = () => {
            this.counter++;
            console.log("cou" + this.counter);
            this.imagePreview = reader.result;
            this.imageList.push({ type: "img", data: reader.result });
            this.fileAr.push(this.file[i]);
          };
          reader.readAsDataURL(this.file[i]);
        } else if (
          this.file[i].type.substring(0, this.file[i].type.indexOf("/")) ==
          "video"
        ) {
          this.videoCount += 1;

          if (this.file[i].size / 1000 / 1000 > 50) {
            this.allPurpose.triggerModal.next({
              type: "alertModal",
              modal: true,
              modalMsg: "Video size cannot exceed 50MB",
            });
            //this.spaarksService.showAlert("Video size cannot exceed 50MB");

            // this.activeUsersService.alertModalSub.next('Video size cannot exceed 50MB');
            return;
          }
          if (this.videoCount > 1) {
            this.multipurposeService.triggerModal.next({
              type: "alertModal",
              modal: true,
              modalMsg: "select only one video",
            });

            // alert("select only one video");
            return;
          }
          if (this.file[i].type == "video/mp4") {
            let date = Date.now();
            const reader = new FileReader();
            reader.onload = () => {
              this.imagePreview = reader.result;
              this.imageList.push({ type: "vid", data: reader.result });
              this.fileAr.push(this.file[i]);
              this.videoArr.push(this.file[i]);
            };

            reader.readAsDataURL(this.file[i]);
          } else {
            // alert('Upload MP4 Format Videos Only');
            // this.activeUsersService.alertModalSub.next('Upload MP4 Format Videos Only');
          }
        } else {
          type = "error";
        }
      }
      console.log(this.fileAr);
    }
    //*********************************************************************************************
    //end-procedure :
    //**********************************************************************************************
  }

  deleteRequest() {
    this.disbleBtn2 = true;
    this.spaarksService.removeRequest(this.requestData.postId).subscribe(
      (success) => {
        console.log(success);
        this.disbleBtn2 = true;

        this.spaarksService.somethingWentWrong("Request has been deleted");
        this.closeModal();
        this.spaarksService.allPurposeSubject.next({ type: "refreshrequests" });
        this.disbleBtn2 = false;
        
      },
      (err) => {
        this.disbleBtn2 = false;
        this.spaarksService.somethingWentWrong(err.error.message);
      }
    );
  }

  deleteImg(idx: number) {
    this.imgListBuffer = [];

    this.myFile.nativeElement.value = "";
    this.myFile.nativeElement.innerHTML = "";

    for (let i = 0; i <= this.imageList.length && this.file.length; i++) {
      if (
        this.file[i].type.substring(0, this.file[i].type.indexOf("/")) ==
        "video"
      ) {
        this.videoCount = 0;
      }

      if (this.imageList[i] == this.imageList[idx]) {
        this.imageList.splice(idx, 1);
        this.fileAr.splice(idx, 1);
        this.file.splice(idx, 1);

        if (this.file.length < 5) this.showImageIcon = true;
        console.table(this.fileAr.length);
        console.table(this.imageList.length);
        console.table(this.file.length);
        return;
      } else {
        if (
          this.file[i].type.substring(0, this.file[i].type.indexOf("/")) ==
          "video"
        ) {
          this.videoCount = 0;
        }
        this.imgListBuffer.push(this.imageList[i]);
      }
    }
  }

  clickedOnLocation(city, id) {
    console.log("heyy", city, id);
    this.cityName = city.name ? city.name : city.city;
    if (id == 1 || id == 2) {
      this.lat = Number(city.lat);
      this.long = Number(city.lon);
    } else {
      this.lat = Number(city.latitude);
      this.long = Number(city.longitude);
    }

    this.loctionStep = "step3";
    this.changeDetectorRef.detectChanges();
    this.renderLeafletMap();
  }

  closeLocModal() {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    this.showLocationModal = false;
    this.showLocationAccess = false;
    this.showGif = false;
  }

  renderLeafletMap() {
    // console.log(this.lat, this.long);

    var marker;
    var map2 = L.map("mapB").setView([this.lat, this.long], 12);
    L.tileLayer(environment.baseMap + "{z}/{x}/{y}.png").addTo(map2);
    const myIcon = L.icon({
      iconUrl: this.markerIcon,
      // ...
    });

    // setting the default location marker
    marker = L.marker([this.lat, this.long], { icon: myIcon }).addTo(map2);
    this.spaarksService.updateLocation(this.lat, this.long);
    // localStorage.setItem('weblocation', JSON.stringify({ lat: this.lat, long: this.long }));

    // setting the location marker while moving
    map2.on("move", () => {
      console.log(this);
      if (marker) {
        map2.removeLayer(marker);
      }
      if (this.marker2) {
        map2.removeLayer(this.marker2);
      }
      this.marker2 = L.marker(map2.getCenter(), { icon: myIcon });
      this.marker2.addTo(map2);
      var coord = map2.getCenter();
      // localStorage.setItem('weblocation', JSON.stringify({ lat: coord.lat, long: coord.lng }));
      this.spaarksService.updateLocation(coord.lat, coord.lng);
    });
  }

  updatedCoords(eve) {
    console.log(eve);
  }

  public centerChanged(coords: any) {
    this.centerLatitude = coords.lat;
    this.centerLongitude = coords.lng;
    // alert(coords.lat);
    this.isCenterChanged = true;
  }

  clickedEndLocationPick() {
    this.showLocationModal = false;

    // if (this.isCenterChanged == true && !this.fromLocateMe) {
    //   localStorage.setItem('weblocation', JSON.stringify({ lat: this.centerLatitude, long: this.centerLongitude }));
    // } else {
    // }
    this.checkLocation = localStorage.getItem("weblocation");
    console.log(JSON.parse(this.checkLocation));

    this.checkLocation = JSON.parse(this.checkLocation);

    if (this.checkLocation) {
      this.spaarksService.latitude = this.checkLocation.lat;
      this.spaarksService.longitude = this.checkLocation.long;
    } else {
      console.log("redirect to Ask Location Again");
      this.navigateToHome();
    }

    if (this.locationData) {
      if (this.locationData.from) {
        if (this.locationData.from == "search") {
          this.spaarksService.allPurposeSubject.next({
            type: "locationcompleted",
          });
        } else {
          this.navigateToHome();
        }
      } else {
        this.navigateToHome();
      }
    } else {
      this.navigateToHome();
    }
    localStorage.setItem("locationfrom", "cityselection");
    localStorage.setItem("isfirstlocation", "true");
  }

  navigateToHome() {
    console.log(this.locationmodalfrom);
    if (this.locationmodalfrom == "explore") {
      //   this.router.navigateByUrl('home/feed').then(() => {
      //     this.router.navigateByUrl('home/exploreMap');
      // });
      this.spaarksService.routeToexplore = true;
      this.router.navigateByUrl("home/feed");
    } else {
      // this.router.navigateByUrl("home/preferences");
      this.router.navigateByUrl("home/feed");
    }
  }

  // used for agm maps
  // public mapReady(map) {
  //   map.addListener("dragend", () => {
  //     console.log(this.centerLatitude, this.centerLongitude)
  //   });
  // }

  onRatingSubmit(userId, postId, ratingId) {
    console.log(this.ratingData);
    this.showRatingsModal = !this.showRatingsModal;
    console.log(this.content);
    console.log(this.ratingValue);
    console.log(postId);

    this.sendRating = {
      userId: userId,
      ratingId: ratingId,
      postId: postId,
      description: this.content,
      rating: this.ratingValue,
    };

    console.log(this.sendRating);

    this.spaarksService.sendRatings(this.sendRating).subscribe((succ: any) => {
      console.log(succ);
    });
  }

  propeve(eve) {
    eve.stopPropagation();
  }

  updateInput(eve) {
    // console.log('Testing');
    this.content = eve.target.value;
    let remain = 250 - eve.target.textLength;
    this.count = remain;
  }

  selectedClick(eve) {
    // this.spaarks.showContactScreen.next(true);
    //this.showCat.emit(eve);
    // alert("hey12")
    console.log(eve);
    let previousSearcehes = [];
    this.content = "";
    this.listofPosts = [];
    this.listofSellers = [];
    this.listofsearches = [];
    var obj = {
      preview: eve.subCategory.replace('in ',''),
      category: eve.category.replace('in ',''),
      subCategory: eve.subCategory.replace('in ',''),
      subCategoryFinal: eve.subCategory.replace('in ',''),
    };

    this.spaarksService.clickedPillFormCard.next(obj);
    this.listofsearches = [];
    this.listofPosts = [];
    this.listofSellers = [];
    this.multipurposeService.modalStatus = false;
    this.searchModal = false;
    this.showPills=true;
    return;
    if (localStorage.getItem("searchedArr")) {
      previousSearcehes = JSON.parse(localStorage.getItem("searchedArr"));
      previousSearcehes.forEach((val, ind) => {
        console.log(val);
        if (eve.subCategoryFinal == val.subCategoryFinal) {
          previousSearcehes.splice(ind, 1);
        }
      });
      previousSearcehes = [eve, ...previousSearcehes];
      this.spaarksService.currentSearchedCat = eve;
      this.spaarksService.searchedCatArr = previousSearcehes;
      localStorage.setItem("searchedArr", JSON.stringify(previousSearcehes));
      this.spaarksService.addSearchPill.next(previousSearcehes);
    } else {
      previousSearcehes = [eve, ...previousSearcehes];
      this.spaarksService.currentSearchedCat = eve;
      this.spaarksService.searchedCatArr = previousSearcehes;
      localStorage.setItem("searchedArr", JSON.stringify(previousSearcehes));
      this.spaarksService.addSearchPill.next(previousSearcehes);
    }





    // let arrays = [];
    // try {
    //   if (localStorage.getItem("searchedArr")) {
    //     arrays = JSON.parse(localStorage.getItem("searchedArr"));
    //   } else {
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

    //     this.spaarksService.currentSearchedCat = eve;
    //     this.spaarksService.searchedCatArr = arrays;
    //     // console.log((this.spaarksService.searchedCatArr));

    //     localStorage.setItem("searchedArr", JSON.stringify(arrays));

    //     this.spaarksService.addSearchPill.next(eve);
    //   }
    // }
    this.listofsearches = [];
    this.listofPosts = [];
    this.listofSellers = [];
    this.multipurposeService.modalStatus = false;
    this.searchModal = false;
  }

  acceptRequest() {
    // this.service.sidewidth();
    console.log("accept Request");
    console.log(this.requestData);
    this.spaarksService.acceptRequest(this.requestData).subscribe(
      (res) => {
        //this.myChat.refreshChatRoster();
        // this.users.somethingWentWrong('Request Accepted');

        // this.showRequest = false;

        // this.myChat.getPendingRequests();
        // this.myChat.removeLocalRequestsSub.next(this.request);
        //this.myChat.refreshChatRoster();
        // this.myChat.getPendingRequests();

        this.chat.greetRequestSubj.next("false");

        this.chat.greetRequestsCount();

        if (this.requestData.mjid) {
          if (this.requestData.mjid == 1) {
            this.chat.reg_sendRequestIq(this.requestData.jid, "Make Friends");
            //ChatService.jidEmitter.next([]);
            try {
              this.chat.ChatPopUp.next({
                jid: this.requestData.jid,
                ano: false,
              });

              // this.myChat.openChatBubble.next('jaiii');

              // this.users.getUsers(this.users.location[0], this.users.location[1]);
            } catch {
              console.log("send request reg error");
            }
          } else if (this.requestData.mjid == 2) {
            this.chat.ano_sendRequestIq(this.requestData.jid, "Make Friends");
            //ChatService.jidEmitter2.next([]);
            try {
              this.chat.ChatPopUp.next({
                jid: this.requestData.jid,
                ano: true,
              }); //commented in v2
              // this.myChat.openChatBubble.next('jaiii'); //commented in v2

              // this.users.getUsers(this.users.location[0], this.users.location[1]);
            } catch {
              console.log("send request ano error");
            }
          }
        }
      },
      (err) => {
        this._zone.open("Something Went Wrong", "ok", {
          duration: 4000,
        });
      }
    );
  }

  confirmRequest() {
    this.disbleBtn1 = true;
    this.spaarksService.acceptRequest(this.requestData).subscribe((succ) => {
      console.log(succ);
      this.disbleBtn1 = true;

      this.spaarksService.somethingWentWrong("Request has been Accepted");
      this.multipurposeService.multiPurposeSubj.next({
        type: "confirmrefresh",
        data: this.requestData,
      });
      this.disbleBtn1 = false;
      this.spaarksService.modalType = "";
      this.showRequestContainerModal = false;
      // this.spaarksService.somethingWentWrong("Request has been Accepted");
    });
    this.disbleBtn1 = false;

  }

  nameConfirm(jid: string) {
    console.log(jid);
    //CHECK NAME CONTAINS

    // Check if string contians letters

    // console.log(this.userName[0])

    if (this.newName.length < 1) {
      this.spaarksService.somethingWentWrong("Minimum 1 character is allowed");
      return;
    }

    if (!this.newName.replace(/\s/g, "").length) {
      this.spaarksService.somethingWentWrong("Name can not be empty");
      this.newName = "";
      this.firstval = true;
      return;
    }

    if (
      this.newName == "Anonymous" ||
      this.newName == "anonymous" ||
      this.newName == "undefined" ||
      this.newName == "Undefined"
    ) {
      this.spaarksService.somethingWentWrong(
        "Name should not contain Anonymous or anonymous"
      );
      this.newName = "";
      this.firstval = true;
      return;
    }
    if (this.newName.length < 20) {
      this.chat
        .sendAlias(jid, this.newName, this.changeNameAccount)
        .subscribe((succ) => {
          console.log(succ);
          this.multipurposeService.multiPurposeSubj.next({
            type: "updatedchangename",
            newName: this.newName,
            jid: jid,
            account: this.changeNameAccount,
          });
          this.newName = "";
          // this.showTicks = false;
          // this.activeUser.name = this.newName;
          // emit an observable to let origin know that name is changed
          this.the_placeholder = "Enter alias name";
          this.wrongtext = false;
          this.clickedOutside("nickname");
        });
    } else {
      this.newName = "";

      this.allPurpose.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "Name should be less than 20 characters.",
      });
      //alert('Please enter name, name should be less than 20 charecters');
      return;
    }
  }

  updateName(eve) {
    console.log(eve);
    this.newName = eve.target.value;
  }

  ignoreRequest() {

    this.showRequestContainerModal = false;
    this.showIgnoreRequest = true;
  }

  confirmignoreRequest() {
    this.spaarksService
      .ignoreRequest(this.requestData)
      .pipe(
        mergeMap((succ: any) => {
          return this.spaarksService.getPendingRequests();
        })
      )
      .subscribe((succ2) => {
        this.spaarksService.getRequestsSub.next(succ2);
        this.spaarksService.allPurposeSubject.next({ type: "refreshrequests" });
      }),
      (err) => {
        this.spaarksService.somethingWentWrong(err.error.message);
      };
    this.spaarksService.modalType = "";
    this.showRequestContainerModal = false;
    this.showIgnoreRequest = false;
  }

  confirmfriendRequest() {
    this.showRequestContainerModal = true;
    this.showIgnoreRequest = false;
  }

  OnSelectImage() {
    this.enlargeImage = true;
    //  this.spaarksService.sendAllPhotos();
    // alert("Clicked ON Image");
  }

  keyEvent(event: KeyboardEvent) {
    //console.log(event);

    console.log("hey");
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      if (this.enlargeImage == true) {
        this.move(1);
      }

      //   if(this.showAppTour==true)
      //   {
      //     this.nextOnBoarding(event);
      //   }
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      if (this.enlargeImage == true) {
        this.move(-1);
      }

      //   if(this.showAppTour==true){
      //     this.previousOnBoarding(event);
      //   }
    }

    // if(event.key === KEY_CODE.ESC)
    // {
    // //   this.showAppTour=false;
    //   console.log("I Did it");
    //   this.enlargeImage=false;
    // }
  }

  sendEvent(event) {
    console.log("prpogated");
    event.stopPropagation();
  }

  move(d: any, eve?) {
    // console.log(event)
    // if(event)
    // {
    //   event.stopPropagation();
    // }

    console.log(d);
    //console.log(this.showModal);

    if (this.data) {
      var len = this.data.length;

      var x = this.data.index;

      if (d > 0) {
        x = x + 1;
      } else {
        if (x == 0) {
          x = len - 1;
        } else {
          x = x - 1;
        }
      }
      this.data.index = x;
    }
  }

  closing() {
    this.showsortingmodal = false;
  }

  onCloseImageDiv() {
    // this.multipurposeService.modalStatus=false;
    this.enlargeImage = false;
  }

  onCloseSingleImageDiv() {
    this.enlargeSingleImage = false;
  }

  onClick = ($event: ClickEvent) => {
    console.log("onClick $event: ", $event);
    this.onClickResult = $event;
    this.ratingValue = $event.rating;
  };

  onRatingChange = ($event: RatingChangeEvent) => {
    console.log("onRatingUpdated $event: ", $event);
    this.onRatingChangeResult = $event;
    this.ratingValue = $event.rating;
  };

  goToLocationStep() {
    this.showGif = false;
    this.showLocationAccess = true;
  }

  closeCitySelection() {
    console.log("sadhsahdjahsj");
    this.loctionStep = "default";
    this.showLocationAccess = true;
  }

  closeSelectLocation() {
    this.loctionStep = "step2";
  }

  closeReviews() {
    this.showreviews = false;
  }

  clickedYesNO(decison) {
    if (decison == "YES")
      this.spaarksService.confirmResponse.next({
        status: true,
        fromWhere: this.fromWhere,
      });
    else
      this.spaarksService.confirmResponse.next({
        status: false,
        fromWhere: this.fromWhere,
      });
    this.showConfirmModal = false;
  }

  clickedOk() {
    this.showAlertModal = false;
    // this.spaarksService.confirmAlert.next({"status":true,"fromWhere":this.FromWhichAlert})
  }

  closeCall(event) {
    this.onlySpaarksCall = false;
    this.noBothCall = false;
    this.showBothCall = false;
    this.onlyPhoneCall = false;
  }

  prop(event) {
    event.stopPropagation();
  }

  onWeb() {
    this.spaarksService.somethingWentWrong(
      "Calls Available only on mobile Browsers"
    );
  }

  clickedPostSearch(spaark) {
    // console.log("calledddddddddddddddd");
    this.searchModal = false;

    this.multipurposeService.triggerModal.next({
      type: "spaarkinmodal",
      post: spaark,
      modal: true,
    });
  }

  openProfile(id) {
    this.searchModal = false;
    this.content = "";
    this.listofsearches = [];
    this.listofSellers = [];
    this.listofPosts = [];
    this.router.navigateByUrl("/profile/seller/" + id);
  }

  key(event: any) {
    console.log(event, event.keyCode, this.userName.length, this.userName[0]);
    if (this.firstval == true) {
      if (event.code.includes("Digit")) {
        console.log("its a number ");
        this.firstval = false;
        this.userName = "";
        event.preventDefault();
        this.spaarksService.somethingWentWrong("invalid input");
      }
    }

    // if(this.userName[0] ||  this.userName[0] == undefined){
    //       this.checkval = true;
    //  if(this.checkval == true){
    //   if(event.keyCode >= 48 && event.keyCode <= 57){
    //     console.log("first cahr is number ");
    //     this.checkval = false;
    //   }
    //  }
    // }
  }

  nameChanged(arg) {
    console.log(this.userName.length, arg);
    if (this.userName.length < 0 || arg == "") {
      console.log(this.userName.length);
      // this.firstval = true;
    }
  }

  submitAccountDetails(username1?) {
    if (username1) this.userName = username1;
    console.log("Userr", this.userName);
    // console.log(numb, this.userName[0]);
    const c = this.userName.substring(0, 1);
    console.log("Userr", this.userName.substring(0, 1));
    if (c >= "0" && c <= "9") {
      this.spaarksService.somethingWentWrong(
        "Name should not start with numbers"
      );
      return;
    }

    var numb = this.userName.match(/\d/g);
    if (numb) {
      var th = numb.join("");
      if (th.length > 6) {
        this.spaarksService.somethingWentWrong("Maximum 6 numbers are allowed");
        this.userName = "";
        return;
      }
    }

    if (this.userName.length < 3) {
      this.spaarksService.somethingWentWrong(
        "Minimum 3 characters are allowed"
      );
      return;
    }

    if (!this.userName.replace(/\s/g, "").length) {
      this.spaarksService.somethingWentWrong("Name can not be empty");
      this.userName = "";
      this.firstval = true;
      return;
    }
    let regex = /[a-zA-Z]/;
    this.doesItHaveLetter = regex.test(this.userName);
    if (!this.doesItHaveLetter) {
      this.spaarksService.somethingWentWrong(
        "Atleast 1 character should be there"
      );
      return;
    }
    if (
      this.userName == "Anonymous" ||
      this.userName == "anonymous" ||
      this.userName == "undefined" ||
      this.userName == "Undefined"
    ) {
      this.spaarksService.somethingWentWrong(
        "Name should not contain Anonymous "
      );
      this.userName = "";
      this.firstval = true;
      return;
    }
    if (this.userName.length < 20) {
      this.namevalue = this.userName;
      this.updateProfile();
    } else {
      this.allPurpose.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "Name/Business Name. Should be less than 20 characters.",
      });
      //alert('Please enter name, name should be less than 20 charecters');
      return;
    }
  }

  updateProfile() {
    this.endLoginModal("loading");

    setTimeout(() => {
      this.spaarksService
        .updateProfileDetails({
          name: this.namevalue,
          gender: this.gendervalue,
        })
        .subscribe((succe) => {
          console.log(succe);

          //this.showNameModal=false;
          localStorage.setItem("name", this.namevalue);
          // localStorage.setItem('phone',this.mobileNumber)
          localStorage.setItem("gender", this.gendervalue);

          localStorage.setItem("iJAIa", environment.ijaiaahut);
          this.endLoginModal("success");
          localStorage.setItem("askname", "true");
        });
    }, 1500);

    setTimeout(() => {
      location.reload();
    }, 6000);
  }

  endLoginModal(stat?, end?) {
    // this.step = 'step5';
    if (stat) {
      this.statusSubmission = stat;

      if (stat == "success") {
        if (end) {
          setTimeout(() => {
            this.spaarksService.endLoginModal();
          }, 2500);
        }
      }
    }
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

  checkerAlert() {
    // alert("alllll");
  }
}
