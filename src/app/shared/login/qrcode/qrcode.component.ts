import { Component, ViewChild, ElementRef, Renderer2, OnInit, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
// import { ChatService } from 'src/app/service/chat.service';

import QrCodeWithLogo from 'node_modules/qrcode-with-logos/dist/qrcode-with-logos.es5.js'

// import { ActiveusersService } from 'src/app/feature3/services/activeusers.service';
// import { ShareService } from '../../service/share.service'

import { Meta, Title } from '@angular/platform-browser';
// import { AppService } from 'src/app/service/app.service';
// import { LoginValidationService } from '../services/login-validation.service';
// import { MetaTagService } from 'src/app/meta-tag.service';
import { Subscription } from 'rxjs';
import { SpaarksService } from 'src/app/spaarks.service';
import { AllpurposeserviceService } from 'src/app/allpurposeservice.service';


// import { ModalService } from 'src/app/service/modal.service';
// import { AppMainService } from 'src/app/app-main.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})

export class QrcodeComponent implements OnInit, OnDestroy {

  ipAddress;
  dataS;
  finString;
  jsonObj = { ip: '', os: '', browser: '' };
  dataString = 'Osos private limited';
  intervalVar;
  showQr = true;
  unqId = null;
  data;
  stillCall = true;
  clickTimes = 0;
  gotJsonip = false;
  @ViewChild('qrr') qrr: ElementRef;
  @ViewChild('imgg') imgg: ElementRef;
  @ViewChild('mainqrtext') maintexxtqr: ElementRef;
  inShare: boolean;
  showInfo: boolean;
  mobileModal = true;
  maintainenceMsg;
  public innerWidth: any;
  public innerHeight: any;

  // private chat: ChatService,private share: ShareService, private activeusersService: ActiveusersService, private loginService: LoginValidationService, private appservice: AppService, private metsService: MetaTagService,private shareservice: ShareService,private modalService: ModalService,,
      // private appMainService:AppMainService

  constructor(private http: HttpClient, private router: Router,
    private renderer: Renderer2, 
    private spaarksservice:SpaarksService ,
     private title: Title, private meta: Meta,
    private changeDetectorRef: ChangeDetectorRef,private allpurposeService:AllpurposeserviceService) {



    this.meta.addTag({ name: 'Spaarks', content: 'Spaarks Content' })

    // this.activeusersService.checkLoginCookie().subscribe((data: any) => {
    //   // alert(data.message);
    //   console.log('try1')
    //   console.log(data);
    //   if (data.status == true) {
    //     // alert('lllll0000000');
    //     this.router.navigate(['/welcome']);
    //   } else  {
    
    //   }
    //   if (data.status == undefined) { return }
    // },(err)=>{

    // })

    setTimeout(()=>{
      this.threesecondsOrNot=true;
      if(this.gotJsonip==false){
        this.callWithoutIp();
      }
    
    },3000)

    this.http.get<{ ip: string }>('https://jsonip.com')
      .subscribe(data => {
        this.gotJsonip = true;
        if(this.threesecondsOrNot==true){
          return;
        }
        //console.log('th data', data);
        this.ipAddress = data.ip;
        //alert(data.ip);
        let vendorStr = navigator.vendor;
        let finVendor = vendorStr.substr(0, vendorStr.indexOf(' '));

        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
          finVendor = "Mozilla Firefox"
        }
        this.dataS = data.ip;
        this.jsonObj.ip = this.dataS;
        this.jsonObj.os = navigator.platform;
        this.jsonObj.browser = finVendor;

        // this.intervalVar = setInterval(()=>{
        //     this.http.post(environment.qrcodeUrl,this.jsonObj).subscribe((succ)=>{

        //     })
        // },2000)

        this.http.post(environment.qrcodeUrl, this.jsonObj, { withCredentials: true }).subscribe((succ: any) => {
          //console.log(succ);
          if(succ.message){
            if(succ.message.toLowerCase().includes('maintenance')){
              this.maintainenceMsg = succ.message;
              console.log('maintainanceeee on');
              this.loading=true;
              this.undermaintenance=true;
              console.log(this.maintexxtqr);
              this.renderer.setProperty(this.maintexxtqr.nativeElement,'innerHTML',succ.message)
              return
            }
          }

          if (succ.uniqueId) {
            this.unqId = succ.uniqueId;
            //////////////////
            let qrcode = new QrCodeWithLogo({
              canvas: document.getElementById("canvas"),
              content: this.unqId,
              width: 300,
              //   download: true,
              image: document.getElementById("image"),
              logo: {
                src: "../../../assets/default.svg"
              }
            });
            qrcode.toCanvas().then(() => {
            });
            /////////////////
            this.initializeQrcode();
            //this.clearIntervalInit();
          }
          
        })
        this.dataString = this.dataS + '~' + navigator.appCodeName + '~' + Date.now() + '~' + navigator.platform;
        this.finString = this.dataString;
        //console.log(navigator);
      })
  }
callWithoutIp(){
if(this.threesecondsOrNot==true){
  this.ipAddress = '';
  //alert(data.ip);
  let vendorStr = navigator.vendor;
  let finVendor = vendorStr.substr(0, vendorStr.indexOf(' '));

  if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    finVendor = "Mozilla Firefox"
  }
  this.dataS = '';
  this.jsonObj.ip = this.dataS;
  this.jsonObj.os = navigator.platform;
  this.jsonObj.browser = finVendor;

  // this.intervalVar = setInterval(()=>{
  //     this.http.post(environment.qrcodeUrl,this.jsonObj).subscribe((succ)=>{

  //     })
  // },2000)

  this.http.post(environment.qrcodeUrl, this.jsonObj,{withCredentials:true}).subscribe((succ: any) => {
    //console.log(succ);
    if (succ.uniqueId) {
      this.unqId = succ.uniqueId;
      //////////////////
      let qrcode = new QrCodeWithLogo({
        canvas: document.getElementById("canvas"),
        content: this.unqId,
        
        width: 300,
        //   download: true,
        image: document.getElementById("image"),
        logo: {
          src: "assets/default.svg"
        }
      });
      qrcode.toCanvas().then(() => {
      });
      /////////////////
      this.initializeQrcode();
      //this.clearIntervalInit();
    }
  })
  this.dataString = this.dataS + '~' + navigator.appCodeName + '~' + Date.now() + '~' + navigator.platform;
  this.finString = this.dataString;
}
}
callWithIp(){

}
threesecondsOrNot=false;
  shareState;
  condition;
  showExpired = false;
  featureVector;
  dataForpost;
  shareId;
  undermaintenance=false;
  language = 'en';
  selectedLangSubjsubscription: Subscription;
  @ViewChild('featurespart') gofeaturepart: ElementRef;


  ngOnInit() {

    // this.appMainService.allPurpSubj.subscribe((succe:any)=>{
    //   console.log(succe)
    //   if(succe.scroll){
    //     if(succe.scroll=='true'){

    //       window.scrollTo(0,400)
    //     }else{
    //       window.scrollTo(0,0)
    //     }
    //   }
    // })


    

    // this.selectedLangSubjsubscription = this.loginService.selectedLangSubj.subscribe((data:any) => {
    //   //alert(this.language)
    //    console.log(data)  
    //   //  user/sendfcm    post
    //   if (data == 'Open') {
    //     window.scrollTo(0, this.gofeaturepart.nativeElement.offsetHeight);
    //   }else{
    //     this.language=data;
    //     console.log(this.language);
    //   }
    // })

    try{
      if(localStorage.getItem('loginLang')){
        this.language = localStorage.getItem('loginLang')
      }
    }catch{}
        

    // this.selectedLangSubjsubscription = this.loginService.selectedLangSubj.subscribe((success: any) => {
    //   //alert(success);
    //   this.language = success;
    // });
    // this.appservice.gettUserCredentials();
    this.innerWidth = window.innerWidth;


    var vv = this.router.events.subscribe((x: any) => {
      console.log(document.URL)
    try{
      //console.log(x.snapshot.url[0])
    }catch{
      console.log('fail')
    }
    });

    console.log(this.router.url)
    console.log(document.URL)
    var url = document.URL;
    var segments = url.split('/');
    // console.log(segments);

    // if (segments[4] == "share") {
    //   this.inShare = true;
    // }
    // console.log(segments[2])
    // if (segments[4] == null) {
    //   return;
    // }
    // alert(AppMainService.shareId)


    // if (AppMainService.shareId == '') { return }
    // else {
      
    //   this.shareId = AppMainService.shareId;
    //   this.http.get(environment.baseUrl + 'share/' + this.shareId, { withCredentials: true }).subscribe((x) => {
    //     // alert('iiiiiiiiiiiiiiiiiiiiiiiiiii')
    //     this.router.navigate(['share/' + this.shareId]);
    //     this.inShare = true;
    //     console.log(x);
    //     this.dataForpost = x;
    //     this.showInfo = true;

    //     this.shareState = x['featureName'];
    //     // console.log(this.shareState);


    //     this.condition = x['condition'];
    //     // console.log(this.condition);
    //     if (this.condition == 'Expired') {
    //       this.showExpired = true;
    //     }

    //     /////////////
    //     this.share.sharedPost.next(x)
    //     this.activeusersService.postDataForNewInfo = x;
    //     this.dataForpost = x;
    //     this.showInfo = true;

    //     this.changeDetectorRef.detectChanges();

    //     // console.log('##########################');

    //     // console.log(this.dataForpost);

    //     this.title.setTitle('Spaarks Share Page');
    //     this.meta.updateTag({ name: this.dataForpost['uservisibility']['name'], content: this.dataForpost['content'] });

    //     // this.meta.addTags([
    //     //   { name: 'twitter:card', content: 'summary' },
    //     //   { name: 'og:url', content: '/about' },
    //     //   { name: 'og:title', content: this.data.name },
    //     //   { name: 'og:description', content: this.data.bio },
    //     //   { name: 'og:image', content: this.data.image }
    //     // ]);



    //     // this.share.shareLoginSubj.subscribe(x => {
    //     //   this.inLoginShareModal = true;
    //     // })

    //     /////////////

    //   }, (err) => {
    //     // alert('hhjj')
    //     // this.appMainService..somethingWentWrong(err.message);
    //     // console.log(err)
    //     this.activeusersService.somethingWentWrong();

    //   })
    // }
    // this.modalService.marketModalSubj.next(null);

  }

