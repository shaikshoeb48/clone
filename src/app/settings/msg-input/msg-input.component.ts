import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SpaarksService } from '../../spaarks.service';

@Component({
  selector: 'app-msg-input',
  templateUrl: './msg-input.component.html',
  styleUrls: ['./msg-input.component.scss']
})
export class MsgInputComponent implements OnInit {

  @Input('compName') compName;

  constructor(private spaarkService:SpaarksService) { }

  fileAr = [];
  @Input('ischat') ischat = true;
  @Output('alloutput') alloutput = new EventEmitter();
  description = '';

  ngOnInit(): void {
  }

  sendMsg() {
    
      if(this.description==''||this.description.match(/^\s*$/)){
        if(this.fileAr.length>0)
        {
          if(this.description.match(/^\s*$/)){
            this.description=''
          }
        }
        else{
          this.spaarkService.somethingWentWrong("Type something");
        this.description='';
        return
        }
        
      }
    
    
    console.log('cliccked send')
    if (this.imageList.length > 0) {
      
      this.alloutput.emit({ compName: this.compName, content: this.description, images: [...this.fileAr] })
    } else {
      this.alloutput.emit({ compName: this.compName, content: this.description, images: [] })
    }

    this.fileAr = [];
    this.description = '';
    this.imageList = []
    this.spaarkService.sentMessage.next(true);
  }

  changedInput(eve) {
    this.description = eve.target.value;

  }

  @ViewChild('myFile') myFile: ElementRef;

  imageForm: FormControl = new FormControl(null, {
    validators: [Validators.required]
  });

  validFormats = [];
  imageArr = [];
  imagePreview;
  imageList = [];
  // fileAr = [];
  imgListBuffer = [];
  videoArr = [];

  counter = 0;


  addImages() {
    try {
      this.myFile.nativeElement.value = null;
      this.myFile.nativeElement.value = ''
      this.myFile.nativeElement.innerHTML = '';
    } catch{ }

    this.myFile.nativeElement.click();
  }

  deleteImg(idx: number) {
    this.imgListBuffer = [];

    this.myFile.nativeElement.value = ''
    this.myFile.nativeElement.innerHTML = '';

    for (let i = 0; i <= this.imageList.length; i++) {

      if (this.imageList[i] == this.imageList[idx]) {
        this.imageList.splice(idx, 1)
        this.fileAr.splice(idx, 1);

        // console.table(this.fileAr);
        // console.table(this.imageList);
        return;
      }
      else {
        this.imgListBuffer.push(this.imageList[i]);
      }
    }


  }


  onImagePicked(event: Event) {

    let fileLength = 0;
    const files = (event.target as HTMLInputElement).files;
    const file = Array.from(files)

    fileLength = file.length;
    // console.log('files length is', fileLength);
    this.imageForm.patchValue({ imageForm: file });
    this.imageForm.updateValueAndValidity();

    this.validFormats = ["image", "video"];

    if(file.length>4)
    {
      this.spaarkService.somethingWentWrong('only 4 images are allowed');
      return;
    }
    if(file.length+this.fileAr.length>4){
      this.spaarkService.somethingWentWrong('only 4 images are allowed');
      return
    }

    if (file) {

      for (let i = 0; i < file.length; i++) {
        if (file[i]) {
          if (this.validFormats.indexOf(
            file[i].type.substring(0, file[i].type.indexOf("/"))
          ) == -1) {
            // alert("Upload an Image or a Video");
            // this.activeUsersService.alertModalSub.next('Upload an Image or a Video');
            return;
          }
        }
        let type = '';
        if (file[i].type.substring(0, file[i].type.indexOf("/")) == 'image') {

          if (file[i]) {

            if (file[i].type) {

              if (file[i].type != 'image/jpeg' && file[i].type != 'image/jpg' && file[i].type != 'image/png' && file[i].type != 'image/webp' && file[i].type != 'image/bmp') {
                // alert('Format not supported');
                // this.activeUsersService.alertModalSub.next('Format not supported');
                return;
              }
            }
          }

          if ((file[i].size / 1000 / 1000) > 25) {
            // alert("image size cannot exceed 25MB");
            // this.activeUsersService.alertModalSub.next('image size cannot exceed 25MB');
            return;
          }
          this.imageArr.push(file[i]);

          let date = Date.now()

          const reader = new FileReader();
          reader.onload = () => {
            this.counter++;
            console.log(this.counter);
            this.imagePreview = reader.result;
            // console.log(this.imagePreview);
            this.imageList.push(
              { type: 'img', data: reader.result }
            );
            this.fileAr.push(file[i]);

          };
          reader.readAsDataURL(file[i]);
          //upload to backend -----vv
        }
        else if (file[i].type.substring(0, file[i].type.indexOf("/")) == 'video') {
          if ((file[i].size / 1000 / 1000) > 50) {
            // alert("Video size cannot exceed 50MB");
            // this.activeUsersService.alertModalSub.next('Video size cannot exceed 50MB');
            return;
          }
          if (file[i].type == 'video/mp4') {
            let date = Date.now()
            const reader = new FileReader();
            reader.onload = () => {
              this.imagePreview = reader.result;
              this.imageList.push(
                { type: 'vid', data: reader.result }
              );
              this.fileAr.push(file[i]);
              this.videoArr.push(file[i]);
            };

            reader.readAsDataURL(file[i]);
          }
          else {
            // alert('Upload MP4 Format Videos Only');
            // this.activeUsersService.alertModalSub.next('Upload MP4 Format Videos Only');
          }
        }
        else {
          type = 'error'
        }
      }
      console.log(this.fileAr);
    }
    //*********************************************************************************************
    //end-procedure :  
    //**********************************************************************************************


  }

}
