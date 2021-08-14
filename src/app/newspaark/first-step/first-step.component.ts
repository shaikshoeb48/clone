import { Location } from "@angular/common";
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { SpaarksService } from "../../spaarks.service";
import { FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AllpurposeserviceService } from "src/app/allpurposeservice.service";

@Component({
  selector: "app-first-step",
  templateUrl: "./first-step.component.html",
  styleUrls: ["./first-step.component.scss"],
})
export class FirstStepComponent implements OnInit {
  constructor(
    private SpaarksService: SpaarksService,
    private router: Router,
    private Route: ActivatedRoute,
    private allpurposeService: AllpurposeserviceService,
    private location: Location
  ) {
    this.propic = localStorage.getItem("propic");
    this.isMobileVersion = this.SpaarksService.isMobileVersion;
  }

  isMobileVersion;
  name = "";
  propic = "";
  currentDate = new Date();
  currentStep = this.SpaarksService.formCurrentState;
  createTimeline = this.SpaarksService.createTimeline;
  showOnly = true;
  count = 1000;
  nocall = true;
  option3 = "";
  img3 = "";
  img1;
  img2;
  spaarkCallChoice = true;
  sparksCall = false;
  option3val = true;
  radioName = true;
  radioProfile = true;
  option1;
  option2;
  optionTxt1;
  optionTxt2;
  featureName;
  validFormats = [];
  imageArr = [];
  imagePreview;
  imageList = [];
  fileAr = [];
  imgListBuffer = [];
  videoArr = [];
  videoCount = 0;
  showImageIcon = true;
  nameChoice = true;
  profileChoice = true;

  file = [];
  option1val;
  option2val;

  imageForm: FormControl = new FormControl(null, {
    validators: [Validators.required],
  });

  @ViewChild("myFile") myFile: ElementRef;
  @ViewChild("myFile1") myFile1: ElementRef;
  counter = 0;
  imagePicked = false;
  imageArrLength = 0;
  isVideo = false;
  isInvalid = false;
  @Output("clickedNext") clickedNextEmitter = new EventEmitter();
  content = "";

  ngOnInit(): void {
    // this.SpaarksService.showName = true;
    //   this.SpaarksService.showProfilePic = true;

    if (!this.SpaarksService.noPhoneCall) {
      this.sparksCall = true;
    }
    //console.log("Heyyyyyyyyy",this.createTimeline.questionno);
    if (this.createTimeline.questionno == 2) {
      this.showOnly = false;
    }
    console.log(this.SpaarksService.selectedCreate);
    try {
      this.name = localStorage.getItem("name");
      this.propic = localStorage.getItem("propic");
    } catch {
      // this.SpaarksService.detailsNotFound("profilePic (FirstStepComp)");
    }
    // alert(this.SpaarksService.showName);
    //     this.SpaarksService.showName = true;
    //     this.SpaarksService.showProfilePic = true;

    console.log(this.SpaarksService.selectedCreate.featureSelected);
    this.featureName = this.SpaarksService.selectedCreate.featureSelected;
    console.log(this.featureName);
    if (this.featureName == "greet") {
      this.option1 = "Show my name";
      this.img1 = "../../../assets/name2.svg";
      this.option2 = "Show profile pic";
      this.img2 = this.propic;
      this.optionTxt1 = "Yes";
      this.optionTxt2 = "No";
      this.option1val = "3";
      this.option2val = "5";
      this.nocall = false;

      if (this.SpaarksService.selectedCreate.isAnonymous) this.makeAnonymous();
      //   this.nameChoice = !this.SpaarksService.selectedCreate.isAnonymous;
      //   this.profileChoice = !this.SpaarksService.selectedCreate.isAnonymous;
      //   this.SpaarksService.showProfilePic= !this.SpaarksService.selectedCreate.isAnonymous;
      //   this.SpaarksService.showName= !this.SpaarksService.selectedCreate.isAnonymous;
      // this.showImageIcon = !this.SpaarksService.selectedCreate.isAnonymous;
    } else {
      this.option1 = "Spaarks call";
      this.img1 = "../../../assets/call1.svg";
      this.option2 = "Spaarks chat";
      this.img2 = "../../../assets/chats.svg";
      this.option3 = "Normal call";
      this.img3 = "../../../assets/phoneCall.svg";
      this.optionTxt1 = "On";
      this.optionTxt2 = "Off";
      this.option1val = "3";
      this.option2val = "5";
      this.nameChoice = this.SpaarksService.selectedCreate.canCallMobile;
      this.SpaarksService.showName = true;
      this.SpaarksService.showProfilePic = true;
    }

    // alert(this.SpaarksService.showName);
    // alert("First Step");
    console.log(this.SpaarksService.CreateSpaarkSteps);

    this.refillValues();
    this.radioProfile = this.SpaarksService.showProfilePic;
    this.radioName = this.SpaarksService.showName;

    this.SpaarksService.previousSubj.subscribe((succ) => {
      console.log(succ);
      if (succ == "TopbackArrow") {
        this.clickedPrevious();
      }
    });

    if (!this.SpaarksService.selectedCreate.canCallMobile) {
      this.sparksCall = true;
      this.spaarkCallChoice = this.SpaarksService.selectedCreate.phoneCall;
    } else {
      this.SpaarksService.selectedCreate.phoneCall = true;

      // if()
      // alert(this.SpaarksService.showName);
      this.spaarkCallChoice = this.SpaarksService.showName;

      this.sparksCall = false;
    }
    // alert(this.SpaarksService.selectedCreate.phoneCall);
  }

