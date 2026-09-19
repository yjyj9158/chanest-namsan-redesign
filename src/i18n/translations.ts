export type Locale = "ko" | "en" | "ja" | "zh";

export const LOCALES: {
  code: Locale;
  label: string;
  short: string;
}[] = [
  { code: "ko", label: "한국어", short: "KO" },
  { code: "en", label: "English", short: "EN" },
  { code: "ja", label: "日本語", short: "JA" },
  { code: "zh", label: "中文", short: "ZH" },
];

export const DEFAULT_LOCALE: Locale = "ko";
export const LOCALE_STORAGE_KEY = "chanest-locale";

export type PrefsDict = {
  title: string;
  subtitle: string;
  scent: string;
  scentWoody: string;
  scentCitrus: string;
  scentFloral: string;
  scentUnscented: string;
  pillow: string;
  pillowFirm: string;
  pillowMedium: string;
  pillowSoft: string;
  lighting: string;
  lightingBright: string;
  lightingSoft: string;
  temperature: string;
  tempCool: string;
  tempModerate: string;
  tempWarm: string;
  party: string;
  partyCouple: string;
  partyFamily: string;
  partyFriends: string;
  partySolo: string;
  partyBusiness: string;
  notes: string;
  notesPlaceholder: string;
  submit: string;
  thanks: string;
  thanksSub: string;
  email: string;
  emailHint: string;
  emailPlaceholder: string;
  loadPrevious: string;
  checkingEmail: string;
  submitting: string;
  error: string;
  readyTitle: string;
  readyBody: string;
  readyHint: string;
  openGuide: string;
  saveLink: string;
  copyLink: string;
  bannerTitle: string;
  bannerBody: string;
  bannerCta: string;
  myPrefsTitle: string;
  myPrefsEdit: string;
};

export type Dictionary = {
  room: string;
  exploreStay: string;
  scroll: string;
  heroKicker: string;
  heroTitle: string;
  introText: string;
  heroImageAlt: string;
  notificationTitle: string;
  notificationText: string;
  minibarEyebrow: string;
  minibarTitle: string;
  minibarDescription: string;
  allItems: string;
  tabAll: string;
  tabAlcohol: string;
  emptyCategory: string;
  selectedCount: (count: number) => string;
  minibarTotal: string;
  itemsSelected: (count: number) => string;
  guideEyebrow: string;
  guideTitle: string;
  guideDescription: string;
  wifiTitle: string;
  network: string;
  password: string;
  copy: string;
  copied: string;
  checkoutTitle: string;
  checkoutDetail: string;
  thermoTitle: string;
  thermoDetail: string;
  rulesTitle: string;
  rulesDetail: string;
  localEyebrow: string;
  localTitle: string;
  localDescription: string;
  localArea: string;
  cafe: string;
  dining: string;
  sights: string;
  call: string;
  kakao: string;
  instagram: string;
  language: string;
  serviceEyebrow: string;
  serviceTitle: string;
  serviceDescription: string;
  waterTitle: string;
  waterFree: string;
  waterDescription: string;
  waterQty: string;
  serviceTowels: string;
  serviceTowelsDesc: string;
  serviceAmenities: string;
  serviceAmenitiesDesc: string;
  serviceHousekeeping: string;
  serviceHousekeepingDesc: string;
  serviceOther: string;
  serviceOtherDesc: string;
  serviceNoteLabel: string;
  serviceNoteHint: string;
  serviceNotePlaceholder: string;
  requestSummary: string;
  requestSend: string;
  requestChoose: string;
  requestViaSms: string;
  requestViaKakao: string;
  requestKakaoHint: string;
  requestFooter: string;
  servicesSelected: (count: number) => string;
  historyEyebrow: string;
  historyTitle: string;
  historyEmpty: string;
  historyReply: string;
  privacyPolicy: string;
  viewMap: string;
  walk: string;
  transitRecommended: string;
  hostCourses: string;
  deliveryEta: string;
  requestToastSuccess: string;
  requestToastError: string;
  checkinTitle: string;
  doorLockPassword: string;
  directions: string;
  parking: string;
  luggageStorage: string;
  checkinDirectionsDetail: string;
  checkinParkingDetail: string;
  checkinLuggageDetail: string;
  emergencyTitle: string;
  emergencyCall: string;
  emergencyPolice: string;
  emergencyFire: string;
  nearestHospital: string;
  nearestHospitalDetail: string;
  nearestPharmacy: string;
  nearestPharmacyDetail: string;
  hostEmergencyContact: string;
  hostEmergencyHours: string;
  transportTitle: string;
  nearestStation: string;
  nearestStationDetail: string;
  gettingAround: string;
  gettingAroundDetail: string;
  taxi: string;
  taxiDetail: string;
  prefs: PrefsDict;
};

