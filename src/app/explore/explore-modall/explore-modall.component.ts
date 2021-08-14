import { SpaarksService } from './../../spaarks.service';
import { AllpurposeserviceService } from './../../allpurposeservice.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-explore-modall',
  templateUrl: './explore-modall.component.html',
  styleUrls: ['./explore-modall.component.scss']
})
export class ExploreModallComponent implements OnInit {

  constructor(private multipurposeService:AllpurposeserviceService,private spaarksService:SpaarksService) { }

  post = undefined;
  showspaarkModal = false;
  DataSource;

  ngOnInit(): void {
    this.multipurposeService.triggerModal.subscribe((succe: any) => {
      console.log(succe);
      this.spaarksService.modalType = succe.type;

      if (succe.type == 'spaarkinmodal') {
        this.showspaarkModal = succe.modal;
        this.post = succe.post;
        if (succe.source) {
          this.DataSource = succe.source;
        }  
        this.multipurposeService.modalStatus = succe.modal;
      }

    });
  
  }



  closeModal() {
    this.showspaarkModal = false;   
    this.multipurposeService.modalStatus = false;
  }






}
