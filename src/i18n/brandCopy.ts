import type { Locale } from "./translations";

export type BrandCopy = {
  meta: {
    homeTitle: string;
    roomsTitle: string;
    designersTitle: string;
    aboutTitle: string;
  };
  nav: {
    rooms: string;
    designers: string;
    about: string;
    book: string;
    menu: string;
    close: string;
  };
  hero: {
    tagline: string;
    taglineLocal: string;
    scroll: string;
  };
  intro: {
    line1: string;
    line2: string;
    body: string;
  };
  rooms: {
    kicker: string;
    title: string;
    view: string;
    comingSoon: string;
    comingSoonHint: string;
    book: string;
    capacity: string;
    amenitiesTitle: string;
    galleryNote: string;
    back: string;
    indexIntro: string;
    detailIntro: string;
    comingSoonA: { name: string; blurb: string };
    comingSoonB: { name: string; blurb: string };
    fallbackBlurb: string;
    amenities: string[];
  };
  experience: {
    kicker: string;
    title: string;
    items: { title: string; body: string }[];
  };
  designers: {
    kicker: string;
    title: string;
    subtitle: string;
    viewAll: string;
    comingSoon: string;
    interview: string;
    involved: string;
    quoteLabel: string;
    indexIntro: string;
    people: Record<
      string,
      {
        name: string;
        field: string;
        blurb: string;
        quote: string;
        interview: { q: string; a: string }[];
      }
    >;
  };
  location: {
    kicker: string;
    title: string;
    body: string;
    addressLabel: string;
    landmarks: string[];
  };
  about: {
    kicker: string;
    title: string;
    lead: string;
    philosophy: string[];
    whyTitle: string;
    whyBody: string;
    timelineTitle: string;
    milestones: { year: string; title: string; body: string }[];
  };
  footer: {
    alreadyStaying: string;
    privacy: string;
    instagram: string;
    call: string;
    tagline: string;
  };
  privacyBack: string;
};

const roomsShared = {
  comingSoonA: {
    ko: { name: "Suite 02", blurb: "두 번째 스위트. 아직 선을 그리고 있습니다." },
    en: { name: "Suite 02", blurb: "A second suite. Still being drawn." },
    ja: { name: "Suite 02", blurb: "二つ目のスイート。いま線を描いているところです。" },
    zh: { name: "Suite 02", blurb: "第二间套房。仍在描绘之中。" },
  },
  comingSoonB: {
    ko: { name: "Garden Stay", blurb: "정원을 향한 머무름. 다음 계절에 열립니다." },
    en: { name: "Garden Stay", blurb: "A garden-facing stay, opening next season." },
    ja: { name: "Garden Stay", blurb: "庭に向かう滞在。次の季節に開きます。" },
    zh: { name: "Garden Stay", blurb: "面向庭院的停留。将于下一季开放。" },
  },
};

