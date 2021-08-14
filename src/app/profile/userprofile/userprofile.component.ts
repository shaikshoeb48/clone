import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Input,
} from "@angular/core";
import { SpaarksService } from "../../spaarks.service";
import { FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { AllpurposeserviceService } from "src/app/allpurposeservice.service";
import { ActivatedRoute } from "@angular/router";
import { MatMenuTrigger } from "@angular/material/menu";
import { Location } from "@angular/common";

@Component({
  selector: "app-userprofile",
  templateUrl: "./userprofile.component.html",
  styleUrls: ["./userprofile.component.scss"],
})
export class UserprofileComponent implements OnInit {
  constructor(
    private spaarksService: SpaarksService,
    private allpurposeService: AllpurposeserviceService,
    private route: ActivatedRoute,
    private loc: Location
  ) {}
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  isAuthed = this.spaarksService.authData.isAuthenticated;
  posts;
  userName;
  enableImageEdit = false;
  @Input("profileData") profileData;
  // profilePic;
  userId;
  @ViewChild("scroller", { static: false }) scroller: ElementRef;
  onlyImages = [];
  onlySpaarks = [];
  photos = [];
  subscription: Subscription;
  hasmarketprofile: boolean;
  loader = false;
  loader2 = false;
  enableNotfound = false;
  noSpaarks = false;
  diffUserId = "";
  profilePic;
  dontopenProfileModal = true;
  showLogin = false;
  showOptionsChangeProfile = false;

  validFormats;
  imagePreview;
  url;

  imageForm: FormControl = new FormControl(null, {
    validators: [Validators.required],
  });

  imageList = [];
  fileAr = [];
  proPic;
  uploadDone = false;
  isUploading = false;
  profilePicw = localStorage.getItem("propic");

  fullView = false;
  initVal = 4;
  images = [];

  @Output("changedprofile") changedprofile = new EventEmitter();

  ngOnInit(): void {
    if (localStorage.getItem("propic")) {
      var profileThere = localStorage.getItem("propic");
      this.userId = localStorage.getItem("id");
      console.log(profileThere);
      if (profileThere.includes("userprofile.png")) {
        this.dontopenProfileModal = false;
      }
    }
    // if(localStorage.getItem('askname'))
    // {
    //   var noName=localStorage.getItem('askname');
    //   if(noName!='true')
    //   {
    //     this.allpurposeService.triggerModal.next({
    //       type: "openName",
    //       modal: true,

    //     });

    //   }

    // }
    // if(this.allpurposeService.isOpenNameModal){
    //   this.allpurposeService.triggerModal.next({
    //     type: "openName",
    //     modal: true,

    //   });
    // }

    this.spaarksService.checkforLocation();
    if (localStorage.getItem("propic")) {
      console.log(localStorage.getItem("propic"));
      this.profilePicw = localStorage.getItem("propic");
    }
    this.diffUserId = this.route.snapshot.paramMap.get("id");
    console.log(this.diffUserId);
    if (this.diffUserId) {
      if (!this.profileData) {
        this.profileData = this.diffUserId;
      }
    }

    this.subscription = this.spaarksService.photoDeleted.subscribe(
      (succPost: any) => {
        this.photos = succPost;

        this.photos.forEach((val, ind) => {
          this.onlyImages.forEach((val2, ind2) => {
            if (val2 == val.url) {
              this.onlyImages.splice(ind2, 1);
            }
          });
        });
      }
    );

    if (this.isAuthed || this.diffUserId) {
      this.loader = true;
      this.loader2 = true;
      this.subscription = this.spaarksService
        .getUserProfile(this.profileData, this.userId == this.profileData)
        .subscribe((succ: any) => {
          this.loader = false;
          this.loader2 = false;
          if (succ) {
            console.log(succ);
            console.log(succ.photos);
            this.hasmarketprofile = succ.hasMarketProfile;
            this.images = succ.photos;
            this.profilePic = succ.profilePic;
            if (this.userId == this.diffUserId) {
              localStorage.setItem("propic", this.profilePic);
              this.spaarksService.proPicSubj.next({
                profilePic: this.profilePic,
              });
            }
            this.userName = succ.name;
            this.images.forEach((val, ind) => {
              this.onlyImages.push(val.url);
            });
            if (!succ.posts) {
              this.loader2 = false;
              this.noSpaarks = true;
            }
            this.posts = succ.posts.reverse();
            if (!this.enableImageEdit)
              this.posts = this.posts.filter((post) => {
                return post.questionNo != 2;
              });
            console.log(
              this.posts.filter((post) => {
                return post.questionNo != 2;
              })
            );
            if (!succ.photos.length) {
              this.enableNotfound = true;
              this.loader = false;
            }
          }
        });
    }
    if (this.diffUserId == this.userId) {
      try {
        this.userName = localStorage.getItem("name");
        this.profilePic = localStorage.getItem("propic");
        this.userId = localStorage.getItem("id");
        // this.diffUserId=localStorage.getItem("id");
        console.log("User IDDDDDDDD", this.userId);
      } catch (error) {
        // this.spaarksService.detailsNotFound(
        //   "userName/profilePic/UserId (UserProfileComp)"
        // );
      }
    }

    this.spaarksService.showLoginScreen.subscribe((bool) => {
      this.showLogin = bool;
    });
    // this.scroller.nativeElement.scrollTop = 0;
    window.scroll(0, 0);
    this.enableImageEdit = (this.userId == this.diffUserId||!this.diffUserId);
  }

  // userId=1;
  changeToSellerProfile() {
    this.changedprofile.emit({ changeTo: "seller" });
  }

  clickedLogin() {
    this.showLogin = true;
    this.spaarksService.showLoginScreen.next(true);
  }

  changeProfilePicOption() {
    if (!this.dontopenProfileModal) {
      //this.changeProfilePic();
    } else {
      this.trigger.openMenu();
      this.showOptionsChangeProfile = true;
    }
  }

  deleteProfilePic() {
    this.showOptionsChangeProfile = false;
    this.spaarksService.removeProfilePic().subscribe((x: any) => {
      this.profilePic = x.profilePic;
      this.spaarksService.proPicSubj.next({
        profilePic: this.profilePic,
      });
      this.dontopenProfileModal = false;
    });
  }

  changeProfilePic() {
    document.getElementById("picChoose").click();
    console.log(document.getElementById("picChoose"));
    this.showOptionsChangeProfile = false;
  }

  closeModal() {
    this.showOptionsChangeProfile = false;
  }

  onSelectFile(event) {
    this.onImagePicked(event);
  }

  onImagePicked(event: Event) {
    this.isUploading = true;
    if (this.uploadDone == true) {
      this.isUploading = false;
    }
    if (this.uploadDone == true) {
      this.uploadDone = false;
    }

    const file = (event.target as HTMLInputElement).files[0];
    console.log("file is ", file);
    this.imageForm.patchValue({ imageForm: file });
    this.imageForm.updateValueAndValidity();
    // console.log(file);
    // console.log(this.imageForm);
    this.validFormats = ["image"];
    if (file) {
      if (
        this.validFormats.indexOf(
          file.type.substring(0, file.type.indexOf("/"))
        ) == -1
      ) {
        this.allpurposeService.triggerModal.next({
          type: "alertModal",
          modal: true,
          modalMsg: "Upload an Image",
        });
        this.isUploading = false;
        // this.spaarksService.showAlert("Upload an Image");
        return;
      }
      if (file.size / 1048576 > 25) {
        this.allpurposeService.triggerModal.next({
          type: "alertModal",
          modal: true,
          modalMsg: "File size cannot exceed 25MB",
        });
        // this.spaarksService.showAlert("File size cannot exceed 25MB");
        this.isUploading = false;
        return;
      }

      if (file.type) {
        if (
          file.type != "image/jpeg" &&
          file.type != "image/jpg" &&
          file.type != "image/png" &&
          file.type != "image/webp" &&
          file.type != "image/bmp"
        ) {
          this.allpurposeService.triggerModal.next({
            type: "alertModal",
            modal: true,
            modalMsg: "Format not supported",
          });
          //this.spaarksService.showAlert("Format not supported");
          this.isUploading = false;
          return;
        }
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.imageList.push(reader.result);
        this.fileAr.push(file);
      };
      reader.readAsDataURL(file);
      // this.isUploading =false;
      this.uploadDone = true;
      console.log("file is ", file);

      this.subscription = this.spaarksService.sendProfilePic(file).subscribe(
        (succ: any) => {
          console.log(succ);
          this.spaarksService.updateChatProfile();
          console.log(succ.message);
          this.proPic = succ;
          console.log(this.profilePic);
          console.log("successfully profile pic updated", this.proPic.message);
          localStorage.setItem("propic", this.proPic.message);
          this.profilePic = this.proPic.message;
          this.isUploading = false;
          this.spaarksService.proPicSubj.next({
            profilePic: this.proPic.message,
          });
          this.dontopenProfileModal = true;
        },
        (err) => {
          this.isUploading = false;
          console.log("Error while uploading profile pic ", err);
        }
      );
    }
  }

  viewAll() {
    this.fullView = !this.fullView;
    if (this.fullView == true) {
      this.initVal = this.images.length;
      console.log("Inside IF");
    } else {
      this.initVal = 4;
      console.log("Inside else");
    }
  }

  showFullScreen(pic) {
    this.spaarksService.sendSinglePhoto(pic);
  }

  fullScreenImage(image, index) {
    this.spaarksService.sendImageWithIndex(this.onlyImages, index);
  }

  clickedBack() {
    this.loc.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
