import { localGuidePlaces, type LocalGuidePlace } from "@/data/localGuide";

export type { LocalGuidePlace };

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
  /** placeholder — 실제 도어락 비밀번호로 교체 */
  doorLockPassword: string;
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
        "체크아웃 시간은 오전 11시입니다.\n레이트 체크아웃이 필요하시면 호스트에게 문의해 주세요.",
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
    // 실제 인스타 계정으로 교체 필요
    { id: 3, title: "Instagram", icon: "camera", url: "https://instagram.com/thechanest_namsan" },
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

  // placeholder — 실제 도어락 비밀번호로 교체
  doorLockPassword: "1234#",

  localGuide: localGuidePlaces,
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
