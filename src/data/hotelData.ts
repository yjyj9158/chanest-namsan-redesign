export interface MinibarCategory {
  id: number;
  name: string;
  sortOrder: number;
}

export interface MinibarItem {
  id: number;
  category: string;
  name: string;
  price: number;
  imageFileId: number;
  image: string;
  /** 재고 연동 전 데모용 — false면 고객 화면 품절 */
  available?: boolean;
}

export interface Service {
  id: number;
  title: string;
  icon: string;
  optionValues: string | null;
}

export interface Guide {
  id: number;
  title: string;
  icon: string;
  detail: string;
}

export interface Contact {
  id: number;
  title: string;
  icon: string;
  url: string;
}

export interface SiteContent {
  brandName: string;
  brandLocation: string;
  heroTitle: string;
  heroKicker: string;
  heroImageAlt: string;
  introText: string;
  notificationTitle: string;
  notificationText: string;
  minibarTitle: string;
  minibarDescription: string;
  minibarImage: string;
  serviceTitle: string;
  serviceDescription: string;
  serviceImage: string;
  guideTitle: string;
  guideDescription: string;
  guideImage: string;
  contactTitle: string;
  contactDescription: string;
  contactImage: string;
  footerText: string;
  footerLogo: string;
  heroImage: string;
}

export interface LocalGuidePlace {
  name: string;
  nameEn: string;
  category: "cafe" | "dining" | "sights";
  description?: string;
  distance: string;
  hours: string;
  priceRange: string;
  recommendation: string;
  mapUrl: string;
  image?: string;
}

export interface WifiInfo {
  network: string;
  password: string;
}

export interface HotelData {
  room: string;
  minibarCategories: MinibarCategory[];
  minibarItems: MinibarItem[];
  services: Service[];
  guides: Guide[];
  contacts: Contact[];
  siteContent: SiteContent;
  localGuide: LocalGuidePlace[];
  wifi: WifiInfo;
}

/** 고정 에셋 서버 (배포 전 디자인 프리뷰용) */
export const ASSET_BASE = "https://air-front-black.vercel.app";

/** /api/files/*, /images/* 경로를 절대 URL로 변환 */
export function resolveAssetUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/api/") || path.startsWith("/images/")) {
    return `${ASSET_BASE}${path}`;
  }
  return path;
}

const img = (path: string) => resolveAssetUrl(path);

