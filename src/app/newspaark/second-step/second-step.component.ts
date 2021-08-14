import { SpaarksService } from "../../spaarks.service";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-second-step",
  templateUrl: "./second-step.component.html",
  styleUrls: ["./second-step.component.scss"],
})
export class SecondStepComponent implements OnInit {
  constructor(private SpaarksService: SpaarksService, private router: Router) {}
  @Output("clickedNext") clickedNextEmitter = new EventEmitter();

  ngOnInit(): void {}

  clickedNext() {
    this.clickedNextEmitter.emit({ clicked: "true" });
  }

  clickedPrevious() {
    // alert('HGeloo');
    // this.router.navigateByUrl('/home/newspaark/create/Offer-a-Service');
    // this.router.navigateByUrl('home/newspaark/create/Offer-a-Service')
    // this.SpaarksService.CreateSpaarkSteps.StepState="three";

    if (
      this.SpaarksService.CreateSpaarkSteps.StepState == "two" &&
      this.SpaarksService.CreateSpaarkSteps.currentStep == "second"
    ) {
      this.SpaarksService.previousSubj.next("BackToFirstPage");
      return;
    }

    if (this.SpaarksService.CreateSpaarkSteps.StepState == "two") {
      this.SpaarksService.previousSubj.next("BackToCat");
      return;
    }
    if (this.SpaarksService.CreateSpaarkSteps.firstSkip == true) {
      this.SpaarksService.previousSubj.next("BackToCat");
      return;
    }

    if (this.SpaarksService.CreateSpaarkSteps.StepState == "three") {
      this.SpaarksService.previousSubj.next("BackToSubCat");

      return;
    }

    if (this.SpaarksService.CreateSpaarkSteps.secondSkip == true) {
      this.SpaarksService.previousSubj.next("BackToSubCat");

      return;
    }

    if (
      this.SpaarksService.CreateSpaarkSteps.Cat == "Make-Friends" ||
      this.SpaarksService.CreateSpaarkSteps.Cat == "Announce-Something"
    ) {
      //alert('Hello')
      this.router.navigateByUrl("home/newspaark");
      this.SpaarksService.CreateSpaarkSteps = this.SpaarksService.DefaultSpaarkSteps;
      return;
    }

    //alert("Function Is Ruinning");
  }
}
