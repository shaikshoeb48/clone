import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";

import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import QrCodeWithLogo from "node_modules/qrcode-with-logos/dist/qrcode-with-logos.es5.js";
import { SpaarksService } from "../../spaarks.service";
import { Location } from "@angular/common";
import { Subscription } from "rxjs";
@Component({
  selector: "app-sellerprofile",
  templateUrl: "./sellerprofile.component.html",
  styleUrls: ["./sellerprofile.component.scss"],
})
export class SellerprofileComponent implements OnInit, OnChanges {
  aboutmeContent;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private spaarkService: SpaarksService,
    private loca: Location
  ) {
    this.isMobileVersion = this.spaarkService.isMobileVersion;
  }

  isMobileVersion;
  userId;
  ParamMapId;
  selectedIndex = 0;
  showAboutMeText = true;
  subscription: Subscription;
  activeCarousel = 0;

  selectedSubcategory = "";
  changedText = false;
  // method called when clicked on particular card

  postlength;

  @Input("profiledata") profiledata = undefined;

  sellerPosts = [];
  paramsId;
  showAboutMe = false;
  showEditOption = false;
  aboutServiceText = "";
  showqr = true;

  imgList;
  onlyImages = [];
  images = [
    "../../../assets/testingMedia/sample1.jpeg",
    "../../../assets/testingMedia/sample_02.jpeg",
    "../../../assets/testingMedia/sample_03.jpg",
    "../../../assets/testingMedia/sample_04.jpg",
    "../../../assets/testingMedia/sample_05.jpeg",
    "../../../assets/testingMedia/sample1.jpeg",
    "../../../assets/testingMedia/sample_02.jpeg",
    "../../../assets/testingMedia/sample_03.jpg",
    "../../../assets/testingMedia/sample_04.jpg",
    "../../../assets/testingMedia/sample_05.jpeg",
  ];

  rate = 1;

  @ViewChild("showmoredata") showmorecontent: ElementRef;
  shomorebollean = true;

  isbookmarked = false;
  isAuthed = this.spaarkService.authData.isAuthenticated;

  closeResult = "";
  count = 250;
  clickedProfileIndex = "0";

  @ViewChild("allSellerCard") allSellerCard;
  clickedEdit = false;

  fullView = false;
  initVal = 4;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @Output("changedprofile") changedprofile = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.profiledata) {
        if (changes.profiledata.currentValue) {
          // console.log(changes.profiledata.currentValue);

          if (changes.profiledata.currentValue.finalData.active[0]) {
            this.sellerPosts =
              changes.profiledata.currentValue.finalData.active[0].posts;
          }
        }
      }
    }
  }

  ngOnInit() {
    console.log(this.route.snapshot.paramMap.get("section"));
    console.log("this.route.params");
    this.subscription = this.route.queryParams.subscribe((params) => {
      this.userId = params["id"];
      this.isbookmarked = this.profiledata.finalData.bookmarked;
    });

    var testId = this.route.snapshot.paramMap.get("id");
    this.paramsId = testId;
    // console.log(testId);

    if (testId === localStorage.getItem("id")) {
      // this.showAboutMeText=true;
      this.showAboutMe = true;
      this.showEditOption = true;
    }
    // else{
    //   this.showAboutMeText=false
    // }
    this.subscription = this.route.paramMap.subscribe((params: ParamMap) => {
      this.ParamMapId = +params.get("id");
      // console.log(this.ParamMapId)
    });

    console.log(this.profiledata);
    if (this.profiledata.finalData.active[this.selectedIndex]) {
      this.imgList = this.profiledata.finalData.active[
        this.selectedIndex
      ].photos;
      this.imgList.forEach((val) => {
        this.onlyImages.push(val.url);
      });
      // console.log("images   LIST", this.imgList);
      // console.log(this.selectedIndex);
      this.selectedSubcategory = this.profiledata.finalData.active[0].subCategory;
    }

    // this.profiledata.finalData.active=this.profiledata.finalData.active.reverse();
    if (this.profiledata.finalData.active[this.selectedIndex].about) {
      var about = this.profiledata.finalData.active[
        this.selectedIndex
      ].about.trim();
      this.postlength = about.split(/\r\n|\r|\n/).length;

      this.aboutServiceText = about.split("\n")[0] + "\n";

      if (about.split("\n")[1]) {
        this.aboutServiceText += about.split("\n")[1] + "\n";
      }
      if (about.split("\n")[2]) {
        this.aboutServiceText += about.split("\n")[2] + "\n";
      }
    }

    // console.log(this.profiledata.finalData.active[this.selectedIndex].userId);
    // console.log(localStorage.getItem('id'));
    if (
      localStorage.getItem("id") !=
      this.profiledata.finalData.active[this.selectedIndex].userId
    ) {
      this.showqr = false;
    }

    if (this.route.snapshot.paramMap.get("section")) {
      var section = this.route.snapshot.paramMap.get("section");
      let subs = this.profiledata.finalData.active;

      let i = 0;
      while (i < subs.length) {
        if (subs[i].subCategory == section) {
          this.clickedSub(i, subs[i]);
          this.clickedProfileIndex = i.toString();
          if (subs.length > 3 && i > 2) {
            this.activeCarousel = i - 2;
            if (this.isMobileVersion) {
              this.activeCarousel = i;
            }
          }
          break;
        }
        i++;
      }
      if (!this.clickedProfileIndex) this.clickedProfileIndex = "0";
    }
  }

  optionMenu() {
    this.trigger.openMenu();
  }

  clickedSub(ind, subCategory) {
    // console.log(this.profiledata.finalData.active);
    this.shomorebollean = true;
    this.onlyImages = [];
    this.subscription = this.spaarkService.infoDeleted.subscribe((sucid) => {
      this.profiledata.finalData.active.forEach((ele, ind2) => {
        ele.posts.forEach((ele2, ind) => {
          if (sucid == ele2._id) {
            this.profiledata.finalData.active[ind2].posts[ind] = "";
          }
        });
      });
    });

    if (this.clickedEdit && this.changedText) {
      this.showAboutMeText = true;
    }

    if (this.profiledata.finalData.active[this.selectedIndex].about) {
      this.aboutmeContent = "";
    }

    this.selectedSubcategory = subCategory;
    this.selectedIndex = ind;
    if (this.profiledata.finalData.active[this.selectedIndex]) {
      console.log(this.profiledata.finalData.active[this.selectedIndex]);

      this.imgList = this.profiledata.finalData.active[
        this.selectedIndex
      ].photos;
      console.log(this.imgList);

      this.imgList.forEach((val) => {
        this.onlyImages.push(val.url);
      });
      // console.log("images   LIST", this.imgList);
      // console.log(this.selectedIndex);
    }

    if (this.profiledata.finalData.active[this.selectedIndex].about) {
      // var about = this.profiledata.finalData.active[this.selectedIndex].about.replace(/(^[ \t]*\n)/gm, "")
      var about = this.profiledata.finalData.active[
        this.selectedIndex
      ].about.trim();
      this.postlength = about.split(/\r\n|\r|\n/).length;
      this.aboutServiceText = about.split("\n")[0] + "\n";
      if (about.split("\n")[1]) {
        this.aboutServiceText += about.split("\n")[1] + "\n";
      }
      if (
        this.profiledata.finalData.active[this.selectedIndex].about.split(
          "\n"
        )[2]
      ) {
        this.aboutServiceText += about.split("\n")[2] + "\n";
      }
    }
  }

  // stopClick(eve){
  //   console.log(eve)
  //   var abc = document.getElementsByClassName('imagecontainer');
  //   eve.stopPropagation();
  // }

  scrollCarousel(side: number = 0) {
    if (side == 0) {
      this.activeCarousel -= 1;
    } else if (side == 1) {
      this.activeCarousel += 1;
    }
  }

  clickedShare(dat) {
    this.clickedWhatsappShare(dat);
  }

  clickedWhatsappShare(post?) {
    let resultt = this.whatsAppShare(post);
    var fakeLink = document.createElement("a");
    fakeLink.setAttribute(
      "href",
      "https://api.whatsapp.com/send?text=" + resultt
    );
    fakeLink.setAttribute("data-action", "share/whatsapp/share");
    fakeLink.setAttribute("target", "_blank");
    fakeLink.click();
  }

  whatsAppShare(post) {
    // console.log(post);
    if (!post) {
      this.spaarkService.somethingWentWrong("Something went wrong");
      return;
    }
    try {
      var a = ` *Name*: ${post.name} %0a%0a*Profile Link*: https://www.spaarks.me/market/${post.userId}  %0a%0a*Download Spaarks app*: %0ahttps://cutt.ly/Spaarks-app %0a%0a*Apna Business promote karein. Market Profile banayein.*  `;
      let url = a;
      return url;
    } catch (err) {}
  }

  goBack() {
    // console.log("Clicked");
    this.changedprofile.emit({ changeTo: "normal" });
    //this.router.navigateByUrl('/home/profile')
    this.loca.back();
  }

  scrollLeft() {
    this.allSellerCard.nativeElement.scrollLeft -= 171;
  }

  scrollRight() {
    this.allSellerCard.nativeElement.scrollLeft += 171;
  }

  addItem(count) {
    // console.log(typeof(count))
    this.clickedProfileIndex = count;
    // console.log("from Parent", count);
  }

  open(content) {
    console.log(this.profiledata.finalData.active[this.selectedIndex]);
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );

    setTimeout(() => {
      let qrcode = new QrCodeWithLogo({
        canvas: document.getElementById("qr_id"),
        content: this.profiledata.finalData.active[this.selectedIndex]._id,
        width: 300,

        //   download: true,
        image: document.getElementById("image"),
        logo: {
          src: "assets/default.svg",
        },
      });
      qrcode.toCanvas().then(() => {});
    }, 500);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  showFullScreen(pic) {
    console.log("asdasdas", pic);
    this.spaarkService.sendSinglePhoto(pic);
  }

  viewFullScreen(ind) {
    this.spaarkService.sendImageWithIndex(this.onlyImages, ind);
  }

  saveAboutMe() {
    if (this.aboutmeContent == "" || this.aboutmeContent.match(/^\s*$/)) {
      this.spaarkService.somethingWentWrong("Text field cannot be empty");
      this.aboutmeContent = "";
      return;
    }
    this.showAboutMeText = true;
    this.subscription = this.spaarkService
      .editAboutMe(this.aboutmeContent, this.selectedSubcategory)
      .subscribe((succ) => {
        // console.log(succ);
        this.shomorebollean = true;
        this.profiledata.finalData.active[
          this.selectedIndex
        ].about = this.aboutmeContent;
        this.aboutServiceText =
          this.profiledata.finalData.active[this.selectedIndex].about.split(
            "\n"
          )[0] + "\n";
        if (
          this.profiledata.finalData.active[this.selectedIndex].about.split(
            "\n"
          )[1]
        ) {
          this.aboutServiceText +=
            this.profiledata.finalData.active[this.selectedIndex].about.split(
              "\n"
            )[1] + "\n";
        }
        if (
          this.profiledata.finalData.active[this.selectedIndex].about.split(
            "\n"
          )[2]
        ) {
          this.aboutServiceText +=
            this.profiledata.finalData.active[this.selectedIndex].about.split(
              "\n"
            )[2] + "\n";
        }

        if (this.profiledata.finalData.active[this.selectedIndex].about) {
          this.postlength = this.profiledata.finalData.active[
            this.selectedIndex
          ].about.split(/\r\n|\r|\n/).length;
          this.aboutServiceText =
            this.profiledata.finalData.active[this.selectedIndex].about.split(
              "\n"
            )[0] + "\n";
          if (
            this.profiledata.finalData.active[this.selectedIndex].about.split(
              "\n"
            )[1]
          ) {
            this.aboutServiceText +=
              this.profiledata.finalData.active[this.selectedIndex].about.split(
                "\n"
              )[1] + "\n";
          }
          if (
            this.profiledata.finalData.active[this.selectedIndex].about.split(
              "\n"
            )[2]
          ) {
            this.aboutServiceText +=
              this.profiledata.finalData.active[this.selectedIndex].about.split(
                "\n"
              )[2] + "\n";
          }
        }
      });
    // console.log("aasddddddddddd");
    //this.aboutmeContent='';
    if (this.profiledata.finalData.active[this.selectedIndex].about) {
      this.postlength = this.profiledata.finalData.active[
        this.selectedIndex
      ].about.split(/\r\n|\r|\n/).length;
      this.aboutServiceText =
        this.profiledata.finalData.active[this.selectedIndex].about.split(
          "\n"
        )[0] + "\n";
      if (
        this.profiledata.finalData.active[this.selectedIndex].about.split(
          "\n"
        )[1]
      ) {
        this.aboutServiceText +=
          this.profiledata.finalData.active[this.selectedIndex].about.split(
            "\n"
          )[1] + "\n";
      }
      if (
        this.profiledata.finalData.active[this.selectedIndex].about.split(
          "\n"
        )[2]
      ) {
        this.aboutServiceText +=
          this.profiledata.finalData.active[this.selectedIndex].about.split(
            "\n"
          )[2] + "\n";
      }
    }
    this.clickedEdit = false;
    this.changedText = false;
  }

  editAboutMe() {
    this.aboutmeContent = this.profiledata.finalData.active[
      this.selectedIndex
    ].about;
    // console.log(this.aboutmeContent);

    this.count = 250 - this.aboutmeContent.length;
    this.profiledata.finalData.active[this.selectedIndex].about = "";
    this.showAboutMeText = false;
    this.clickedEdit = true;
  }

  updateInput(eve) {
    this.aboutmeContent = eve.target.value;
    let remain = 250 - eve.target.textLength;
    this.count = remain;
    this.changedText = true;
  }

  viewAll() {
    this.fullView = !this.fullView;
    if (this.fullView == true) {
      this.initVal = this.onlyImages.length;
      console.log("Inside IF");
    } else {
      this.initVal = 4;
      console.log("Inside else");
    }
  }

  showMore() {
    if (this.profiledata.finalData.active[this.selectedIndex].about) {
      console.log("ssssssssssssssss");
      if (
        this.profiledata.finalData.active[this.selectedIndex].about.split(
          /\r\n|\r|\n/
        ).length > 3 ||
        this.profiledata.finalData.active[this.selectedIndex].about.length > 245
      ) {
        this.renderer.removeClass(
          this.showmorecontent.nativeElement,
          "showmore"
        );
        this.shomorebollean = false;
        this.aboutServiceText = this.profiledata.finalData.active[
          this.selectedIndex
        ].about;
      }
    }
  }

  showLess() {
    if (this.profiledata.finalData.active[this.selectedIndex].about) {
      this.renderer.addClass(this.showmorecontent.nativeElement, "showmore");
      this.shomorebollean = true;
      this.aboutServiceText =
        this.profiledata.finalData.active[this.selectedIndex].about.split(
          "\n"
        )[0] + "\n";
      if (
        this.profiledata.finalData.active[this.selectedIndex].about.split(
          "\n"
        )[1]
      ) {
        this.aboutServiceText +=
          this.profiledata.finalData.active[this.selectedIndex].about.split(
            "\n"
          )[1] + "\n";
      }
      if (
        this.profiledata.finalData.active[this.selectedIndex].about.split(
          "\n"
        )[2]
      ) {
        this.aboutServiceText +=
          this.profiledata.finalData.active[this.selectedIndex].about.split(
            "\n"
          )[2] + "\n";
      }
    }
  }

  toggleBookmark(userId) {
    if (this.isAuthed) {
      if (!this.isbookmarked) {
        this.isbookmarked = !this.isbookmarked;
        this.subscription = this.spaarkService
          .bookmarkUser(userId)
          .subscribe((succescallBack) => {
            console.log(succescallBack);
            this.spaarkService.somethingWentWrong("Bookmarked successfully");
          });
      } else {
        this.subscription = this.spaarkService
          .removeUserBookmark(userId)
          .subscribe((successcallBack) => {
            console.log(successcallBack);
            this.spaarkService.somethingWentWrong("Bookmark removed");
          });

        this.isbookmarked = !this.isbookmarked;
      }
    } else {
      this.spaarkService.somethingWentWrong("Please login to bookmark profile");
      // this.router.navigateByUrl('home/profile');
      this.spaarkService.triggerLogin();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
