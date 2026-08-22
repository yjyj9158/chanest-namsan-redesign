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
  },
};
