import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { computeDecimalDigest } from "@angular/compiler/src/i18n/digest";
import { FormControl, Validators } from "@angular/forms";
import { SpaarksService } from "../../spaarks.service";

@Component({
  selector: "app-commentscontainer",
  templateUrl: "./commentscontainer.component.html",
  styleUrls: ["./commentscontainer.component.scss"],
})
export class CommentscontainerComponent implements OnInit {
  constructor(private spaarkService: SpaarksService) {}
  placeHolderText = "Please login to post a comment";

  isAuthed = false;
  postId;
  userId;
  @Input("commentsArr") commentsArr = [];
  @Input("post") post;
  @Output("updatecomments") updatecomments = new EventEmitter();
  description = "";
  allowed: any = 140;
  imgArr = [];

  @ViewChild("myFile") myFile: ElementRef;

  numb = "140";

  imageForm: FormControl = new FormControl(null, {
    validators: [Validators.required],
  });

  validFormats = [];

  imageArr = []; // to store original file image files

  counter = 0;

  imagePreview;
  imgListBuffer = [];
  count = 140;
  remain;
  isSafariBrowser = false;

  imageList = [];
  fileAr = [];
  videoArr = []; // to store original file vid files

  ngOnInit(): void {
    this.spaarkService.reqErrorSubj.subscribe((a) => {
      console.log(a);
    });
    if (localStorage.getItem("id") == this.post.userId) {
      this.spaarkService.somethingWentWrong("It's your own Spaark.");
    }
    this.postId = this.post.userId;

    this.userId = localStorage.getItem("id");

    this.isAuthed = this.spaarkService.authData.isAuthenticated;
    console.log(this.commentsArr);
  }

  redirectToLogin() {
    this.spaarkService.triggerLogin();
  }

  onImagePicked(event: Event) {
    let fileLength = 0;
    const files = (event.target as HTMLInputElement).files;
    const file = Array.from(files);

    fileLength = file.length;
    // console.log('files length is', fileLength);
    this.imageForm.patchValue({ imageForm: file });
    this.imageForm.updateValueAndValidity();

    this.validFormats = ["image", "video"];

    if (file) {
      for (let i = 0; i < file.length; i++) {
        if (file[i]) {
          if (
            this.validFormats.indexOf(
              file[i].type.substring(0, file[i].type.indexOf("/"))
            ) == -1
          ) {
            // alert("Upload an Image or a Video");
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
                // alert('Format not supported');
                // this.activeUsersService.alertModalSub.next('Format not supported');
                return;
              }
            }
          }

          if (file[i].size / 1000 / 1000 > 25) {
            // alert("image size cannot exceed 25MB");
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
          };
          reader.readAsDataURL(file[i]);
          //upload to backend -----vv
        } else if (
          file[i].type.substring(0, file[i].type.indexOf("/")) == "video"
        ) {
          if (file[i].size / 1000 / 1000 > 50) {
            // alert("Video size cannot exceed 50MB");
            // this.activeUsersService.alertModalSub.next('Video size cannot exceed 50MB');
            return;
          }
          // if (file[i].type == 'video/mp4') {
          //   let date = Date.now()
          //   //upload to backend -----vv
          //   const reader = new FileReader();

          //   reader.onload = () => {
          //     this.imagePreview = reader.result;
          //     this.imageList.push(
          //       { type: 'vid', data: reader.result }
          //     );
          //     this.fileAr.push(file[i]);
          //     this.videoArr.push(file[i]);
          //   };

          //   reader.readAsDataURL(file[i]);
          // }
          else {
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

  // onAdd(): this function will validates the content of a commnet if everything is fine then it will post the comment.
  onAdd() {
    this.myFile.nativeElement.value = null;
    this.myFile.nativeElement.click();

    // if (!this.description.replace(/\s/g, '').length) {
    //   alert('only white spaces not allowed')
    //   return;
    // }
    // this.count = 140;
  }

  deleteImg(idx: number) {
    this.imgListBuffer = [];

    this.myFile.nativeElement.value = "";
    this.myFile.nativeElement.innerHTML = "";

    for (let i = 0; i <= this.imageList.length; i++) {
      if (this.imageList[i] == this.imageList[idx]) {
        this.imageList.splice(idx, 1);
        this.fileAr.splice(idx, 1);

        // console.table(this.fileAr);
        // console.table(this.imageList);
        return;
      } else {
        this.imgListBuffer.push(this.imageList[i]);
      }
    }

    // for (let i = 0; i <= this.imageList.length; i++) {
    //   if (this.imageList[i] == this.imageList[idx]) {
    //     delete this.imageList[idx];
    //   } else {
    //     this.imgListBuffer.push(this.imageList[i]);
    //   }
    // }

    // this.imageList = this.imgListBuffer;

    // this.fileAr.splice(idx, 1);
  }

  /*******End of Function*********/

  // isSafari(): it will detect Safari browser and set character count to constant value
  isSafari() {
    if (/apple/i.test(navigator.vendor)) {
      //console.log("Its safari");

      //alert('Its Safari');
      this.count = 140;
      this.isSafariBrowser = true;
    }
  }
  /*******End of Function*********/
  //update(): On Every keystrokes from textBox this function counts the remaining characters
  update(evt) {
    // console.log('v')

    if (this.isSafariBrowser) {
      this.count = 140;
    } else {
      this.allowed = this.allowed - 1;
      this.numb = this.allowed + "";
      this.remain = 140 - evt.target.textLength;
      this.count = this.remain;
    }
    /*******End of Function*********/
  }

  createComment() {
    console.log("i got clickedddd");
    if (
      (this.description == "" || this.description.match(/^\s*$/)) &&
      this.fileAr.length == 0
    ) {
      this.spaarkService.somethingWentWrong("Type something to comment");
      this.description = "";
      return;
    }
    // console.log(this.post);
    // console.log(this.fileAr);

    try {
      this.spaarkService
        .createComment(
          this.description,
          this.fileAr,
          this.post._id,
          this.post.featureName
        )
        .subscribe((suc: any) => {
          console.log(suc);
          this.updatecomments.emit({ newcomment: true });
          this.description = "";
          // this.spaarkService.commentCreated.next();
          this.commentsArr.unshift(suc);
          this.count = 140;
        });
    } catch {
      console.log("some yhing hapend"),
        (err) => {
          this.spaarkService.catchInternalErrs(err);
        };
    }

    console.log(this.description);
    console.log(this.fileAr);

    this.fileAr = [];
    this.imageArr = [];
    this.imageList = [];

    // sending location to backend
    if (this.spaarkService.authData.isAuthenticated)
      this.spaarkService.postUpdatedLocation().subscribe();
  }
}
