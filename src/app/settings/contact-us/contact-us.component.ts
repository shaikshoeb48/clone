import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SpaarksService } from "../../spaarks.service";
import { of } from "rxjs";
import { Validators, FormControl } from "@angular/forms";
import { AllpurposeserviceService } from "src/app/allpurposeservice.service";

@Component({
  selector: "app-contact-us",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.scss"],
})
export class ContactUsComponent implements OnInit {
  tickets:any=[];
  constructor(
    private spaarksService: SpaarksService,
    private allpurposeService: AllpurposeserviceService
  ) {
    this.isMobileVersion = this.spaarksService.isMobileVersion;
  }
  panelOpenState = false;
  loading = false;
  isMobileVersion;

  validFormats = [];
  imageArr = [];
  imagePreview;
  imgListBuffer = [];
  videoArr = [];
  videoCount = 0;
  showImageIcon = true;
  disableBtn=false;
  imageForm: FormControl = new FormControl(null, {
    validators: [Validators.required],
  });

  @ViewChild("myFile") myFile: ElementRef;
  counter = 0;
  imagePicked = false;
  imageArrLength = 0;
  state: string = "default";
  contactWindow = false;
  selectedQuery;
  previousChatScreen = false;
  isAuthed = this.spaarksService.authData.isAuthenticated;
  content = "";
  photo = "";
  editedMsg = false;
  imageList = [];
  fileAr = [];
  showBtn = false;
  showLogin = false;
  count = 1000;

  ngOnInit(): void {
    if (this.spaarksService.authData.isAuthenticated) {
        this.spaarksService.getTickets().subscribe((succ) => {
      console.log(succ);
      this.tickets = succ;
    
    });
  }
  
    this.spaarksService.checkforLocation();
  }

  rotate(ind, eve) {
    console.log(eve);
    console.log(ind);
    this.state = this.state === "default" ? "rotated" : "default";
  }

  backbutton() {
    this.fileAr = [];
    this.imageList = [];
    this.content = "";
    this.count = 1000;

    this.contactWindow = false;
  }

  openContactWindow(val?) {
    console.log(val);
    if (this.isAuthed) {
      this.contactWindow = true;
      this.selectedQuery = val;
      console.log(this.selectedQuery);
    } else {
      this.spaarksService.triggerLogin();
    }
  }

  submitForm() {
    this.disableBtn=true;
    if (this.content == "" || this.content.match(/^\s*$/)) {
      // alert('Description cannot be empty please type something');
      this.spaarksService.somethingWentWrong("Please write something");
      this.content = "";
    this.disableBtn=false;

      return;
    }
    this.contactWindow = false;
    let form: FormData = new FormData();
    form.append("content", this.content);
    form.append("type", "help");

    for (let i = 0; i < this.imageList.length; i++) {
    if (this.imageList[i]["type"] == "img") {
        form.append("photo", this.fileAr[i]);
      }
    }
    form.append("subject", this.selectedQuery);
    console.log("selected Query", this.selectedQuery);
    console.log(form);
    this.loading = true;

    this.spaarksService.sendContactData(form).subscribe((succe: any) => {
      console.log(succe);
      this.content = "";
      this.loading = false;
      this.disableBtn=true;

      this.spaarksService.somethingWentWrong(succe.message);
      this.imageList = [];
      // this.fileAr = [];
      // this.imgArr = []
      if (this.spaarksService.authData.isAuthenticated) {
            this.spaarksService.getTickets().subscribe((succ) => {
        console.log(succ);
        // this.tickets=[];
        this.tickets = succ;
        this.disableBtn=false;
      
      });
      }
    });
   
    this.count = 1000;
  }

  textEntered(eve) {
    // if (this.content != '')
    //   this.showBtn = true;
    // else
    //   this.showBtn = false
    let remain = 1000 - eve.target.textLength;
    this.count = remain;
  }

  closeOtherWindows() {
    this.contactWindow = false;
    this.previousChatScreen = true;
  }

  checkInput(event) {
    // console.log(event.target.value);
    if (this.content.length > 1) {
      this.editedMsg = true;
    }
  }

  issues = [
    { que: "Payment related issues?" },
    { que: "Are you seeking information?" },
    { que: "Are you facing any problem with application?" },
    // { que: "What happens if I enable share option in my Spaark?", ans: "By enabling the share option you let others share your Spaark on external platforms (like Whatsapp, Twitter, Facebook, Instagram etc)" },
    // { que: "By enabling the Share option, what all details will be shared?", ans: "Sharing will only share the Contents of a Spaark along with the comments other users have made on that Spaark. Any user accessing the shared link has only read permissions i.e. s/he can not comment or connect through the shared Spaark." },
  ];

