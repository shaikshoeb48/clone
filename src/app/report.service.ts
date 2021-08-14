import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ReportService {
  
  dynamicGetLink;
  blockedSubj = new Subject();
  jidRefreshSubs = new Subject();
  newchatsubj_jai = new Subject();
  storiesSubj = new Subject();
  featureDot = new Subject();
  multiPurposeSubj = new Subject();
  accountTab = 1;
  
  constructor(public http: HttpClient) {
   
   
 
  }
  // getUserProfileDetails(idd){
  //   return this.http.get(environment.baseUrl+'user/userprofile/'+idd);
  // }
  // sendReport(content: string, id: any, type: string) {
  //   // console.log(type)
   

  //   if (this.activeUsers.serviceState == 'Unsafe') {
  //     this.dynamicGetLink = environment.feature3;
  //   }
  //   else if (this.activeUsers.serviceState == 'Ambulance') {
  //     this.dynamicGetLink = environment.ambulance;
  //   }
  //   else if (this.activeUsers.serviceState == 'Greet') {
  //     this.dynamicGetLink = environment.greet;
  //   }
  //   else if (this.activeUsers.serviceState == 'Playtime') {
  //     this.dynamicGetLink = environment.playtime;
  //   }
  //   else if (this.activeUsers.serviceState == 'Deposit') {
  //     this.dynamicGetLink = environment.deposit;
  //   }
  //   else if (this.activeUsers.serviceState == 'People') {
  //     this.dynamicGetLink = environment.people;
  //   }
  //   else if (this.activeUsers.serviceState == undefined || this.activeUsers.serviceState == null) {
  //     return
  //   }


  //   this.http.post(this.dynamicGetLink + 'report/' + type,
  //     {
  //       "id": id,
  //       "reason": "..."
  //     },{withCredentials:true})
  //     .subscribe(i => {
  //       // console.log(i)
  //     },
  //       error => {
  //         // console.log(error.error.message)
  //       }
  //     )

  // }

  // subscribeUser(uid, category) {
  
  //   // alert(subCategory);
  //   // subCategory = this.activeUsers.subCategory;
  //   var data = { uid: uid, category: category }
  //   // alert(subCategory);

  //   console.log('http options above is ');
  //   return this.http.post(environment.baseUrl + 'user/dosubscription', data,{withCredentials:true});

  // }

  // reportPost(id, fname) {
   
  //   //console.log('id at report comment is ',id);
  //   //console.log('type of id at report comment is ',typeof(id));
  //   var data = {
  //     reason: 'Reported users post',
  //     featureId: id,
  //     featureName: fname,
  //     originalName: this.langService.langdata[fname]
  //   };

  //   if (this.activeUsers.serviceState == 'Unsafe') {
  //     this.dynamicGetLink = environment.feature3;
  //   }
  //   else if (this.activeUsers.serviceState == 'Ambulance') {
  //     this.dynamicGetLink = environment.ambulance;
  //   }
  //   else if (this.activeUsers.serviceState == 'Greet') {
  //     this.dynamicGetLink = environment.greet;
  //   }
  //   else if (this.activeUsers.serviceState == 'Playtime') {
  //     this.dynamicGetLink = environment.playtime;
  //   }
  //   else if (this.activeUsers.serviceState == 'Deposit') {
  //     this.dynamicGetLink = environment.deposit;
  //   }
  //   else if (this.activeUsers.serviceState == 'People') {
  //     this.dynamicGetLink = environment.people;
  //   }
  //   else if (this.activeUsers.serviceState == 'Showtime') {
  //     this.dynamicGetLink = environment.showtime;
  //   }
  //   else if (this.activeUsers.serviceState == 'Market') {
  //     this.dynamicGetLink = environment.market;
  //   }
  //   else if (this.activeUsers.serviceState == undefined || this.activeUsers.serviceState == null) {
  //     return
  //   }

  //   console.log('http options above is ');
  //   return this.http.post(this.dynamicGetLink + 'report/post', data,{withCredentials:true});

  // }

  reportSubpost(id, fname) {
   // alert(id);
     //alert(fname)
     //alert(this.activeUsers.serviceState)

  

    var data = {
      reason: 'Reported users sub-post',
      featureId: id,
      featureName: fname,
      originalName: ''
    };


    return this.http.post(environment.baseUrl +`/api/v2.0/${fname}`+ '/report/subpost', data,{withCredentials:true});

  }

  reportComment(id, fname) {
 
    console.log('http options is ');
    var data = {
      reason: 'Reported users comment',
      featureId: id,
      featureName: fname,
      originalName: ''
    };
    

    return this.http.post(environment.baseUrl+'/api/v2.0/'+fname + '/report/comment', data,{withCredentials:true});
  }

  blockUser(blk: any) {

  
 
    var url = environment.baseUrl + '/api/v2.0/user/blockuser/post';
    console.log('http options in the end is ')
    var obj;
    if (blk.featureName == 'chat') {
      obj = { featureName: 'chat', jid: blk.jid, userId: blk.userId, mjid: this.accountTab }
    }
    else {
      obj = { featureName: blk.featureName, postId: blk.postId, userId: blk.userId, jid: blk.jid }
    }
    return this.http.post(url, obj,{withCredentials:true});

  }

  blockOther(blk) {
   
    console.log(blk);
    var url = environment.baseUrl + '/api/v2.0/user/blockuser/other';
    return this.http.post(url, blk,{withCredentials:true});

  }
  sendLatLngOnClick(lat,long,radius){
    let bodyy = {
      longitude:Number(long.toFixed(7)),
      latitude:Number(lat.toFixed(7)),
      radius:radius,
      featureName:''
    }
    return this.http.post('',bodyy,{withCredentials:true});
  }






} 
