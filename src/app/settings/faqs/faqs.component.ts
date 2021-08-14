import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { SpaarksService } from "../../spaarks.service";

@Component({
  selector: "app-faqs",
  templateUrl: "./faqs.component.html",
  styleUrls: ["./faqs.component.scss"],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger("rotatedState", [
      state("default", style({ transform: "rotate(0)" })),
      state("rotated", style({ transform: "rotate(+90deg)" })),
      transition("rotated => default", animate("200ms ease-out")),
      transition("default => rotated", animate("200ms ease-in")),
    ]),
  ],
})
export class FaqsComponent implements OnInit {
  constructor(private spaarks: SpaarksService) {
    this.isMobileVersion = this.spaarks.isMobileVersion;
    this.spaarks.noAuthRequired = true;
  }

  ngOnInit(): void {}
  isMobileVersion;
  state: string = "default";

  rotate(ind, eve) {
    console.log(eve);
    console.log(ind);
    this.state = this.state === "default" ? "rotated" : "default";
  }

  faq = [
    {
      que: "What is the concept of this application?",
      ans: "Connect to people in your local area.",
    },
    {
      que: "What is a Spaark?",
      ans: "A Spaark is the information posted by a user.",
    },
    {
      que: "What are the features in the application?",
      ans:
        "i.Announce  is about events, public announcements, ideas, thoughts, opinions, news, offers, celebrations, festivals, prayers etc in your local area. ii.Market is about promoting your Service, making customers in your local area. You can also share your Seller profile with others through Whatsapp. You can also connect with buyers of goods or services or find jobs or work around you.",
    },
    {
      que: "Why does the application take my location permissions?",
      ans: "Local area is defined by user’s actual location.",
    },
    {
      que: "What is the importance of radius shown on the map?",
      ans: "Radius gives the distance up to which you can see other Spaarks.",
    },
    {
      que: "Am I visible to others on the map when I log into the app?",
      ans:
        "No. Others can see your Spaark’s location if you allow it, but not your location.",
    },
    { que: "Will other user's location be visible to me?", ans: "No." },
    {
      que: "What if I want my Spaark to be visible for more distance?",
      ans: "Leave a Business query with us.",
    },
    {
      que:
        "If I am a Seller, then how do I collect reviews for my service from buyers?",
      ans:
        "A Seller can collect a review from a user who got connected through Spaarks app. App will automatically direct both the users once a user connects a Seller.",
    },
    {
      que: "How can I give review to a Seller?",
      ans:
        "As a buyer if you have connected to a Seller, then the Seller will send you the request for giving review.",
    },
    {
      que: "Can I edit my Spaark?",
      ans:
        "No. You cannot edit your Spaark after posting it. You can always delete it.",
    },
    {
      que: "How is a Spaark or a Content taken down?",
      ans:
        "If Reports to a Spaark exceed a threshold level, it gets taken down automatically.",
    },
    {
      que: "How does an account get suspended?",
      ans:
        "An account whose Content is reported and taken down many times which exceeds the threshold level, the account gets suspended automatically.",
    },
    {
      que: "What is the maximum video size allowed to upload?",
      ans: "50 MB - 1 video.",
    },
    //  { que: "What is anonymous chat? ", ans: "In anonymous chats, your name is not seen by other user. In normal chat name is visible. Anonymous chat is only available in Make friends feature. " },
    {
      que: "Will I be able to receive calls when I have logged out.",
      ans: "A user need to be logged into the app to receive the calls.",
    },
    //  { que: "Can I get a call from an Anonymous user through Chat?", ans: "A user connected anonymously cannot make a call. " },
    {
      que: "Can I recover a deleted chat?",
      ans: "No. You cannot recover the chat, once deleted.",
    },
    {
      que: "What happens when I exit a chat?",
      ans:
        "None of the users can exchange messages. You can resume the chat even after exiting.",
    },
    {
      que: "What will be visible to the other user when I block him/her?",
      ans:
        "Your details will remain confidential. Your Spaarks will not be shown to the blocked user. The blocked user can not chat with you any further.",
    },
    //  { que: "What happens when I delete my account?  ", ans: "The user will no longer be able to access any data related to the account. An account with same phone number can not be opened again for next 28 days. " },
  ];