  refillValues() {
    if (
      this.SpaarksService.selectedCreate.content != "" ||
      this.SpaarksService.selectedCreate.imageList.length != 0
    ) {
      this.content = this.SpaarksService.selectedCreate.content;
      this.count = this.count - this.content.length;
      if (this.featureName == "greet") {
        console.log(this.SpaarksService.showName);

        this.nameChoice = this.SpaarksService.showName;
        this.spaarkCallChoice = this.SpaarksService.showName;
        this.profileChoice = this.SpaarksService.showProfilePic;
      } else {
        this.nameChoice = this.SpaarksService.selectedCreate.canCallMobile;
        this.profileChoice = this.SpaarksService.selectedCreate.chat;
        this.spaarkCallChoice = this.SpaarksService.selectedCreate.phoneCall;
      }

      if (this.SpaarksService.selectedCreate.imageList.length != 0) {
        this.imageList = this.SpaarksService.selectedCreate.imageList;
        this.fileAr = this.SpaarksService.selectedCreate.fileAr;
        this.imageArrLength = this.fileAr.length;
      }
    }
  }

  makeAnonymous() {
    if (this.featureName == "greet") {
      this.radioName = false;
      this.option1val = false;
      this.radioProfile = false;
      this.option2val = false;
      this.nameChoice = false;
      this.profileChoice = false;
      this.SpaarksService.showName = false;
      this.SpaarksService.showProfilePic = false;
      this.SpaarksService.selectedCreate.isAnonymous = false;
      this.spaarkCallChoice = false;
    }
  }

  changedSelectedVal(values, eve) {
    if (this.featureName == "greet") {
      if (values == "opt1") {
        console.log(values);
        console.log(eve);
        this.radioName = JSON.parse(eve.value);

        this.option1val = eve;
      } else if (values == "opt2") {
        console.log(values);
        console.log(eve);
        this.radioProfile = JSON.parse(eve.value);
        this.option2val = eve;
      }

      // console.log(this.radioName);
      // console.log(this.radioProfile);
      this.SpaarksService.showProfilePic = this.radioProfile;
      this.SpaarksService.showName = this.radioName;

      console.log(this.SpaarksService.showName);
      console.log(this.SpaarksService.showProfilePic);
    } else {
      if (values == "opt1") {
        console.log(values);
        console.log(eve);
        // this.radioName = JSON.parse(eve.value);

        this.option1val = JSON.parse(eve.value);
        console.log(this.option1val);
        this.SpaarksService.selectedCreate.phoneCall = this.option1val;
      } else if (values == "opt3") {
        console.log(values);
        console.log(eve);
        this.option3val = JSON.parse(eve.value);
        this.SpaarksService.noPhoneCall = this.option3val;
        if (!this.SpaarksService.noPhoneCall) {
          this.sparksCall = true;
        } else this.sparksCall = false;
        this.SpaarksService.selectedCreate.canCallMobile = this.option3val;
      } else if (values == "opt2") {
        console.log(values);
        console.log(eve);
        // this.radioProfile = JSON.parse(eve.value);
        this.option2val = JSON.parse(eve.value);
        console.log(this.option2val);
        this.SpaarksService.selectedCreate.chat = this.option2val;
      }
    }
  }

