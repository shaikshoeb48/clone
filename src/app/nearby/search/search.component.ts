import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import {
  Router,
  ActivatedRoute,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { SpaarksService } from "../../spaarks.service";
import { AllpurposeserviceService } from "../../allpurposeservice.service";
import { Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private spaark: SpaarksService,
    private allPurposeService: AllpurposeserviceService
  ) {}

  allPurpSubs: Subscription;
  lastFeat = "market";
  allposts = [];
  posts = [];
  postsBeyond = [];
  allSellerPosts = [];
  category = "all";
  subCategory: "";
  hideSearchBar = true;
  specificPills = [
    {
      tags: [],
      isTag: false,
      _id: "somerandomid",
      categoryId: "All",
      category: "All",
      image: "All",
      __v: 0,
      isTicked: true,
      subCat: [],
    },
    {
      tags: [],
      isTag: false,
      _id: "somerandomids",
      categoryId: this.category,
      category: this.category,
      image: "All",
      __v: 0,
      isTicked: true,
      subCat: [],
    },
  ];

  showCallDiv = false;

  currentFeature = "";
  dynamicinp = null;

  @ViewChild("allSellerCard") allSellerCard: ElementRef;
  @ViewChild("allMarketCard") allMarketCard: ElementRef;

  marketTab = this.spaark.marketTab;
  content = "";
  fName = "market";

  pillsArr = [];
  @ViewChild("allMarketTab") allMarketTab: ElementRef;

  ngOnInit(): void {
    this.allPurpSubs = this.spaark.allPurposeSubject.subscribe((succ: any) => {
      console.log(succ);
      if (succ) {
        if (succ.type) {
          if (succ.type == "locationcompleted") {
            this.getPosts("market");
          }
        }
      }
    });

    if (this.spaark.authData.isAuthenticated) {
      this.showCallDiv = true;
    }

    this.router.events.subscribe((suc: any) => {
      console.log(suc);
      // this.category = suc.url.slice(suc.url.indexOf('nearby/'))
      console.log(this.category);

      // this.subCategory = suc.keywords
    });

    this.route.params.subscribe((succ) => {
      console.log(succ);
      this.category = succ.keyword;
      this.subCategory = succ.keyword;
      this.specificPills[1].category = succ.keyword;
      this.getPosts(this.subCategory);
      this.dynamicinp = { keyword: succ.keyword };
    });
    try {
      if (localStorage.getItem("weblocation")) {
        let loc = localStorage.getItem("weblocation");
        this.getPosts("market");
      } else {
        this.takeLocation();
      }
    } catch {
      this.takeLocation();
    }

    if (localStorage.getItem("preferences")) {
      let preferences = JSON.parse(localStorage.getItem("preferences"));

      preferences.forEach((val, ind) => {
        this.pillsArr.push(val);
      });
      console.log(this.pillsArr);
      this.pillsArr.unshift(this.specificPills[1]);
      this.pillsArr.unshift(this.specificPills[0]);
      console.log(this.pillsArr);
    } else {
      console.log(this.pillsArr);
      this.pillsArr.unshift(this.specificPills[1]);
      this.pillsArr.unshift(this.specificPills[0]);
      console.log(this.pillsArr);
    }

    // console.log(this.route.queryParams.);
  }

  scrollLeftSide() {
    this.allMarketTab.nativeElement.scrollLeft -= 151;
  }

  scrollRightSide() {
    this.allMarketTab.nativeElement.scrollLeft += 200;
  }

  takeLocation() {
    this.allPurposeService.triggerModal.next({
      type: "locationModal",
      step: "default",
      modal: true,
      from: "search",
    });
  }

  contactRequest(opt, post) {
    if (opt == "yes") {
      this.http.post(
        environment.baseUrl + "/api/v2.0/market/sendfcm",
        { post: post },
        { withCredentials: true }
      );
    } else if ("no") {
      this.showCallDiv = false;
    }
  }

  multioutputFromspaarkCard(eve) {
    if (eve) {
      if (eve.type) {
        if (eve.type == "blocksuccess") {
          this.getPosts(this.lastFeat);
        }
      }
    }
  }

  selectedCat(i, txt) {
    this.spaark.selectedCat(i, txt);
  }

  clickedCat(eve) {
    console.log(this.currentFeature);
    console.log(eve);
    this.category = eve.category;
    this.subCategory = eve.subCategoryFinal;

    if (this.category == "" && this.subCategory != "") {
      this.category = this.subCategory;
    }
    console.log(this.spaark.searchedCatArr);
    // console.log(localStorage.getItem(JSON.parse('searchedArr')));

    // this.pillsArr = this.spaark.searchedCatArr;
    // this.pillsArr = this.spaark.searchedCatArr;
    this.getPosts("market");
  }

  scrollLeft(eve) {
    if (eve == "seller") {
      this.allSellerCard.nativeElement.scrollLeft -= 171;
    } else if (eve == "create") {
      this.allMarketCard.nativeElement.scrollLeft -= 161;
    }
  }

  scrollRight(eve) {
    if (eve == "seller") {
      this.allSellerCard.nativeElement.scrollLeft += 171;
    } else if (eve == "create") {
      this.allMarketCard.nativeElement.scrollLeft += 161;
    }
  }

  clickedSearch() {
    this.allPurposeService.triggerModal.next({
      type: "searchModal",
      modal: true,
    });
  }

  checkTabIndex(event) {
    console.log(event);

    this.getPosts(event);

    // // let locUrll = document.URL;
    // if(event=='market'){
    //     this.getSellerRating();
    //     // alert('heloooo');
    // }
  }

  getPosts(fName) {
    this.lastFeat = fName;
    this.spaark
      .getPostsForSearch(this.subCategory, "market")
      .subscribe((succ: any) => {
        console.log(succ.data);
        this.allposts = succ;

        this.posts = succ.data.post;
        console.log(this.posts);
        this.postsBeyond = succ.data.postBeyond;
        // this.appendItems(0, this.sum);

        // console.log(fName);
      });
    try {
      this.spaark
        .getSellerPosts(this.spaark.latitude, this.spaark.longitude)
        .subscribe((succ: any) => {
          console.log(succ);
          this.allSellerPosts = succ.data;

          console.log(this.allSellerPosts);
        });
    } catch {}
  }

  ngOnDestroy() {
    if (this.allPurpSubs) {
      this.allPurpSubs.unsubscribe();
    }
  }
}
