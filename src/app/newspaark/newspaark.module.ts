import { NgModule } from "@angular/core";
import { CreateFirstStepComponent } from "./create-first-step/create-first-step.component";
import { CreateSecondStepComponent } from "./create-second-step/create-second-step.component";
import { CreateLayoutComponent } from "./createlayout/create-layout.component";
import { FirstStepComponent } from "./first-step/first-step.component";
import { NewSpaarkComponent } from "./new-spaark/new-spaark.component";
import { SecondStepComponent } from "./second-step/second-step.component";
import { SteppercontainerComponent } from "./steppercontainer/steppercontainer.component";
import { ThirdStepComponent } from "./third-step/third-step.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AgmCoreModule } from "@agm/core";
import { SharedModule } from "../shared/shared.module";
import { MatChipsModule } from "@angular/material/chips";
import { NewSpaarkRouting } from "./newspaark-routing.module";
import { MatSliderModule } from "@angular/material/slider";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { DirectivesModule } from "../directives/directives.module";

@NgModule({
  declarations: [
    CreateFirstStepComponent,
    CreateSecondStepComponent,
    CreateLayoutComponent,
    FirstStepComponent,
    NewSpaarkComponent,
    SecondStepComponent,
    SteppercontainerComponent,
    ThirdStepComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DirectivesModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: "",
    }),
    MatChipsModule,
    NewSpaarkRouting,
    MatSliderModule,
    MatBottomSheetModule,
  ],
})
export class NewspaarkModule {}