const people = {
  seoyeon: {
    ko: {
      name: "이서연",
      field: "Interior Designer",
      blurb: "남산의 빛과 장충동의 고요를 객실의 결로 옮겼습니다.",
      quote: "공간을 설계할 때 가장 먼저 생각하는 것은 빛입니다. 남산의 아침 햇살이 어느 각도로 들어오는지부터 관찰했어요.",
      interview: [
        {
          q: "이 공간을 처음 마주했을 때 무엇이 보였나요?",
          a: "창으로 들어오는 남산의 실루엣이었습니다. 서울의 소음이 한 겹 걸러진 자리라는 느낌이 들었어요. 그래서 벽을 채우기보다, 그 빛이 하루 동안 어떻게 이동하는지를 먼저 그렸습니다.",
        },
        {
          q: "객실에서 가장 오래 고민한 부분은 무엇인가요?",
          a: "침대와 창 사이의 거리입니다. 너무 가까우면 도시가 다가오고, 너무 멀면 풍경이 액자가 되어 버립니다. 머무는 사람이 창을 바라볼 때, 바깥이 풍경이 아니라 공기가 되길 바랐어요.",
        },
        {
          q: "재료는 어떻게 골랐나요?",
          a: "만졌을 때 온도가 너무 차지 않은 것들을 골랐습니다. 석재도, 나무도, 패브릭도 손끝이 머무는 순간이 있거든요. 그 순간이 차갑지 않기를 원했습니다.",
        },
        {
          q: "손님이 이 방에서 기억했으면 하는 감각이 있나요?",
          a: "저녁의 침묵입니다. 조명이 한 단계 낮아지고, 창밖 남산이 검게 가라앉는 그 시간. 서울에 있는데 서울이 멀어지는 느낌이었으면 합니다.",
        },
      ],
    },
    en: {
      name: "Lee Seoyeon",
      field: "Interior Designer",
      blurb: "She translated Namsan’s light and Jangchung’s quiet into the grain of the room.",
      quote:
        "The first thing I consider is light. I began by watching how morning sun from Namsan enters the room, and at what angle.",
      interview: [
        {
          q: "What did you see when you first walked into this space?",
          a: "The silhouette of Namsan in the window. The city’s noise felt one layer thinner here. So rather than filling the walls, I started by drawing how the light would move across a single day.",
        },
        {
          q: "What took the longest to get right?",
          a: "The distance between the bed and the window. Too close, and the city leans in. Too far, and the view becomes a picture. I wanted the outside to feel like air, not scenery, when someone looks out.",
        },
        {
          q: "How did you choose the materials?",
          a: "I chose things that don’t feel cold to the touch. Stone, wood, fabric — each has a moment where the fingertips stay. I didn’t want that moment to be chilly.",
        },
        {
          q: "What would you like a guest to remember?",
          a: "The silence of evening. When the lights drop a level and Namsan settles into black. To be in Seoul, and feel Seoul recede.",
        },
      ],
    },
    ja: {
      name: "イ・ソヨン",
      field: "Interior Designer",
      blurb: "南山の光と、奨忠洞の静けさを客室の質感へ移しました。",
      quote:
        "空間を設計するとき、最初に考えるのは光です。南山の朝日がどの角度で入るのか、そこから観察しました。",
      interview: [
        {
          q: "この空間に初めて立ったとき、何が見えましたか。",
          a: "窓に入る南山のシルエットでした。ソウルの喧騒が一枚、濾された場所だと感じました。だから壁を埋めるより先に、光が一日のうちにどう移動するかを描きました。",
        },
        {
          q: "客室でいちばん長く悩んだ部分は。",
          a: "ベッドと窓の距離です。近すぎると街が迫り、遠すぎると景色が額縁になります。滞在する人が窓を見るとき、外が風景ではなく空気であってほしいと思いました。",
        },
        {
          q: "素材はどのように選びましたか。",
          a: "触れたときに冷たすぎないものを選びました。石も木も布も、指先が留まる瞬間があります。その瞬間が冷たくないことを願いました。",
        },
        {
          q: "客人に覚えていてほしい感覚はありますか。",
          a: "夕方の沈黙です。照明が一段階落ち、窓の外の南山が黒く沈む時間。ソウルにいながら、ソウルが遠ざかる感じであってほしいのです。",
        },
      ],
    },
    zh: {
      name: "李瑞妍",
      field: "Interior Designer",
      blurb: "把南山的光与奖忠洞的静，写进房间的肌理。",
      quote: "设计空间时，我最先想的是光。从观察南山晨光以怎样的角度进入房间开始。",
      interview: [
        {
          q: "第一次走进这里时，你看见了什么？",
          a: "窗里南山的轮廓。首尔的喧响在这里像被滤掉一层。所以我没有急着填满墙壁，而是先画出光线在一天里如何移动。",
        },
        {
          q: "房间里耗时最久的是哪一部分？",
          a: "床与窗的距离。太近，城市就会压过来；太远，风景就变成画框。我希望人望向窗外时，外面是空气，而不是风景。",
        },
        {
          q: "材料是怎么选的？",
          a: "选触摸时不会太凉的东西。石、木、织物——指尖都会停驻一瞬。我不希望那一瞬是冷的。",
        },
        {
          q: "希望客人记住怎样的感觉？",
          a: "傍晚的静默。灯光低一度，窗外南山沉成黑色。人在首尔，却感到首尔远去。",
        },
      ],
    },
  },
  junho: {
    ko: {
      name: "박준호",
      field: "Furniture",
      blurb: "오래 앉아도 자세가 흐트러지지 않는 비례를 찾았습니다.",
      quote: "가구는 공간의 문장 부호라고 생각해요. 너무 많으면 목소리가 되고, 없으면 호흡이 사라집니다.",
      interview: [
        {
          q: "이 객실의 가구는 어디에서 출발했나요?",
          a: "앉는 높이부터였습니다. 창을 바라보는 의자가 침대보다 낮으면 시선이 겸손해지고, 테이블이 손끝에 가까우면 머무는 시간이 길어집니다. 그 두 높이를 먼저 정했어요.",
        },
        {
          q: "나무의 결을 드러낸 이유가 있나요?",
          a: "페인트로 덮으면 시간이 멈춥니다. 결이 보이면 아침과 저녁의 빛이 다르게 머무르거든요. 같은 테이블인데 하루를 두 번 사는 느낌이 들기를 바랐습니다.",
        },
        {
          q: "손님이 만졌으면 하는 부분은 어디인가요?",
          a: "침대 옆 협탁의 모서리입니다. 날을 세우지 않고 손바닥이 자연스럽게 멈추도록 깎았습니다. 잠들기 전, 그 짧은 접촉이 객실의 온도를 알려 주기를 원했어요.",
        },
        {
          q: "가구가 공간에서 사라지길 바라나요, 드러나길 바라나요?",
          a: "낮에는 사라지고, 저녁에는 한 번만 드러나길 바랍니다. 조명이 내려앉을 때 나무의 단면에 금이 스치듯 반짝이는 그 한 순간이면 충분합니다.",
        },
      ],
    },
    en: {
      name: "Park Junho",
      field: "Furniture",
      blurb: "He looked for proportions that hold, even after a long sit.",
      quote:
        "I think of furniture as punctuation. Too much, and it starts to speak. Too little, and the room loses its breath.",
      interview: [
        {
          q: "Where did the furniture for this room begin?",
          a: "With sitting height. If the chair facing the window sits lower than the bed, the gaze becomes modest. If the table stays close to the fingertips, time in the room lengthens. Those two heights came first.",
        },
        {
          q: "Why leave the grain of the wood visible?",
          a: "Paint stops time. When the grain is visible, morning light and evening light stay differently. I wanted the same table to feel like two days lived in one.",
        },
        {
          q: "Is there a part you hope a guest will touch?",
          a: "The edge of the bedside table. I didn’t sharpen it. I carved it so the palm stops there naturally. That brief contact before sleep should tell you the temperature of the room.",
        },
        {
          q: "Should furniture disappear, or be seen?",
          a: "Disappear by day, and appear once at night. When the lights settle, a single gleam along the cut of the wood is enough.",
        },
      ],
    },
    ja: {
      name: "パク・ジュンホ",
      field: "Furniture",
      blurb: "長く座っても姿勢が崩れない比例を探しました。",
      quote:
        "家具は空間の句読点だと思っています。多すぎると声になり、なければ呼吸が消えます。",
      interview: [
        {
          q: "この客室の家具はどこから始まりましたか。",
          a: "座る高さからです。窓を向く椅子がベッドより低いと視線が慎ましくなり、テーブルが指先に近いと滞在の時間が長くなります。その二つの高さを先に決めました。",
        },
        {
          q: "木目を見せた理由は。",
          a: "塗料で覆うと時間が止まります。木目が見えると、朝と夕方の光の留まり方が違います。同じテーブルなのに、一日を二度生きるような感じであってほしかった。",
        },
        {
          q: "客人に触れてほしい場所はありますか。",
          a: "ベッドサイドの角です。刃を立てず、掌が自然に止まるように削りました。眠る前の短い接触が、客室の温度を教えてくれることを願いました。",
        },
        {
          q: "家具は消えるべきですか、現れるべきですか。",
          a: "昼は消え、夜に一度だけ現れてほしい。照明が落ちたとき、木の断面に金が差すような一瞬があれば十分です。",
        },
      ],
    },
    zh: {
      name: "朴俊浩",
      field: "Furniture",
      blurb: "寻找即使久坐也不失比例的尺度。",
      quote: "家具是空间的标点。太多会变成声音，太少呼吸就消失。",
      interview: [
        {
          q: "这间客房的家具从哪里开始？",
          a: "从坐高开始。面向窗户的椅子若低于床，视线会变得谦逊；桌子若靠近指尖，停留的时间会变长。这两个高度最先确定。",
        },
        {
          q: "为什么留下木纹？",
          a: "油漆会让时间停下。木纹可见时，晨光与暮光停留的方式不同。我希望同一张桌子，能让人过完两遍一天。",
        },
        {
          q: "希望客人触摸哪一处？",
          a: "床边柜的边角。没有削尖，而是让掌心自然停住。入睡前那短暂的接触，应能告诉你房间的温度。",
        },
        {
          q: "家具该隐去，还是显现？",
          a: "白天隐去，夜里只显现一次。灯光落下时，木的断面闪过一线金，就够了。",
        },
      ],
    },
  },
  harin: {
    ko: {
      name: "김하린",
      field: "Lighting",
      blurb: "밤의 객실이 낮과 다른 얼굴을 갖도록 층을 나눴습니다.",
      quote: "좋은 조명은 보이지 않습니다. 다만 얼굴이, 천이, 창밖의 산이 다르게 보일 뿐입니다.",
      interview: [
        {
          q: "조명을 설계할 때 가장 먼저 없앤 것은 무엇인가요?",
          a: "천장 한가운데의 밝은 점입니다. 얼굴 위에 그림자를 떨어뜨리고, 창밖의 남산을 유리 너머의 포스터처럼 만들어 버리거든요. 대신 벽과 바닥을 조용히 밀어 올리는 빛을 썼습니다.",
        },
        {
          q: "손님이 직접 조절하길 바라는 장면이 있나요?",
          a: "잠들기 한 시간 전의 낮은 황금빛입니다. 책을 읽기엔 충분하고, 대화는 조금 느려지는 밝기. 그 장면을 기본값으로 두었습니다.",
        },
        {
          q: "향과 빛은 어떻게 맞춰 보았나요?",
          a: "우디한 향이 있을 때는 색온도를 조금 내렸습니다. 같은 공간이 더 깊게 숨을 쉬는 느낌이 들어요. 시트러스가 올라오는 날에는 창 쪽을 한 단계 열어, 공기가 더 맑아 보이게 했습니다.",
        },
        {
          q: "이 방에서 가장 아름다운 시간은 언제인가요?",
          a: "해 진 뒤 십오 분. 바깥은 아직 남색이고, 실내는 이미 금입니다. 그 경계에 서 있으면, 객실이 도시를 잠시 잊게 합니다.",
        },
      ],
    },
    en: {
      name: "Kim Harin",
      field: "Lighting",
      blurb: "She layered the night so the room could wear a different face after dark.",
      quote:
        "Good lighting is invisible. You only notice that a face, a cloth, a mountain beyond the glass look different.",
      interview: [
        {
          q: "What was the first thing you removed from the lighting plan?",
          a: "The bright point in the center of the ceiling. It drops a shadow across the face and turns Namsan into a poster behind glass. I used light that lifts the walls and floor instead — quietly.",
        },
        {
          q: "Is there a scene you hope a guest will set themselves?",
          a: "The low gold of the hour before sleep. Bright enough to read, slow enough for conversation. I made that the default.",
        },
        {
          q: "How did you match light to scent?",
          a: "When the room is woody, I drop the color temperature a little. The same space seems to breathe more deeply. On citrus days, I open the window side one step, so the air looks clearer.",
        },
        {
          q: "When is this room at its most beautiful?",
          a: "Fifteen minutes after sunset. Outside still indigo, inside already gold. Stand in that threshold, and the room lets the city forget you for a while.",
        },
      ],
    },
    ja: {
      name: "キム・ハリン",
      field: "Lighting",
      blurb: "夜の客室が昼とは別の顔を持てるよう、層を分けました。",
      quote:
        "良い照明は見えません。ただ顔が、布が、窓の外の山が違って見えるだけです。",
      interview: [
        {
          q: "照明を設計するとき、最初に取り除いたものは。",
          a: "天井の真ん中の明るい点です。顔に影を落とし、窓の外の南山をガラスの向こうのポスターにしてしまいます。代わりに、壁と床を静かに押し上げる光を使いました。",
        },
        {
          q: "客人に自ら整えてほしい場面はありますか。",
          a: "眠る一時間前の低い金色です。本を読むには足りて、会話は少し遅くなる明るさ。その場面を初期値にしました。",
        },
        {
          q: "香りと光はどう合わせましたか。",
          a: "ウッディな香りがあるときは色温度を少し下げました。同じ空間がより深く息をする感じがします。シトラスが立つ日は窓側を一段開き、空気がより澄んで見えるようにしました。",
        },
        {
          q: "この部屋がいちばん美しい時間は。",
          a: "日没の十五分後。外はまだ藍で、室内はすでに金。その境界に立つと、客室は都市をしばらく忘れさせます。",
        },
      ],
    },
    zh: {
      name: "金夏麟",
      field: "Lighting",
      blurb: "把夜晚分层，让客房在暗下来之后换一副面孔。",
      quote: "好的灯光是看不见的。你只会发现脸、布料、玻璃外的山，看起来不一样。",
      interview: [
        {
          q: "做灯光时，你最先拿掉的是什么？",
          a: "天花正中那一点过亮的光。它会在脸上投下影子，把窗外的南山变成玻璃后的海报。我改用把墙和地板轻轻托起来的光。",
        },
        {
          q: "希望客人自己调出哪一种场面？",
          a: "入睡前一小时的低金色。够读书，又让对话变慢。我把它设成了默认。",
        },
        {
          q: "香与光是怎么配合的？",
          a: "木香时，色温稍降，同一空间像在更深地呼吸。柑橘升起的日子，把窗侧再开一档，让空气看起来更清。",
        },
        {
          q: "这间房最美的时刻是？",
          a: "日落之后十五分钟。外面仍是靛蓝，室内已是金。站在那道界线上，客房会让城市暂时忘记你。",
        },
      ],
    },
  },
};

