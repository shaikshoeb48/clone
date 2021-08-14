import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MainView } from "./mainview/mainview.component";
import { SpaarksRouting } from "./spaarks-routing.module";
import { ViewRoott } from "./viewroot/viewroot.component";
import { Languagee } from "./language/language.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { PreferencesComponent } from "./preferences/preferences.component";
import { NgxMasonryModule } from "ngx-masonry";
import { MatChipsModule } from "@angular/material/chips";
import { InViewportModule } from "ng-in-viewport";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatMenuModule } from "@angular/material/menu";
import { MatTabsModule } from "@angular/material/tabs";
// import { ExplorecarouselComponent } from "./explorecarousel/explorecarousel.component";
import { LocationPermissionComponent } from "./location-permission/location-permission.component";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { AllpurposelistComponent } from "./allpurposelist/allpurposelist.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatStepperModule } from "@angular/material/stepper";
import { MatSliderModule } from "@angular/material/slider";
import { BarRatingModule } from "node_modules/ngx-bar-rating";
import { SellercardComponent } from "./sellercard/sellercard.component";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { NgOtpInputModule } from "ng-otp-input";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { CookiepolicyComponent } from "./cookiepolicy/cookiepolicy.component";
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { StarRatingModule } from "angular-star-rating";
import { MatCardModule } from "@angular/material/card";
import { ChatRequestContainerComponent } from "./chat-request-container/chat-request-container.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { WorkStatusComponent } from "./work-status/work-status.component";
import { SharedModule } from "../shared/shared.module";
import { AgmCoreModule } from "@agm/core";
import { RequestWrapperComponent } from "./request-wrapper/request-wrapper.component";
import { ChatModule } from "../chat/chat.module";
import { TagInputModule } from "ngx-chips";
import { DirectivesModule } from "../directives/directives.module";
import { GetstartedgaurdService } from "../getstartedgaurd.service";
import { TopbarComponent } from "../shared/topbar/topbar.component";
import { NotificationComponent } from "./notification/notification.component";
// import { NotifItemComponent } from './notif-item/notif-item.component';

@NgModule({
  declarations: [
    MainView,
    ViewRoott,
    Languagee,
    PreferencesComponent,
    // ExplorecarouselComponent,
    LocationPermissionComponent,
    AllpurposelistComponent,
    LandingPageComponent,
    SellercardComponent,
    CookiepolicyComponent,
    ChatRequestContainerComponent,
    WorkStatusComponent,
    RequestWrapperComponent,
    NotificationComponent,
    // NotifItemComponent
  ],
  imports: [
    TagInputModule,
    CommonModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    SpaarksRouting,
    MatTabsModule,
    NgxMasonryModule,
    MatChipsModule,
    InViewportModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatMenuModule,
    MatStepperModule,
    MatSliderModule,
    BarRatingModule,
    MatSnackBarModule,
    NgxSkeletonLoaderModule,
    NgOtpInputModule,
    NgbModule,
    MatSelectModule,
    // BrowserAnimationsModule,
    MatRadioModule,
    MatCardModule,
    ScrollingModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    DirectivesModule,
    StarRatingModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "",
    }),
    InfiniteScrollModule,
    MatCheckboxModule,
    ChatModule,
  ],
  exports: [MainView, MatMenuModule, CookiepolicyComponent],
  entryComponents: [MainView],
  providers: [GetstartedgaurdService],
})
export class SpaarksModule {}
