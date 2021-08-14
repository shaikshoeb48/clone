

import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Router, ActivatedRoute } from '@angular/router';
// import { Feature3 } from '../feature.modal';

import { MatSnackBar } from '@angular/material/snack-bar';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class ActiveusersService {


  constructor(private http: HttpClient, private router: Router, public _zone: MatSnackBar, private _zoneone: NgZone,

    ) {
      this.languageCheck = localStorage.getItem('language');
    let gunn = document.URL;
    if (gunn.includes('localhost') || gunn.includes('192.168.0.254')) {
      let env = JSON.stringify(environment);
      let envReplaced = JSON.stringify(environment).split('https://api.spaarksweb.com').join('http://192.168.0.254:3010');
      console.log(envReplaced)
      //environment = JSON.parse(envReplaced)
      console.log(environment)
      //environment = envReplaced;
    }
 
 
      // this.toDecrypt("details")
      //alert("im i running on every reload");   
    

    this.routeControllerSubj.subscribe((succ: string) => {
      this.routeController = succ;
      console.log('route controller', succ);
    })

    this.postIdSubj.subscribe((succ: string) => {
      this.postId = succ;
    })

    this.commentIdSubj.subscribe((succ: string) => {
      this.commentId = succ;
    })

    this.postsArrSubj.subscribe((succ: []) => {
      this.postsArr = succ;
    });

    this.subpostIdSubj.subscribe((succ: string) => {
      this.subpostId = succ;
    });

    this.stateSubj.subscribe((succ) => {
      this.serviceState = succ;

      //already calling getSlider on route params change, see and remove this
      // this.getSlider()

      // console.log('ooooooooooooooooooooooooooooooooooooooooooooooooooo');
      // if ((this.originalLocation[0] == undefined || this.originalLocation[0] == null) || (this.originalLocation[1] == undefined || this.originalLocation[1] == null)) {

      // } else {
      //   this.getUsers(this.originalLocation[0], this.originalLocation[1]);
      // }

      //this.getUsersSub(this.location[0],this.location[1]);
      //sdfsdf 
      // this.closeInfoModal.next({ val: 'open' });

    })

    // this.checkLoginCookie().subscribe((succ) => {
      
    //   this.toDecrypt("details");
    //   // alert("im running");
    //   try {
    //     var b = document.getElementsByTagName('body');
    //     if (b[0].classList.value.includes('overfloww')) {
    //       // alert('Class found');
    //       b[0].classList.remove('overfloww');
    //       // alert('Removed');
    //     }
    //   } catch { }

    // });
    this.cookiePass = "osos123";

   
  }

  tourbool = false;
  toursub = new BehaviorSubject(false);
  packagesArray = [];
  canAddPackages: boolean;
  radiusPost;

  encryptedData;
  cookieId;
  cookieJid;
  cookieJidAno;
  sp_j_cp;
  private users: any;
  private editInfoUpdated = new Subject<any>();
  private usersUpdated = new Subject<any>();
  private info: any;
  infoUpdated = new Subject<any>();
  multipurposeSubject = new Subject();
  private data: any = {}
  private dataId = []

  alertModalSub = new Subject();

  category = 'all';
  subCategory = '';

  dynamicGetLink;
  dynamicGetLink1;
  packages;
  marketDataSuccess: any = null;

  hideOnBlock: boolean = false;

  closeInfoModal = new Subject<any>();


  packageSub = new Subject<any>();
  radiusSub = new Subject<any>();

  currentUserPostId;
  isRepost = false;
  currentUserPost;

  currentDistance;

  originalLocation = [];
  sellerOrBuyer = 'seller';

  locationSubj = new Subject();

  //subject and variable for routerController
  routeControllerSubj = new Subject();
  routeController = 'no';

  //subject and variable for postId
  postIdSubj = new Subject();
  postId = '';

  //subject and variable for subpostId(for comments)
  commentIdSubj = new Subject();
  commentId = '';

  //posts subject and posts array
  postsArrSubj = new Subject();
  postsArr = [];

  //subpostid subj and variable
  subpostIdSubj = new Subject();
  subpostId = '';

  //subpost and comment subj and variable
  subpostAndCommentsSubj = new Subject();
  subpostAndComments;

  //userlocation subject and variable
  userlocationSubj = new Subject();
  userlocationVar;

  //navToggle subj
  navToggleSubj = new Subject();

  //stateSuject and variable
  stateSubj = new Subject();

  // SliderS Subject
  sliderSubj = new Subject<any>();

  slider: [];
  postDataForNewInfo: any;

  // shareId = '';

  distanceSubject = new Subject();

  //wholeMarketData
  wholeMarketDataSubj = new Subject();
  wholeMarketData;

  postIdFromWelcome = '';

  chatRequestFromWelcome = ''
  notificationFromWelcomeSub = new BehaviorSubject<any>('')
  subNavFromFeature3Sub = new BehaviorSubject<any>('')
  activateContentFromFeature3Sub = new BehaviorSubject<any>('')
  helpNotificationSub = new BehaviorSubject<any>('')

  allPurposeSub = new Subject<any>();

  canRepostSubj = new BehaviorSubject<any>('');

  overlayreference;


  showGreetNotification=new Subject();

  // oopentour(){
  //   this.toursub.next(true)
  // }
  //packages data

  subscribersSubject = new Subject();
  getSubsData() {

    return this.http.get<any>(environment.baseUrl + 'user/getsubscription', { withCredentials: true });
  }
  packagedata() {
    if (this.serviceState == null) {
      return;
    }

    return this.http.get<any>(environment.baseUrl + 'user/myPackages/' + this.serviceState, { withCredentials: true });
  }


  getLocationName(lon, lat) {



    return this.http.post(environment.mapsUrl + "getName", {
      lat: lat,
      lon: lon
    }, { withCredentials: true });
  }

  onConnect(postId) {

    //console.log(lon,lat)
    return this.http.post(environment.baseUrl + 'user/greetRequest/' + postId, { description: 'Make a Connection' }, { withCredentials: true });
  }

  getNextUser(id) {

    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i]._id === id) {
        if (i == this.users.length - 1) {
          return this.users[0]._id
        }
        return this.users[i + 1]._id

      }
    }
  }
  cookieMsg;
  isLoggedIn: boolean;

  checkLoginCookie() {
    // alert('inside checklogin')
    return this.http.get<any>(environment.baseUrl + 'user/checkcookie', { withCredentials: true });
  }

  decryptedData;
  cookiePass= "osos123";
  userDetails;
