import {
  Component,
  OnInit,
  ɵConsole,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { SpaarksService } from "../../spaarks.service";
import { BusinessTicketsComponent } from "../business-tickets/business-tickets.component";
import { FormControl, Validators } from "@angular/forms";
import { AllpurposeserviceService } from "src/app/allpurposeservice.service";

@Component({
  selector: "app-business-enq",
  templateUrl: "./business-enq.component.html",
  styleUrls: ["./business-enq.component.scss"],
})
export class BusinessEnqComponent implements OnInit {
  constructor(
    private spaarksService: SpaarksService,
    private allpurposeService: AllpurposeserviceService
  ) {
    this.isMobileVersion = this.spaarksService.isMobileVersion;
  }
  panelOpenState = false;
  businessQueries;
  previousChatScreen = false;
  loading = false;
  isMobileVersion;
  disableBtn=false;
  validFormats = [];
  imageArr = [];
  imagePreview;
  imageList = [];
  fileAr = [];
  imgListBuffer = [];
  videoArr = [];
  videoCount = 0;
  imageForm: FormControl = new FormControl(null, {
    validators: [Validators.required],
  });
  counter = 0;

  selectedQuery;
  bussinesChatScreen = false;

  isAuthed = this.spaarksService.isJai;

  content = "";
  imgArr = [];
  showBtn = false;
  selectedBusinessQuery;
  showTickets = false;
  showLogin = false;
  isTicketOpen = true;
  @ViewChild("myFile") myFile: ElementRef;

  ngOnInit(): void {
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
    if (this.spaarksService.authData.isAuthenticated) {
      this.spaarksService.getBusinessQueries().subscribe((succ) => {
        // console.log(succ);
        this.businessQueries = succ;
        console.log("businwsss queriws", this.businessQueries);
        // this.tickets.forEach(ind => {

        // });
      });
    }

    this.spaarksService.checkforLocation();
  }

  ngOnChanges() {}
  count = 1000;
  textEntered(eve) {
    if (!this.isAuthed) {
      this.spaarksService.triggerLogin();
      return;
    }
    let remain = 1000 - eve.target.textLength;
    this.count = remain;
    console.log(this.content);
    // if (this.content == ''||this.content.match(/^\s*$/))
    //   this.showBtn = false;
    // else {
    //   this.showBtn = true
    // }
  }

  submitForm() {
    if (!this.isAuthed) {
      this.spaarksService.triggerLogin();
      return;
    }
     this.disableBtn=true;
    if (this.content == "" || this.content.match(/^\s*$/)) {
      // alert('Description cannot be empty please type something');
      this.spaarksService.somethingWentWrong("Text field cannot be empty");
      this.content = "";
     this.disableBtn=false;
            return;
    }

    if (this.content.match(/^[0-9]+$/) != null) {
      // alert('Description cannot be empty please type something');
      this.spaarksService.somethingWentWrong("Only numbers are not allowed.");

      return;
    }
    this.loading = true;
    this.bussinesChatScreen = true;

    let form: FormData = new FormData();
    console.log(this.content);
    form.append("content", this.content);
    form.append("type", "business");

    for (let i = 0; i < this.imageList.length; i++) {
      if (this.imageList[i]["type"] == "img") {
        form.append("photo", this.fileAr[i]);
      }
    }

    this.selectedQuery = "problem";
    form.append("subject", this.selectedQuery);
    this.spaarksService.sendContactData(form).subscribe((succe: any) => {
      console.log(succe);
      //alert('Issue Register');
      this.loading = false;
      this.bussinesChatScreen = false;
      this.disableBtn=true;
      this.content = "";
      this.spaarksService.somethingWentWrong(succe.message);

      this.imageList = [];
      this.fileAr = [];
      this.imgArr = [];
      if (this.spaarksService.authData.isAuthenticated) {
        this.spaarksService.getBusinessQueries().subscribe((succ) => {
          // console.log(succ);
          this.businessQueries = [];
          this.businessQueries = succ;
          console.log("businwsss queriws", this.businessQueries);
           
          this.disableBtn=false;
        

          // this.tickets.forEach(ind => {

          // });
        });
      }

    });
    this.count = 1000;
  }

  closeOtherWindows() {
    this.bussinesChatScreen = false;
  }

  clickedbusinessQuery(eve) {
    this.showTickets = true;
    this.bussinesChatScreen = !this.bussinesChatScreen;
    this.selectedBusinessQuery = eve;
  }
  issues = [
    {
      que: "Payment related issues?",
      ans:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      que: "Are you seeking information?",
      ans:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      que: "Are you facing any problem with application?",
      ans:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    // { que: "What happens if I enable share option in my Spaark?", ans: "By enabling the share option you let others share your Spaark on external platforms (like Whatsapp, Twitter, Facebook, Instagram etc)" },
    // { que: "By enabling the Share option, what all details will be shared?", ans: "Sharing will only share the Contents of a Spaark along with the comments other users have made on that Spaark. Any user accessing the shared link has only read permissions i.e. s/he can not comment or connect through the shared Spaark." },
  ];

  clickedLogin() {
    this.showLogin = true;
  }

  moveBack() {
    this.bussinesChatScreen = !this.bussinesChatScreen;
    this.showTickets = !this.showTickets;
  }

  addImages() {
    // console.log(this.imageList)
    // console.log(this.fileAr);
    // console.log(this.imageArr);
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

  onImagePicked(event: Event) {
    let fileLength = 0;
    const files = (event.target as HTMLInputElement).files;
    const file = Array.from(files);
    // if (file.length > 5) {
    //   this.isInvalid = true;
    // }

    fileLength = file.length;
    //console.log('files length is', this.fileAr.length);
    this.imageForm.patchValue({ imageForm: file });
    this.imageForm.updateValueAndValidity();

    this.validFormats = ["image", "video"];

    if (file.length > 4) {
      this.spaarksService.somethingWentWrong("Only 4 images are allowed");

      return;
    }
    if (this.fileAr.length + file.length > 4) {
      this.spaarksService.somethingWentWrong("Only 4 images are allowed");

      return;
    }
    if (file) {
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
              modalMsg: "Upload an Image",
            });
            // this.spaarksService.showAlert("Upload an Image or a Video");
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
                //this.spaarksService.showAlert('Format not supported');
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
            // console.log(this.counter);
            this.imagePreview = reader.result;
            // console.log(this.imagePreview);
            this.imageList.push({ type: "img", data: reader.result });
            this.fileAr.push(file[i]);
            console.log(this.fileAr);
          };
          reader.readAsDataURL(file[i]);
          //upload to backend -----vv
        } else if (
          file[i].type.substring(0, file[i].type.indexOf("/")) == "video"
        ) {
          this.allpurposeService.triggerModal.next({
            type: "alertModal",
            modal: true,
            modalMsg: "Invalid file type found.",
          });
          return;
          // type="error";
          // if (file[i].size / 1000 / 1000 > 50) {
          //   this.allpurposeService.triggerModal.next({
          //     type: "alertModal",
          //     modal: true,
          //     modalMsg: "Video size cannot exceed 50MB",
          //   });
          //   //this.spaarksService.showAlert("Video size cannot exceed 50MB");
          //   // this.activeUsersService.alertModalSub.next('Video size cannot exceed 50MB');
          //   return;
          // }
          // if (file[i].type == "video/mp4") {
          //   let date = Date.now();
          //   const reader = new FileReader();
          //   reader.onload = () => {
          //     this.imagePreview = reader.result;
          //     this.imageList.push({ type: "vid", data: reader.result });
          //     this.fileAr.push(file[i]);
          //     this.videoArr.push(file[i]);
          //   };

          //   reader.readAsDataURL(file[i]);
          // } else {
          //   // alert('Upload MP4 Format Videos Only');
          //   // this.activeUsersService.alertModalSub.next('Upload MP4 Format Videos Only');
          // }
        } else {
          type = "error";
        }
      }
      // console.log(this.fileAr);
    }

    // console.log(this.imageList)
    //*********************************************************************************************
    //end-procedure :
    //**********************************************************************************************
  }

  deleteImg(idx: number) {
    this.imgListBuffer = [];
    this.myFile.nativeElement.value = "";
    this.myFile.nativeElement.innerHTML = "";

    for (let i = 0; i <= this.imageList.length; i++) {
      if (this.imageList[i] == this.imageList[idx]) {
        this.imageList.splice(idx, 1);
        this.fileAr.splice(idx, 1);
        //return;
      } else {
        this.imgListBuffer.push(this.imageList[i]);
      }
    }
    console.log(this.fileAr);
  }
}
