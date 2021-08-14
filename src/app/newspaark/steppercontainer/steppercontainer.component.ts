import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  NgZone,
  OnDestroy,
} from "@angular/core";
import { CdkStep } from "@angular/cdk/stepper";
import { MatStepper } from "@angular/material/stepper";
import { SpaarksService } from "../../spaarks.service";
import { Router } from "@angular/router";
import { Subscription, throwError } from "rxjs";
import { AllpurposeserviceService } from "src/app/allpurposeservice.service";
import { catchError } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-steppercontainer",
  templateUrl: "./steppercontainer.component.html",
  styleUrls: ["./steppercontainer.component.scss"],
})
export class SteppercontainerComponent implements OnInit, OnDestroy {
  constructor(
    private spaarksService: SpaarksService,
    private router: Router,
    private allpurposeService: AllpurposeserviceService,
    private snack: MatSnackBar
  ) { }

  allpurpsubs: Subscription;

  imageList = [];
  fileAr = [];
  featureName;
  showName;
  showProfilePic;
  timeline = this.spaarksService.createTimeline;
  secondStep = false;
  firstStep = true;
  thirdStep = false;
  currentStep = "first";
  loading = false;
  showSuccess = false;
  fullSelection = { question: "", category: "", subcategory: "" };
  step = { step1: { completed: false }, step2: { completed: false } };

  @ViewChild("stepone") stepone: CdkStep;
  @ViewChild("steptwo") steptwo: CdkStep;
  selectedIndexx = 0;

  ngOnInit(): void {
    if (
      this.spaarksService.selectedCreate.selectedQuestion == "" ||
      this.spaarksService.selectedCreate.featureSelected == ""
    ) {
      this.router.navigateByUrl("home/newspaark");
    } else {
      this.fullSelection = {
        question: this.spaarksService.selectedCreate.selectedQuestion,
        category: this.spaarksService.selectedCreate.selectedCategory,
        subcategory: this.spaarksService.selectedCreate.selectedSubCategory,
      };
    }

    this.allpurpsubs = this.spaarksService.allPurposeSubject.subscribe(
      (succ) => {
        console.log(succ);
        if (succ == "SubmitForm") {
          this.submitSpaark();
        }
        if (succ == "badContent") {
          console.log(succ);
          this.snack.open("heyyyy", "ok", {
            duration: 4000,
          });
        }
      }
    );
  }

