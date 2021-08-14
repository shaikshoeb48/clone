import { Component, OnInit, Renderer2 } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { SpaarksService } from "../../spaarks.service";

@Component({
  selector: "app-new-spaark",
  templateUrl: "./new-spaark.component.html",
  styleUrls: ["./new-spaark.component.scss"],
})
export class NewSpaarkComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private router: Router,
    private spaarkservice: SpaarksService
  ) {}

  marketTab = [
    {
      catTxt: "Announce",
      catImg: "../../../assets/testingMedia/sample_05.jpeg",
    },
    {
      catTxt: "Make Friends",
      catImg: "../../../assets/testingMedia/sample1.jpeg",
    },
    {
      catTxt: "I give a Service",
      catImg: "../../../assets/testingMedia/1.jpeg",
    },
    {
      catTxt: "Have Something to Sell",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    { catTxt: "Looking for", catImg: "../../../assets/testingMedia/2.jpeg" },
    {
      catTxt: "Post a Job",
      catImg: "../../../assets/testingMedia/download.jpeg",
    },
    {
      catTxt: "Want a Job",
      catImg: "../../../assets/testingMedia/download.jpeg",
    },
  ];

  marketDetails = [
    {
      categoryName: "Freelancers",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      categoryName: "Routine Services",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      categoryName: "Food and related",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      categoryName: "Workers",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      categoryName: "Consultants",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      categoryName: "Farm Produce",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      categoryName: "Resell or Give away",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      categoryName: "Beauty",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      categoryName: "IT",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      categoryName: "Care",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      categoryName: "Travel",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      categoryName: "Real Estate and Rentals",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      categoryName: "Stores",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      categoryName: "Small Scale Entrepreneurs",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      categoryName: "Others",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
  ];

  lisfofSub = [
    {
      categoryName: "Freelancers/Coaches/Tutors",
      subCategory: [
        "Photographer",
        "Music/Dance Tutor",
        "Lifestyle Coach",
        "Tutors",
        "Content Writers",
        "Digital Marketing",
        "Music Troops",
        "Cooking Classes",
        "Sports Coach",
        "Performing Arts",
      ],
    },
    {
      categoryName: "Routine Services",
      subCategory: [
        "Garbage Collector",
        "Raddiwala",
        "Electrician",
        "Locksmith",
        "Cobbler",
        "Carpenter",
        "Plumber",
        "Painter",
        "Bag & Related Repair",
        "Dhobi/Dry cleaner",
        "Gardener/Nursery",
      ],
    },
    {
      categoryName: "Food and related",
      subCategory: [
        "Fruits/Vegetables",
        "Juice Corner",
        "Panwala/Tea-stall",
        "Street Food",
        "Gol-gappe/Chaat",
        "Bakery",
        "Tiffin",
        "Catering",
      ],
    },
    {
      categoryName: "Workers/Helpers",
      subCategory: [
        "Maid/Cook",
        "Driver/Car Washer",
        "Miscellaneous Helper",
        "Miscellaneous Helper",
        "Office Assistant",
        "Security/ Guard Service",
        "Daily Wage Labour",
        "Waiters/Bearers",
      ],
    },
    {
      categoryName: "Consultants",
      subCategory: [
        "Legal Consultant",
        "CA/Tax Consultant",
        "Astrologer/Tarot",
        "Career Counsellor",
        "Interior Designer",
        "Event/Wedding Planner",
      ],
    },
    {
      categoryName: "Farm Produce",
      subCategory: [
        "Organic Produce",
        "Grains/Pulses",
        "Fruits/Vegetables",
        "Milk and milk products",
        "Flowers",
        "Poultry/Meat/Fish",
        "Spices/Herbs",
        "Exotic products",
      ],
    },
    {
      categoryName: "Resell or Give away",
      subCategory: [
        "Car/Bike",
        "Children’s",
        "Books",
        "Appliances/Furniture",
        "Others/Miscellaneous",
        "Food/Clothes/Utensils",
        "IT and Hardware",
      ],
    },
    {
      categoryName: "Beauty and Fitness",
      subCategory: [
        "Stylist",
        "Home Service Beautician",
        "Masseurs/Massage",
        "Parlour/Hairdressers",
        "Dietician/Nutritionist",
        "Fitness/Yoga",
      ],
    },
    {
      categoryName: "IT",
      subCategory: [
        "IT Security",
        "Computer/Mobile Repair",
        "Broadband/Internet",
        "Animators/Developers",
        "IT related Professionals",
        "Computer Training/related",
      ],
    },
    {
      categoryName: "Care and Paramedic",
      subCategory: [
        "Nurse and Paramedic",
        "Baby Sitter/Pet Sitter",
        "Pharmacy",
        "Vet",
        "Physiotherapist",
        "Post Delivery Care-taker",
      ],
    },
    {
      categoryName: "Transport related",
      subCategory: [
        "Rickshaw/Autorickshaw",
        "Hire Vehicle",
        "Taxi- Sharing/Single",
        "Mechanic",
      ],
    },
    {
      categoryName: "Real Estate and Rentals",
      subCategory: [
        "House on Rent",
        "Roommates/Flatmates",
        "Domestic Items on Rent",
        "Beddings on Rent",
      ],
    },
    {
      categoryName: "Stores",
      subCategory: [
        "Dhabas",
        "General Stores",
        "Small Eating Joints",
        "Sweet Shops",
      ],
    },
    {
      categoryName: "Small Scale Entrepreneurs",
      subCategory: ["Jewellery Making", "Handicrafts", "Tailor/Boutique"],
    },
    { categoryName: "Others", subCategory: ["Any Other"] },
  ];
  content = "";
  listofsearches = [];
  showStepper = false;
  showState = 0;
  showSubCat = false;
  BtmNav = true;
  // showState= Show Questions // Initial State Clicked On Explore
  // showState = 1 //  Announced and Make Friends
  // showState = 2 //  Market Services
  //
  //
  //
  //

  ngOnInit(): void {
    if (document.URL.includes("create")) {
      this.router.navigateByUrl("home/newspaark");
    }
    this.router.events.subscribe((succ) => {
      console.log(succ);
    });
    this.spaarkservice.allPurposeSubject.subscribe((succe: any) => {
      console.log(succe);
      if (succe.action == "firststep") {
        this.datafromfirstChild(succe);
      }

      if (succe.action == "secondstepcreated") {
        this.showState = 1;
      }
    });
  }

  checkTabIndex(event) {
    console.log(event);
  }

  datafromfirstChild(eve) {
    console.log(eve);
    this.showState = eve.index;

    this.router.navigateByUrl(
      "home/newspaark/create/" + eve.text.split(" ").join("-")
    );
  }

  pressedkey(eve) {
    console.log(eve);
    if (this.content) {
      if (this.content.length == 0) {
        this.listofsearches = [];
        console.log("no searches");
        return;
      }
    }

    this.http
      .get("https://staging-api.ososweb.com/search/" + this.content)
      .subscribe((succe: any) => {
        console.log(succe);
        this.listofsearches = succe;
      });
  }

  selectedCat(val, matCat) {
    this.showState = val;
    let gun: string = val;
    console.log(val);
    console.log(matCat);
    this.router.navigateByUrl(
      "home/newspaark/create/" + matCat.split(" ").join("-")
    );
    //     if(val>=2)
    //     {
    // this.showState=100;
    //     }
    console.log(this.marketDetails);
  }

  selectSubCat(val, id?) {
    var combo = id + val;
    // this.showState=val;
    this.showSubCat = true;
    console.log("this is the selected Category");
    console.log(val);
  }

  datafromsecondChild(eve) {}

  startStepper(subCat, Ind) {
    this.showSubCat = false;
    this.showStepper = true;
    console.log(subCat);
    console.log(Ind);
  }
}