  clickedLogin() {
    this.showLogin = true;
  }

  addImages() {
    if (this.fileAr.length > 4) {
      this.spaarksService.somethingWentWrong("Only 4 images are allowed");
      return;
    }
    try {
      this.myFile.nativeElement.value = null;
      this.myFile.nativeElement.value = "";
      this.myFile.nativeElement.innerHTML = "";
    } catch {}

    this.myFile.nativeElement.click();
  }

  deleteImg(idx: number) {
    this.imgListBuffer = [];
    this.myFile.nativeElement.value = "";
    this.myFile.nativeElement.innerHTML = "";

    for (let i = 0; i <= this.imageList.length; i++) {
      if (this.imageList[i] == this.imageList[idx]) {
        this.imageList.splice(idx, 1);
        this.fileAr.splice(idx, 1);
        return;
      } else {
        this.imgListBuffer.push(this.imageList[i]);
      }
    }
  }

  onImagePicked(event: Event) {
    this.imagePicked = true;
    let fileLength = 0;
    const files = (event.target as HTMLInputElement).files;
    const file = Array.from(files);

    this.imageArrLength = file.length;
    // console.log("FFFFFFFFFFFFFFFFFFF", file)
    console.log(files);

    fileLength = file.length;
    // console.log('files length is', fileLength);
    this.imageForm.patchValue({ imageForm: file });
    this.imageForm.updateValueAndValidity();

    this.validFormats = ["image", "video"];
    if (file.length > 4) {
      this.spaarksService.somethingWentWrong("Only 4 images are allowed");
      return;
    }
    if (file.length + this.fileAr.length > 4) {
      this.spaarksService.somethingWentWrong("Only 4 images are allowed");

      return;
    }
    if (file) {
      console.log("FILELFIELEIFLELIE", file);
      for (let i = 0; i < file.length; i++) {
        if (file[i]) {
          if (
            this.validFormats.indexOf(
              file[i].type.substring(0, file[i].type.indexOf("/"))
            ) == -1
          ) {
            this.allpurposeService.triggerModal.next({
              type: "alertModal",
              modal: true,
              modalMsg: "Upload an image or a video",
            });
            //this.spaarksService.showAlert("Upload an Image or a Video");
            // this.activeUsersService.alertModalSub.next('Upload an Image or a Video');
            return;
          }
        }
        let type = "";
        if (file[i].type.substring(0, file[i].type.indexOf("/")) == "image") {
          if (file[i]) {
            if (file[i].type) {
              if (
                file[i].type != "image/jpeg" &&
                file[i].type != "image/jpg" &&
                file[i].type != "image/png" &&
                file[i].type != "image/webp" &&
                file[i].type != "image/bmp"
              ) {
                this.allpurposeService.triggerModal.next({
                  type: "alertModal",
                  modal: true,
                  modalMsg: "Format not supported",
                });
                // this.spaarksService.showAlert('Format not supported');
                // this.activeUsersService.alertModalSub.next('Format not supported');
                return;
              }
            }
          }

          if (file[i].size / 1000 / 1000 > 25) {
            this.allpurposeService.triggerModal.next({
              type: "alertModal",
              modal: true,
              modalMsg: "Image size cannot exceed 25MB",
            });
            //this.spaarksService.showAlert("Image size cannot exceed 25MB");
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
            this.imageList.push({ type: "img", data: reader.result });
            this.fileAr.push(file[i]);

            this.spaarksService.selectedCreate.imageList = this.imageList;
            this.spaarksService.selectedCreate.fileAr = this.fileAr;
          };
          reader.readAsDataURL(file[i]);
          //upload to backend -----vv
        } else if (
          file[i].type.substring(0, file[i].type.indexOf("/")) == "video"
        ) {
          if (file[i].size / 1000 / 1000 > 50) {
            this.allpurposeService.triggerModal.next({
              type: "alertModal",
              modal: true,
              modalMsg: "Video size cannot exceed 50MB",
            });
            // this.spaarksService.showAlert("Video size cannot exceed 50MB");
            // this.activeUsersService.alertModalSub.next('Video size cannot exceed 50MB');
            return;
          }
          if (file[i].type == "video/mp4") {
            let date = Date.now();
            const reader = new FileReader();
            reader.onload = () => {
              this.imagePreview = reader.result;
              this.imageList.push({ type: "vid", data: reader.result });
              this.fileAr.push(file[i]);
              this.videoArr.push(file[i]);

              this.spaarksService.selectedCreate.imageList = this.imageList;
              this.spaarksService.selectedCreate.fileAr = this.fileAr;
            };

            reader.readAsDataURL(file[i]);
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
}
