import { Injectable, NgZone } from "@angular/core";

import { Router, ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Subject, ReplaySubject, Subscription } from "rxjs";
import { HttpHeaders, HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import * as CryptoJS from "crypto-js";
import { AllpurposeserviceService } from "./allpurposeservice.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as moment from "moment";
import { HindiService } from "./hindi.service";
import { TeluguService } from "./telugu.service";
import { JsonPipe } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class SpaarksService {
  // isProfileName=new Subject();
  clickedChatFromFeed = false;
  browserName = "";
  browserNumber = "";
  screenWidth: any;

  alreadyLoaded = false;


  screenHeight: any;
  sendToExplore = new Subject();
  isClickedFromAnnounce=false;

  constructor(
    private router: Router,
    private hindi: HindiService,
    private http: HttpClient,
    private activeSnapshot: ActivatedRoute,
    private allPurposeService: AllpurposeserviceService,
    public _zone: MatSnackBar,
    private _zoneone: NgZone,
    private telugu: TeluguService
  ) {
    
    this.checkforLocation();

    this.browserName = this.myBrowser();
    this.browserNumber = this.getBrowserVersion();
    console.log(this.myBrowser());
    this.screenWidth = window.innerWidth;

    this.screenHeight = window.innerHeight;
    console.log(this.getBrowserVersion());
    if (localStorage.getItem("phoneData")) {
      var Data = localStorage.getItem("phoneData");
      if (Data == "false") {
        this.getPhoneData().subscribe(() => {
          localStorage.setItem("phoneData", "true");
        });
      }
    }

    // alert(this.screenWidth);
    // alert( this.screenWidth);
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

    // if(localStorage.getItem('askname'))
    // {
    //   alert('hey')
    //   var noName=localStorage.getItem('askname');
    //   if(noName=='false')
    //   {
    //     alert("sadsad")
    //     this.allPurposeService.triggerModal.next({
    //       type: "openName",
    //       modal: true,

    //     });

    //   }

    // }

    console.log("service constructor");
    this.reqErrorSubj.subscribe((a) => {
      console.log(a);
      if (a.message == "Please login to access this feature") {
        this.logOut();
      }
    });

    if (window.innerWidth < 951) {
      this.isMobileVersion = true;
    } else {
      this.isMobileVersion = false;
    }
    if (window.innerWidth < 1200) {
      this.removeRightfeed = true;
    } else {
      this.removeRightfeed = false;
    }

    try {
      if (localStorage.getItem("weblocation")) {
        if (localStorage.getItem("locationfrom")) {
          if (localStorage.getItem("locationfrom") == "geolocation") {
            this.takeLocation();
          }
        }
        let loc = JSON.parse(localStorage.getItem("weblocation"));
        console.log(loc);
        this.latitude = loc.lat;
        this.longitude = loc.long;
      }
    } catch {
      (err) => {
        this.catchInternalErrs(err);
      };
    }

    // try {
    //   if (localStorage.getItem('askname')) {
    //     let getNameVal = localStorage.getItem('askname');
    //     if (getNameVal == 'true') {
    //       this.triggerLogin();
    //     }
    //   }
    // } catch{

    // }

    this.activeSnapshot.params.subscribe((succ) => {
      // console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn', succ);
      // console.log(succ);
      // console.log(this.onShared);
    });

    if (localStorage.getItem("iJAIa")) {
      if (localStorage.getItem("iJAIa") == environment.ijaia) {
        this.isJai = false;
        this.authData.isAuthenticated = false;

        if (
          this.isloggedOut == false &&
          !this.router.url.includes("language") &&
          !this.router.url.includes("preferences")
        ) {
        }
      } else if (localStorage.getItem("iJAIa") == environment.ijaiaahut) {
        this.isJai = true;
        this.authData.isAuthenticated = true;

        //decrypt all details
        try {
          this.getUserDetailsEach("", "jai");
        } catch {
          (err) => {
            this.catchInternalErrs(err);
          };
        }

        //decrypt all details

        // try{
        //   this.getRoster();
        // }catch{(err)=>{
        //   this.catchInternalErrs(err)
        // }}
      } else {
        localStorage.setItem("iJAIa", environment.ijaia);
        this.isJai = false;
      }
    } else {
      this.isJai = false;
      localStorage.setItem("iJAIa", environment.ijaia);
    }
  }


  //This method returns what type of browser is user using.

  myBrowser() {
    if (
      (navigator.userAgent.indexOf("Opera") ||
        navigator.userAgent.indexOf("OPR")) != -1
    ) {
      return "Opera";
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
      return "Chrome";
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      return "Safari";
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      return "Firefox";
    }
    // else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )){

    //   return 'IE';

    // }
    else {
      return "unknown";
    }
  }

//This method return browser version
  getBrowserVersion() {
    var userAgent = navigator.userAgent,
      tem,
      matchTest =
        userAgent.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];

    if (/trident/i.test(matchTest[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];

      return "IE " + (tem[1] || "");
    }

    if (matchTest[1] === "Chrome") {
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);

      if (tem != null) return tem.slice(1).join(" ").replace("OPR", "Opera");
    }

    matchTest = matchTest[2]
      ? [matchTest[1], matchTest[2]]
      : [navigator.appName, navigator.appVersion, "-?"];

    if ((tem = userAgent.match(/version\/(\d+)/i)) != null)
      matchTest.splice(1, 1, tem[1]);

    return matchTest.join(" ");
  }
  // clickedOnShare=new Subject();
  clickedPillFormCard = new Subject();

  mainTabTrigger = new Subject();
  selectedChatFromRecentChats: any;
  noPhoneCall = true;
  isMobileVersion;
  removeRightfeed;
  routeToexplore = false;
  isJai = false;
  showContactScreen = new Subject<boolean>();
  preferencesArr = [];
  addSearchPill = new Subject();
  showLoginScreen = new Subject<boolean>();
  exploreDrawLine = new Subject();
  formCurrentState = "first";
  modalType;
  currentStepState = "two";
  removebookmarkPost = new Subject();
  postForMarkers = new Subject();
  previousSubj = new Subject();
  quickSpaarkSubj = new Subject();
  infoDeleted = new Subject();
  photoDeleted = new Subject();
  quickSpaark = { cat: "", subCat: "", questionNo: "" };
  quickSpaarkClicked = false;
  closenotification = new Subject();
  idFromExplore = false;
  confirmAlert = new Subject();
  hideCarousel = new Subject();
  fromChat=false;
  tabChanged=new Subject();
  CreateSpaarkSteps = {
    firstSkip: false,
    secondSkip: false,
    FormState: "",
    StepState: "",
    isTag: "",
    Cat: "",
    subCat: "",
    currentStep: "",
  };
  DefaultSpaarkSteps = {
    firstSkip: false,
    secondSkip: false,
    FormState: "",
    StepState: "",
    isTag: "",
    Cat: "",
    subCat: "",
    currentStep: "",
  };

  authData = {
    isAuthenticated: false,
  };

  createTimeline;
  redirectToNewspark = new Subject();
  getRequestsSub = new Subject<any>();
  enableAnonymousSpaark = new Subject();
  serviceSelected = new Subject();

  showName = true;
  showProfilePic = true;

  selectedTab = 1;
  selectedTabName = "";
  noPillSelected=true;
  currentPost = null; 
  postForMap: boolean;
  fName;
  selectedLang;
  onShared = false;
  noAuthRequired = false;
  showOptions = {
    spaarkscardOptions: false,
    commentsOptions: false,
    repliesOptions: false,
    showSettings: false,
  };
  images = new Subject<any>();
  sentMessage = new Subject();
  sortSubj = new Subject();
  reqErrorSubj = new Subject<any>();
  // imageList = ["../../../assets/testingMedia/sample1.jpeg", "../../../assets/testingMedia/sample_02.jpeg",
  //   "../../../assets/testingMedia/sample_03.jpg", "../../../assets/testingMedia/sample_04.jpg",
  //   "../../../assets/testingMedia/sample_05.jpeg", "../../../assets/testingMedia/sample1.jpeg", "../../../assets/testingMedia/sample_02.jpeg",
  //   "../../../assets/testingMedia/sample_03.jpg", "../../../assets/testingMedia/sample_04.jpg",
  //   "../../../assets/testingMedia/sample_05.jpeg"];


  //This method will take input as images array and calls triggermodal
  sendAllPhotos(imageList) {
    console.log("Data GOT", imageList);
    //alert('sendallphotos')
    this.allPurposeService.triggerModal.next({
      type: "images",
      modal: true,
      imgArr: imageList,
      index: 0,
    });
    //this.images.next({ imgArr: imageList, index: 0 });
    // return this.images.asObservable();
  }


  // This will take index and  imageList to open specific image
  sendImageWithIndex(imageList, inde) {
    this.allPurposeService.triggerModal.next({
      type: "images",
      modal: true,
      imgArr: imageList,
      index: inde,
    });
  }

  getRequestsbyPost() {
    return this.http.get(
      environment.baseUrl + "/api/v2.0/greet/getPendingRequestByPost"
    );
  }

  getSentRequestByPost() {
    return this.http.get(
      environment.baseUrl + "/api/v2.0/greet/getSentRequestByPost"
    );
  }

  sendSinglePhoto(imageSingle) {
    // console.log(imageSingle);
    this.allPurposeService.triggerModal.next({
      type: "singleImage",
      modal: true,
      img: imageSingle,
      index: 0,
    });
  }
  showTabIndex = 1;
  featName = "";
  featCat = "all";
  updatePreferencesStatus = null;
  openSpaarksModal = false;
  triggerSpaarksModal = new Subject();
  noChats = new Subject();
  shareId = "";
  locationSubj = new BehaviorSubject("not given");

  arraytoOpenBottomsheet = [];
  allPurposeSubject = new Subject();
  createSpaarksMain = { pageone: "none" };

  selectedCreate = {
    isMarket: false,
    featureSelected: "",
    selectedQuestion: "",
    selectedSubCategory: "",
    wantAJobAns: "",
    selectedCategory: "",
    categoryId: "",
    content: "",
    imageList: [],
    fileAr: [],
    radius: "7",
    questionNo: "",
    subCategoryId: "",
    dynamicLocation: "true",
    phoneCall: true,
    chat: true,
    isProvider: true,
    gender: true,
    location: true,
    canCallMobile: true,
    isAnonymous: false,
  };
  defaultCreate = {
    isMarket: false,
    featureSelected: "",
    selectedQuestion: "",
    selectedSubCategory: "",
    wantAJobAns: "",
    selectedCategory: "",
    categoryId: "",
    content: "",
    imageList: [],
    fileAr: [],
    radius: "7",
    questionNo: "",
    subCategoryId: "",
    dynamicLocation: "true",
    phoneCall: true,
    chat: true,
    isProvider: true,
    gender: true,
    location: true,
    canCallMobile: true,
    isAnonymous: false,
  };

  //for share N

  templatitude;
  templongitude;
  getOnePost(id) {
    // console.log(id);

    return this.http.get(environment.baseUrl + "/api/v2.0/share/" + id);
  }

  getNotifPost(id, fName) {
    return this.http.get(
      environment.baseUrl + "/api/v2.0/" + fName + "/post/" + id
    );
  }

  // view/sendOTP ---> {phone:''} ==> succ =>{encodedotp}
  // view/resendOTP ---> {}
  // view/verifyOTP ---> {phone:'',encodedOtp:'',cOtp:''}

  loginProcess = { phone: "", language: "en", preferences: [], encodedOtp: "" };

  endLoginModal() {
    this.allPurposeService.triggerModal.next({ type: "login", modal: false });
  }

  triggerLogin() {
    this.allPurposeService.triggerModal.next({ type: "login", modal: true });
  }

  sendMobileNumberLogin(dat) {
    //  console.log(dat);

    return this.http.post(
      environment.baseUrl + "/api/v2.0/auth/web/sendOTP",
      dat
    );
  }

  sendOTPLogin(otp) {
    console.log(otp);
    return this.http.post(
      environment.baseUrl + "/api/v2.0/auth/web/verifyWebOTP",
      otp,
      {withCredentials: true }
    );
  }

  resendOtp(dat) {
    return this.http.post(
      environment.baseUrl + "/api/v2.0/auth/web/resendWebOTP",
      dat
    );
  }

  createSpaark(data: FormData, featureName) {
    console.log(featureName);
    console.log(data);
    let gun = localStorage.getItem("iJAIa");
    // console.log(gun);

    return this.http.post(
      environment.baseUrl + "/api/v2.0/" + featureName + "/post",
      data
    );
  }

  sendRequest(otherPostId, form: FormData) {
    return this.http.post(
      environment.baseUrl + "/api/v2.0/greet/greetRequest/" + otherPostId,
      form
    );
  }

  editAboutMe(content, subcategory) {
    return this.http.post(
      environment.baseUrl + "/api/v2.0/market/aboutcategory",
      { content: content, subCategory: subcategory }
    );
  }

  getPendingRequests() {
    return this.http.get(
      environment.baseUrl + "/api/v2.0/greet/getPendingRequest"
    );
  }

  workStatusSubj = new Subject();
  sendWorkStatus(id, userId, sendOpt) {
    this.http
      .get(
        environment.baseUrl +
          "/api/v2.0/market/confirm/work/" +
          id +
          "/" +
          userId +
          "/" +
          sendOpt
      )
      .subscribe((succ: any) => {
        console.log(succ);
        this.workStatusSubj.next(succ);
        this.somethingWentWrong(succ.message);
      });
  }

  ignoreRequest(request) {
    console.log(request);

    let body = {
      postId: request["postId"],
      uid: request["userId"],
      id: request["_id"],
    };

    return this.http.post(
      environment.baseUrl + "/api/v2.0/greet/rejectGreetRequest",
      body
    );
  }

  acceptRequest(request) {
    console.log(request);

    let body = {
      postId: request["postId"],
      uid: request["userId"],
      id: request["_id"],
    };
    console.log(request.mjid);

    // if(request.mjid==1)
    // {
    //     this.chat.reg_sendRequest(request);
    // }
    // // else{
    // else if(request.mjid==2){ // Changed
    //   this.chat.ano_sendRequest(request);
    // }

    return this.http.post(
      environment.baseUrl + "/api/v2.0/greet/acceptGreetRequest",
      body
    );
  }

  getBlockedUsers() {
    return this.http.get(environment.baseUrl + "/api/v2.0/user/block");
  }

  unBlockUsers(id) {
    return this.http.get(environment.baseUrl + "/api/v2.0/user/unblock/" + id);
  }

  openChatVar = null;

  getBellNotificatrion() {
    return this.http.get(
      environment.baseUrl + "/api/v2.0/user/getnotifications"
    );
  }

  deleteAllnotification() {
    return this.http.get(
      environment.baseUrl + "/api/v2.0/user/deleteallnotification"
    );
  }

  removeNotification(id: any) {
    return this.http.get(
      environment.baseUrl + "/api/v2.0/user/deletenotification/" + id
    );
  }

  getTickets() {
    return this.http.get(environment.baseUrl + "/api/v2.0/ticket/help");
  }

  getTicket(ticketId) {
    return this.http.get(
      environment.baseUrl + "/api/v2.0/ticket/getTicket/" + ticketId
    );
  }

  getBusinessTicket(ticketId) {
    return this.http.get(
      environment.baseUrl + "/api/v2.0/ticket/getTicket/" + ticketId
    );
  }

  getBusinessQueries() {
    if (!this.authData.isAuthenticated) {
      return;
    }
    return this.http.get(environment.baseUrl + "/api/v2.0/ticket/business");
  }

  getUserProfile(userId, isCurrentUser = false) {
    if (isCurrentUser)
      return this.http.get(environment.baseUrl + "/api/v2.0/user/getmyprofile");

    return this.http.get(
      environment.baseUrl + "/api/v2.0/user/getmyprofile/" + userId
    );
  }

  sendProfilePic(images: any) {
    var form = new FormData();
    form.append("profilePic", images);

    return this.http.post<{ userId: any }>(
      environment.baseUrl + "/api/v2.0/user/profilepic",
      form
    );
  }

  proPicSubj = new Subject();
  statusCardSub = new Subject();

  updateChatProfile() {
    this.http
      .get<{ userId: any }>(environment.baseUrl + "/api/v2.0/user/updatechat")
      .subscribe((res) => {
        console.log(res),
          (err) => {
            console.log(err);
          };
      });
  }

  removeProfilePic() {
    return this.http.get(
      environment.baseUrl + "/api/v2.0/user/setdefaultprofilepic",
      { withCredentials: true }
    );
  }

  sendContactData(form) {
    return this.http.post<{ userId: any }>(
      environment.baseUrl + "/api/v2.0/ticket",
      form
    );
  }
  sendReplies(ticketId, content: string, photos?: any) {
    var form = new FormData();
    form.append("ticketId", ticketId);
    form.append("content", content);
    console.log(form);
    photos.forEach((photo) => {
      form.append("photo", photo);
    });
    return this.http.put<{ userId: any }>(
      environment.baseUrl + "/api/v2.0/ticket",
      form
    );
  }


  marketTab = [
    {
      catTxt: "I give a Service",
      questionNo: "3",
      catImg: "q3.png",
      catDesc:
        "Maid, Driver, Cook, Tuition, Consultant, Freelancer, Tailor, Watchman, Donate etc.",
      excluding: [],
    },
    {
      catTxt: "I have Something to Sell",
      questionNo: "4",
      catImg: "q4.png",
      catDesc:
        "Fruits/Vegetables, Handicrafts, Florist, Homemade, Agri Mall etc.",
      excluding: [
        "C4",
        "C5",
        "C7",
        "C9",
        "C011",
        "C012",
        "C013",
        "C018",
        "C019",
        "C020",
        "C023",
        "C024",
      ],
    },
    {
      catTxt: "Make Friends",
      questionNo: "2",
      catImg: "q2.png",
      catDesc:
        "Say Hello, Connect to a Stranger, Find a Date, Make Introduction.",
      excluding: [],
    },
    {
      catTxt: "Announce Something",
      questionNo: "1",
      catImg: "q1.png",
      catDesc:
        " Public Announcements, Events, Thoughts, Exhibition,Festival, Prayers, Achievement,Launch, Sale, Party.",
      excluding: [],
    },
    {
      catTxt: "Post a Job",
      questionNo: "6",
      catImg: "q6.png",
      catDesc: "Labour, Helper, Assistant, Manager, Professional etc.",
      excluding: ["C5", "C018", "C020", "C019", "C024"],
    },
    {
      catTxt: "I Want a Job",
      questionNo: "7",
      catImg: "q7.png",
      catDesc: "Skilled, Not Skilled, Daily Wage, Any Work, Part Time etc.",
      excluding: [],
    },
    {
      catTxt: "I need a Service",
      questionNo: "5",
      catImg: "q5.png",
      catDesc: "Stylist, Electrician,Dhobi, Gardener, Repair, Key Maker etc.",
      excluding: [],
    },
    {
      catTxt: "Others",
      questionNo: "8",
      catImg: "q8.png",
      catDesc: "Health Emergency, Ask for Help, Lost or Found etc.",
      excluding: [],
    },


  ];

  createFromFeed = new Subject();
  selectedCat(i, txt,isAnonymous=false) {
    console.log(i, txt);
    this.createSpaarksMain.pageone = txt;

    // if (txt == "Announce") {
    //   this.selectedCreate.featureSelected = "showtime";
    // } else if (txt.includes("Friends")) {
    //   this.selectedCreate.featureSelected = "greet";
    // } else {
    //   this.selectedCreate.featureSelected = "market";
    // }
    // this.selectedCreate.selectedQuestion = txt;
    // this.selectedCreate.questionNo = i;

    // this.router.navigateByUrl(
    //   "home/newspaark/create/" + txt.split(" ").join("-")
    // // );
    // this.createFromFeed.next({ ind: i, name: txt });
    // this.router.navigateByUrl("newspaark/create/" + txt.split(" ").join("-"));
    this.selectedCatCreator(i,txt,isAnonymous);

    // this.spaarksservice.allPurposeSubject.next({action:'firststep',index:i,text:txt})
  }

  selectedCatCreator(i, txt, isAnonymous = false) {
    this.createTimeline = null;
    this.selectedCreate.isAnonymous = isAnonymous;

    this.selectedCreate = {
      ...this.defaultCreate,
    };
    this.selectedCreate.selectedSubCategory = "";
    this.CreateSpaarkSteps = {
      ...this.DefaultSpaarkSteps,
    };
    this.selectedCreate.content = "";
    

    // console.log(this.spaarksservice.selectedCreate);
    // console.log(this.spaarksservice.CreateSpaarkSteps);
    this.createSpaarksMain.pageone = txt;
    if (txt.includes("Announce") || txt.includes("Friends")) {
      if (this.authData.isAuthenticated == false) {
        this.triggerLogin();

        return;
      }
    }

    if (txt.includes("Announce")) {
      this.selectedCreate.featureSelected = "showtime";
      this.selectedCreate.questionNo = "1";
    } else if (txt.includes("Friends")) {
      this.selectedCreate.featureSelected = "greet";
      this.selectedCreate.questionNo = "2";

      this.selectedCreate.isAnonymous = isAnonymous;
      this.selectedCreate.location=false;

    } else {
      this.selectedCreate.featureSelected = "market";
      if (txt.includes("give")) {
        this.selectedCreate.questionNo = "3";
      } else if (txt.includes("need")) {
        this.selectedCreate.questionNo = "5";
      } else if (txt.includes("Want")) {
        this.selectedCreate.questionNo = "7";
      } else if (txt.includes("Post")) {
        this.selectedCreate.questionNo = "6";
      } else if (txt.includes("Sell")) {
        this.selectedCreate.questionNo = "4";
      } else if (txt.includes("Others")) {
        this.selectedCreate.questionNo = "8";
      }
    }
    this.selectedCreate.selectedQuestion = txt;

    //Navigating user to the route, home/newspaark/create/i-offer-a-service
    //by splitting the spaces and join with -
    this.router.navigateByUrl("newspaark/create/" + txt.split(" ").join("-"));

    // this.spaarksservice.allPurposeSubject.next({action:'firststep',index:i,text:txt})
  }

//Method called when ever user enters his name for first time login
  updateProfileDetails(dat) {
    return this.http.post(
      environment.baseUrl + "/api/v2.0/user/updateprofile",
      dat
    );
  }

  setDetailsToLocalStorage(dat, isInitial?) {
    console.log(isInitial);
    try {
      this.encrAndSet("jid_main", dat.jid_main);
    } catch {
      (err) => {
        this.catchInternalErrs(err);
      };
    }

    try {
      this.encrAndSet("jid_anonymous", dat.jid_anonymous);
    } catch {
      (err) => {
        this.catchInternalErrs(err);
      };
    }

    try {
      this.encrAndSet("chatpassword", dat.chatpassword);
    } catch {
      (err) => {
        this.catchInternalErrs(err);
      };
    }

    try {
      this.encrAndSet("chatDomainWeb", dat.chatDomainWeb);
    } catch {
      (err) => {
        this.catchInternalErrs(err);
      };
    }

    try {
      console.log(dat);
      localStorage.setItem("propic", dat.profilePic);
      localStorage.setItem("name", dat.name);
      localStorage.setItem("gender", dat.gender);
      if (!isInitial) localStorage.setItem("phone", dat.phone);
      localStorage.setItem("id", dat.id);
      localStorage.setItem("iJAIa", environment.ijaiaahut);
      localStorage.setItem("language", dat.webLanguage);
    } catch {
      (err) => {
        this.catchInternalErrs(err);
      };
    }

    if (dat.isProfileCompleted) {
      setTimeout(() => {
        location.reload();
      }, 2000);
    } else {
    }
  }

  getUserDetailsEach(key, jai?) {
    try {
      if (key) {
        console.log(key);
        if (this.userDetailsStrings.includes(key)) {
          console.log(key);
          this.userDetailsArr.forEach((val, ind) => {
            console.log(key);
            if (val.name == key) {
              console.log(key);
              if (val.decrValue == "") {
                console.log(key);
                let fun = localStorage.getItem(val.fakeName);
                if (fun) {
                  console.log(fun);

                  let unCypher = CryptoJS.AES.decrypt(
                    fun,
                    this.scrtJaikey
                  ).toString(CryptoJS.enc.Utf8);
                  val.decrValue = unCypher;
                  console.log(unCypher);
                  return unCypher;
                } else {
                  console.log(key);
                  return null;
                }
              } else {
                console.log(val.decrValue);
                return val.decrValue;
              }
            } else {
              return null;
            }
          });
        } else {
          if (jai) {
            return null;
          } else {
            return null;
          }
        }
      } else if (jai) {
        if (jai) {
          try {
            this.userDetailsArr.forEach((val, ind) => {
              let fun = localStorage.getItem(val.fakeName);
              // console.log(fun)
              if (fun) {
                let unCypher = CryptoJS.AES.decrypt(
                  fun,
                  this.scrtJaikey
                ).toString(CryptoJS.enc.Utf8);
                // console.log('--------------------->')

                val.decrValue = unCypher;

                // console.log(unCypher)

                // console.log('--------------------->')
                switch (val.name) {
                  case "jid_main":
                    this.allPurposeService.setCookieVals("cookieJid", unCypher);
                    // this.chatService.cookieJid = unCypher
                    break;
                  case "jid_anonymous":
                    this.allPurposeService.setCookieVals(
                      "cookieJidAno",
                      unCypher
                    );
                    // this.chatService.cookidJidAno = unCypher
                    break;
                  // case cookieId, cookiePass

                  case "chatpassword":
                    this.allPurposeService.setCookieVals(
                      "cookiePass",
                      unCypher
                    );
                    break;
                }
              } else {
                return null;
              }
            });
          } catch {
            (err) => {
              this.catchInternalErrs(err);
            };
          }
        }
      } else {
        return null;
      }
    } catch {
      (err) => {
        console.log(err);
      };
    }
  }

  getSellerProfile(id) {
    return this.http.post(
      environment.baseUrl + "/api/v2.0/market/othersRatings/" + id,
      { withCredentials: true }
    );
  }

  bufferSendReqInfoBool = false;
  bufferSendReqInfo = null;

  getRoster() {
    // this.allPurposeService.getRoster()
  }

  currentFeatureSubj = new Subject();

  dummySpaarksPost = [
    {
      _id: "6047623848a973157103a257",
      uservisibility: {
        name: "Raju",
        profilePic:
          "https://static-content.spaarksweb.com/images/userprofile.png",
        chat: false,
        phoneCall: true,
        location: true,
      },
      locationStatic: { type: "Point", coordinates: ["", ""] },
      imageOverlay: [],
      videoOverlay: false,
      photo: [],
      video: [],
      subposts: [],
      status: true,
      condition: "Ongoing",
      showLocation: false,
      jid: "",
      aid: "800855126s",
      SOS: false,
      content:
        "Hi there I’m an artist wef ad sd as  s dfasdfsadf sdaf sadf asdf",
      radius: 5000,
      photos: [],
      videos: [],
      createdAt: "2021-03-09T11:55:36.612Z",
      postedAt: "2021-03-09T11:55:36.612Z",
      userId: "6015390fe0167c62b9b403c3",
      repostDescription: [],
      featureName: "market",
      OriginalName: "Services & Goods",
      updatedAt: "2021-03-17T05:55:45.039Z",
      uniqueId: "6047623848a973157103a257",
      distance: 738.7089831620528,
      within: true,
      isFull: false,
      fromAdmin: false,
    },
  ];

  catchInternalErrs(errs) {
    console.log(errs);
  }
  userDetailsArr = [
    { name: "jid_main", fakeName: "sjpiad", decrValue: "" },
    { name: "jid_anonymous", fakeName: "sjpiadaarn", decrValue: "" },
    { name: "chatpassword", fakeName: "scppaaars", decrValue: "" },
    { name: "chatDomainWeb", fakeName: "sdpoamaari", decrValue: "" },
  ];

  userDetailsStrings = [
    "jid_main",
    "jid_anonymous",
    "chatpassword",
    "chatDomainWeb",
  ];

  encrAndSet(key, val) {
    if (key == "jid_main") {
      let localValue = val;
      let encrDat = CryptoJS.AES.encrypt(
        localValue,
        this.scrtJaikey
      ).toString();
      localStorage.setItem("sjpiad", encrDat);
    } else if (key == "jid_anonymous") {
      let localValue = val;
      let encrDat = CryptoJS.AES.encrypt(
        localValue,
        this.scrtJaikey
      ).toString();
      localStorage.setItem("sjpiadaarn", encrDat);
    } else if (key == "chatpassword") {
      let localValue = val;
      let encrDat = CryptoJS.AES.encrypt(
        localValue,
        this.scrtJaikey
      ).toString();
      localStorage.setItem("scppaaars", encrDat);
    } else if (key == "chatDomainWeb") {
      let localValue = val;
      let encrDat = CryptoJS.AES.encrypt(
        localValue,
        this.scrtJaikey
      ).toString();
      localStorage.setItem("sdpoamaari", encrDat);
    }
  }

  scrtJaikey = "ace0900brz8j";

  latitude = null;
  longitude = null;

  removeRequest(otherPostId) {
    return this.http.get(
      environment.baseUrl + "/api/v2.0/greet/removeRequest/" + otherPostId
    );
  }

  deleteSpaark(fname, id) {
    return this.http.delete(
      environment.baseUrl + "/api/v2.0/" + fname + "/post/" + id
    );
  }

  getMyRequests() {
    return this.http.get(environment.baseUrl + "/api/v2.0/user/myrequest", {});
  }

  getAllPosts(feat) {
    // console.log(this.latitude, this.longitude);
    if (!feat) {
      feat = "user";
    }
    let dat = {
      latitude: this.latitude,
      longitude: this.longitude,
      radius: 5000,
      category: "all",
      subCategory: "",
    };
    return this.http.post(
      environment.baseUrl + "/api/v2.0/" + feat + "/post/static",
      dat
    );
  }
  // getCategoryPosts(feat) {
  //   // console.log(this.latitude, this.longitude);

  //   let dat = {
  //     latitude: this.latitude,
  //     longitude: this.longitude,
  //     radius: 5000,
  //     category: feat.category,
  //     subCategory:feat.subCategory,
  //   };
  //   return this.http.post(
  //     environment.baseUrl + "/api/v2.0/user/post/static",
  //     dat
  //   );
  // }
  routeSub: Subscription;
  fromLanding = false;

  checkforLocation() {
     console.log(document.URL);

    if (
      document.URL.includes("faqs") ||
      document.URL.includes("terms") ||
      document.URL.includes("connect")
    ) {
      // console.log(document.URL, 'ooooooo');

      this.noAuthRequired = false;
      return
    }
    // console.log(!this.onShared);
    // console.log(window.localStorage);

    if (!this.onShared && !this.noAuthRequired) {
      // console.log(document.URL, 'pppppppppppp');

      if (!localStorage.getItem("alreadyvisited")) {
        console.log("i came from service ");

        this.router.navigateByUrl("/home/getstarted").then((a) => {
      //    window.location.reload();
        });
      } else if (!localStorage.getItem("lang")) {
        // console.log('check for location for lang');

        this.router.navigateByUrl("/home/language");
      } else if (!localStorage.getItem("weblocation")) {
        if (!document.URL.includes("nearby")) {
          if (
            localStorage.getItem("isfirstlocation") &&
            localStorage.getItem("iJAIa") != "bGThac"
          ) {
            // getting location from backened
            this.getLocation().subscribe((succ: any) => {
              console.log(succ);
              if (succ.location.coordinates) {
                this.longitude = succ.location.coordinates[0];
                this.latitude = succ.location.coordinates[1];
                this.updateLocation(this.latitude, this.longitude);
                console.log(this.latitude, this.longitude);
                this.allPurposeSubject.next({
                  type: "locationupdate",
                  data: succ,
                });
              }

              // if backened location succ is empty show the location modal
              else {
                this.allPurposeService.triggerModal.next({
                  type: "locationmodal",
                  step: "default",
                  modal: true,
                });
              }
            });
          }

          // for first time users it should navigate to
          else {
            // this.router.navigateByUrl("/home/preferences");
            if(localStorage.getItem("weblocation"))
            this.router.navigateByUrl("/home/feed");
          }
          //check for succ, if not location from backend, go to preferences
        }
      }
    }
  }
  getUpdatedLocation() {
    throw new Error("Method not implemented.");
  }

  SkeletonTimer = new Subject();
  allowedGeoLocation = false;

  currentSearchedCat;
  searchedCatArr = [];

  baseUrl = "https://staging-api.ososweb.com/api/v2.0";

  // get posts according to features
  getPosts(lat, long, cat, subCat, lang, fName) {
    console.log("cate:", cat, "subCat", subCat, "Fname", fName);
    if (cat == "Market" || cat == undefined || cat == "") {
      cat = "all";
    }
    if (fName != "market") {
      return this.http.post(
        environment.baseUrl + "/api/v2.0/" + fName + "/post/static",
        { latitude: lat, longitude: long, radius: 2 }
      );
    } else {
      return this.http.post(
        environment.baseUrl + "/api/v2.0/" + fName + "/post/static",
        { latitude: lat, longitude: long, category: cat, subCategory: subCat }
      );
    }
  }

  getSortPostsWithin(lat, long, cat, subCat, lang, fName, page, radius, type) {
    console.log(
      "lat",
      lat,
      "long",
      long,
      "cat",
      cat,
      "subact",
      subCat,
      "lang",
      lang,
      "fName",
      fName,
      "page",
      page,
      "radius",
      radius,
      "type",
      type
    );
    if (cat == "Market" || cat == undefined || cat == "") {
      cat = "all";
    }
    if (fName != "market") {
      return this.http.post(
        environment.baseUrl + "/api/v2.0/" + fName + "/post/static/within",
        {
          latitude: lat,
          longitude: long,
          page,
          radius: parseInt(radius),
          sortBy: type,
        }
      );
    } else {
      // alert("in market");
      console.log(lat);
      console.log(long);
      console.log(cat);
      console.log(subCat);
      console.log(page);

      return this.http.post(
        environment.baseUrl + "/api/v2.0/" + fName + "/post/static/within",
        {
          latitude: lat,
          longitude: long,
          category: cat,
          subCategory: subCat,
          page,
          radius: parseInt(radius),
          sortBy: type,
        }
      );
    }
  }

  getPostsWithin(lat, long, cat, subCat, lang, fName, page, radius, type) {
    console.log(
      "lat",
      lat,
      "long",
      long,
      "cat",
      cat,
      "subact",
      subCat,
      "lang",
      lang,
      "fName",
      fName,
      "page",
      page,
      "radius",
      radius,
      "type",
      type
    );
    if (cat == "Market" || cat == undefined || cat == "") {
      cat = "all";
    }
    if (fName != "market") {
      return this.http.post(
        environment.baseUrl + "/api/v2.0/" + fName + "/post/static/within",
        {
          latitude: lat,
          longitude: long,
          page,
          radius: parseInt(radius),
          sortBy: type,
        }
      );
    } else {
      // alert("in market");
      console.log(lat);
      console.log(long);
      console.log(cat);
      console.log(subCat);
      console.log(page);

      return this.http.post(
        environment.baseUrl + "/api/v2.0/" + fName + "/post/static/within",
        {
          latitude: lat,
          longitude: long,
          category: cat,
          subCategory: subCat,
          page,
          radius: parseInt(radius),
          sortBy: type,
        }
      );
    }
  }

  getPostsBeyond(lat, long, cat, subCat, lang, fName, page, radius, type) {
    if (cat == "Market" || cat == undefined || cat == "") {
      cat = "all";
    }
    if (fName != "market") {
      return this.http.post(
        environment.baseUrl + "/api/v2.0/" + fName + "/post/static/beyond",
        {
          latitude: lat,
          longitude: long,
          page,
          radius: parseInt(radius),
          sortBy: type,
        }
      );
    } else {
      return this.http.post(
        environment.baseUrl + "/api/v2.0/" + fName + "/post/static/beyond",
        {
          latitude: lat,
          longitude: long,
          category: cat,
          subCategory: subCat,
          page,
          radius: parseInt(radius),
          sortBy: type,
        }
      );
    }
  }

  getPostsForSearch(subCat, fName) {
    return this.http.post(
      environment.baseUrl + "/api/v2.0/" + fName + "/post/subcategories",
      {
        latitude: this.latitude,
        longitude: this.longitude,
        radius: 2,
        subCategory: subCat,
      },
      { withCredentials: true }
    );
  }

  getLocation() {
    return this.http.get(environment.baseUrl + "/api/v2.0/user/location", {
      withCredentials: true,
    });
  }

  postUpdatedLocation() {
    return this.http.post(environment.baseUrl + "/api/v2.0/user/location", {
      latitude: this.latitude,
      longitude: this.longitude,
    });
  }

  sendRatings(sendRating) {
    return this.http.post(
      environment.baseUrl + "/api/v2.0/market/giveRating",
      sendRating
    );
  }

  ignore(userId) {
    return this.http.post(
      environment.baseUrl + "/api/v2.0/market/ignorerating",
      { id: userId }
    );
  }

  getSellerRatings() {
    return this.http.get(
      environment.baseUrl + "/api/v2.0/market/pendingRatings"
    );
  }

  getPreviousCat() {
    return this.http.get(
      environment.baseUrl + "/api/v2.0/market/previouscategories"
    );
  }

  getsearchLocation(searchKey) {
    return this.http.get(environment.baseUrl + "/searchlocation/" + searchKey);
  }

  //get seller posts for horizontal
  getSellerPosts(lat, long) {
    if (this.authData.isAuthenticated) {
      return this.http.post(
        environment.baseUrl + "/api/v2.0/market/getuserProfiles",
        { latitude: lat, longitude: long }
      );
    }
  }

  // This method is called when searched from keyword.
	// If a user is logged in send token i.e.,WithCredentials
	// else just send the key param
  searchRight(content)
  {
    
    if(this.authData.isAuthenticated)
    {
      return this.http.get("https://staging-api.ososweb.com/search/" + content,{withCredentials:true})
  
    }
    else{
      return this.http.get("https://staging-api.ososweb.com/search/" + content)

    }
    
  }
  getComments(id, fname) {
    return this.http.get(
      environment.baseUrl + "/api/v2.0/" + fname + "/comments/" + id
    );
  }

  createComment(content: string, photos: any, id: any, fname: any) {
    var form = new FormData();

    console.log(content);
    console.log(photos);

    form.append("postId", id);
    // form.append("userId",'5e414b9400242e00173f83c2')
    form.append("content", content);

    form.append("fname", fname);

    photos.forEach((photo) => {
      form.append("photo", photo);
    });

    console.log(form);
    //making link dynamic

    return this.http.post(
      environment.baseUrl + "/api/v2.0/" + fname + "/post/subpost",
      form
    );
  }

  createReply(text: string, id: string, featureName: string, OrgName?) {
    //

    console.log("this.sendComments");

    return this.http.post<any>(
      environment.baseUrl +
        "/api/v2.0/" +
        featureName +
        "/post/subpost/" +
        id +
        "/comment",
      { content: text, featureName: featureName }
    );
  }

  getReplies(id, fname) {
    return this.http.get(
      environment.baseUrl +
        "/api/v2.0/" +
        fname +
        "/post/subpost/" +
        id +
        "/comment"
    );
  }
//When  user likes or unlikes post this method I called we have to pass postId with 					user Token
  postLiked(postid) {
    return this.http.get(
      environment.baseUrl + "/api/v2.0/market/post/" + postid + "/like"
    );
  }
  askLocation = [
    {
      name: "Mumbai",
      image: "assets/cities/mumbai.svg",
      lat: "18.9667",
      lon: "72.8333",
      index: 1,
    },
    {
      name: "Delhi",
      image: "assets/cities/ncr.svg",
      lat: "28.6600",
      lon: "77.2300",
      index: 2,
    },
    {
      name: "Bengaluru",
      image: "assets/cities/banglore.svg",
      lat: "12.9699",
      lon: "77.598",
      index: 3,
    },
    {
      name: "Hyderabad",
      image: "assets/cities/hyd.svg",
      lat: "17.3667",
      lon: "78.48667",
      index: 4,
    },
    {
      name: "Ahmedabad",
      image: "assets/cities/ahmedabad.svg",
      lat: "23.03",
      lon: "72.58",
      index: 5,
    },
    {
      name: "Chandigarh",
      image: "assets/cities/chandigarh.svg",
      lat: "30.7353",
      lon: "76.7911",
      index: 6,
    },
    {
      name: "Chennai",
      image: "assets/cities/chennai.svg",
      lat: "13.0825",
      lon: "80.275",
      index: 7,
    },
    {
      name: "Kolkata",
      image: "assets/cities/kolkata.svg",
      lat: "22.5411",
      lon: "88.3378",
      index: 8,
    },
    {
      name: "Pune",
      image: "assets/cities/pune.svg",
      lat: "18.5196",
      lon: "73.8553",
      index: 9,
    },
  ];
  textMsg = "";
  languageCheck = localStorage.getItem("lang");

  somethingWentWrong(arg?, action?) {
    this.languageCheck = localStorage.getItem("lang");
    console.log(this.languageCheck);
    this.textMsg = arg;
    if (this.languageCheck == "hi") {
      this.textMsg = this.hindi.langs[arg];
    }
    if (this.languageCheck == "te") {
      this.textMsg = this.telugu.langs[arg];
    }
    // console.log(this.textMsg, "msg After lang Conversion");
    if (this.textMsg == undefined) {
      this.textMsg = arg;
    }
    console.log(this.textMsg);

    this._zoneone.run((submitMessege) => {
      this._zone.open(
        this.textMsg ? this.textMsg : "Something went wrong",
        "Ok",
        {
          duration: 2000,
        }
      );
      //console.log(succ);
    });

    // this.textMsg = arg;

    // if (this.textMsg == undefined) {
    //   this.textMsg = arg;
    // }
    // //console.log(this.textMsg);

    // this._zoneone.run(
    //   (submitMessege) => {
    //     this._zone.open(this.textMsg ? this.textMsg : 'Something went wrong', 'Ok', {
    //       duration: 2000
    //     });

    //   }
    // );
  }
  confirmResponse = new ReplaySubject(1);
  confirmStatus = true;
  textAlertMsg = "";
  doConfirm(arg) {
    this.languageCheck = localStorage.getItem("lang");
    console.log(arg);
    try {
      this.languageCheck = localStorage.getItem("lang");
    } catch {
      this.languageCheck = "en";
    }
    this.textAlertMsg = arg;
    if (this.languageCheck == "hi") {
      this.textAlertMsg = this.hindi.langs[arg];
    }
    console.log("After Language Change");
    console.log(this.textAlertMsg);
    if (this.textAlertMsg == undefined) {
      this.textAlertMsg = arg;
    }
    console.log(this.textAlertMsg);

    if (arg != undefined) {
      this.confirmStatus = confirm(this.textAlertMsg);
      return this.confirmStatus;
    }
  }

  showAlert(arg?) {
    this.languageCheck = localStorage.getItem("lang");
    console.log(arg);
    try {
      this.languageCheck = localStorage.getItem("lang");
    } catch {
      this.languageCheck = "en";
    }
    this.textAlertMsg = arg;
    if (this.languageCheck == "hi") {
      this.textAlertMsg = this.hindi.langs[arg];
    }
    console.log("After Language Change");
    console.log(this.textAlertMsg);
    if (this.textAlertMsg == undefined) {
      this.textAlertMsg = arg;
    }
    console.log(this.textAlertMsg);

    if (arg != undefined) {
      alert(this.textAlertMsg);
    }
  }

  resetSpaarkData() {
    this.selectedCreate = this.defaultCreate;
    this.selectedCreate.selectedSubCategory = "";
    this.CreateSpaarkSteps = this.DefaultSpaarkSteps;
    this.selectedCreate.content = "";
    console.log(this.selectedCreate);
    console.log(this.CreateSpaarkSteps);
  }
  isloggedOut = false;

  clearCookie() {
    var userId = localStorage.getItem("id");
    this.http
      .get(environment.baseUrl + "/api/v2.0/auth/logout/" + userId, {})
      .subscribe(
        (abc) => {
          // this.router.navigateByUrl("/home/getstarted")
          // this.chat.disconnect_xmpp();
        },
        (err) => {
          console.log(err);
          // if (err.status == 401) {
          //   this.router.navigateByUrl('/home/getstarted');
          // };
        }
      );
  }

  logOut() {
    this.clearCookie();
    // localStorage.clear();

    this.router.navigateByUrl("/home/feed").then(() => {
      window.location.reload();
    });

    var lang = localStorage.getItem("lang");
    var preferences = localStorage.getItem("preferences");
    var weblocation = localStorage.getItem("weblocation");
    var locationfrom = localStorage.getItem("locationfrom");
    var alreadyvisited = localStorage.getItem("alreadyvisited");
    var isfirstlocation = localStorage.getItem("isfirstlocation");
    var cookieAccess = localStorage.getItem("cookieAccess");
    localStorage.clear();

    if (locationfrom != null) {
      localStorage.setItem("locationfrom", locationfrom);
    }
    if (alreadyvisited != null) {
      localStorage.setItem("alreadyvisited", alreadyvisited);
    }
    if (isfirstlocation != null) {
      localStorage.setItem("isfirstlocation", isfirstlocation);
    }

    if (preferences != null) {
      localStorage.setItem("preferences", preferences);
    }

    if (lang != null) {
      localStorage.setItem("lang", lang);
    }

    if (weblocation != null) {
      localStorage.setItem("weblocation", weblocation);
    }

    if (cookieAccess != null) {
      localStorage.setItem("cookieAccess", cookieAccess);
    }
    // window.location.reload();
  }

  finalAgo = "";
  receiveCreated(sm) {
    let date1 = new Date();
    let a = moment(date1).format("YYYY-MM-DD HH:mm");
    let b = moment(sm);
    let neg_mins = b.diff(date1, "minutes");
    let positive_mins = Math.abs(neg_mins);
    let minutesDiff = positive_mins;
    //  console.log(minutesDiff)
    let finRemString;
    let minsCnt;
    let data = minutesDiff;

    let dateTime = moment(date1).format("YYYY-MM-DD HH:mm:ss");
    let hourCnt;
    let temp;

    //console.log(minutesDiff,"Created")

    finRemString = minutesDiff / 60 / 24;

    if (minutesDiff <= 5) {
      this.finalAgo = "just now";
      this.changeFinalAgo(sm);
      return finRemString;
    } else if (minutesDiff > 5 && minutesDiff <= 55) {
      minsCnt = minutesDiff;
      this.finalAgo = minsCnt + " " + "min(s)" + " ago";
      return minsCnt + " " + "min(s)";
    } else if (minutesDiff > 55 && minutesDiff <= 1380) {
      finRemString = minutesDiff / 60;
      hourCnt = Math.floor(finRemString);
      //hourCnt = finRemString.toFixed(0);
      hourCnt = Math.floor(hourCnt);
      minsCnt = data % 60;
      minsCnt = minsCnt.toFixed(0);
      if (hourCnt > 0) {
        if (hourCnt == 1) {
          temp = " hour" + " ago";
        } else if (hourCnt > 1) {
          temp = " hours" + " ago";
        }

        this.finalAgo = hourCnt + temp;

        return hourCnt + temp; // + minsCnt + ' min(s)'
      }
    }
    //  else if (minutesDiff > 1380 && minutesDiff <= 1440) {
    //   let dat = new Date(sm);
    //   dat.toDateString();
    //   //console.log(dat,"converted")
    //   var month = dat.toLocaleString("default", { month: "long" });
    //   finRemString = finRemString.toFixed(0);
    //   if (finRemString == 1) {
    //     //console.log("getting date",dat.getDate(),dat.getMonth(),month);
    //     temp =
    //       month.substring(0, 3) + " " + dat.getDate() + " " + dat.getFullYear();
    //   } else if (finRemString > 1) {
    //     temp =
    //       month.substring(0, 3) + " " + dat.getDate() + " " + dat.getFullYear();
    //   }
    //   this.finalAgo = temp;
    //   return temp;
    // }
    else if (minutesDiff > 1380 && minutesDiff <= 10080) {
      finRemString = minutesDiff / 60 / 24;
      finRemString = finRemString.toFixed(0);
      // alert(finRemString);

      if (finRemString == 1) {
        temp = " day ago";
      } else if (finRemString > 1) {
        temp = " days ago";
      }

      this.finalAgo = finRemString + temp;

      return finRemString + temp;
    } else if (minutesDiff >= 10080) {
      let dat = new Date(sm);
      dat.toDateString();
      // console.log(dat,"converted")
      var month = dat.toLocaleString("default", { month: "long" });
      temp =
        month.substring(0, 3) + " " + dat.getDate() + " " + dat.getFullYear();
this.finalAgo=temp
      return temp;
    }
    // if (minutesDiff > 60 && minutesDiff < 1440) {
    //   finRemString = minutesDiff / 60;
    //   hourCnt = Math.floor(finRemString);
    //   //hourCnt = finRemString.toFixed(0);
    //   hourCnt = Math.floor(hourCnt);
    //   minsCnt = data % 60;
    //   minsCnt = minsCnt.toFixed(0);
    //   if (hourCnt > 0) {
    //     if (hourCnt == 1) {
    //       temp = " hour" + " ago";
    //     } else if (hourCnt > 1) {
    //       temp = " hours" + " ago";
    //     }

    //     this.finalAgo = hourCnt + temp;

    //     return hourCnt + temp; // + minsCnt + ' min(s)'
    //   }
    //   else {
    //     this.finalAgo = minsCnt + " " + "min(s)" + " ago";
    //     return minsCnt + " " + "min(s)";
    //   }
    // } else if (minutesDiff >= 1440 && minutesDiff < 525600) {
    //   finRemString = minutesDiff / 60 / 24;

    //   finRemString = finRemString.toFixed(0);
    //   if (finRemString == 1) {
    //     temp = " day" + " ago";
    //   } else if (finRemString > 1) {
    //     temp = " days" + " ago";
    //   }
    //   this.finalAgo = finRemString + temp;
    //   return finRemString + temp;
    // } else if (minutesDiff >= 525600) {
    //   finRemString = minutesDiff / 60 / 24 / 365;
    //   finRemString = finRemString.toFixed(0);
    //   this.finalAgo = finRemString + " " + "Year(s)" + " ago";
    //   return finRemString + " " + "Year(s)";
    // } else if (minutesDiff < 5) {
    //   this.finalAgo = "just now";
    //   this.changeFinalAgo(sm);
    //   return finRemString;
    // }
    else {
      this.finalAgo = minutesDiff + " " + "mins" + " ago";
      return minutesDiff + " " + "mins";
    }
    return a;
  }

  changeFinalAgo(sm) {
    setTimeout(() => {
      this.receiveCreated(sm);
    }, 50000);
  }

  updateLocation(lat, lng) {
    localStorage.setItem(
      "weblocation",
      JSON.stringify({ lat: lat, long: lng })
    );
    this.latitude = lat;
    this.longitude = lng;

    // updating location to backend also
    if (this.authData.isAuthenticated) this.postUpdatedLocation().subscribe();
  }

  takeLocation() {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position: any) => {
          // console.log(position.coords.latitude);
          localStorage.setItem(
            "weblocation",
            JSON.stringify({
              long: position.coords.longitude,
              lat: position.coords.latitude,
            })
          );

          this.updateLocation(
            position.coords.latitude,
            position.coords.longitude
          );
          // this.fromLocateMe = true;
          this.allowedGeoLocation = true;

          localStorage.setItem("locationfrom", "geolocation");
          // this.postUpdatedLocation();

          // this.clickedEndLocationPick();
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
          // this.loctionStep = 'step2'
          // this.citiesiterator.nativeElement.scrollTop = this.citiesiterator.nativeElement.scrollHeight
        }
      );
    } else {
      this.allPurposeService.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "Sorry, your browser does not support HTML5 geolocation.",
      });
      //this.showAlert("Sorry, your browser does not support HTML5 geolocation.");
      // this.loctionStep = 'step2'
      // this.citiesiterator.nativeElement.scrollTop = this.citiesiterator.nativeElement.scrollHeight
    }
    // this.showLocationAccess = false;
  }
