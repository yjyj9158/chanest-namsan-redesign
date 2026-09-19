import type { Metadata } from "next";
import { RoomsIndex } from "@/components/brand/RoomsPages";
import { fetchActiveRooms } from "@/lib/rooms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rooms",
  description: "A quiet suite beside Namsan. THE CHANEST NAMSAN rooms.",
};

export default async function RoomsPage() {
  const rooms = await fetchActiveRooms();
  return <RoomsIndex rooms={rooms} />;
}