export const hotelData: HotelData = {
  room: "301",

  minibarCategories: [
    { id: 1, name: "Snack", sortOrder: 0 },
    { id: 2, name: "Soft Drink", sortOrder: 0 },
    { id: 3, name: "Whisky", sortOrder: 0 },
    { id: 4, name: "Wine", sortOrder: 0 },
    { id: 84, name: "Soju", sortOrder: 0 },
    { id: 85, name: "Highball", sortOrder: 0 },
  ],

  minibarItems: [
    { id: 108, category: "Snack", name: "Pringles", price: 4000, imageFileId: 24, image: img("/api/files/24") },
    { id: 109, category: "Soft Drink", name: "Coca Cola(&ZERO)", price: 4000, imageFileId: 25, image: img("/api/files/25") },
    { id: 110, category: "Soft Drink", name: "Sprite", price: 4000, imageFileId: 26, image: img("/api/files/26") },
    { id: 111, category: "Soft Drink", name: "Sanpellegrino Sparkling", price: 5000, imageFileId: 27, image: img("/api/files/27") },
    { id: 112, category: "Snack", name: "Hunter's Black Truffle", price: 4000, imageFileId: 28, image: img("/api/files/28") },
    { id: 113, category: "Snack", name: "Choco Chip Cookie Mini", price: 4000, imageFileId: 29, image: img("/api/files/29") },
    { id: 114, category: "Snack", name: "Honey Butter Almond", price: 4000, imageFileId: 30, image: img("/api/files/30"), available: false },
    { id: 115, category: "Soju", name: "Dokdo Soju", price: 15000, imageFileId: 31, image: img("/api/files/31") },
    { id: 116, category: "Highball", name: "Jimbeam Highball", price: 8000, imageFileId: 32, image: img("/api/files/32") },
    { id: 117, category: "Whisky", name: "Jonnie Walker Blue", price: 320000, imageFileId: 33, image: img("/api/files/33") },
    { id: 118, category: "Whisky", name: "Ballantine 17Y", price: 180000, imageFileId: 34, image: img("/api/files/34") },
    { id: 119, category: "Wine", name: "Babich (white wine)", price: 69000, imageFileId: 35, image: img("/api/files/35") },
    { id: 120, category: "Wine", name: "Grant Burge (red wine)", price: 69000, imageFileId: 36, image: img("/api/files/36") },
    { id: 121, category: "Wine", name: "Demi Sec (sparkling wine)", price: 69000, imageFileId: 37, image: img("/api/files/37") },
    { id: 122, category: "Wine", name: "Moet chandon (Champagne)", price: 159000, imageFileId: 38, image: img("/api/files/38") },
  ],

  services: [
    { id: 1, title: "Additional Towels", icon: "towel", optionValues: "" },
    { id: 3, title: "Cleaning Request", icon: "sparkle", optionValues: "" },
    { id: 2, title: "Water Request", icon: "bottle", optionValues: null },
    { id: 5, title: "Other Request", icon: "chat", optionValues: null },
  ],

  guides: [
    {
      id: 1,
      title: "Wi-Fi",
      icon: "wifi",
      detail: "네트워크: U+net 1148 / 비밀번호: K370BB53F#",
    },
    {
      id: 2,
      title: "Check-out 11:00",
      icon: "clock",
      detail:
        "체크아웃 시간은 오전 11시입니다.\n만점 후기 작성 시 오후 12시까지 레이트 체크아웃 혜택을 제공해 드립니다.",
    },
    {
      id: 4,
      title: "Heating & Cooling",
      icon: "thermo",
      detail:
        "냉방은 에어컨 리모컨을 이용해 온도를 조절해 주세요.\n난방은 메인룸 벽면에 설치된 온도 조절기를 이용해 설정해 주세요.\n온수가 나오지 않을 경우, 온도 조절기의 온수 기능을 켜 주세요.",
    },
    {
      id: 5,
      title: "House Rules",
      icon: "note",
      detail:
        "• 객실 및 건물 내 모든 공간은 금연입니다.\n• 객실 내부에서는 신발을 벗고 이용해 주세요.\n• 객실 내 비품과 시설을 소중히 이용해 주세요.",
    },
  ],

  contacts: [
    { id: 1, title: "Call Guest Service", icon: "phone", url: "tel:010-3223-5714" },
    { id: 3, title: "Instagram", icon: "camera", url: "https://instagram.com/11" },
    { id: 2, title: "KakaoTalk", icon: "chat", url: "https://open.kakao.com/" },
  ],

  siteContent: {
    brandName: "THE CHANEST",
    brandLocation: "NAMSAN",
    heroTitle: "Welcome to\r\nThe Chanest Namsan",
    heroKicker: "YOUR STAY, THOUGHTFULLY PREPARED.",
    heroImageAlt: "더 채네스트 남산 객실 전경",
    introText:
      "서울의 중심, 남산 곁에서 한층 고요한 머무름을 경험해 보세요.\n필요한 순간마다 세심하게 함께하겠습니다.",
    notificationTitle: "Notifications",
    notificationText: "머무시는 동안 필요한 안내를 확인해 주세요.",
    minibarTitle: "Minibar",
    minibarDescription:
      "객실에서 편안하게 즐기실 수 있도록 음료와 스낵을 준비했습니다.",
    minibarImage: img("/api/files/40"),
    serviceTitle: "Concierge",
    serviceDescription:
      "객실 이용 중 필요한 사항을 요청해 주세요. 원활한 서비스 준비를 위해 필요한 사항은 하루 전에 요청해 주시기 바랍니다.",
    serviceImage: img("/api/files/41"),
    guideTitle: "Stay Guide",
    guideDescription: "쾌적한 객실 이용을 위한 주요 안내사항을 확인해 주세요.",
    guideImage: img("/api/files/42"),
    contactTitle: "Guest Assistance",
    contactDescription:
      "도움이 필요하신가요? 필요한 순간 언제든 편하게 연락해 주세요.",
    contactImage: img("/api/files/43"),
    footerText: "A STAY BY CHAN & NEST",
    footerLogo: img("/images/chanest-footer-logo.png"),
    heroImage: img("/images/main.png"),
  },

  wifi: {
    network: "U+net 1148",
    password: "K370BB53F#",
  },

  localGuide: [
    {
      name: "프릳츠 장충",
      nameEn: "Fritz JangChung",
      category: "cafe",
      distance: "도보 8~10분",
      hours: "매일 08:00~22:00",
      priceRange: "₩5,000~15,000",
      recommendation:
        "한옥 느낌의 정원과 맛있는 커피·베이커리를 함께 즐길 수 있어 아침이나 오후 휴식 장소로 추천드려요.",
      mapUrl: "https://map.naver.com/v5/search/프릳츠 장충",
    },
    {
      name: "스타벅스 장충라운지R점",
      nameEn: "Starbucks Jangchung Lounge R",
      category: "cafe",
      distance: "도보 12~15분",
      hours: "월~목·일 09:00~21:00, 금·토 09:00~22:00",
      priceRange: "₩5,000~15,000",
      recommendation:
        "일반 스타벅스와 달리 오래된 저택을 개조한 독특한 공간이라 사진을 찍거나 쉬어 가기 좋아요.",
      mapUrl: "https://map.naver.com/v5/search/스타벅스 장충라운지R점",
    },
    {
      name: "콘드에뻬뻬",
      nameEn: "Corned E Pepe",
      category: "cafe",
      distance: "도보 13~15분",
      hours: "매일 11:00~21:00",
      priceRange: "₩7,000~20,000",
      recommendation:
        "아늑하고 로맨틱한 분위기에서 커피와 디저트를 즐기기 좋아서 데이트나 조용한 휴식에 추천드려요.",
      mapUrl: "https://map.naver.com/v5/search/콘드에뻬뻬",
    },
    {
      name: "PaperCrane Bakery & Cafe",
      nameEn: "PaperCrane Bakery & Cafe",
      category: "cafe",
      distance: "도보 14~15분",
      hours: "매일 08:30~22:00",
      priceRange: "₩5,000~15,000",
      recommendation:
        "아침부터 늦은 저녁까지 이용하기 편하고, 커피와 빵을 함께 간단히 즐기고 싶을 때 좋아요.",
      mapUrl: "https://map.naver.com/v5/search/PaperCrane Bakery Cafe",
    },
    {
      name: "서울다이닝",
      nameEn: "Seoul Dining",
      category: "dining",
      distance: "도보 7~9분",
      hours: "화~토 11:30~14:00, 17:30~22:00 (일·월 휴무)",
      priceRange: "₩100,000~",
      recommendation:
        "특별한 저녁이나 기념일 식사를 원하시면 예약 후 방문하기 좋은 고급 레스토랑이에요.",
      mapUrl: "https://map.naver.com/v5/search/서울다이닝 장충",
    },
    {
      name: "서울신라호텔 라연",
      nameEn: "La Yeon",
      category: "dining",
      distance: "도보 6~8분",
      hours: "매일 12:00~14:30, 17:30~21:30",
      priceRange: "₩150,000~",
      recommendation:
        "한국 전통음식을 고급스럽게 경험하고 싶은 외국인 손님께 추천하기 좋은 특별한 식사 장소입니다.",
      mapUrl: "https://map.naver.com/v5/search/서울신라호텔 라연",
    },
    {
      name: "프릳츠 장충",
      nameEn: "Fritz JangChung",
      category: "dining",
      distance: "도보 8~10분",
      hours: "매일 08:00~22:00",
      priceRange: "₩10,000~25,000",
      recommendation:
        "가볍게 브런치나 빵과 음료로 식사하고 싶을 때 부담 없이 추천할 수 있는 곳이에요.",
      mapUrl: "https://map.naver.com/v5/search/프릳츠 장충",
    },
    {
      name: "명동 고깃집 윤슬 숯불구이",
      nameEn: "Yoonseul Charcoal Grill",
      category: "dining",
      distance: "도보 20~25분 (대중교통 추천)",
      hours: "매일 11:00~23:00",
      priceRange: "₩25,000~70,000",
      recommendation:
        "한국식 숯불구이를 처음 드시는 외국인 손님께 추천하기 좋은 곳으로, 숙성 삼겹살과 한우를 함께 즐길 수 있어요.",
      mapUrl: "https://map.naver.com/v5/search/명동 고깃집 윤슬 숯불구이",
    },
    {
      name: "명동 더식당",
      nameEn: "The Sic Ddang",
      category: "dining",
      distance: "도보 20~25분 (대중교통 추천)",
      hours: "매일 11:00~23:00",
      priceRange: "₩10,000~20,000",
      recommendation:
        "쭈꾸미·칼국수·피자처럼 여러 메뉴를 나누어 먹을 수 있어 가족이나 친구끼리 방문하기 좋아요.",
      mapUrl: "https://map.naver.com/v5/search/명동맛집 더식당",
    },
    {
      name: "장충단공원",
      nameEn: "Jangchungdan Park",
      category: "sights",
      distance: "도보 5~7분",
      hours: "24시간 개방",
      priceRange: "무료",
      recommendation:
        "숙소에서 가장 가까운 산책 코스로, 아침 산책이나 저녁에 조용히 걷기에 좋아요.",
      mapUrl: "https://map.naver.com/v5/search/장충단공원",
    },
    {
      name: "남산공원",
      nameEn: "Namsan Park",
      category: "sights",
      distance: "도보 15~20분 (버스 이용 추천)",
      hours: "24시간 개방",
      priceRange: "무료",
      recommendation:
        "낮에는 숲길 산책과 서울 전망을, 밤에는 서울 야경을 즐길 수 있어 가장 추천하는 명소예요.",
      mapUrl: "https://map.naver.com/v5/search/남산공원",
    },
    {
      name: "남산 한국숲정원",
      nameEn: "Namsan Korean Forest Garden",
      category: "sights",
      distance: "도보 20분 (버스 이용 추천)",
      hours: "24시간 개방",
      priceRange: "무료",
      recommendation:
        "사람이 많은 중심 관광지보다 조용한 자연 풍경을 좋아하신다면 낮 시간 산책 코스로 추천드려요.",
      mapUrl: "https://map.naver.com/v5/search/남산 한국숲정원",
    },
    {
      name: "중앙아시아거리",
      nameEn: "Central Asian Street",
      category: "sights",
      distance: "도보 12~15분",
      hours: "24시간",
      priceRange: "무료",
      recommendation:
        "서울 안에서 색다른 분위기를 느끼고 싶을 때 추천하며, 낮에는 골목 구경, 저녁에는 이국적인 식사를 즐기기 좋아요.",
      mapUrl: "https://map.naver.com/v5/search/광희동 중앙아시아거리",
    },
    {
      name: "인사동길",
      nameEn: "Insadong-gil",
      category: "sights",
      distance: "도보 30분 (대중교통 추천)",
      hours: "상시 이용 가능",
      priceRange: "무료",
      recommendation:
        "전통 공예품과 기념품을 보고 싶거나 서울의 전통적인 분위기를 느끼고 싶을 때 좋아요.",
      mapUrl: "https://map.naver.com/v5/search/인사동길",
    },
  ],
};

export const LOCAL_GUIDE_TABS = [
  { id: "cafe" as const, label: "카페 & 디저트", emoji: "☕" },
  { id: "dining" as const, label: "식사", emoji: "🍽" },
  { id: "sights" as const, label: "볼거리", emoji: "📸" },
];

export const CATEGORY_EMOJI: Record<string, string> = {
  Snack: "🥔",
  "Soft Drink": "🥤",
  Whisky: "🥃",
  Wine: "🍷",
  Soju: "🍶",
  Highball: "🍹",
};

export function formatKRW(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

export function getGuideByIcon(guides: Guide[], icon: string): Guide | undefined {
  return guides.find((g) => g.icon === icon);
}
