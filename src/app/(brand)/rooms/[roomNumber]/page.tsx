import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoomDetail } from "@/components/brand/RoomsPages";
import { fetchRoomByNumber } from "@/lib/rooms";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ roomNumber: string }>;
}): Promise<Metadata> {
  const { roomNumber } = await params;
  return { title: `Room ${roomNumber}` };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ roomNumber: string }>;
}) {
  const { roomNumber } = await params;
  const { room } = await fetchRoomByNumber(roomNumber);
  if (!room) notFound();
  return <RoomDetail room={room} />;
}
