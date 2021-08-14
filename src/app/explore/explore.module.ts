import { ExploreRouting } from "./explore-routing.module";
import { NgModule } from "@angular/core";
import { MapCardComponent } from "./map-card/map-card.component";
import { ExploreMapComponent } from "./explore-map/explore-map.component";

import { AgmCoreModule } from "@agm/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { ExploreModallComponent } from "./explore-modall/explore-modall.component";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { DirectivesModule } from "../directives/directives.module";

@NgModule({
  declarations: [MapCardComponent, ExploreMapComponent, ExploreModallComponent],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: "",
    }),
    SharedModule,
    FormsModule,
    CommonModule,
    ExploreRouting,
    MatBottomSheetModule,
    DirectivesModule,
  ],
  // exports: [ExploreMapComponent],
  bootstrap: [ExploreMapComponent],
})
export class ExploreModule {}
