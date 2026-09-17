import { hotelData } from "@/data/hotelData";

const NAME_ALIASES: Record<string, string[]> = {
  프링글스: ["pringles"],
  콜라: ["coca cola", "cola"],
  사이다: ["sprite"],
  "하이볼 캔": ["jimbeam", "highball"],
  참이슬: ["dokdo", "soju"],
  "발렌타인 위스키": ["ballantine"],
  "하우스 와인": ["babich", "grant burge"],
};

export function fallbackMinibarImage(name: string, category: string): string {
  const items = hotelData.minibarItems;
  const needle = name.trim().toLowerCase();

  const exact = items.find((item) => item.name.toLowerCase() === needle);
  if (exact) return exact.image;

  const aliases = NAME_ALIASES[name] ?? [];
  for (const alias of aliases) {
    const found = items.find((item) =>
      item.name.toLowerCase().includes(alias.toLowerCase()),
    );
    if (found) return found.image;
  }

  const fuzzy = items.find((item) => {
    const itemName = item.name.toLowerCase();
    return itemName.includes(needle) || needle.includes(itemName);
  });
  if (fuzzy) return fuzzy.image;

  const byCategory = items.find((item) => item.category === category);
  return byCategory?.image ?? items[0]?.image ?? "";
}

export type InventoryRow = {
  id: string | number;
  name: string;
  category: string;
  qty: number;
  available?: boolean | null;
  price?: number | string | null;
  image_url?: string | null;
};

export type LiveMinibarItem = {
  id: string;
  category: string;
  name: string;
  price: number;
  image: string;
  available: boolean;
};

export function mapInventoryToMinibarItem(row: InventoryRow): LiveMinibarItem {
  const qty = Number(row.qty) || 0;
  const imageUrl = row.image_url?.trim();
  return {
    id: String(row.id),
    name: row.name,
    category: row.category,
    price: Number(row.price) || 0,
    image: imageUrl || fallbackMinibarImage(row.name, row.category),
    available: row.available === false ? false : qty > 0,
  };
}