  onImagePicked(event: Event) {
    // alert("heeee")
    this.imagePicked = true;
    let fileLength = 0;
    const files = (event.target as HTMLInputElement).files;
    let file = Array.from(files);

    this.imageArrLength = file.length;
    // console.log("FFFFFFFFFFFFFFFFFFF", file)
    console.log(files);
    if (file.length > 4) {
      this.isInvalid = true;
      this.SpaarksService.somethingWentWrong("Only 4 files are allowed");
      this.isVideo = false;
      return;
    }
    if (this.fileAr.length + file.length > 4) {
      // alert("aaaaa")
      if (this.isVideo) {
        this.SpaarksService.somethingWentWrong(
          "Only 3 images 1 video are allowed"
        );
      } else {
        this.SpaarksService.somethingWentWrong("Only 4 images are allowed");
      }

      this.isVideo = false;
      return;
    }
    fileLength = file.length;
    // console.log('files length is', fileLength);
    this.imageForm.patchValue({ imageForm: file });
    this.imageForm.updateValueAndValidity();

    this.validFormats = ["image", "video"];

    if (file) {
      console.log("FILELFIELEIFLELIE", file);
      for (let i = 0; i < file.length; i++) {
        if (file[i]) {
          console.log("loop", this.fileAr);
          if (
            this.validFormats.indexOf(
              file[i].type.substring(0, file[i].type.indexOf("/"))
            ) == -1
          ) {
            // this.SpaarksService.showAlert("Upload an Image or a Video");
            this.allpurposeService.triggerModal.next({
              type: "alertModal",
              modal: true,
              modalMsg: "Upload an Image or a Video",
            });
            // this.activeUsersService.alertModalSub.next('Upload an Image or a Video');
            return;
          }
        }
        let type = "";
        if (
          this.isVideo == false &&
          file[i].type.substring(0, file[i].type.indexOf("/")) == "image"
        ) {
          if (file[i]) {
            if (file[i].type) {
              if (
                file[i].type != "image/jpeg" &&
                file[i].type != "image/jpg" &&
                file[i].type != "image/png" &&
                file[i].type != "image/webp" &&
                file[i].type != "image/bmp"
              ) {
                // this.SpaarksService.showAlert("Format not supported");
                this.allpurposeService.triggerModal.next({
                  type: "alertModal",
                  modal: true,
                  modalMsg: "Format not supported",
                });
                file = [];
                this.imageArrLength = 0;
                // this.activeUsersService.alertModalSub.next('Format not supported');
                return;
              }
            }
          }

          if (file[i].size / 1000 / 1000 > 25) {
            //this.SpaarksService.showAlert("Image size cannot exceed 25MB");
            this.allpurposeService.triggerModal.next({
              type: "alertModal",
              modal: true,
              modalMsg: "Image size cannot exceed 25MB",
            });
            // this.activeUsersService.alertModalSub.next('image size cannot exceed 25MB');
            return;
          }

          this.imageArr.push(file[i]);

          let date = Date.now();

          const reader = new FileReader();
          reader.onload = () => {
            this.counter++;
            console.log(this.counter);
            this.imagePreview = reader.result;
            // console.log(this.imagePreview);
            // alert("sssss")
            this.imageList.push({ type: "img", data: reader.result });
            this.fileAr.push(file[i]);
            console.log(this.fileAr);

            this.SpaarksService.selectedCreate.imageList = this.imageList;
            this.SpaarksService.selectedCreate.fileAr = this.fileAr;
          };
          reader.readAsDataURL(file[i]);
          //upload to backend -----vv
        } else if (
          file[i].type.substring(0, file[i].type.indexOf("/")) == "video"
        ) {
          console.log(this.fileAr);
          console.log(file[i].type);
          if (this.fileAr.filter((f) => f.type == "video/mp4").length != 0) {
            this.allpurposeService.triggerModal.next({
              type: "alertModal",
              modal: true,
              modalMsg: "You can only upload a maximum of one video.",
            });
            // alert('You can only upload a maximum of one video.');

            return;
          }
          if (file[i].size / 1000 / 1000 > 50) {
            this.allpurposeService.triggerModal.next({
              type: "alertModal",
              modal: true,
              modalMsg: "Video size cannot exceed 50MB",
            });
            //this.SpaarksService.showAlert("Video size cannot exceed 50MB");
            // this.activeUsersService.alertModalSub.next('Video size cannot exceed 50MB');
            return;
          }
          if (file[i].type == "video/mp4") {
            let date = Date.now();
            const reader = new FileReader();
            this.isVideo = false;
            reader.onload = () => {
              // alert("aaaaaaaaaaaa");
              if (
                this.fileAr.filter((f) => f.type == "video/mp4").length != 0
              ) {
                this.allpurposeService.triggerModal.next({
                  type: "alertModal",
                  modal: true,
                  modalMsg: "You can only upload a maximum of one video.",
                });
                // alert('You can only upload a maximum of one video.');

                return;
              }
              this.imagePreview = reader.result;
              this.imageList.push({ type: "vid", data: reader.result });
              this.fileAr.push(file[i]);
              this.videoArr.push(file[i]);
              console.log(this.fileAr);

              this.SpaarksService.selectedCreate.imageList = this.imageList;
              this.SpaarksService.selectedCreate.fileAr = this.fileAr;
            };

            reader.readAsDataURL(file[i]);
          } else {
            // alert('Upload MP4 Format Videos Only');
            // this.activeUsersService.alertModalSub.next('Upload MP4 Format Videos Only');
          }
        } else {
          type = "error";
          this.isVideo = false;
        }
      }
      console.log(this.fileAr);
    }

    //*********************************************************************************************
    //end-procedure :
    //**********************************************************************************************
  }
  // ngOnDestroy():void{
  //   this.SpaarksService.selectedCreate.isAnonymous=false;
  // }

