import { naverMapUrl, type LocalizedText } from "@/i18n/localized";

export interface LocalGuidePlace {
  name: string;
  nameEn: string;
  category: "cafe" | "dining" | "sights";
  description?: string;
  distance: LocalizedText;
  hours: LocalizedText;
  priceRange: LocalizedText;
  recommendation: LocalizedText;
  mapUrl: string;
  mapQuery?: string;
  image?: string;
  transit?: boolean;
}

const loc = (
  ko: string,
  en: string,
  ja: string,
  zh: string,
): LocalizedText => ({ ko, en, ja, zh });

function place(
  input: Omit<LocalGuidePlace, "mapUrl"> & { mapQuery: string },
): LocalGuidePlace {
  const { mapQuery, ...rest } = input;
  return { ...rest, mapUrl: naverMapUrl(mapQuery) };
}

export const localGuidePlaces: LocalGuidePlace[] = [
  place({
    name: "프릳츠 장충",
    nameEn: "Fritz JangChung",
    category: "cafe",
    mapQuery: "프릳츠 장충",
    distance: loc("도보 8~10분", "8-10 min walk", "徒歩8〜10分", "步行8~10分钟"),
    hours: loc("매일 08:00~22:00", "Daily 08:00-22:00", "毎日 08:00〜22:00", "每日 08:00~22:00"),
    priceRange: loc("₩5,000~15,000", "₩5,000-15,000", "₩5,000〜15,000", "₩5,000~15,000"),
    recommendation: loc(
      "한옥 느낌의 정원과 맛있는 커피·베이커리를 함께 즐길 수 있어 아침이나 오후 휴식 장소로 추천드려요.",
      "A hanok-inspired garden with excellent coffee and fresh bakery — our pick for a slow morning or afternoon pause.",
      "韓屋の趣ある庭とおいしいコーヒー・ベーカリーを楽しめる、朝や午後のひと休みにおすすめの場所です。",
      "韩屋风格的庭院配上美味的咖啡与烘焙，适合悠闲的早晨或午后小憩。",
    ),
  }),
  place({
    name: "스타벅스 장충라운지R점",
    nameEn: "Starbucks Jangchung Lounge R",
    category: "cafe",
    mapQuery: "스타벅스 장충라운지R점",
    distance: loc("도보 12~15분", "12-15 min walk", "徒歩12〜15分", "步行12~15分钟"),
    hours: loc(
      "월~목·일 09:00~21:00, 금·토 09:00~22:00",
      "Mon-Thu & Sun 09:00-21:00; Fri-Sat 09:00-22:00",
      "月〜木・日 09:00〜21:00、金・土 09:00〜22:00",
      "周一至周四、周日 09:00~21:00；周五至周六 09:00~22:00",
    ),
    priceRange: loc("₩5,000~15,000", "₩5,000-15,000", "₩5,000〜15,000", "₩5,000~15,000"),
    recommendation: loc(
      "일반 스타벅스와 달리 오래된 저택을 개조한 독특한 공간이라 사진을 찍거나 쉬어 가기 좋아요.",
      "Not a typical Starbucks — a restored mansion with rooms to linger in, and a favorite for photos.",
      "いつものスターバックスとは違い、古い邸宅を改装した独特な空間。写真や休憩にもぴったりです。",
      "不同于普通星巴克，这是一栋改建的老宅，适合拍照或稍作停留。",
    ),
  }),
  place({
    name: "콘드에뻬뻬",
    nameEn: "Corned E Pepe",
    category: "cafe",
    mapQuery: "콘드에뻬뻬",
    distance: loc("도보 13~15분", "13-15 min walk", "徒歩13〜15分", "步行13~15分钟"),
    hours: loc("매일 11:00~21:00", "Daily 11:00-21:00", "毎日 11:00〜21:00", "每日 11:00~21:00"),
    priceRange: loc("₩7,000~20,000", "₩7,000-20,000", "₩7,000〜20,000", "₩7,000~20,000"),
    recommendation: loc(
      "아늑하고 로맨틱한 분위기에서 커피와 디저트를 즐기기 좋아서 데이트나 조용한 휴식에 추천드려요.",
      "A quiet, romantic room for coffee and dessert — lovely for a date or an unhurried hour.",
      "落ち着いたロマンチックな雰囲気でコーヒーとデザートを楽しめる、デートや静かな休息におすすめです。",
      "氛围安静浪漫，适合约会或安静地享用咖啡与甜品。",
    ),
  }),
  place({
    name: "PaperCrane Bakery & Cafe",
    nameEn: "PaperCrane Bakery & Cafe",
    category: "cafe",
    mapQuery: "PaperCrane Bakery Cafe",
    distance: loc("도보 14~15분", "14-15 min walk", "徒歩14〜15分", "步行14~15分钟"),
    hours: loc("매일 08:30~22:00", "Daily 08:30-22:00", "毎日 08:30〜22:00", "每日 08:30~22:00"),
    priceRange: loc("₩5,000~15,000", "₩5,000-15,000", "₩5,000〜15,000", "₩5,000~15,000"),
    recommendation: loc(
      "아침부터 늦은 저녁까지 이용하기 편하고, 커피와 빵을 함께 간단히 즐기고 싶을 때 좋아요.",
      "Open from morning until late — an easy stop when you want coffee and bread without a plan.",
      "朝から夜遅くまで使いやすく、コーヒーとパンを気軽に楽しみたいときにぴったりです。",
      "从早晨营业到晚上，想简单喝杯咖啡、吃点面包时很方便。",
    ),
  }),
  place({
    name: "서울다이닝",
    nameEn: "Seoul Dining",
    category: "dining",
    mapQuery: "서울다이닝 장충",
    distance: loc("도보 7~9분", "7-9 min walk", "徒歩7〜9分", "步行7~9分钟"),
    hours: loc(
      "화~토 11:30~14:00, 17:30~22:00 (일·월 휴무)",
      "Tue-Sat 11:30-14:00, 17:30-22:00 (closed Sun-Mon)",
      "火〜土 11:30〜14:00、17:30〜22:00（日・月休）",
      "周二至周六 11:30~14:00、17:30~22:00（周日、周一休息）",
    ),
    priceRange: loc("₩100,000~", "₩100,000+", "₩100,000〜", "₩100,000起"),
    recommendation: loc(
      "특별한 저녁이나 기념일 식사를 원하시면 예약 후 방문하기 좋은 고급 레스토랑이에요.",
      "A refined table for an anniversary or a slower evening — reserve ahead if you can.",
      "特別な夜や記念日の食事に。ご予約のうえお越しください。",
      "适合纪念日或特别的晚餐，建议提前预订。",
    ),
  }),
  place({
    name: "서울신라호텔 라연",
    nameEn: "La Yeon",
    category: "dining",
    mapQuery: "서울신라호텔 라연",
    distance: loc("도보 6~8분", "6-8 min walk", "徒歩6〜8分", "步行6~8分钟"),
    hours: loc(
      "매일 12:00~14:30, 17:30~21:30",
      "Daily 12:00-14:30, 17:30-21:30",
      "毎日 12:00〜14:30、17:30〜21:30",
      "每日 12:00~14:30、17:30~21:30",
    ),
    priceRange: loc("₩150,000~", "₩150,000+", "₩150,000〜", "₩150,000起"),
    recommendation: loc(
      "한국 전통음식을 고급스럽게 경험하고 싶은 외국인 손님께 추천하기 좋은 특별한 식사 장소입니다.",
      "Korean cuisine, presented with care — a memorable table if you want tradition without the noise.",
      "韓国の伝統料理を上質に味わいたい方へ。特別な食事の時間になります。",
      "想以精致方式体验韩国料理时，是很特别的一餐。",
    ),
  }),
  place({
    name: "프릳츠 장충",
    nameEn: "Fritz JangChung",
    category: "dining",
    mapQuery: "프릳츠 장충",
    distance: loc("도보 8~10분", "8-10 min walk", "徒歩8〜10分", "步行8~10分钟"),
    hours: loc("매일 08:00~22:00", "Daily 08:00-22:00", "毎日 08:00〜22:00", "每日 08:00~22:00"),
    priceRange: loc("₩10,000~25,000", "₩10,000-25,000", "₩10,000〜25,000", "₩10,000~25,000"),
    recommendation: loc(
      "가볍게 브런치나 빵과 음료로 식사하고 싶을 때 부담 없이 추천할 수 있는 곳이에요.",
      "When you want something light — bakery, coffee, and an easy brunch without dressing up.",
      "気軽なブランチやパンと飲み物で済ませたいときに、負担なくおすすめできる場所です。",
      "想轻松吃顿早午餐，或用面包和饮品简单解决时，这里刚刚好。",
    ),
  }),
  place({
    name: "명동 고깃집 윤슬 숯불구이",
    nameEn: "Yoonseul Charcoal Grill",
    category: "dining",
    mapQuery: "명동 고깃집 윤슬 숯불구이",
    transit: true,
    distance: loc(
      "도보 20~25분 (대중교통 추천)",
      "20-25 min walk (transit recommended)",
      "徒歩20〜25分（公共交通推奨）",
      "步行20~25分钟（建议乘坐公共交通）",
    ),
    hours: loc("매일 11:00~23:00", "Daily 11:00-23:00", "毎日 11:00〜23:00", "每日 11:00~23:00"),
    priceRange: loc("₩25,000~70,000", "₩25,000-70,000", "₩25,000〜70,000", "₩25,000~70,000"),
    recommendation: loc(
      "한국식 숯불구이를 처음 드시는 외국인 손님께 추천하기 좋은 곳으로, 숙성 삼겹살과 한우를 함께 즐길 수 있어요.",
      "A welcoming introduction to Korean charcoal grill — aged samgyeopsal and hanwoo, shared at the table.",
      "韓国の炭火焼きが初めての方にもおすすめ。熟成サムギョプサルと韓牛を一緒に楽しめます。",
      "适合第一次吃韩式炭火烤肉的客人，可同时品尝熟成五花肉与韩牛。",
    ),
  }),
  place({
    name: "명동 더식당",
    nameEn: "The Sic Ddang",
    category: "dining",
    mapQuery: "명동맛집 더식당",
    transit: true,
    distance: loc(
      "도보 20~25분 (대중교통 추천)",
      "20-25 min walk (transit recommended)",
      "徒歩20〜25分（公共交通推奨）",
      "步行20~25分钟（建议乘坐公共交通）",
    ),
    hours: loc("매일 11:00~23:00", "Daily 11:00-23:00", "毎日 11:00〜23:00", "每日 11:00~23:00"),
    priceRange: loc("₩10,000~20,000", "₩10,000-20,000", "₩10,000〜20,000", "₩10,000~20,000"),
    recommendation: loc(
      "쭈꾸미·칼국수·피자처럼 여러 메뉴를 나누어 먹을 수 있어 가족이나 친구끼리 방문하기 좋아요.",
      "A casual table for sharing — stir-fried webfoot octopus, kalguksu, pizza — easy with family or friends.",
      "チュクミ、カルグクス、ピザなど、いろいろなメニューを分けて食べられる、家族や友人との食事に。",
      "可以分食章鱼、刀削面和披萨等，适合家人或朋友一起去。",
    ),
  }),
  place({
    name: "장충단공원",
    nameEn: "Jangchungdan Park",
    category: "sights",
    mapQuery: "장충단공원",
    distance: loc("도보 5~7분", "5-7 min walk", "徒歩5〜7分", "步行5~7分钟"),
    hours: loc("24시간 개방", "Open 24 hours", "24時間開放", "24小时开放"),
    priceRange: loc("무료", "Free", "無料", "免费"),
    recommendation: loc(
      "숙소에서 가장 가까운 산책 코스로, 아침 산책이나 저녁에 조용히 걷기에 좋아요.",
      "The nearest walk from the suite — quiet in the morning, and just as easy after dark.",
      "滞在先からいちばん近い散策コース。朝の散歩や夜の静かな散歩に。",
      "离住处最近的散步路线，适合清晨或夜晚安静地走走。",
    ),
  }),
  place({
    name: "남산공원",
    nameEn: "Namsan Park",
    category: "sights",
    mapQuery: "남산공원",
    transit: true,
    distance: loc(
      "도보 15~20분 (버스 이용 추천)",
      "15-20 min walk (bus recommended)",
      "徒歩15〜20分（バス推奨）",
      "步行15~20分钟（建议乘公交）",
    ),
    hours: loc("24시간 개방", "Open 24 hours", "24時間開放", "24小时开放"),
    priceRange: loc("무료", "Free", "無料", "免费"),
    recommendation: loc(
      "낮에는 숲길 산책과 서울 전망을, 밤에는 서울 야경을 즐길 수 있어 가장 추천하는 명소예요.",
      "Our first recommendation: forest paths and city views by day, Seoul’s lights after dusk.",
      "昼は森の散歩とソウルの眺望を、夜は夜景を。いちばんおすすめの名所です。",
      "白天可走林间步道远眺首尔，夜里可看夜景，是我们最推荐的一处。",
    ),
  }),
  place({
    name: "남산 한국숲정원",
    nameEn: "Namsan Korean Forest Garden",
    category: "sights",
    mapQuery: "남산 한국숲정원",
    transit: true,
    distance: loc(
      "도보 20분 (버스 이용 추천)",
      "20 min walk (bus recommended)",
      "徒歩20分（バス推奨）",
      "步行20分钟（建议乘公交）",
    ),
    hours: loc("24시간 개방", "Open 24 hours", "24時間開放", "24小时开放"),
    priceRange: loc("무료", "Free", "無料", "免费"),
    recommendation: loc(
      "사람이 많은 중심 관광지보다 조용한 자연 풍경을 좋아하신다면 낮 시간 산책 코스로 추천드려요.",
      "Quieter than the main lookouts — a daytime walk if you prefer trees to crowds.",
      "混雑する観光地より、静かな自然がお好みなら、日中の散策に。",
      "若更想避开人潮、走一段安静的自然步道，白天很合适。",
    ),
  }),
  place({
    name: "중앙아시아거리",
    nameEn: "Central Asian Street",
    category: "sights",
    mapQuery: "광희동 중앙아시아거리",
    distance: loc("도보 12~15분", "12-15 min walk", "徒歩12〜15分", "步行12~15分钟"),
    hours: loc("24시간", "Open 24 hours", "24時間", "24小时"),
    priceRange: loc("무료", "Free", "無料", "免费"),
    recommendation: loc(
      "서울 안에서 색다른 분위기를 느끼고 싶을 때 추천하며, 낮에는 골목 구경, 저녁에는 이국적인 식사를 즐기기 좋아요.",
      "A different Seoul — wander the lanes by day, then stay for a Central Asian supper.",
      "ソウルのなかで少し違う空気を感じたいときに。昼は路地歩き、夜は異国情緒ある食事を。",
      "想在首尔感受一点不同的气息时，白天逛巷子，晚上可以吃顿异国风味的晚餐。",
    ),
  }),
  place({
    name: "인사동길",
    nameEn: "Insadong-gil",
    category: "sights",
    mapQuery: "인사동길",
    transit: true,
    distance: loc(
      "도보 30분 (대중교통 추천)",
      "30 min walk (transit recommended)",
      "徒歩30分（公共交通推奨）",
      "步行30分钟（建议乘坐公共交通）",
    ),
    hours: loc("상시 이용 가능", "Open throughout the day", "終日利用可", "全天可逛"),
    priceRange: loc("무료", "Free", "無料", "免费"),
    recommendation: loc(
      "전통 공예품과 기념품을 보고 싶거나 서울의 전통적인 분위기를 느끼고 싶을 때 좋아요.",
      "Craft shops, small galleries, and a slower street if you want a more traditional corner of Seoul.",
      "伝統工芸やお土産を見たいとき、ソウルの伝統的な空気を感じたいときに。",
      "想看传统工艺和纪念品，或感受首尔偏传统的一面时，很值得走一走。",
    ),
  }),
];
