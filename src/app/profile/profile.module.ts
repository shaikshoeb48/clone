import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { UserprofileComponent } from "./userprofile/userprofile.component";
import { SellerProfContainerComponent } from "./seller-prof-container/seller-prof-container.component";
import { SellerprofileComponent } from "./sellerprofile/sellerprofile.component";
import { ProfileContainerComponent } from "./profile-container/profile-container.component";
import { SellercategoryratingComponent } from "./sellercategoryrating/sellercategoryrating.component";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";

import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { ProfileRouting } from "./profile-routing.module";
import { BookmarksComponent } from "./bookmarks/bookmarks.component";
import { RightFeed } from "../shared/rightfeed/rightfeed.component";
import { RatingsComponent } from "../shared/ratings/ratings.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { DirectivesModule } from '../directives/directives.module';
import { BarRatingModule, BarRating } from 'ngx-bar-rating';
// import { MainfeedDirDirective } from "../mainfeed-dir.directive";
// import { MainfeedDirDirective } from '../mainfeed-dir.directive';

@NgModule({
  declarations: [
    UserprofileComponent,
    SellerProfContainerComponent,
    SellerprofileComponent,
    ProfileContainerComponent,
    SellercategoryratingComponent,
    BookmarksComponent

    // MainfeedDirDirective,
  ],
  imports: [
    SharedModule,
    CommonModule,
    MatCardModule,
    CommonModule,
    FormsModule,
    ProfileRouting,
    MatBottomSheetModule,
    MatButtonToggleModule,
    DirectivesModule,
    BarRatingModule
    // MainfeedDirDirective
  ],
  exports: [SellercategoryratingComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [RatingsComponent],
})
export class ProfileModule {}
