import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SpaarksService } from "../../spaarks.service";
import { listenToTriggersV2 } from "ngx-bootstrap/utils/triggers";
import { environment } from "src/environments/environment";
import { AllpurposeserviceService } from "../../allpurposeservice.service";
import { Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  constructor(
    private spaarksService: SpaarksService,
    private http: HttpClient,
    private allpurposeService: AllpurposeserviceService
  ) {}
  showLogin = true;
  showOtp = true;
  isOtpClosed = false;
  loading = false;
  showLoginModal = true;
  step = "step1";
  resendTimer;

  otpSubs: Subscription;
  otpStatus = "none";
  mobileNumber: string = "";

  checkOtp = false;

  @ViewChild("otp") otp: ElementRef;
  gotJsonip = false;
  ipAddress;
  jsonObj = { ip: "", os: "", browser: "" };
  namevalue = "";
  gendervalue = "";
  statusSubmission = "loading";
  userName = "";
  doesItHaveLetter = false;

  checkval = false;
  firstval = true;

  canResend = false;

  ngOnInit(): void {
    this.showLoginModal = true;
    // alert("do");

    try {
    } catch {
      (err) => {
        this.spaarksService.catchInternalErrs(err);
      };
    }
    this.isOtpClosed = false;
    this.spaarksService.reqErrorSubj.subscribe((a) => {
      console.log(a);
      if (a.message == "please enter correct phone number") {
        console.log(a);
        //this.showOtp = true;
        this.mobileNumber = "";
        this.spaarksService.loginProcess.phone = "";
        this.step = "step2";
        this.showLogin = true;
        this.spaarksService.somethingWentWrong(
          "You have Entered Invalid Number"
        );
      }
      if (a.message == "OTP Mismatch") {
        if (this.isOtpClosed) {
          this.showOtp = true;
          return;
        }
        console.log(a);
        this.showOtp = true;
        this.showLogin = false;
        this.step = "step3";
        this.spaarksService.somethingWentWrong("You have Entered Wrong OTP");
      }
    });
  }

  startResendProcess() {
    if (this.resendTimer) {
      clearTimeout(this.resendTimer);
      this.resendTimer = setTimeout(() => {
        this.canResend = true;
      }, 30000);
    } else {
      try {
        clearTimeout(this.resendTimer);
      } catch {}
      this.resendTimer = setTimeout(() => {
        this.canResend = true;
      }, 30000);
    }
  }

  closeModal() {
    console.log("loginnnnnnnnnnnnnnnnnnnnnnn");
    this.allpurposeService.triggerModal.next({ type: "login", modal: false });
    this.showLoginModal = false;
    this.spaarksService.showLoginScreen.next(false);
  }

  goToOtpScreen() {
    console.log(this.mobileNumber[0]);
    this.isOtpClosed = false;
    this.startResendProcess();

    console.log(this.mobileNumber);
    if (this.mobileNumber[0] == "0") {
      this.allpurposeService.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "Please fill valid mobile number",
      });
      return;
    }
    if (!this.mobileNumber) {
      this.allpurposeService.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "Please fill valid mobile number",
      });
      //this.spaarksService.showAlert('Please fill valid mobile number');

      return;
    } else if (this.mobileNumber.length < 10 || this.mobileNumber.length > 11) {
      this.allpurposeService.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "Please fill valid mobile number",
      });
      //this.spaarksService.showAlert('Please fill valid mobile number');

      return;
    } else if (this.mobileNumber) {
      if (Number.isInteger(Number(this.mobileNumber)) == false) {
        this.allpurposeService.triggerModal.next({
          type: "alertModal",
          modal: true,
          modalMsg: "Please fill valid mobile number",
        });
        // this.spaarksService.showAlert('Please fill valid mobile number');
        return;
      } else {
        this.loading = true;
        this.showLogin = false;
        this.spaarksService.loginProcess.phone = this.mobileNumber;
        this.endLoginModal("loading");
        this.isOtpClosed = false;
        setTimeout(() => {
          this.spaarksService
            .sendMobileNumberLogin({ phone: "+91" + this.mobileNumber })
            .subscribe(
              (suc: any) => {
                this.loading = false;
                console.log(suc);
                this.endLoginModal("success");
                this.step = "step3";
                this.spaarksService.loginProcess.encodedOtp = suc.Details;
                this.otpStatus = suc.Status;
                // this.allpurposeService.openNameTrigger.next('check');
                // this.mobileNumber=this.spaarksService.encryptData(this.mobileNumber);

                //localStorage.setItem('phone',this.mobileNumber);
              },
              (err) => {
                this.loading = false;
                //alert('Please fill valid OTP');
                console.log(err);
                if (this.isOtpClosed) {
                  this.showOtp = true;
                  return;
                }
                this.showOtp = true;
                this.showLogin = true;
                this.step = "step2";
                this.spaarksService.somethingWentWrong(err.error.message);
              }
            );
        }, 1500);
      }
    }
  }

  abc(eve) {
    console.log(eve);
  }

  onOtpChange(eve) {
    this.isOtpClosed = false;
    console.log(eve);
    console.log(this.otp);

    if (eve.length == 6 && this.checkOtp == false) {
      if (Number.isInteger(Number(eve)) == false) {
        this.allpurposeService.triggerModal.next({
          type: "alertModal",
          modal: true,
          modalMsg: "Please fill valid OTP",
        });

        //this.spaarksService.showAlert('Please fill valid OTP');
        return;
      } else {
        this.checkOtp = true;
        //this.endLoginModal('loading')
        this.isOtpClosed = false;

        this.http
          .get<{ ip: string }>("https://jsonip.com")
          .subscribe((res: any) => {
            this.ipAddress = res.ip;
          });

        //console.log('th data', data);

        //alert(data.ip);
        let vendorStr = navigator.vendor;
        let finVendor = vendorStr.substr(0, vendorStr.indexOf(" "));

        if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
          finVendor = "Mozilla Firefox";
        }

        this.jsonObj.os = navigator.platform;
        this.jsonObj.browser = finVendor;

        setTimeout(() => {
          this.showOtp = false;
          console.log(this.jsonObj);

          this.otpSubs = this.spaarksService
            .sendOTPLogin({
              phone: "+91" + this.spaarksService.loginProcess.phone,
              encodedOtp: this.spaarksService.loginProcess.encodedOtp,
              cOtp: eve,
              webLanguage: "en",
              ip: this.ipAddress,
              os: this.jsonObj.os,
              browser: this.jsonObj.browser,
            })
            .subscribe(
              (suc: any) => {
                this.checkOtp = true;
                localStorage.setItem("phoneData", "false");
                localStorage.setItem("askname", suc.isProfileCompleted);
                this.spaarksService.loginProcess.phone = this.spaarksService.encryptData(
                  this.spaarksService.loginProcess.phone
                );
                localStorage.setItem(
                  "phone",
                  this.spaarksService.loginProcess.phone
                );
                localStorage.setItem("iJAIa", environment.ijaiaahut);
                console.log(suc);

                if (this.spaarksService.loginProcess.phone == "")
                  this.spaarksService.setDetailsToLocalStorage(suc, false);
                else this.spaarksService.setDetailsToLocalStorage(suc, true);

                if (suc) {
                  if (suc.isProfileCompleted == false) {
                    this.step = "step4";
                    // this.allpurposeService.openNameTrigger.next('check');
                    // localStorage.setItem('askname', 'true');
                  } else {
                    this.endLoginModal("success", "close");
                    setTimeout(() => {
                      location.reload();
                    }, 3000);
                  }
                }
              },
              (err) => {
                console.log(err);
                // alert('Please fill valid OTP'+this.isOtpClosed);
                if (this.isOtpClosed) {
                  this.showOtp = true;
                  return;
                }
                this.showOtp = true;
                this.showLogin = false;
                this.step = "step3";
                this.spaarksService.somethingWentWrong(
                  "You have Entered Wrong OTP"
                );
                this.checkOtp = false;
              }
            );
        }, 1500);
      }
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
    }, 2000);
  }

  endLoginModal(stat?, end?) {
    this.step = "step5";
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

  resendOtp() {
    if (this.canResend == false) {
      this.allpurposeService.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "You can not resend OTP yet.",
      });

      // alert('Oops! you cant resend otp yet.');
      return;
    }
    this.canResend = false;
    this.spaarksService.loginProcess.encodedOtp = "";
    this.endLoginModal("loading");
    this.spaarksService
      .sendMobileNumberLogin({ phone: "+91" + this.mobileNumber })
      .subscribe((suc: any) => {
        console.log(suc);
        this.spaarksService.loginProcess.encodedOtp = suc.Details;

        this.endLoginModal("loading");

        this.startResendProcess();
        console.log(suc);
        this.step = "step3";
      });
  }

  keyPress(event: any) {
    console.log(event.target.value, event.keyCode);
    if (event.keyCode == 32 || event.keyCode == 45 || event.keyCode == 43) {
      event.preventDefault();
    }
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 32 && !pattern.test(inputChar)) {
      console.log("i came");
      event.preventDefault();
    }
  }

  changedGender(eve) {
    console.log(eve);
    this.gendervalue = eve.value;
  }

  updateName(eve) {
    this.namevalue = eve.target.value;
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
    console.log(this.userName[0]);
    if (username1) this.userName = username1;
    console.log("Userr", this.userName);
    const c = this.userName.substring(0, 1);
    console.log("Userr", this.userName.substring(0, 1));
    if (c >= "0" && c <= "9") {
      this.spaarksService.somethingWentWrong(
        "Name should not start with number."
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
        "Name should not contain Anonymous or anonymous"
      );
      this.userName = "";
      this.firstval = true;
      return;
    }
    if (this.userName.length < 20) {
      this.updateProfile();
    } else {
      this.allpurposeService.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "Name/Business Name. Should be less than 20 characters.",
      });
      //alert('Please enter name, name should be less than 20 charecters');
      return;
    }
  }

  wrongMobileNumber() {
    this.mobileNumber = "";
    this.spaarksService.loginProcess.phone = "";
    this.step = "step2";
    this.showLogin = true;
  }

  ngOnDestroy() {
    // alert('called')
    this.allpurposeService.openNameTrigger.next("check");
  }

  changedMobile(eve) {
    console.log(eve.target.value);
    var value = eve.target.value;

    this.mobileNumber = value;
    this.mobileNumber = this.mobileNumber.replace(",", "");
    this.mobileNumber = this.mobileNumber.replace(".", "");
    this.mobileNumber = this.mobileNumber.replace("-", "");
    eve.target.value = this.mobileNumber;
    // alert(this.mobileNumber)

    eve.preventDefault();
    //  this.mobileNumber= this.mobileNumber.replaceAll(',',' ')
    //  alert(eve.target.value)
  }

  showMobile() {
    this.step = "step2";
  }

  showQr() {
    this.step = "step6";
  }

  closeMobileModal() {
    this.step = "step1";
    this.showLoginModal = true;
  }

  closeOtpModal() {
    this.step = "step1";
    this.showLogin = true;
    this.showLoginModal = true;
    this.isOtpClosed = true;
    this.checkOtp = false;
  }
}
