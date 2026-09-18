import { redirect } from "next/navigation";
import { DEFAULT_ROOM_NUMBER } from "@/lib/rooms";

export default async function PreferencesAliasPage({
  searchParams,
}: {
  searchParams: Promise<{ room?: string }>;
}) {
  const { room } = await searchParams;
  redirect(`/r/${room?.trim() || DEFAULT_ROOM_NUMBER}/preferences`);
}