closeBanner = true;

closeBan(){
this.closeBanner = false;
}



  ngOnDestroy() {
    this.stillCall=false;
    clearInterval(this.intervalVar);
    try{

      if(this.selectedLangSubjsubscription){
        this.selectedLangSubjsubscription.unsubscribe();
      }
    }catch{}
  }

  loading = true;
  initializeQrcode() {
    this.loading = false;
    this.showQr = true;
    this.intervalVar = setInterval(() => {
      if (this.stillCall == true) {




        this.http.get(environment.checkStatus + '/' + this.unqId, { withCredentials: true }).subscribe((succ: any) => {
          // load apptour first time
          // if (succ) {
          //   this.shareservice.logindata(succ['startWebTour']);
          //   this.appMainService.appTour = succ['startWebTour']
          // }
          // console.log(succ['startWebTour']);
          this.spaarksservice.setDetailsToLocalStorage(succ,'initial')
          //console.log(succ);
          this.data = succ;
          // req.headers.authorization.split(' ')

          console.log(succ);

          let chatcntt = 0;
          clearInterval(this.intervalVar);
          clearInterval(this.intervalVar);
          this.stillCall = false;

          console.log(this.data)
          localStorage.setItem('iJAIa', environment.ijaiaahut);
         
          this.spaarksservice.setDetailsToLocalStorage(succ);
          let loginDat = {id:this.data.id,jid:this.data.jid_main,jidAno:this.data.jid_anonymous,cp:succ.chatpassword}
          // this.activeusersService.loginDat = loginDat;
   
   
  //  }catch{}
  //         localStorage.setItem("tempData","no Value Present");
          // localStorage.setItem("jid", this.data.jid_main);
          // localStorage.setItem("jidAno", this.data.jid_anonymous);
          // //localStorage.setItem("loginToken", this.data.token);
          // localStorage.setItem('chatcntt', JSON.stringify(chatcntt))
          // // alert('login token '+ data.token);
          // localStorage.setItem("id", this.data.id);
          // localStorage.setItem("username", this.data.username);
          // localStorage.setItem("name", this.data.name);

          // this.activeusersService.somethingWentWrong('Please Wait...');

          // if(this.data.webLanguage){

          //   localStorage.setItem("language",this.data.webLanguage);
          // }
          // if (this.data.profilePic != '') {
          //   localStorage.setItem("ProfilePic", this.data.profilePic);
          // }
          // else {
          //   localStorage.setItem("ProfilePic", '../../../assets/userprofile.svg');
          // }
          // localStorage.setItem("gender", this.data.gender);

          //console.log(this.data)
           
          //
          
          // this.activeusersService.tempDetails(succ.chatpassword,"sp_j_cp");
          // this.activeusersService.setEncrDetails(loginDat);
          // this.activeusersService.toDecrypt("details");
      
          //console.log(this.data.chatpassword);
          //  this.chat.tempDetails(this.data.chatpassword,"sp_j_cp");
          //  this.chat.setEncrDetails(loginDat);
          // this.chat.toDecrypt("details");

          // setTimeout(()=>{
          //   this.chat.connect_xmpp('');

          //   // this.router.navigate(["/welcome"]);
          // },4000)
          
        })


      }
      else {
        //return
      }
    }, 2000);
    this.clearIntervalInit();

  }

  reload() {

    //    alert('clicked')
    //    alert(this.clickTimes)
    this.clickTimes = this.clickTimes + 1;
    this.stillCall = true;
    //console.log('clicked qr');
    if (this.clickTimes < 4) {
      this.initializeQrcode();

    } else {
     // alert('You are clicking too many times');
      this.allpurposeService.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "You are clicking too many times",
       
      });
      // this.activeusersService.alertModalSub.next('You are clicking too many times');

    }

  }

  closeModal() {
    if (this.innerWidth >= 1024) {
      this.showInfo = false; this.inShare = false
    } else {

      // this.share.inShareSub.next(false);
      // this.router.navigateByUrl('/');
      // this.share.inShareSub.next(false)
    }

    // this.share.inShareSub.next(false)
  }


  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.innerWidth = window.innerWidth;
  //   this.innerHeight = window.innerHeight;
  // }

  clearIntervalInit() {
    setTimeout(() => {
      clearInterval(this.intervalVar);
      let imgElem = '<img src="../../assets/qrreload.png" #imgg class="qrreload" >';
      // let img = this.renderer.createElement('img');
      // this.renderer.setAttribute(img,'src','../../../assets/qrreload.png');
      // this.renderer.setAttribute(img,'class','qrImg');
      // this.renderer.listen(img.nativeElement, 'click', (event) => {
      //   this.initializeQrcode();
      // })

      this.showQr = false;
      setTimeout(()=>{
        this.stillCall = false;
      },2000)

      // this.renderer.setProperty(this.qrr.nativeElement,'innerHTML',img);
    }, 19000)


  }


}