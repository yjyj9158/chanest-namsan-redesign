import { BrandHome } from "@/components/brand/BrandHome";
import { fetchActiveRooms } from "@/lib/rooms";

export const dynamic = "force-dynamic";

export default async function BrandHomePage() {
  const rooms = await fetchActiveRooms();
  return <BrandHome rooms={rooms} />;
}