export const dictionaries: Record<Locale, Dictionary> = {
  ko: {
    room: "Room",
    exploreStay: "Explore Your Stay",
    scroll: "Scroll",
    heroKicker: "YOUR STAY, THOUGHTFULLY PREPARED.",
    heroTitle: "Welcome to\nThe Chanest Namsan",
    introText:
      "서울의 중심, 남산 곁에서 한층 고요한 머무름을 경험해 보세요.\n필요한 순간마다 세심하게 함께하겠습니다.",
    heroImageAlt: "더 채네스트 남산 객실 전경",
    notificationTitle: "Notifications",
    notificationText: "머무시는 동안 필요한 안내를 확인해 주세요.",
    minibarEyebrow: "In-Room",
    minibarTitle: "Minibar",
    minibarDescription:
      "객실에서 편안하게 즐기실 수 있도록 음료와 스낵을 준비했습니다.",
    allItems: "All Items",
    tabAll: "All",
    tabAlcohol: "Alcohol",
    emptyCategory: "이 카테고리에 상품이 없습니다.",
    selectedCount: (count) => `선택 ${count}개`,
    minibarTotal: "Minibar Total",
    itemsSelected: (count) =>
      `${count} item${count > 1 ? "s" : ""} selected`,
    guideEyebrow: "Essentials",
    guideTitle: "Stay Guide",
    guideDescription: "쾌적한 객실 이용을 위한 주요 안내사항을 확인해 주세요.",
    wifiTitle: "Wi-Fi",
    network: "Network",
    password: "Password",
    copy: "복사",
    copied: "복사됨",
    checkoutTitle: "Check-out 11:00",
    checkoutDetail:
      "체크아웃 시간은 오전 11시입니다.\n만점 후기 작성 시 오후 12시까지 레이트 체크아웃 혜택을 제공해 드립니다.",
    thermoTitle: "Heating & Cooling",
    thermoDetail:
      "냉방은 에어컨 리모컨을 이용해 온도를 조절해 주세요.\n난방은 메인룸 벽면에 설치된 온도 조절기를 이용해 설정해 주세요.\n온수가 나오지 않을 경우, 온도 조절기의 온수 기능을 켜 주세요.",
    rulesTitle: "House Rules",
    rulesDetail:
      "• 객실 및 건물 내 모든 공간은 금연입니다.\n• 객실 내부에서는 신발을 벗고 이용해 주세요.\n• 객실 내 비품과 시설을 소중히 이용해 주세요.",
    localEyebrow: "Jangchung · Namsan",
    localTitle: "Local Guide",
    localDescription: "장충동과 남산 주변의 추천 장소를 안내해 드립니다.",
    localArea: "장충동 · 남산",
    cafe: "카페 & 디저트",
    dining: "식사",
    sights: "볼거리",
    call: "전화",
    kakao: "카카오톡",
    instagram: "Instagram",
    language: "언어",
    serviceEyebrow: "Guest Services",
    serviceTitle: "객실 요청",
    serviceDescription:
      "필요한 어메니티와 서비스를 선택해 주세요. 호스트에게 한 번에 요청할 수 있습니다.",
    waterTitle: "추가 생수",
    waterFree: "무료",
    waterDescription: "객실로 무료 생수를 추가 요청할 수 있습니다.",
    waterQty: "수량",
    serviceTowels: "추가 타월",
    serviceTowelsDesc: "목욕 타월 / 페이스 타월 추가",
    serviceAmenities: "어메니티",
    serviceAmenitiesDesc: "치약, 샴푸 등 어메니티 보충",
    serviceHousekeeping: "하우스키핑",
    serviceHousekeepingDesc: "객실 청소 및 정돈 요청",
    serviceOther: "기타 요청",
    serviceOtherDesc: "아래에 상세 내용을 남겨 주세요",
    serviceNoteLabel: "요청 메모",
    serviceNoteHint: "도착 희망 시간이나 세부 요청을 적어 주세요.",
    serviceNotePlaceholder: "예: 오후 3시 이후 방문 부탁드립니다.",
    requestSummary: "요청 요약",
    requestSend: "호스트에게 요청하기",
    requestChoose: "전송 방법을 선택해 주세요",
    requestViaSms: "문자로 보내기",
    requestViaKakao: "카카오톡 오픈채팅",
    requestKakaoHint: "요청 내용이 복사됩니다. 오픈채팅에 붙여넣어 주세요",
    requestFooter: "확인 부탁드립니다. 감사합니다.",
    servicesSelected: (count) => `요청 ${count}건`,
    historyEyebrow: "Your Requests",
    historyTitle: "내 요청 내역",
    historyEmpty: "아직 요청 내역이 없습니다",
    historyReply: "호스트 답변",
    privacyPolicy: "개인정보처리방침",
    viewMap: "지도 보기",
    walk: "도보",
    transitRecommended: "대중교통 추천",
    hostCourses: "호스트 추천 코스",
    deliveryEta: "요청 후 약 10~15분 내 전달해 드립니다.",
    requestToastSuccess:
      "요청이 전송되었습니다. 약 10~15분 내 전달해 드릴게요. 😊",
    requestToastError: "전송에 실패했습니다. 다시 시도해주세요.",
    checkinTitle: "Check-in",
    doorLockPassword: "도어락 비밀번호",
    directions: "오시는 길",
    parking: "주차",
    luggageStorage: "짐 보관",
    checkinDirectionsDetail:
      "서울 중구 동호로25가길\n동대입구역(3호선) 3번 출구에서 도보 약 7분",
    checkinParkingDetail:
      "건물 내 주차 불가. 인근 공영주차장 이용 (장충체육관 공영주차장 도보 3분)",
    checkinLuggageDetail:
      "체크인 전·체크아웃 후 짐 보관이 필요하시면 호스트에게 요청해 주세요.",
    emergencyTitle: "Emergency Contacts",
    emergencyCall: "긴급 신고",
    emergencyPolice: "경찰",
    emergencyFire: "소방/응급",
    nearestHospital: "가까운 병원",
    nearestHospitalDetail: "국립중앙의료원 (도보 10분)",
    nearestPharmacy: "가까운 약국",
    nearestPharmacyDetail: "장충약국 (도보 5분)",
    hostEmergencyContact: "호스트 긴급 연락처",
    hostEmergencyHours: "(24시간)",
    transportTitle: "Transportation",
    nearestStation: "가장 가까운 역",
    nearestStationDetail: "동대입구역 (3호선) — 도보 약 7분",
    gettingAround: "주요 장소까지",
    gettingAroundDetail:
      "명동 → 동대입구역에서 1정거장 (충무로역 환승 4호선) 또는 도보 20분\n서울역 → 동대입구역에서 2정거장 (충무로역 환승 4호선)\n강남역 → 동대입구역에서 약 25분 (충무로 환승)\n홍대입구역 → 약 30분 (충무로 환승 2호선)\n인천공항 → 서울역에서 공항철도 약 43분",
    taxi: "택시",
    taxiDetail:
      "카카오T 앱 추천. 기본요금 ₩4,800.\n호스트에게 택시 호출을 요청하실 수도 있습니다.",
    prefs: {
      title: "도착 전, 취향을 알려주세요",
      subtitle: "당신을 위해 공간을 준비하겠습니다.",
      scent: "향 (Scent)",
      scentWoody: "우디",
      scentCitrus: "시트러스",
      scentFloral: "플로럴",
      scentUnscented: "무향",
      pillow: "베개 (Pillow)",
      pillowFirm: "단단하게",
      pillowMedium: "중간",
      pillowSoft: "부드럽게",
      lighting: "조명 (Lighting)",
      lightingBright: "밝게",
      lightingSoft: "은은하게",
      temperature: "실내 온도 (Temperature)",
      tempCool: "시원하게",
      tempModerate: "적당히",
      tempWarm: "따뜻하게",
      party: "누구와 함께하시나요 (Who's joining)",
      partyCouple: "연인",
      partyFamily: "가족",
      partyFriends: "친구",
      partySolo: "혼자",
      partyBusiness: "비즈니스",
      notes: "더 필요하신 것이 있다면",
      notesPlaceholder: "기념일 데코, 알레르기 등 자유롭게 적어 주세요.",
      submit: "준비를 부탁드립니다",
      thanks: "감사합니다.",
      thanksSub: "도착하실 때 준비되어 있겠습니다.",
      email: "이메일 (선택)",
      emailHint:
        "같은 이메일로 다시 방문하시면 지난 취향을 불러올 수 있습니다.",
      emailPlaceholder: "optional@email.com",
      loadPrevious: "지난번 설정을 불러올까요?",
      checkingEmail: "이전 설정을 확인하는 중…",
      submitting: "전달하는 중…",
      error: "저장에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      readyTitle: "준비하겠습니다",
      readyBody: "도착하실 때 말씀하신 대로 공간을 정돈해 두겠습니다.",
      readyHint:
        "체크인 후에는 객실 안내와 미니바 주문을 이용하실 수 있습니다.",
      openGuide: "객실 가이드 열기 →",
      saveLink: "이 링크를 저장해 두세요",
      copyLink: "링크 복사",
      bannerTitle: "아직 취향을 알려주지 않으셨네요",
      bannerBody:
        "향, 베개, 조명을 선택하시면 다음 방문 때 그대로 준비해 드립니다.",
      bannerCta: "취향 남기기 →",
      myPrefsTitle: "내 취향",
      myPrefsEdit: "수정하기",
    },
  },
  en: {
    room: "Room",
    exploreStay: "Explore Your Stay",
    scroll: "Scroll",
    heroKicker: "YOUR STAY, THOUGHTFULLY PREPARED.",
    heroTitle: "Welcome to\nThe Chanest Namsan",
    introText:
      "Experience a quieter stay beside Namsan, in the heart of Seoul.\nWe are here thoughtfully, whenever you need us.",
    heroImageAlt: "THE CHANEST Namsan guest room view",
    notificationTitle: "Notifications",
    notificationText: "Please check important notices during your stay.",
    minibarEyebrow: "In-Room",
    minibarTitle: "Minibar",
    minibarDescription:
      "Drinks and snacks prepared for you to enjoy comfortably in your room.",
    allItems: "All Items",
    tabAll: "All",
    tabAlcohol: "Alcohol",
    emptyCategory: "No items in this category.",
    selectedCount: (count) => `${count} selected`,
    minibarTotal: "Minibar Total",
    itemsSelected: (count) =>
      `${count} item${count > 1 ? "s" : ""} selected`,
    guideEyebrow: "Essentials",
    guideTitle: "Stay Guide",
    guideDescription: "Key information for a comfortable stay.",
    wifiTitle: "Wi-Fi",
    network: "Network",
    password: "Password",
    copy: "Copy",
    copied: "Copied",
    checkoutTitle: "Check-out 11:00",
    checkoutDetail:
      "Check-out is at 11:00 AM.\nLeave a five-star review and enjoy late check-out until 12:00 PM.",
    thermoTitle: "Heating & Cooling",
    thermoDetail:
      "Use the air conditioner remote to adjust cooling.\nUse the wall thermostat in the main room for heating.\nIf hot water is not running, turn on the hot-water function on the thermostat.",
    rulesTitle: "House Rules",
    rulesDetail:
      "• Smoking is prohibited in all guest rooms and building areas.\n• Please remove your shoes inside the room.\n• Treat room amenities and facilities with care.",
    localEyebrow: "Jangchung · Namsan",
    localTitle: "Local Guide",
    localDescription: "Recommended spots around Jangchung-dong and Namsan.",
    localArea: "Jangchung · Namsan",
    cafe: "Cafe & Dessert",
    dining: "Dining",
    sights: "Sights",
    call: "Call",
    kakao: "KakaoTalk",
    instagram: "Instagram",
    language: "Language",
    serviceEyebrow: "Guest Services",
    serviceTitle: "Room Requests",
    serviceDescription:
      "Select amenities and services you need. Send everything to the host at once.",
    waterTitle: "Extra Water",
    waterFree: "Free",
    waterDescription: "Request complimentary bottled water for your room.",
    waterQty: "Quantity",
    serviceTowels: "Extra Towels",
    serviceTowelsDesc: "Bath / face towels",
    serviceAmenities: "Amenities",
    serviceAmenitiesDesc: "Toothpaste, shampoo, and toiletries",
    serviceHousekeeping: "Housekeeping",
    serviceHousekeepingDesc: "Room cleaning and tidy-up",
    serviceOther: "Other Request",
    serviceOtherDesc: "Leave details in the note below",
    serviceNoteLabel: "Request note",
    serviceNoteHint: "Preferred time or special instructions.",
    serviceNotePlaceholder: "e.g. Please visit after 3 PM.",
    requestSummary: "Request summary",
    requestSend: "Request to host",
    requestChoose: "Choose how to send",
    requestViaSms: "Send via SMS",
    requestViaKakao: "KakaoTalk Open Chat",
    requestKakaoHint: "Request text is copied — paste it in Open Chat",
    requestFooter: "Please confirm. Thank you.",
    servicesSelected: (count) => `${count} service request${count > 1 ? "s" : ""}`,
    historyEyebrow: "Your Requests",
    historyTitle: "My requests",
    historyEmpty: "No requests yet",
    historyReply: "Host reply",
    privacyPolicy: "Privacy Policy",
    viewMap: "View Map",
    walk: "Walk",
    transitRecommended: "Transit recommended",
    hostCourses: "Host picks",
    deliveryEta: "Your request will be delivered within 10-15 minutes.",
    requestToastSuccess:
      "Your request has been sent. We'll deliver it within about 10-15 minutes. 😊",
    requestToastError: "Couldn't send. Please try again.",
    checkinTitle: "Check-in",
    doorLockPassword: "Door Lock Password",
    directions: "Directions",
    parking: "Parking",
    luggageStorage: "Luggage Storage",
    checkinDirectionsDetail:
      "Dongho-ro 25ga-gil, Jung-gu, Seoul\nAbout 7 minutes on foot from Exit 3 of Dongguk Univ. Station (Line 3)",
    checkinParkingDetail:
      "No on-site parking. Use a nearby public lot (Jangchung Gymnasium public parking, 3-minute walk).",
    checkinLuggageDetail:
      "If you need luggage storage before check-in or after check-out, please request it from the host.",
    emergencyTitle: "Emergency Contacts",
    emergencyCall: "Emergency",
    emergencyPolice: "Police",
    emergencyFire: "Fire / EMS",
    nearestHospital: "Nearest Hospital",
    nearestHospitalDetail: "National Medical Center (10-minute walk)",
    nearestPharmacy: "Nearest Pharmacy",
    nearestPharmacyDetail: "Jangchung Pharmacy (5-minute walk)",
    hostEmergencyContact: "Host Emergency Contact",
    hostEmergencyHours: "(24 hours)",
    transportTitle: "Transportation",
    nearestStation: "Nearest Station",
    nearestStationDetail: "Dongguk Univ. Station (Line 3) — about 7 minutes on foot",
    gettingAround: "Getting Around",
    gettingAroundDetail:
      "Myeongdong → 1 stop from Dongguk Univ. Station (transfer at Chungmuro to Line 4) or 20-minute walk\nSeoul Station → 2 stops from Dongguk Univ. Station (transfer at Chungmuro to Line 4)\nGangnam Station → about 25 minutes (transfer at Chungmuro)\nHongik Univ. Station → about 30 minutes (transfer at Chungmuro to Line 2)\nIncheon Airport → AREX about 43 minutes from Seoul Station",
    taxi: "Taxi",
    taxiDetail:
      "Kakao T app recommended. Base fare ₩4,800.\nYou can also ask the host to call a taxi.",
    prefs: {
      title: "Tell us your preferences",
      subtitle: "We'll prepare the space just for you.",
      scent: "Scent",
      scentWoody: "Woody",
      scentCitrus: "Citrus",
      scentFloral: "Floral",
      scentUnscented: "Unscented",
      pillow: "Pillow",
      pillowFirm: "Firm",
      pillowMedium: "Medium",
      pillowSoft: "Soft",
      lighting: "Lighting",
      lightingBright: "Bright",
      lightingSoft: "Soft",
      temperature: "Temperature",
      tempCool: "Cool",
      tempModerate: "Moderate",
      tempWarm: "Warm",
      party: "Who's joining",
      partyCouple: "Couple",
      partyFamily: "Family",
      partyFriends: "Friends",
      partySolo: "Solo",
      partyBusiness: "Business",
      notes: "Anything else we should know",
      notesPlaceholder: "Anniversary décor, allergies, and other notes.",
      submit: "Prepare my stay",
      thanks: "Thank you.",
      thanksSub: "It will be ready when you arrive.",
      email: "Email (optional)",
      emailHint: "Use the same email next time to restore your last preferences.",
      emailPlaceholder: "optional@email.com",
      loadPrevious: "Load your previous settings?",
      checkingEmail: "Checking previous settings…",
      submitting: "Sending…",
      error: "Couldn't save. Please try again in a moment.",
      readyTitle: "We'll have it ready",
      readyBody: "Your space will be prepared just as you described.",
      readyHint:
        "After check-in, you can access the room guide and minibar orders.",
      openGuide: "Open Room Guide →",
      saveLink: "Save this link for later",
      copyLink: "Copy Link",
      bannerTitle: "Tell us your preferences",
      bannerBody:
        "Choose your scent, pillow, and lighting — we'll have it ready next time.",
      bannerCta: "Set Preferences →",
      myPrefsTitle: "My Preferences",
      myPrefsEdit: "Edit",
    },
  },
  ja: {
    room: "Room",
    exploreStay: "滞在を探す",
    scroll: "Scroll",
    heroKicker: "YOUR STAY, THOUGHTFULLY PREPARED.",
    heroTitle: "Welcome to\nThe Chanest Namsan",
    introText:
      "ソウルの中心、南山のそばで、より静かな滞在をお楽しみください。\n必要な瞬間に、丁寧にお手伝いいたします。",
    heroImageAlt: "THE CHANEST南山 客室の風景",
    notificationTitle: "お知らせ",
    notificationText: "ご滞在中に必要なご案内をご確認ください。",
    minibarEyebrow: "In-Room",
    minibarTitle: "Minibar",
    minibarDescription:
      "客室でゆったりお楽しみいただけるよう、ドリンクとスナックをご用意しました。",
    allItems: "すべて",
    tabAll: "All",
    tabAlcohol: "Alcohol",
    emptyCategory: "このカテゴリに商品がありません。",
    selectedCount: (count) => `${count}点選択`,
    minibarTotal: "ミニバー合計",
    itemsSelected: (count) => `${count}点選択中`,
    guideEyebrow: "Essentials",
    guideTitle: "Stay Guide",
    guideDescription: "快適なご滞在のための主なご案内です。",
    wifiTitle: "Wi-Fi",
    network: "ネットワーク",
    password: "パスワード",
    copy: "コピー",
    copied: "コピー済み",
    checkoutTitle: "チェックアウト 11:00",
    checkoutDetail:
      "チェックアウトは午前11時です。\n満点レビューご記入で、午後12時までのレイトチェックアウト特典をご提供します。",
    thermoTitle: "冷暖房",
    thermoDetail:
      "冷房はエアコンのリモコンで温度を調整してください。\n暖房はメインルーム壁面の温度調節器で設定してください。\nお湯が出ない場合は、温度調節器の給湯機能をオンにしてください。",
    rulesTitle: "ハウスルール",
    rulesDetail:
      "• 客室および建物内はすべて禁煙です。\n• 客室内では靴を脱いでご利用ください。\n• 客室内の備品・設備は大切にご利用ください。",
    localEyebrow: "Jangchung · Namsan",
    localTitle: "Local Guide",
    localDescription: "奨忠洞・南山周辺のおすすめスポットをご案内します。",
    localArea: "奨忠洞 · 南山",
    cafe: "カフェ＆デザート",
    dining: "お食事",
    sights: "観光",
    call: "電話",
    kakao: "カカオトーク",
    instagram: "Instagram",
    language: "言語",
    serviceEyebrow: "Guest Services",
    serviceTitle: "客室リクエスト",
    serviceDescription:
      "必要なアメニティとサービスを選択し、ホストへまとめてリクエストできます。",
    waterTitle: "追加のミネラルウォーター",
    waterFree: "無料",
    waterDescription: "客室へ無料のミネラルウォーターを追加リクエストできます。",
    waterQty: "数量",
    serviceTowels: "追加タオル",
    serviceTowelsDesc: "バスタオル / フェイスタオル",
    serviceAmenities: "アメニティ",
    serviceAmenitiesDesc: "歯磨き粉・シャンプーなどの補充",
    serviceHousekeeping: "ハウスキーピング",
    serviceHousekeepingDesc: "客室清掃・整頓のリクエスト",
    serviceOther: "その他",
    serviceOtherDesc: "詳細は下のメモへご記入ください",
    serviceNoteLabel: "リクエストメモ",
    serviceNoteHint: "ご希望時間や詳細をご記入ください。",
    serviceNotePlaceholder: "例：午後3時以降のご訪問をお願いします。",
    requestSummary: "リクエスト概要",
    requestSend: "ホストにリクエスト",
    requestChoose: "送信方法を選択してください",
    requestViaSms: "SMSで送る",
    requestViaKakao: "カカオトークオープンチャット",
    requestKakaoHint: "内容がコピーされます。オープンチャットに貼り付けてください",
    requestFooter: "ご確認をお願いいたします。ありがとうございます。",
    servicesSelected: (count) => `リクエスト ${count}件`,
    historyEyebrow: "Your Requests",
    historyTitle: "リクエスト履歴",
    historyEmpty: "まだリクエストはありません",
    historyReply: "ホストからの返信",
    privacyPolicy: "プライバシーポリシー",
    viewMap: "地図を見る",
    walk: "徒歩",
    transitRecommended: "公共交通推奨",
    hostCourses: "ホストおすすめコース",
    deliveryEta: "ご注文後、約10〜15分でお届けします。",
    requestToastSuccess:
      "リクエストを送信しました。約10〜15分でお届けします。😊",
    requestToastError: "送信に失敗しました。もう一度お試しください。",
    checkinTitle: "Check-in",
    doorLockPassword: "ドアロック暗証番号",
    directions: "アクセス",
    parking: "駐車場",
    luggageStorage: "荷物預かり",
    checkinDirectionsDetail:
      "ソウル中区東湖路25街キル\n東大入口駅（3号線）3番出口から徒歩約7分",
    checkinParkingDetail:
      "建物内駐車不可。近隣の公営駐車場をご利用ください（奨忠体育館公営駐車場まで徒歩3分）。",
    checkinLuggageDetail:
      "チェックイン前・チェックアウト後の荷物預かりが必要な場合は、ホストへご依頼ください。",
    emergencyTitle: "Emergency Contacts",
    emergencyCall: "緊急通報",
    emergencyPolice: "警察",
    emergencyFire: "消防・救急",
    nearestHospital: "最寄りの病院",
    nearestHospitalDetail: "国立中央医療院（徒歩10分）",
    nearestPharmacy: "最寄りの薬局",
    nearestPharmacyDetail: "奨忠薬局（徒歩5分）",
    hostEmergencyContact: "ホスト緊急連絡先",
    hostEmergencyHours: "（24時間）",
    transportTitle: "Transportation",
    nearestStation: "最寄り駅",
    nearestStationDetail: "東大入口駅（3号線）— 徒歩約7分",
    gettingAround: "主要スポットへ",
    gettingAroundDetail:
      "明洞 → 東大入口駅から1駅（忠武路駅で4号線乗換）または徒歩20分\nソウル駅 → 東大入口駅から2駅（忠武路駅で4号線乗換）\n江南駅 → 約25分（忠武路乗換）\n弘大入口駅 → 約30分（忠武路で2号線乗換）\n仁川空港 → ソウル駅から空港鉄道 約43分",
    taxi: "タクシー",
    taxiDetail:
      "カカオTアプリ推奨。基本料金₩4,800。\nホストにタクシー手配をお願いすることもできます。",
    prefs: {
      title: "ご到着前に、お好みをお聞かせください",
      subtitle: "あなたのために空間を整えます。",
      scent: "香り (Scent)",
      scentWoody: "ウッディ",
      scentCitrus: "シトラス",
      scentFloral: "フローラル",
      scentUnscented: "無香",
      pillow: "枕 (Pillow)",
      pillowFirm: "かため",
      pillowMedium: "ふつう",
      pillowSoft: "やわらかめ",
      lighting: "照明 (Lighting)",
      lightingBright: "明るく",
      lightingSoft: "やわらかく",
      temperature: "室温 (Temperature)",
      tempCool: "涼しく",
      tempModerate: "ふつう",
      tempWarm: "暖かく",
      party: "ご同行 (Who's joining)",
      partyCouple: "カップル",
      partyFamily: "家族",
      partyFriends: "友人",
      partySolo: "一人",
      partyBusiness: "ビジネス",
      notes: "その他ご要望があれば",
      notesPlaceholder: "記念日のデコレーション、アレルギーなどご自由に。",
      submit: "準備をお願いします",
      thanks: "ありがとうございます。",
      thanksSub: "ご到着の際に整えてお待ちしております。",
      email: "メール（任意）",
      emailHint: "同じメールで再訪されると、前回の設定を呼び出せます。",
      emailPlaceholder: "optional@email.com",
      loadPrevious: "前回の設定を読み込みますか？",
      checkingEmail: "前回の設定を確認しています…",
      submitting: "送信中…",
      error: "保存に失敗しました。しばらくしてから再度お試しください。",
      readyTitle: "ご準備いたします",
      readyBody:
        "ご到着時に、お伝えいただいた通りに整えてお待ちしております。",
      readyHint:
        "チェックイン後は、客室ガイドとミニバーのご注文がご利用いただけます。",
      openGuide: "客室ガイドを開く →",
      saveLink: "このリンクを保存してください",
      copyLink: "リンクをコピー",
      bannerTitle: "お好みをまだお聞きしていません",
      bannerBody:
        "香り・枕・照明をお選びいただければ、次回も同じようにご用意します。",
      bannerCta: "お好みを伝える →",
      myPrefsTitle: "お好み設定",
      myPrefsEdit: "変更する",
    },
  },
  zh: {
    room: "Room",
    exploreStay: "探索您的旅程",
    scroll: "Scroll",
    heroKicker: "YOUR STAY, THOUGHTFULLY PREPARED.",
    heroTitle: "Welcome to\nThe Chanest Namsan",
    introText:
      "在首尔中心、南山之畔，体验更加宁静的停留。\n在您需要的每一个时刻，我们都会细心相伴。",
    heroImageAlt: "THE CHANEST南山客房景观",
    notificationTitle: "通知",
    notificationText: "入住期间请查看必要的住宿指引。",
    minibarEyebrow: "In-Room",
    minibarTitle: "Minibar",
    minibarDescription: "我们已准备好饮品与零食，方便您在客房内轻松享用。",
    allItems: "全部",
    tabAll: "All",
    tabAlcohol: "Alcohol",
    emptyCategory: "此分类暂无商品。",
    selectedCount: (count) => `已选 ${count} 项`,
    minibarTotal: "迷你吧合计",
    itemsSelected: (count) => `已选 ${count} 项`,
    guideEyebrow: "Essentials",
    guideTitle: "Stay Guide",
    guideDescription: "请查看舒适入住所需的主要指引。",
    wifiTitle: "Wi-Fi",
    network: "网络名称",
    password: "密码",
    copy: "复制",
    copied: "已复制",
    checkoutTitle: "退房 11:00",
    checkoutDetail:
      "退房时间为上午11点。\n撰写满分评价可享受延迟退房至中午12点的优惠。",
    thermoTitle: "冷暖空调",
    thermoDetail:
      "制冷请使用空调遥控器调节温度。\n制热请使用主卧墙面温控器进行设置。\n若无热水，请开启温控器的热水功能。",
    rulesTitle: "入住须知",
    rulesDetail:
      "• 客房及楼内所有区域均禁止吸烟。\n• 请在客房内脱鞋使用。\n• 请爱护客房内的物品与设施。",
    localEyebrow: "Jangchung · Namsan",
    localTitle: "Local Guide",
    localDescription: "为您推荐奖忠洞与南山周边的地点。",
    localArea: "奖忠洞 · 南山",
    cafe: "咖啡与甜品",
    dining: "餐饮",
    sights: "景点",
    call: "电话",
    kakao: "KakaoTalk",
    instagram: "Instagram",
    language: "语言",
    serviceEyebrow: "Guest Services",
    serviceTitle: "客房请求",
    serviceDescription: "请选择所需的备品与服务，可一并发送给房东。",
    waterTitle: "额外矿泉水",
    waterFree: "免费",
    waterDescription: "可免费申请额外瓶装水送到客房。",
    waterQty: "数量",
    serviceTowels: "额外毛巾",
    serviceTowelsDesc: "浴巾 / 面巾",
    serviceAmenities: "洗漱用品",
    serviceAmenitiesDesc: "牙膏、洗发水等补充",
    serviceHousekeeping: "客房清洁",
    serviceHousekeepingDesc: "客房打扫与整理",
    serviceOther: "其他请求",
    serviceOtherDesc: "请在下方备注中填写详情",
    serviceNoteLabel: "请求备注",
    serviceNoteHint: "可填写希望到达时间或其他说明。",
    serviceNotePlaceholder: "例如：请于下午3点后上门。",
    requestSummary: "请求摘要",
    requestSend: "向房东请求",
    requestChoose: "请选择发送方式",
    requestViaSms: "短信发送",
    requestViaKakao: "KakaoTalk 开放聊天",
    requestKakaoHint: "请求内容已复制，请粘贴到开放聊天",
    requestFooter: "请确认，谢谢。",
    servicesSelected: (count) => `请求 ${count} 项`,
    historyEyebrow: "Your Requests",
    historyTitle: "我的请求记录",
    historyEmpty: "暂无请求记录",
    historyReply: "房东回复",
    privacyPolicy: "个人信息处理方针",
    viewMap: "查看地图",
    walk: "步行",
    transitRecommended: "建议乘坐公共交通",
    hostCourses: "房东推荐路线",
    deliveryEta: "下单后约10-15分钟内送达。",
    requestToastSuccess: "请求已发送。约10-15分钟内送达。😊",
    requestToastError: "发送失败，请再试一次。",
    checkinTitle: "Check-in",
    doorLockPassword: "门锁密码",
    directions: "交通指南",
    parking: "停车",
    luggageStorage: "行李寄存",
    checkinDirectionsDetail:
      "首尔中区东湖路25街路\n东大入口站（3号线）3号出口步行约7分钟",
    checkinParkingDetail:
      "楼内不可停车。请使用附近公共停车场（奖忠体育馆公共停车场步行3分钟）。",
    checkinLuggageDetail:
      "如需在入住前或退房后寄存行李，请向房东提出请求。",
    emergencyTitle: "Emergency Contacts",
    emergencyCall: "紧急报警",
    emergencyPolice: "警察",
    emergencyFire: "消防/急救",
    nearestHospital: "最近医院",
    nearestHospitalDetail: "国立中央医疗院（步行10分钟）",
    nearestPharmacy: "最近药店",
    nearestPharmacyDetail: "奖忠药店（步行5分钟）",
    hostEmergencyContact: "房东紧急联系方式",
    hostEmergencyHours: "（24小时）",
    transportTitle: "Transportation",
    nearestStation: "最近车站",
    nearestStationDetail: "东大入口站（3号线）— 步行约7分钟",
    gettingAround: "主要地点交通",
    gettingAroundDetail:
      "明洞 → 东大入口站1站（忠武路换乘4号线）或步行20分钟\n首尔站 → 东大入口站2站（忠武路换乘4号线）\n江南站 → 约25分钟（忠武路换乘）\n弘大入口站 → 约30分钟（忠武路换乘2号线）\n仁川机场 → 首尔站机场铁路约43分钟",
    taxi: "出租车",
    taxiDetail:
      "推荐使用 Kakao T。起步价 ₩4,800。\n也可以请房东帮忙叫车。",
    prefs: {
      title: "入住前，告诉我们您的偏好",
      subtitle: "我们将为您准备好空间。",
      scent: "香氛 (Scent)",
      scentWoody: "木质",
      scentCitrus: "柑橘",
      scentFloral: "花香",
      scentUnscented: "无香",
      pillow: "枕头 (Pillow)",
      pillowFirm: "偏硬",
      pillowMedium: "适中",
      pillowSoft: "偏软",
      lighting: "灯光 (Lighting)",
      lightingBright: "明亮",
      lightingSoft: "柔和",
      temperature: "室温 (Temperature)",
      tempCool: "凉爽",
      tempModerate: "适中",
      tempWarm: "温暖",
      party: "同行嘉宾 (Who's joining)",
      partyCouple: "情侣",
      partyFamily: "家庭",
      partyFriends: "朋友",
      partySolo: "独自",
      partyBusiness: "商务",
      notes: "如需其他安排",
      notesPlaceholder: "纪念日布置、过敏等，请随时告诉我们。",
      submit: "请为我准备",
      thanks: "谢谢。",
      thanksSub: "您抵达时，一切都会准备就绪。",
      email: "邮箱（选填）",
      emailHint: "下次使用同一邮箱，即可恢复上次的偏好设置。",
      emailPlaceholder: "optional@email.com",
      loadPrevious: "要载入上次的设置吗？",
      checkingEmail: "正在确认上次设置…",
      submitting: "提交中…",
      error: "保存失败，请稍后再试。",
      readyTitle: "我们会为您准备好",
      readyBody: "我们将按照您的要求为您整理好空间。",
      readyHint: "入住后，您可以使用客房指南和迷你吧订购服务。",
      openGuide: "打开客房指南 →",
      saveLink: "请保存此链接",
      copyLink: "复制链接",
      bannerTitle: "还未告诉我们您的偏好",
      bannerBody: "选择香氛、枕头和灯光，下次我们会照此准备。",
      bannerCta: "设置偏好 →",
      myPrefsTitle: "我的偏好",
      myPrefsEdit: "修改",
    },
  },
};