  clickedNext() {
    if (this.fileAr.length == 0) {
      if (!this.content.replace(/\s/g, "").length) {
        this.SpaarksService.somethingWentWrong("Text field cannot be empty");
        this.content = "";
        return;
      }
    }

    this.SpaarksService.selectedCreate.imageList = this.imageList;
    this.SpaarksService.selectedCreate.fileAr = this.fileAr;
    // let gun = {}
    // this.SpaarksService.connectionData = {}

    this.clickedNextEmitter.emit({ clicked: "true" });
    this.currentStep = "second";
    this.SpaarksService.CreateSpaarkSteps.currentStep = "second";

    console.log(this.SpaarksService.showName);
    console.log(this.SpaarksService.showProfilePic);
  }

  confirmExit(): Boolean {
    if (
      this.SpaarksService.selectedCreate.content == "" &&
      this.SpaarksService.selectedCreate.fileAr.length == 0 &&
      this.SpaarksService.selectedCreate.imageList.length == 0
    )
      return true;
    var des = window.confirm("Are you sure, you want to discard this Spaark?");
    return des;
  }

  clickedPrevious() {
    // alert('HGeloo');
    // this.router.navigateByUrl('/home/newspaark/create/Offer-a-Service');
    // this.router.navigateByUrl('home/newspaark/create/Offer-a-Service')
    // this.SpaarksService.CreateSpaarkSteps.StepState="three";

    //jai's logic

    if (this.SpaarksService.createTimeline) {
      if (
        this.SpaarksService.createTimeline.questionno != "1" &&
        this.SpaarksService.createTimeline.questionno != "2" &&
        this.SpaarksService.createTimeline.questionno != "7"
      ) {
        if (this.SpaarksService.createTimeline.subcat == null) {
          if (this.SpaarksService.quickSpaarkClicked) {
            this.router.navigateByUrl("newspaark");
            this.SpaarksService.CreateSpaarkSteps = {
              ...this.SpaarksService.DefaultSpaarkSteps,
            };
            this.SpaarksService.quickSpaarkClicked = false;
          } else {
            this.SpaarksService.previousSubj.next("BackToCat");
          }
        } else if (this.SpaarksService.createTimeline.subcat != null) {
          this.SpaarksService.previousSubj.next("BackToSubCat");
        }
      } else if (
        this.SpaarksService.createTimeline.questionno == "1" ||
        this.SpaarksService.createTimeline.questionno == "2"
      ) {
        if (!this.confirmExit()) {
          return;
        }
        this.SpaarksService.isClickedFromAnnounce = true;
        this.SpaarksService.CreateSpaarkSteps = this.SpaarksService.DefaultSpaarkSteps;
        this.location.back();
      } else if (this.SpaarksService.createTimeline.questionno == "7") {
        if (this.SpaarksService.createTimeline.skilled) {
          this.SpaarksService.previousSubj.next("skilled");
        }
      }
    }

    //syed's logic
    // if (this.SpaarksService.CreateSpaarkSteps.StepState == "two") {
    //   this.SpaarksService.previousSubj.next('BackToCat');
    //   return;
    // }
    // if (this.SpaarksService.CreateSpaarkSteps.firstSkip == true) {
    //   this.SpaarksService.previousSubj.next('BackToCat');
    //   return;
    // }
    // if (this.SpaarksService.CreateSpaarkSteps.StepState == "three") {
    //   this.SpaarksService.previousSubj.next('BackToSubCat');
    //   return;
    // }
    // if (this.SpaarksService.CreateSpaarkSteps.secondSkip == true) {
    //   this.SpaarksService.previousSubj.next('BackToSubCat');
    //   return;
    // }
    // if (this.SpaarksService.CreateSpaarkSteps.Cat == "Make-Friends" || this.SpaarksService.CreateSpaarkSteps.Cat == "Announce-Something") {
    //   //alert('Hello')
    //   this.router.navigateByUrl('home/newspaark');
    //   this.SpaarksService.CreateSpaarkSteps = this.SpaarksService.DefaultSpaarkSteps;
    // }

    //alert("Function Is Ruinning");
  }

