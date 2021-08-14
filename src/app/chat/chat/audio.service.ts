import { Injectable } from '@angular/core';
import { Subject,Observable } from 'rxjs';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment'
import { ChatService } from 'src/app/chat.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }
  private stream;
  private recorder;
  private interval;
  private startTime;
  private _recorded = new Subject<any>();
  private _recordingTime = new Subject<string>();
  private _recordingFailed = new Subject<string>();
  
  
  getRecordedBlob(): Observable<any> {
    return this._recorded.asObservable();
  }
  
  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }
  
  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }

  startRecording() {

    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }
  
    this._recordingTime.next('00:00');
   try{
    navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
      console.log('getmic in startrecording')
      this.stream = s;
      this.record();
    }).catch(error => {
      this._recordingFailed.next();
    });
   }catch{console.log('catch in startrecording')}
  
  }
  
  private record() {

    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: 'audio',
      mimeType: 'audio/webm'
    });
  
    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
        this._recordingTime.next(time);
      },
      1000
    );
  }

  private toString(value) {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  } 

  stopRecording(check,toWhichChat) {

    if(check == 1){
      if (this.recorder) {
        this.recorder.stop((blob) => {
          if (this.startTime) {
            const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
            this.stopMedia();
            this._recorded.next({ blob: blob, title: mp3Name, to: toWhichChat });
           ChatService.scrollToBottom.next({});
          }
        }, () => {
          this.stopMedia();
          this._recordingFailed.next();
        });
      }
    }else{
      this.stopMedia()
    }
  }

  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => track.stop());
        this.stream = null;
      }
    }
  }
  
  abortRecording() {
    this.stopMedia();
  }

}