  submitSpaark() {
    // user can create post only with geolocation
    // if (localStorage.getItem('locationfrom') == 'cityselection') {
    //   alert('We need your location permission to create post');
    //   this.spaarksService.takeLocation();
    //   return;
    // }

    if (this.imageList.length > 5) {
      // this.spaarksService.showAlert('Upto 5 media files can be uploaded');
      this.allpurposeService.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "Upto 5 media files can be uploaded",
      });
    }
    this.showName = this.spaarksService.showName;
    this.showProfilePic = this.spaarksService.showProfilePic;

    this.featureName = this.spaarksService.selectedCreate.featureSelected;

    let form: FormData = new FormData();

    this.imageList = this.spaarksService.selectedCreate.imageList;
    this.fileAr = this.spaarksService.selectedCreate.fileAr;

    for (let i = 0; i < this.imageList.length; i++) {
      if (this.imageList[i]["type"] == "img") {
        form.append("photo", this.fileAr[i]);
      }
    }

    let vidCnt = 0;
    for (let i = 0; i < this.imageList.length; i++) {
      if (this.imageList[i]["type"] == "vid") {
        vidCnt = vidCnt + 1;
        form.append("video", this.fileAr[i]);
      }
      if (vidCnt > 1) {
        // alert('You cant upload more than one video');
        this.allpurposeService.triggerModal.next({
          type: "alertModal",
          modal: true,
          modalMsg: "One video can be uploaded",
        });
        //this.spaarksService.showAlert('One video can be uploaded');
        return;
      }
    }

    form.append("locationStatic[coordinates]", this.spaarksService.longitude); //number
    form.append("locationStatic[coordinates]", this.spaarksService.latitude); //number
    form.append("locationStatic[type]", "Point");
    form.append(
      "category",
      this.spaarksService.selectedCreate.selectedCategory
    );
    form.append(
      "subCategory",
      this.spaarksService.selectedCreate.selectedSubCategory
    );
    form.append(
      "question",
      this.spaarksService.selectedCreate.selectedQuestion
    );
    form.append("radius", this.spaarksService.selectedCreate.radius); //7
    form.append("content", this.spaarksService.selectedCreate.content);
    form.append("uservisibility[name]", "" + this.showName); //localstorage name
    form.append("uservisibility[profilePic]", "" + this.showProfilePic);
    form.append(
      "uservisibility[gender]",
      "" + this.spaarksService.selectedCreate.gender
    );
    form.append(
      "uservisibility[phoneCall]",
      "" + String(this.spaarksService.selectedCreate.phoneCall)
    );
    form.append(
      "uservisibility[canCallMobile]",
      "" + String(this.spaarksService.selectedCreate.canCallMobile)
    );

    form.append(
      "uservisibility[location]",
      "" + String(this.spaarksService.selectedCreate.location)
    );
    form.append(
      "uservisibility[chat]",
      "" + String(this.spaarksService.selectedCreate.chat)
    );
    form.append("isProvider", "" + true);
    form.append("questionNo", this.spaarksService.selectedCreate.questionNo);
    form.append("categoryId", this.spaarksService.selectedCreate.categoryId);
    form.append(
      "subCategoryId",
      this.spaarksService.selectedCreate.subCategoryId
    );
    form.append(
      "dynamicLocation",
      this.spaarksService.selectedCreate.dynamicLocation
    );

    let findata = {
      category: "",
      subCategory: "",
      question: "",
      radius: 7,
      photo: [],
      video: [],
      locationStatic: [],
    };
    this.loading = true;

    try {
      this.spaarksService.createSpaark(form, this.featureName).subscribe(
        (succe) => {
          this.spaarksService.selectedCreate = { ...this.spaarksService.defaultCreate };
          if (succe) {
            console.log(succe);
            this.loading = true;
            this.showSuccess = true;
            // this.spaarksService.selectedCreate = this.spaarksService.defaultCreate;
            this.spaarksService.CreateSpaarkSteps = this.spaarksService.DefaultSpaarkSteps;
            this.spaarksService.selectedCreate.content = "";
            if (this.spaarksService.quickSpaarkClicked == true) {
              this.spaarksService.quickSpaarkClicked = false;
              this.spaarksService.quickSpaarkSubj.next("QuickSpaarkCreated");
            }

            setTimeout(() => {
              this.showSuccess = false;
              this.spaarksService.selectedCreate = {...this.spaarksService.defaultCreate};
              // alert("aaaa")
              console.log(this.spaarksService.selectedCreate);
              console.log(this.spaarksService.defaultCreate);
              this.router.navigateByUrl("/home/feed");
            }, 2500);
          } else {
            console.log("noe");
            this.spaarksService.selectedCreate = { ...this.spaarksService.defaultCreate };
          }
        },
        (err) => {
          console.log(err);
          this.loading = false;
          // this.spaarksService.somethingWentWrong(err.error.message);
          this.spaarksService.somethingWentWrong(err.error.message);
        }
      );
    } catch (error) {
      console.log(error);
    }

    // updating location in backened after creating post
    if (this.spaarksService.authData.isAuthenticated)
      this.spaarksService.postUpdatedLocation().subscribe();
  }

  nextStep(eve?) {
    if (this.currentStep == "first") {
      this.step.step1.completed = true;
      this.thirdStep = true;
      this.firstStep = false;
      this.currentStep = "second";
    }
  }

  previousStep(eve) {
    //Receives previous step change from second screen as event
    console.log(eve);
    if (this.step.step1.completed) {
      this.thirdStep = false;
      this.firstStep = true;
      this.currentStep = "first";
    }
  }

  ngOnDestroy() {
    try {
      if (this.allpurpsubs) {
        this.allpurpsubs.unsubscribe();
      }
    } catch { }
  }
}