  addImages() {
    if (this.fileAr.length > 3) {
      // this.isVideo=false;
      if (this.isVideo) {
        this.SpaarksService.somethingWentWrong(
          "Only 3 images and 1 video are allowed"
        );
      } else {
        this.SpaarksService.somethingWentWrong("Only 4 images are allowed");
      }

      this.isVideo = false;
      return;
    }

    try {
      this.myFile.nativeElement.value = null;
      this.myFile.nativeElement.value = "";
      this.myFile.nativeElement.innerHTML = "";
    } catch {}

    this.myFile.nativeElement.click();

    // console.log(this.imageList);
  }

  addSingleImage() {
    // console.log("filefile file file file");
    try {
      this.myFile1.nativeElement.value = null;
      this.myFile1.nativeElement.value = "";
      this.myFile1.nativeElement.innerHTML = "";
    } catch {}

    this.myFile1.nativeElement.click();
  }

  addVideo() {
    this.isVideo = true;
    this.addImages();
  }

  deleteImg(idx: number) {
    // alert('uuu')

    this.imgListBuffer = [];
    this.myFile.nativeElement.value = "";
    this.myFile.nativeElement.innerHTML = "";

    this.myFile1.nativeElement.value = "";
    this.myFile1.nativeElement.innerHTML = "";

    for (let i = 0; i <= this.imageList.length; i++) {
      if (this.imageList[i] == this.imageList[idx]) {
        this.imageList.splice(idx, 1);
        this.fileAr.splice(idx, 1);
        this.file.splice(idx, 1);
        this.imageArrLength = this.file.length;
        // console.log(this.imageArrLength);
        return;
      } else {
        this.imgListBuffer.push(this.imageList[i]);
      }
    }
  }

  updateInput(eve) {
    this.content = eve.target.value;
    this.SpaarksService.selectedCreate.content = this.content;
    let remain = 1000 - eve.target.textLength;
    this.count = remain;
  }
}