function designerPeople(locale: Locale): BrandCopy["designers"]["people"] {
  return {
    seoyeon: people.seoyeon[locale],
    junho: people.junho[locale],
    harin: people.harin[locale],
  };
}

export const brandCopy: Record<Locale, BrandCopy> = {
  ko: {
    meta: {
      homeTitle: "홈",
      roomsTitle: "객실",
      designersTitle: "디자이너",
      aboutTitle: "브랜드 스토리",
    },
    nav: {
      rooms: "Rooms",
      designers: "Designers",
      about: "About",
      book: "Book",
      menu: "메뉴",
      close: "닫기",
    },
    hero: {
      tagline: "A quiet luxury stay in Seoul",
      taglineLocal: "남산 곁, 고요한 머무름",
      scroll: "Scroll",
    },
    intro: {
      line1: "우리는 방을 만들지 않았습니다.",
      line2: "머무는 시간을 설계했습니다.",
      body: "디자이너와 함께 공간의 모든 결을 다시 그렸습니다.\n조명의 각도, 침구의 무게, 공기의 향까지 —\n당신이 머무는 동안의 모든 감각을 고려했습니다.",
    },
    rooms: {
      kicker: "Stay",
      title: "Rooms",
      view: "View",
      comingSoon: "Coming Soon",
      comingSoonHint: "다음 공간이 준비되고 있습니다.",
      book: "예약하기",
      capacity: "정원",
      amenitiesTitle: "편의시설",
      galleryNote: "공간의 결을 가까이에서.",
      back: "객실 목록",
      indexIntro: "남산 곁에 머무는 몇 개의 방. 지금은 301호가 문을 열었습니다.",
      detailIntro: "빛, 향, 침구까지 — 머무는 시간을 위해 다시 그린 공간입니다.",
      comingSoonA: roomsShared.comingSoonA.ko,
      comingSoonB: roomsShared.comingSoonB.ko,
      fallbackBlurb: "남산 곁의 고요한 스위트. 빛, 향, 침구까지 머무는 시간을 위해 다시 그렸습니다.",
      amenities: [
        "취향에 맞춘 킹 사이즈 침구",
        "레인 샤워",
        "큐레이션된 향",
        "장면별 조명",
        "네스프레소",
        "조용한 작업 공간",
        "남산 방향의 창",
      ],
    },
    experience: {
      kicker: "The Experience",
      title: "머무름의 결",
      items: [
        {
          title: "당신이 도착하기 전에",
          body: "선호하시는 향과 침구를 미리 여쭙습니다.",
        },
        {
          title: "머무는 동안",
          body: "필요한 모든 것을 한 번의 터치로.",
        },
        {
          title: "떠난 후에도",
          body: "당신의 취향은 기억됩니다.",
        },
      ],
    },
    designers: {
      kicker: "The People",
      title: "함께한 사람들",
      subtitle: "공간을 만든 사람들",
      viewAll: "View All",
      comingSoon: "준비 중",
      interview: "Interview",
      involved: "이 디자이너가 참여한 공간",
      quoteLabel: "Note",
      indexIntro:
        "객실의 결은 한 사람의 손이 아닙니다. 빛, 가구, 향 — 각자의 언어로 같은 고요를 만들었습니다.",
      people: designerPeople("ko"),
    },
    location: {
      kicker: "Location",
      title: "장충동, 남산 곁",
      body: "서울의 중심이되, 한 켜 물러선 자리. 남산의 숲과 장충단공원의 보행로가 객실의 창 가까이 있습니다.",
      addressLabel: "Address",
      landmarks: ["남산", "장충단공원", "동대입구역", "장충동"],
    },
    about: {
      kicker: "About",
      title: "왜 채네스트인가",
      lead: "CHAN과 NEST가 만나, 머무는 시간을 짓는 브랜드가 되었습니다.",
      philosophy: [
        "우리는 숙소를 상품으로 보지 않습니다. 하룻밤의 공기가 다음 날의 보행을 바꾼다고 믿습니다.",
        "그래서 객실의 모든 결정은 사진이 아니라 감각에서 출발합니다. 손끝에 남는 온도, 잠들기 전의 밝기, 창을 열었을 때의 향.",
        "THE CHANEST NAMSAN은 그 감각을 장충동이라는 자리에 조용히 앉힌 첫 번째 머무름입니다.",
      ],
      whyTitle: "이름에 대하여",
      whyBody:
        "CHAN은 사람을, NEST는 머무는 자리를 뜻합니다. 화려한 수식 대신, 손님이 자신의 리듬으로 쉴 수 있는 둥지를 만들고자 했습니다. 남산은 그 둥지가 바라보는 산이며, 동시에 서울을 한 걸음 물러서게 하는 거리입니다.",
      timelineTitle: "Milestones",
      milestones: [
        {
          year: "2024",
          title: "설립",
          body: "머무는 시간을 설계하겠다는 문장에서 브랜드가 시작되었습니다.",
        },
        {
          year: "2025",
          title: "301호 오픈",
          body: "장충동에 첫 객실이 문을 열었습니다. 디자이너와 함께 빛과 가구, 향을 다시 그렸습니다.",
        },
        {
          year: "Soon",
          title: "다음 공간",
          body: "두 번째 스위트와 정원을 향한 머무름이 준비되고 있습니다.",
        },
      ],
    },
    footer: {
      alreadyStaying: "투숙 중이신가요?",
      privacy: "개인정보처리방침",
      instagram: "Instagram",
      call: "전화",
      tagline: "A STAY BY CHAN & NEST",
    },
    privacyBack: "홈으로",
  },
  en: {
    meta: {
      homeTitle: "Home",
      roomsTitle: "Rooms",
      designersTitle: "Designers",
      aboutTitle: "About",
    },
    nav: {
      rooms: "Rooms",
      designers: "Designers",
      about: "About",
      book: "Book",
      menu: "Menu",
      close: "Close",
    },
    hero: {
      tagline: "A quiet luxury stay in Seoul",
      taglineLocal: "Beside Namsan, time slows.",
      scroll: "Scroll",
    },
    intro: {
      line1: "We did not make a room.",
      line2: "We designed the time you spend in it.",
      body: "Every surface was redrawn with a designer.\nThe angle of the light, the weight of the bedding, the scent in the air —\nevery sense, considered, for the hours you are here.",
    },
    rooms: {
      kicker: "Stay",
      title: "Rooms",
      view: "View",
      comingSoon: "Coming Soon",
      comingSoonHint: "The next rooms are being drawn.",
      book: "Book",
      capacity: "Guests",
      amenitiesTitle: "Amenities",
      galleryNote: "The grain of the space, up close.",
      back: "All rooms",
      indexIntro: "A handful of rooms beside Namsan. Suite 301 is open.",
      detailIntro: "Light, scent, bedding — redrawn for the hours you stay.",
      comingSoonA: roomsShared.comingSoonA.en,
      comingSoonB: roomsShared.comingSoonB.en,
      fallbackBlurb:
        "A quiet suite beside Namsan. Light, scent, and bedding — redrawn for the hours you stay.",
      amenities: [
        "King bedding, set to your preference",
        "Rain shower",
        "Curated scent",
        "Layered lighting scenes",
        "Nespresso",
        "A quiet desk",
        "A window toward Namsan",
      ],
    },
    experience: {
      kicker: "The Experience",
      title: "How a stay is held",
      items: [
        {
          title: "Before you arrive",
          body: "We ask about the scent and bedding you prefer.",
        },
        {
          title: "While you stay",
          body: "Everything you need, in a single touch.",
        },
        {
          title: "After you leave",
          body: "Your preferences are remembered.",
        },
      ],
    },
    designers: {
      kicker: "The People",
      title: "The people behind the space",
      subtitle: "The people behind the space",
      viewAll: "View All",
      comingSoon: "Coming soon",
      interview: "Interview",
      involved: "Spaces they shaped",
      quoteLabel: "Note",
      indexIntro:
        "The grain of a room is never one pair of hands. Light, furniture, scent — each in its own language, toward the same quiet.",
      people: designerPeople("en"),
    },
    location: {
      kicker: "Location",
      title: "Jangchung, beside Namsan",
      body: "The center of Seoul, set one step back. The forest of Namsan and the paths of Jangchungdan Park sit close to the window.",
      addressLabel: "Address",
      landmarks: ["Namsan", "Jangchungdan Park", "Dongguk University Station", "Jangchung-dong"],
    },
    about: {
      kicker: "About",
      title: "Why Chanest",
      lead: "CHAN and NEST met to build not a room, but the hours spent inside it.",
      philosophy: [
        "We do not treat a stay as a product. We believe the air of one night can change how you walk the next morning.",
        "Every decision in the room begins with the senses, not with a photograph: the temperature that lingers on the fingertips, the brightness before sleep, the scent when a window opens.",
        "THE CHANEST NAMSAN is the first of those hours, set quietly in Jangchung-dong.",
      ],
      whyTitle: "On the name",
      whyBody:
        "CHAN is the person; NEST is the place one stays. Instead of ornament, we wanted a nest where a guest can rest in their own rhythm. Namsan is the mountain the nest looks toward — and the distance that lets Seoul step back.",
      timelineTitle: "Milestones",
      milestones: [
        {
          year: "2024",
          title: "Founded",
          body: "The brand began with a single sentence: to design the time one spends.",
        },
        {
          year: "2025",
          title: "Suite 301 opens",
          body: "The first room opened in Jangchung-dong. Light, furniture, and scent were redrawn with designers.",
        },
        {
          year: "Soon",
          title: "What follows",
          body: "A second suite, and a garden-facing stay, are being prepared.",
        },
      ],
    },
    footer: {
      alreadyStaying: "Already staying with us?",
      privacy: "Privacy Policy",
      instagram: "Instagram",
      call: "Call",
      tagline: "A STAY BY CHAN & NEST",
    },
    privacyBack: "Back to home",
  },
  ja: {
    meta: {
      homeTitle: "ホーム",
      roomsTitle: "客室",
      designersTitle: "デザイナー",
      aboutTitle: "ストーリー",
    },
    nav: {
      rooms: "Rooms",
      designers: "Designers",
      about: "About",
      book: "Book",
      menu: "メニュー",
      close: "閉じる",
    },
    hero: {
      tagline: "A quiet luxury stay in Seoul",
      taglineLocal: "南山の傍ら、静かな滞在",
      scroll: "Scroll",
    },
    intro: {
      line1: "私たちは部屋を作りませんでした。",
      line2: "滞在する時間を設計しました。",
      body: "デザイナーとともに、空間のすべての質感を描き直しました。\n光の角度、寝具の重さ、空気の香りまで —\nあなたが滞在するあいだの感覚を、すべて考えました。",
    },
    rooms: {
      kicker: "Stay",
      title: "Rooms",
      view: "View",
      comingSoon: "Coming Soon",
      comingSoonHint: "次の空間を、いま準備しています。",
      book: "予約する",
      capacity: "定員",
      amenitiesTitle: "アメニティ",
      galleryNote: "空間の質感を、近くで。",
      back: "客室一覧",
      indexIntro: "南山の傍らの、いくつかの部屋。いまは301号室が開いています。",
      detailIntro: "光、香り、寝具まで — 滞在する時間のために描き直した空間です。",
      comingSoonA: roomsShared.comingSoonA.ja,
      comingSoonB: roomsShared.comingSoonB.ja,
      fallbackBlurb:
        "南山の傍らの静かなスイート。光、香り、寝具まで、滞在する時間のために描き直しました。",
      amenities: [
        "好みに合わせたキングサイズ寝具",
        "レインシャワー",
        "キュレーションされた香り",
        "シーン照明",
        "ネスプレッソ",
        "静かなデスク",
        "南山へ開く窓",
      ],
    },
    experience: {
      kicker: "The Experience",
      title: "滞在の質感",
      items: [
        {
          title: "到着する前に",
          body: "お好みの香りと寝具を、あらかじめ伺います。",
        },
        {
          title: "滞在しているあいだ",
          body: "必要なものは、一度のタッチで。",
        },
        {
          title: "立ち去ったあとも",
          body: "あなたの好みは、覚えられています。",
        },
      ],
    },
    designers: {
      kicker: "The People",
      title: "ともに作った人たち",
      subtitle: "空間をつくった人たち",
      viewAll: "View All",
      comingSoon: "準備中",
      interview: "Interview",
      involved: "このデザイナーが関わった空間",
      quoteLabel: "Note",
      indexIntro:
        "客室の質感は、ひとりの手ではありません。光、家具、香り — それぞれの言葉で、同じ静けさを作りました。",
      people: designerPeople("ja"),
    },
    location: {
      kicker: "Location",
      title: "奨忠洞、南山の傍ら",
      body: "ソウルの中心でありながら、一枚退いた場所。南山の森と奨忠壇公園の歩道が、客室の窓の近くにあります。",
      addressLabel: "Address",
      landmarks: ["南山", "奨忠壇公園", "東大入口駅", "奨忠洞"],
    },
    about: {
      kicker: "About",
      title: "なぜチャネストなのか",
      lead: "CHANとNESTが出会い、滞在する時間をつくるブランドになりました。",
      philosophy: [
        "私たちは宿を商品だとは考えません。一夜の空気が、翌朝の歩き方を変えると信じています。",
        "だから客室のすべての決断は、写真ではなく感覚から始まります。指先に残る温度、眠る前の明るさ、窓を開けたときの香り。",
        "THE CHANEST NAMSANは、その感覚を奨忠洞という場所に静かに置いた、最初の滞在です。",
      ],
      whyTitle: "名前について",
      whyBody:
        "CHANは人を、NESTは滞在する場所を意味します。華やかな修飾の代わりに、客人が自分のリズムで休める巣をつくりたかった。南山はその巣が見つめる山であり、ソウルを一歩退かせる距離でもあります。",
      timelineTitle: "Milestones",
      milestones: [
        {
          year: "2024",
          title: "設立",
          body: "滞在する時間を設計するという一文から、ブランドが始まりました。",
        },
        {
          year: "2025",
          title: "301号室オープン",
          body: "奨忠洞に最初の客室が開きました。デザイナーとともに光と家具、香りを描き直しました。",
        },
        {
          year: "Soon",
          title: "次の空間",
          body: "二つ目のスイートと、庭に向かう滞在を準備しています。",
        },
      ],
    },
    footer: {
      alreadyStaying: "ご滞在中ですか？",
      privacy: "プライバシーポリシー",
      instagram: "Instagram",
      call: "電話",
      tagline: "A STAY BY CHAN & NEST",
    },
    privacyBack: "ホームへ",
  },
  zh: {
    meta: {
      homeTitle: "首页",
      roomsTitle: "客房",
      designersTitle: "设计师",
      aboutTitle: "关于",
    },
    nav: {
      rooms: "Rooms",
      designers: "Designers",
      about: "About",
      book: "Book",
      menu: "菜单",
      close: "关闭",
    },
    hero: {
      tagline: "A quiet luxury stay in Seoul",
      taglineLocal: "南山身旁，安静的停留",
      scroll: "Scroll",
    },
    intro: {
      line1: "我们没有只做一间房间。",
      line2: "我们设计了你停留的时间。",
      body: "与设计师一起，把空间的每道肌理重新画过。\n灯光的角度、寝具的重量、空气里的香——\n你停留其间的每一种感官，都被考虑过。",
    },
    rooms: {
      kicker: "Stay",
      title: "Rooms",
      view: "View",
      comingSoon: "Coming Soon",
      comingSoonHint: "下一间空间，正在被描绘。",
      book: "预订",
      capacity: "入住人数",
      amenitiesTitle: "设施",
      galleryNote: "靠近看，空间的肌理。",
      back: "全部客房",
      indexIntro: "南山身旁的几间房。此刻，301号已经开门。",
      detailIntro: "光、香、寝具——为停留的时间重新画过的空间。",
      comingSoonA: roomsShared.comingSoonA.zh,
      comingSoonB: roomsShared.comingSoonB.zh,
      fallbackBlurb: "南山身旁安静的套房。光、香与寝具，都为停留的时间重新画过。",
      amenities: [
        "按喜好准备的特大床寝具",
        "雨淋花洒",
        "精选香氛",
        "分层灯光场景",
        "Nespresso",
        "安静的书桌",
        "朝向南山的窗",
      ],
    },
    experience: {
      kicker: "The Experience",
      title: "停留的肌理",
      items: [
        {
          title: "在你抵达之前",
          body: "我们会先问起你偏好的香与寝具。",
        },
        {
          title: "停留期间",
          body: "需要的一切，一次触碰即可。",
        },
        {
          title: "离开之后",
          body: "你的喜好会被记住。",
        },
      ],
    },
    designers: {
      kicker: "The People",
      title: "一起完成的人",
      subtitle: "把空间做出来的人",
      viewAll: "View All",
      comingSoon: "即将推出",
      interview: "Interview",
      involved: "这位设计师参与的空间",
      quoteLabel: "Note",
      indexIntro: "客房的肌理从不是一双手。光、家具、香——各自的语言，朝向同一种安静。",
      people: designerPeople("zh"),
    },
    location: {
      kicker: "Location",
      title: "奖忠洞，南山身旁",
      body: "在首尔的中心，却退开一层。南山的林木与奖忠坛公园的步道，就在客房窗边。",
      addressLabel: "Address",
      landmarks: ["南山", "奖忠坛公园", "东大门历史文化公园站／东大入口", "奖忠洞"],
    },
    about: {
      kicker: "About",
      title: "为何是 CHANEST",
      lead: "CHAN 与 NEST 相遇，成为一个建造停留时间的品牌。",
      philosophy: [
        "我们不把住宿当作商品。我们相信一夜的空气，能改变次日的步伐。",
        "所以客房里的每一个决定都从感官出发，而不是照片：指尖残留的温度、入睡前的亮度、开窗时的香。",
        "THE CHANEST NAMSAN 是把这种感官，安静安放在奖忠洞的第一次停留。",
      ],
      whyTitle: "关于这个名字",
      whyBody:
        "CHAN 是人，NEST 是停留的位置。不要华丽的修饰，我们想做的是客人能按自己节奏休息的巢。南山是这座巢望向的山，也是让首尔退开一步的距离。",
      timelineTitle: "Milestones",
      milestones: [
        {
          year: "2024",
          title: "创立",
          body: "品牌始于一句话：设计人停留的时间。",
        },
        {
          year: "2025",
          title: "301号开业",
          body: "第一间客房在奖忠洞开门。与设计师一起，重新画过光、家具与香。",
        },
        {
          year: "Soon",
          title: "下一间空间",
          body: "第二间套房，以及面向庭院的停留，正在准备。",
        },
      ],
    },
    footer: {
      alreadyStaying: "已经入住了吗？",
      privacy: "隐私政策",
      instagram: "Instagram",
      call: "电话",
      tagline: "A STAY BY CHAN & NEST",
    },
    privacyBack: "返回首页",
  },
};

export function getBrandCopy(locale: Locale): BrandCopy {
  return brandCopy[locale];
}
