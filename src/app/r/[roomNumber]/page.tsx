import { notFound } from "next/navigation";
import { GuestHome } from "@/components/GuestHome";
import { roomExists } from "@/lib/rooms";

export const dynamic = "force-dynamic";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomNumber: string }>;
}) {
  const { roomNumber } = await params;
  if (!(await roomExists(roomNumber))) notFound();
  return <GuestHome />;
}