//To bookmark a post.
  bookmarkpost(postid) {
    return this.http.post(
      environment.baseUrl + "/api/v2.0/user/bookmark/post",
      { postId: postid }
    );
  }
//To remove bookmark a post.

  removepostbookmark(postid) {
    return this.http.post(
      environment.baseUrl + "/api/v2.0/user/removebookmark/post",
      { postId: postid }
    );
  }
  //book mark a userporfile
  bookmarkUser(userid) {
    return this.http.post(
      environment.baseUrl + "/api/v2.0/user/bookmark/user",
      { userId: userid }
    );
  }
  //remove bookmark for  a userporfile

  removeUserBookmark(userid) {
    return this.http.post(
      environment.baseUrl + "/api/v2.0/user/removebookmark/user",
      { userId: userid }
    );
  }

  //get all bookmarks
  
  getBookmarks() {
    return this.http.get(environment.baseUrl + "/api/v2.0/user/bookmark");
  }

  
  updateLanguage(lang) {
    return this.http.post(
      environment.baseUrl + "/api/v2.0/user/updatelanguage",
      { language: lang, from: "web" }
    );
  }

  getPhoneData() {
    return this.http.post(environment.baseUrl + "/api/v2.0/user/getphonedata", {
      currentAppVersioin: "0.3.9",
      phoneModel: this.browserName,
      phone_resolution: this.screenWidth + "X" + this.screenHeight,
      android_version: this.browserNumber,
      os_flavour: "web",
    });
  }

  //This method is used to make any data encrypt by using th key
  encryptSecretKey = "ososmobile";
  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        this.encryptSecretKey
      ).toString();
    } catch (e) {
      console.log(e);
    }
  }
//this method to decrpyt the data with sam key
  decryptData(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }
}
