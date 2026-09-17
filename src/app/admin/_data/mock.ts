export type OrderStatus = "new" | "seen" | "done";
export type RequestStatus = "unanswered" | "answered";
export type RequestType = "order" | "amenity" | "question";

export type MockOrder = {
  id: string;
  room: string;
  items: string;
  /** 표시용 문자열 — 무료는 "무료 요청" */
  total: string;
  /** 합계 계산용 원 단위 (무료=0) */
  amount: number;
  timeAgo: string;
  status: OrderStatus;
  /** ISO datetime for date filters */
  createdAt: string;
  unread: boolean;
};

export type MockInventoryItem = {
  id: string;
  name: string;
  category: string;
  qty: number;
  price: number;
};

export type MockRequest = {
  id: string;
  room: string;
  message: string;
  timeAgo: string;
  status: RequestStatus;
  type: RequestType;
  reply?: string;
  createdAt: string;
  unread: boolean;
};

/** SSR/CSR 동일 시각 — Date.now() 쓰면 하이드레이션 불일치 */
const REF = Date.UTC(2026, 8, 16, 2, 0, 0); // 2026-09-16 11:00 KST
const minutes = (m: number) => new Date(REF - m * 60_000).toISOString();
const hours = (h: number) => new Date(REF - h * 3_600_000).toISOString();
const days = (d: number) => new Date(REF - d * 86_400_000).toISOString();

export const INITIAL_ORDERS: MockOrder[] = [
  {
    id: "ord-1",
    room: "301",
    items: "프링글스 ×1 · 콜라 ×2",
    total: "₩12,000",
    amount: 12000,
    timeAgo: "3분 전",
    status: "new",
    createdAt: minutes(3),
    unread: true,
  },
  {
    id: "ord-2",
    room: "301",
    items: "추가 타월 · 생수 ×2",
    total: "무료 요청",
    amount: 0,
    timeAgo: "12분 전",
    status: "new",
    createdAt: minutes(12),
    unread: true,
  },
  {
    id: "ord-3",
    room: "301",
    items: "하이볼 ×2",
    total: "₩18,000",
    amount: 18000,
    timeAgo: "1시간 전",
    status: "done",
    createdAt: hours(1),
    unread: false,
  },
  {
    id: "ord-4",
    room: "301",
    items: "와인 ×1",
    total: "₩69,000",
    amount: 69000,
    timeAgo: "2일 전",
    status: "done",
    createdAt: days(2),
    unread: false,
  },
  {
    id: "ord-5",
    room: "301",
    items: "스낵 세트",
    total: "₩8,000",
    amount: 8000,
    timeAgo: "5일 전",
    status: "done",
    createdAt: days(5),
    unread: false,
  },
];

export const INITIAL_INVENTORY: MockInventoryItem[] = [
  { id: "inv-1", name: "프링글스", category: "스낵", qty: 8, price: 4000 },
  { id: "inv-2", name: "콜라", category: "음료", qty: 15, price: 3000 },
  { id: "inv-3", name: "발렌타인 위스키", category: "위스키", qty: 3, price: 0 },
  { id: "inv-4", name: "하우스 와인", category: "와인", qty: 6, price: 0 },
  { id: "inv-5", name: "참이슬", category: "소주", qty: 10, price: 0 },
  { id: "inv-6", name: "하이볼 캔", category: "하이볼", qty: 2, price: 0 },
];

export const INITIAL_REQUESTS: MockRequest[] = [
  {
    id: "req-1",
    room: "301",
    message: "체크아웃 1시간만 늦출 수 있을까요?",
    timeAgo: "5분 전",
    status: "unanswered",
    type: "question",
    createdAt: minutes(5),
    unread: true,
  },
  {
    id: "req-2",
    room: "301",
    message: "온수가 잘 안 나와요.",
    timeAgo: "1시간 전",
    status: "answered",
    type: "question",
    reply: "지금 바로 확인 도와드리겠습니다.",
    createdAt: hours(1),
    unread: false,
  },
  {
    id: "req-3",
    room: "301",
    message: "추가 타월 부탁드립니다.",
    timeAgo: "20분 전",
    status: "unanswered",
    type: "amenity",
    createdAt: minutes(20),
    unread: true,
  },
  {
    id: "req-4",
    room: "301",
    message: "미니바 콜라 2개 · 프링글스 1개 주문합니다.",
    timeAgo: "8분 전",
    status: "unanswered",
    type: "order",
    createdAt: minutes(8),
    unread: true,
  },
];

export type AdminTab = "orders" | "inventory" | "requests" | "stats";

export const ADMIN_TABS: { id: AdminTab; label: string }[] = [
  { id: "orders", label: "주문" },
  { id: "inventory", label: "재고" },
  { id: "requests", label: "요청·문의" },
  { id: "stats", label: "통계" },
];

export const ADMIN_ROOM = "301";

export function formatKRWAmount(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfWeek(): Date {
  const d = startOfToday();
  const day = d.getDay(); // 0 Sun
  const diff = day === 0 ? 6 : day - 1; // Monday start
  d.setDate(d.getDate() - diff);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