  faqHindi = [
    {
      que: "इस एप्लिकेशन का संकल्प क्या है? ",
      ans: "अपने आस पास के लोगो से कनैक्ट करना। ",
    },
    { que: "स्पार्क क्या है?", ans: "यूज़र की पोस्ट को स्पार्क कहेंगे। " },
    {
      que: "इस एप्लिकेशन में क्या फीचर्स हैं?",
      ans:
        "i.बताएं फीचर आपके आस पास में घटनाओं, पब्लिक घोषणाओं, विचारों, समाचारों, समारोहों, त्योहारों, प्रार्थनाओं आदि के बारे में है।  ii.बाजार फीचर से आप अपनी सर्विस को प्रमोट कर सकते हैं, अपने आस पास ग्राहक बना सकते हैं। अपनी सैलर प्रोफाइल भी व्हाट्सप्प पर शेयर कर सकते हैं। आप खरीददारों से कनेक्ट या कोई काम भी ढून्ढ सकते हैं। iii.दोस्त बनाएं - अपने आस पास दोस्त बनाएं। रिक्वेस्ट को हाँ करके ही चैट करें। गुमनाम होकर भी चैट कर सकते हैं। अपनी प्रोफाइल फोटो भी छुपा सकते हैं। ",
    },
    {
      que: "एप्लिकेशन मेरी लोकेशन की अनुमति क्यों लेता है?",
      ans: "यूज़र की लोकेशन के हिसाब से ऐप में आस पास के स्पार्क्स दिखेंगे। ",
    },
    {
      que: "मैप पर दिखाए गए घेरे का महत्व क्या है?",
      ans: "जहाँ तक घेरा होगा वहाँ तक के स्पार्क्स दिखेंगे। ",
    },
    {
      que: "क्या मेरे लॉगिन करते ही अन्य यूज़र्स मुझे देख सकते हैं?",
      ans:
        "नहीं। आपकी लोकेशन कोई नहीं देख सकता। आपकी स्पार्क की लोकेशन यदि आपने अनुमति दी थी तो देखी जा सकती है। ",
    },
    { que: "क्या अन्य उपयोगकर्ताओं की लोकेशन मुझे दिखाई देगी?", ans: "नहीं।" },
    {
      que: "क्या मैं अपने स्पार्क को अधिक समय और घेरे में दिखा सकता हूँ?",
      ans: "हमारे पास एक बिज़नेस प्रश्न छोड़ें। ",
    },
    {
      que: "मैं अपनी सेवा के लिए खरीदार से रिव्यु कैसे लूँ?",
      ans:
        "यदि एक यूज़र ऐप से किसी सैलर को कॉन्टैक्ट करता है तो ऐप इन दोनों यूज़र्स को अपने आप रिव्यु देने के लिए गाइड करेगी। ",
    },
    {
      que: "मैं एक सैलर को रिव्यु कैसे दूँ?",
      ans:
        "यदि आपने ऐप से एक सैलर को कॉन्टैक्ट किया है तो ऐप आपसे अपने आप सैलर के लिए रिव्यु मांग लेगी।",
    },
    {
      que: "क्या मैं अपने स्पार्क में कुछ बदल सकता हूँ?",
      ans:
        "नहीं। स्पार्क पोस्ट करने के बाद बदला नहीं जा सकता। डिलीट कर सकते हैं। ",
    },
    {
      que: "एक स्पार्क या टिप्पणी ऐप से खुद ब खुद कैसे हटती है?",
      ans:
        "यदि एक स्पार्क पर रिपोर्ट्स एक सीमा से ऊपर हो जाती हैं तो स्पार्क अपने आप ऐप से हट जाता है। ",
    },
    {
      que: "एक अकाउंट सस्पैंड कैसे होता है?",
      ans:
        "यदि एक अकाउंट के काफी स्पार्क्स रिपोर्ट होते हैं तो वह अकाउंट अपने आप सस्पैंड हो जाता है। ",
    },
    {
      que: " ज़्यादा से ज़्यादा कितनी बड़ी वीडियो अपलोड कर सकते हैं?",
      ans: "50 एम् बी - 1 वीडियो ",
    },
    {
      que: "गुमनाम चैट क्या है?",
      ans:
        "गुमनाम चैट में आपका नाम दूसरे यूज़र को नहीं दिखता। सामान्य चैट में दिखता है। गुमनाम चैट केवल दोस्त बनाने में उपलब्ध है। ",
    },
    {
      que: "क्या मैं लॉग आउट होने पर कॉल प्राप्त कर सकूंगा?",
      ans: "कॉल प्राप्त करने के लिए आपको लॉग इन होना चाहिए।",
    },
    {
      que: "क्या मुझे किसी गुमनाम चैट से कॉल प्राप्त हो सकती है?",
      ans: "एक गुमनाम रूप से संपर्क में आया उपयोगकर्ता आपको कॉल नहीं कर सकता। ",
    },
    {
      que: "क्या मैं मिटाए गए चैट को फिर से प्राप्त कर सकता हूं?",
      ans: "नहीं, चैट मिटाने के बाद आप चैट को फिर से प्राप्त नहीं कर सकते।",
    },
    {
      que: "जब मैं चैट से बाहर निकलता हूं तो क्या होता है?",
      ans:
        "चैट से बाहर निकलने के बाद मेसेजस नहीं भेजे जा सकते। चैट को फिर से शुरू, मतलब रिज्यूम, भी किया जा सकता है। ",
    },
    {
      que: "एक यूज़र को ब्लॉक करने पर उसे मेरे बारे में क्या दिखेगा?",
      ans:
        "आपकी जानकारी छुपी रहेगी। आपके स्पार्क्स ब्लॉक हुए यूज़र को नहीं दिखेंगे। ब्लॉक हुआ यूज़र आपके साथ चैट नहीं कर पाएगा। ",
    },
    {
      que: "जब मैं अपने खाते को मिटा देता हूं तो क्या होता है? ",
      ans:
        "आप अपने खाते से सम्बंधित कोई भी जानकारी नहीं देख सकते। उसी नंबर/ईमेल के साथ अगले 28 दिन तक फिर से खाता नहीं बन सकता।",
    },
  ];

  ngOnDestroy(){
   // console.log("aaaaaaaaaa");
    this.spaarks.checkforLocation();

  }
}