loginDat={};
  // This Function Decrypts id,jid,JidAno from encrypted cookie.
  toDecrypt(key?) {
try{

  // if (key == "details") {

  //   this.cookiePass = "osos123"; // This Password Should Be Match With Backend 
  //   if (key.trim() === "" || this.cookiePass.trim() === "") {
  //     console.log("please Fill proper details");
  //     return;
  //   }
  //   //console.log(key);
  //   var data = localStorage.getItem("sp_jlaoi");
  //   this.decryptedData = CryptoJS.AES.decrypt(data.trim(), this.cookiePass.trim()).toString(CryptoJS.enc.Utf8);

  //   console.log("Decrypt Function");
  //   this.userDetails = JSON.parse(this.decryptedData);
  //   console.log(this.userDetails);


  //   // this.sp_j_id=this.userDetails[0].userid;
  //   // this.sp_j_jd=this.userDetails[1].user_jid;
  //   // this.sp_j_Jda=this.userDetails[2].user_jid_anonymous;

  //   this.cookieId = this.userDetails.id;
  //   this.cookieJid = this.userDetails.jid;
  //   this.cookieJidAno = this.userDetails.jidAno;
  //   this.sp_j_cp = this.userDetails.cp;

  //   // console.log(this.sp_j_id);
  //   // console.log(this.sp_j_jd);
  //   // console.log(this.sp_j_Jda);
  //   this.tempDetails(this.userDetails);
  //   //this.setDecryptedValues();
  //   // if (localStorage.getItem("sp_j_cp")) {
  //   //   this.decryptedData = localStorage.getItem("sp_j_cp");
  //   //   this.sp_j_cp = CryptoJS.AES.decrypt(this.decryptedData.trim(), this.cookiePass.trim()).toString(CryptoJS.enc.Utf8);
  //   // }

  // }else{
  //   var data = localStorage.getItem("sp_jlaoi");
  //   this.decryptedData = CryptoJS.AES.decrypt(data.trim(), this.cookiePass.trim()).toString(CryptoJS.enc.Utf8);

  //   console.log("Decrypt Function");
  //   this.userDetails = JSON.parse(this.decryptedData);
  //   console.log(this.userDetails);
  //   this.setEncrDetails(this.userDetails);


  //   // this.sp_j_id=this.userDetails[0].userid;
  //   // this.sp_j_jd=this.userDetails[1].user_jid;
  //   // this.sp_j_Jda=this.userDetails[2].user_jid_anonymous;

  //   this.cookieId = this.userDetails.id;
  //   this.cookieJid = this.userDetails.jid;
  //   this.cookieJidAno = this.userDetails.jidAno;
  //   this.sp_j_cp = this.userDetails.cp;

  //   switch (key) {

  //     case 'id':
  
  //       console.log('id is Called');
  //       // this.cookieId = this.cookieId;
  //       console.log(this.cookieId);
  //       return this.cookieId;
  
  //     case 'jid':
  //       //key='jid';
  //       console.log('Jid is called');
  //       // this.cookieJid = this.userDetails[1].user_jid;
  //       console.log(this.cookieJid);
  //       return this.cookieJid;
  
  //     case 'jidAno':
  
  //       console.log('jidAno is Called');
  //       // this.cookieJidAno = this.userDetails[2].user_jid_anonymous;
  //       console.log(this.cookieJidAno);
  //       return this.cookieJidAno;
  
  //   }
  // }

  

}catch{console.log('failed todecrypt')}
    return this.userDetails;
  }
  // end of Fucntion
  encryptedlogindata;
  setEncrDetails(dat){
    console.log(dat);

  console.log('first')
  this.cookieId = dat.id ;
  this.cookieJid = dat.jid;
  this.cookieJidAno = dat.jidAno;
  this.sp_j_cp = dat.cp;
  console.log('first')
  this.encryptedlogindata = CryptoJS.AES.encrypt(JSON.stringify(dat),this.cookiePass).toString();
  console.log('first')
  let encrid = CryptoJS.AES.encrypt(dat.id,this.cookiePass).toString();
  console.log('first')
  if(localStorage.getItem('sp_j_id')===null){
    console.log('nope')
    localStorage.setItem("sp_j_id",encrid);
  }else{
   console.log('llll')
  }
  let cpp= CryptoJS.AES.encrypt(dat.cp, this.cookiePass).toString();
  if(localStorage.getItem('sp_j_cp')){}else{
    localStorage.setItem("sp_j_cp",cpp);
  }
  localStorage.setItem("sp_j_cp",cpp);
  let encrjid = CryptoJS.AES.encrypt(dat.jid,this.cookiePass).toString();
  if(localStorage.getItem('sp_j_jd')){}else{
    localStorage.setItem("sp_j_jd",encrjid);
  }
  
  let encrjidAno = CryptoJS.AES.encrypt(dat.jidAno,this.cookiePass).toString();
  if(localStorage.getItem('sp_j_Jda')){}else{
    localStorage.setItem("sp_j_Jda",encrjidAno);
  }
  
  let encralllogin = CryptoJS.AES.encrypt(JSON.stringify(dat),this.cookiePass).toString();
  if(localStorage.getItem('sp_jlaoi')){}else{
    localStorage.setItem("sp_jlaoi",encralllogin);
  }
  }
  // Temp Details will Encrypt and Store the data into local Storage
  tempDetails(userDetails, key?) {

   try{
    this.cookiePass = "osos123";
    if (key == "sp_j_cp") {
      return;
      console.log(userDetails);
      
      this.encryptedData= CryptoJS.AES.encrypt(userDetails, this.cookiePass).toString();
      localStorage.setItem("sp_j_cp",this.encryptedData);
     
    }
    else{return;
  
      this.encryptedData= CryptoJS.AES.encrypt(userDetails[0].userid.trim(), this.cookiePass.trim()).toString();
      localStorage.setItem("sp_j_id",this.encryptedData);
    
      this.encryptedData= CryptoJS.AES.encrypt(userDetails[1].user_jid.trim(), this.cookiePass.trim()).toString();
      localStorage.setItem("sp_j_jd",this.encryptedData);
    
      this.encryptedData= CryptoJS.AES.encrypt(userDetails[2].user_jid_anonymous.trim(), this.cookiePass.trim()).toString();
      localStorage.setItem("sp_j_Jda",this.encryptedData);
    }
   }catch{}
  
  }


  deleteInfo(id) {
    this.data[id] = null
  }

  editInfo(i: any) {
    this.data[i._id] = i
  }

  refrehPosts = new Subject();
  getUsers(lat: any, lng: any, packageRadius?) {

    let funn = 0;
    if (packageRadius) {

      funn = packageRadius;
    }
    // console.log('-----||---- calling get users with coords' + lat + ',' + lng)

    this.location = [lat, lng];
    //  console.log( 'Bearer '+ this.token )
    // console.log("hi")
    //  let lati,long;
    //  navigator.geolocation.getCurrentPosition((p)=>{
    //   lati= p.coords.longitude.toString();
    //   long =  p.coords.latitude.toString();
    // })



    // if (this.serviceState == 'Unsafe') {
    //   this.dynamicGetLink = environment.feature3 + "post/static";
    // }
    // else if (this.serviceState == 'Ambulance') {
    //   this.dynamicGetLink = environment.ambulance + "post/static";
    // }
    // else if (this.serviceState == 'Greet') {
    //   this.dynamicGetLink = environment.greet + "post/static";
    // }
    // else if (this.serviceState == 'Playtime') {
    //   this.dynamicGetLink = environment.playtime + "post/static";
    // }
    // else if (this.serviceState == 'Deposit') {
    //   this.dynamicGetLink = environment.deposit + "post/static";
    // }
    // else if (this.serviceState == 'People') {
    //   this.dynamicGetLink = environment.people + "post/static";
    // }
    // else if (this.serviceState == 'Showtime') {
    //   this.dynamicGetLink = environment.showtime + "post/static"
    // }
    // else if (this.serviceState == 'Market') {
    //   this.dynamicGetLink = environment.market + "post/static"
    // }
    // else if (this.serviceState == undefined || this.serviceState == null) {
    //   return
    // }

    //  return;

    if (this.serviceState != 'Market') {
      this.http.post(this.dynamicGetLink, {  //make dynamic

        "latitude": lng, //this.location[1] change the value to this for dynamic behaviour
        "longitude": lat, //this.location[0] change the value to this for dynamic behaviour
        "radius": funn

      }, { withCredentials: true }
      )
        .subscribe((i: any) => {

          this.users = i
          console.log(this.users)
          this.radiusSub.next(this.users.radius);
          this.postsArr = i.post;


          this.getUpdateListener.next(this.users)


          this.packages = this.users.packages;
          // console.log('Sending Packages from subject');

          this.packagesArray = this.packages;
          // console.log('[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[');

          console.log(this.packages);
          var jaii = this.packages.sort(function (a, b) { return b['range'] - a['range'] });

          this.canAddPackages = this.users.canAddPackage;

          this.packageSub.next(jaii);
          // alert('radius')
          this.radiusPost = this.users.radius;

          // console.log('****************', this.users.radius);

        })
    }

    else if (this.serviceState == 'Market') {
      // console.log(this.subCategory);
      // console.log(this.category);
      if (this.category == undefined || this.category == null || this.category == '' || this.subCategory == undefined || this.subCategory == null || this.subCategory == '') {
        this.subCategory = '';
        this.category = 'all'
      }
      this.http.post(this.dynamicGetLink, {  //make dynamic

        "latitude": lng,
        "longitude": lat,
        "radius": funn,
        "category": this.category,
        "subCategory": this.subCategory

      }, { withCredentials: true }
      )
        .subscribe((i: any) => {
          // console.log(i);
          // console.log(typeof (this.location[0]));
          this.http.get(environment.baseUrl + 'package/getMarketfeatures', { withCredentials: true }).subscribe(
            (succ) => {
           
              // this.modalService.allInOneSub.next({Category:succ});
              // console.log(succ);
            }, (err) => { this.somethingWentWrong(); }
          );
          this.marketDataSuccess = { backend: i, category: this.category, subCategory: this.subCategory };
          this.users = i;
          this.postsArr = i.post;
          this.packages = this.users.packages;
          // console.log('Sending Packages from subject');

          this.packagesArray = this.packages;
          console.log(this.packages);
          console.log(this.users);
          this.canAddPackages = this.users.canAddPackage;

          this.packageSub.next(this.packages);
          // console.log('whole Market data', i);
          this.wholeMarketDataSubj.next({ backend: i, category: this.category, subCategory: this.subCategory });
          this.wholeMarketData = { backend: i, category: this.category, subCategory: this.subCategory };
          // console.log(i.post)
          
          this.getUpdateListener.next(this.users)
        })

      //for categories and subcategories list





      // if (localStorage.getItem('language') == 'en' || localStorage.getItem('language') != null) {
      //   this.http.get(environment.baseUrl + 'package/getmarketfeatureslan/' + localStorage.getItem('language'), httpOptions).subscribe(
      //     (succ) => {
      //       this.categoriesSubj.next(succ);
      //       console.log(succ);
      //     }
      //   );
      // }

      // this.http.get(environment.market + 'pendingRatings', { withCredentials: true }).subscribe((succ) => {
      //   // console.log(succ);
      //   this.modalService.ratingsData.next(succ);
      // })

      //for getting pending confirmations
      //this.http.get(environment.baseUrl)
    }

    // alert('getUsers');
  }

  getPackages() {
    return this.packageSub.asObservable();
  }

  getRadius() {
    return this.radiusSub.asObservable();
  }

  
  getRequestActivation(id){
    return this.http.get(environment.baseUrl + 'share/requestActivation/' + id);
  }

  postRequestActivation(body, id){
    console.log(body);
    return this.http.post(environment.baseUrl + 'share/requestActivation/'+ id,body);
  }

  
   
  
  getUpdateListener=new Subject()

  sendConnectionDetails(postId, userId) {

    // console.log('sent call to backend');
    this.http.get(environment.baseUrl + 'user/contactMe/' + postId + '/' + userId, { withCredentials: true }).subscribe((succ) => { console.log(succ); });
  }

  // Payment Slider 
  data1: [];


  getSlider() {
    // if(this.serviceState != 'Unsafe' && this.serviceState != 'Ambulance'){

    // }
    console.log('                                                      ');

    console.log('               ********************.......getSlider called................**********************');
    console.log('                                                      ');
    if (this.serviceState != null) {

      if (!this.serviceState) {
        return;
      }
      try{
        return this.http.get<any>(environment.baseUrl + 'package/getpackage/' + this.serviceState.toLowerCase(), { withCredentials: true })
      }catch{}
    }
  }
  uniqueRange(data) {
    // new set will remove dublicates of range 
    const b = [...new Set(data.message.map((o) => o.range))];
    return b;
  }

  uniqueDays(data) {
    const a = [...new Set(data.map((o) => o.day))];
    console.log(a.sort(function (a, b) {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    }));

    return a;
  }
  getCostFromDay(data, day: number) {
    const b = data.filter(function (a) {
      return a.day == day;
    });
    return b[0].cost;
  }

  getDaysFromRange(data2, r: number) {
    const b = data2.message.filter(function (a) {
      return a.range == r;
    })
    return b;
  }

  serviceState = null;


  getEditInfo(id) {
    if (this.data[id]) {

      this.editInfoUpdated.next(this.data[id])
    }
  }

  getActiveInfos() {


    let dynamicActiveInfos = '';
    if (!this.serviceState) { return; }
    // if (this.serviceState == 'Playtime') {
    //   dynamicActiveInfos = environment.playtime
    // }
    // else if (this.serviceState == 'Showtime') {
    //   dynamicActiveInfos = environment.showtime
    // }
    // else if (this.serviceState == 'Deposit') {
    //   dynamicActiveInfos = environment.deposit
    // }
    // else if (this.serviceState == 'Market') {
    //   dynamicActiveInfos = environment.market
    // }
    // else if (this.serviceState == 'Unsafe') {
    //   dynamicActiveInfos = environment.feature3
    // }
    // else if (this.serviceState == 'Ambulance') {
    //   dynamicActiveInfos = environment.ambulance
    // }
    // else if (this.serviceState == 'People') {
    //   dynamicActiveInfos = environment.people
    // }
    // else if (this.serviceState == 'Greet') {
    //   dynamicActiveInfos = environment.greet
    // }

    return this.http.get(dynamicActiveInfos + 'getActiveInfos', { withCredentials: true });
  }

  getEditUpdateListener() {
    return this.editInfoUpdated.asObservable();
  }

  getInfo(id, featureName) {
    //making the get link dynamic
    // console.log(id);

    // if (featureName == 'unsafe') {
    //   this.dynamicGetLink1 = environment.feature3 + "post/";
    // }
    // else if (featureName == 'ambulance') {
    //   this.dynamicGetLink1 = environment.ambulance + "post/";
    // }
    // else if (featureName == 'greet') {
    //   this.dynamicGetLink1 = environment.greet + "post/";
    // }
    // else if (featureName == 'playtime') {
    //   this.dynamicGetLink1 = environment.playtime + "post/";
    // }
    // else if (featureName == 'deposit') {
    //   this.dynamicGetLink1 = environment.deposit + "post/";
    // }
    // else if (featureName == 'people') {
    //   this.dynamicGetLink1 = environment.people + "post/";
    // }
    // else if (featureName == 'showtime') {
    //   this.dynamicGetLink1 = environment.showtime + "post/";
    // }
    // else if (featureName == 'market') {
    //   this.dynamicGetLink1 = environment.market + "post/";
    // }
    // else if (featureName == undefined || featureName == null) {
    //   return
    // }
    //dynamic making get link completed



    //alert('...'+id);
    //alert(this.dynamicGetLink+ id);
    this.http.get(this.dynamicGetLink1 + id, { withCredentials: true }
    )
      .subscribe((i: any) => {
        // console.log(i);

        if (i != null) {
          this.data[i._id] = i
          // this.dataId.push(i._id)
          this.info = i
          this.postDataForNewInfo = i;
          // return this.info
          this.infoUpdated.next(this.info)
        } else {
          this.router.navigate(["./feature3/start/"])
        }
      })


  }
  location = this.originalLocation;
  locationSucc;
  locationReceive = false;
  locationName = '';

  //get your current location
  getLocation() {



    this.http.get(environment.baseUrl + 'user/location', { withCredentials: true }).subscribe(
      (succ: any) => {
        this.locationSucc = succ;
        this.location = this.locationSucc.location.coordinates;
        this.originalLocation = this.locationSucc.location.coordinates;
        // console.log(succ);
        this.locationReceive = true;
        this.locationName = succ.locationName;
        this.locationSubj.next(succ);
      },
      (err) => {
        this.somethingWentWrong();
        // alert('if you are seeing this error, it is backend problem. go to sai kiran and scream "turn on the serverr"');
        this.locationReceive = false;
      }
    );
  }

  languageCheck = localStorage.getItem('language');
  textMsg ="";
  somethingWentWrong(arg?) {
    //alert(',,')
    this.languageCheck = localStorage.getItem('language');
    alert(this.languageCheck)
    this.textMsg = arg;
    // if (this.languageCheck == 'hi') {
    //   this.textMsg = this.hindi.langs[arg]
    // } else if(this.languageCheck=="te"){
    //   this.textMsg = this.telgu.langs[arg]
    // }
    console.log(this.textMsg,"msg After lang Conversion");
    if(this.textMsg == undefined)
    {
        this.textMsg = arg;
    }
    console.log(this.textMsg);

    
      this._zoneone.run(
        (submitMessege) => {
          this._zone.open(this.textMsg ? this.textMsg : 'Something went wrong', 'Ok', {
            duration: 2000
          });
          //console.log(succ);
        }
      );
    
  }
  
textAlertMsg="";
confirmStatus;

translateText(data){
  let langg = localStorage.getItem('language');
  if(!langg||langg==''){
    return data;
  }
  if(localStorage.getItem('language')){
    
      if(langg=='te'){
        let ddd = ''
        if(!ddd||ddd==''){
          return data;
        }else{
          return ddd;
        }
      }

      if(langg=='en'){
          return data;
      }
      if(langg=='hi'){
        let hid = ''
        if(!hid||hid==''){
          return data;
        }else{
          return hid;
        }
      }
    
  }
}

doConfirm(arg){
  this.languageCheck = localStorage.getItem('language');
  console.log(arg);
  try{

    this.languageCheck = localStorage.getItem('language')
  }catch{
    this.languageCheck='en';
  }
  this.textAlertMsg = arg;
  if (this.languageCheck == 'hi') {
    // this.textAlertMsg = this.hindi.langs[arg]
  } else if(this.languageCheck=="te"){
    // this.textAlertMsg = this.telgu.langs[arg]
  }
  console.log("After Language Change");
  console.log(this.textAlertMsg);
  if(this.textAlertMsg == undefined)
  {
      this.textAlertMsg = arg;
  }
  console.log(this.textAlertMsg);

  if(arg!=undefined)
    {
  this.confirmStatus = confirm(this.textAlertMsg);
  return this.confirmStatus;
    }
  

}

  openTourModal() {

    this.onBoardingScreens.next({ onBoarding: true })
  }


  getInfoUpdateListener() {
    return this.infoUpdated.asObservable();
  }

  checkIsPostExists(featureName, postId) {


    // console.log('sent call to backend');
    return this.http.get(`${environment.baseUrl}${featureName}/post/${postId}`, { withCredentials: true })

  }

  onBoardingScreens = new Subject();
}

    //        ==============old code==============

  // sendPosts(content : string , photos : any){

  //   var form = new FormData()
  //   form.append("postId",'5e4e5552686a07f09ed64447')
  //   form.append("userId",'5e414b9400242e00173f83c2')
  //   form.append("content", 'hi')
  //   console.log(form)
  //   // photos.forEach(photo => {
  //   //   form.append('photo',photo)
  //   // });
  //   this.http.post('https://osos-testing.herokuapp.com/api/post/subpost/',form,httpOptions ).subscribe(i=>{
  //     this.posts.push(i)
  //     this.postsUpdated.next([...this.posts])
  //     // console.log(i)
  //   })
  // }

  //get users not market subscription success code old

          // if(this.serviceState == 'Greet'){
        //   this.usersUpdated.next([...this.users.post])
        //   this.packages = this.users.packages;
        //   this.packageSub.next(this.packages)
        // }else{
        //   this.usersUpdated.next([...this.users])
        // }


        // if(this.serviceState != 'Unsafe' && this.serviceState != 'Ambulance')

        // this.usersUpdated.next([...this.users])
        // this.packages = this.users.packages;
        // this.packageSub.next(this.packages)



  //never used
  // getUsersSub(lat, lng) {
  //   alert('usersSub');

  //   this.http.post(this.dynamicGetLink, {
  //     "latitude": this.location[0],
  //     "longitude": this.location[1],
  //     "radius": 500
  //   }, httpOptions
  //   )
  //     .subscribe((i:any) => {
  //       this.users = i
  //       this.usersUpdated.next([...this.users])
  //       this.postsArr = i;  //update here
  //     })
  //   setInterval(e => {
  //     if(this.serviceState!='Market'){
  //       this.http.post(this.dynamicGetLink, {
  //         "latitude": 17.407332,
  //         "longitude": 78.444923,
  //         "radius": 2000
  //       }, httpOptions
  //       )
  //         .subscribe(i => {
  //           this.users = i
  //           this.usersUpdated.next([...this.users]) // update for interval
  //         })
  //     }


  //       if(this.serviceState=='Market'){
  //         this.http.post(this.dynamicGetLink, {  //make dynamic

  //           "latitude": 17.407332, //this.location[1] change the value to this for dynamic behaviour
  //           "longitude": 78.444923, //this.location[0] change the value to this for dynamic behaviour
  //           "radius": 500,
  //           "category": this.category,
  //           "subCategory": this.subCategory

  //         }, httpOptions
  //         )
  //           .subscribe((i:any) => {
  //             this.users = i.post
  //              console.log(i.post)
  //             this.usersUpdated.next([this.users])
  //           })
  //       }
  //   }, 100000);
  //   //alert('getUsersSub');
  // }