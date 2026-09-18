import { notFound } from "next/navigation";
import { PreferencesForm } from "@/components/PreferencesForm";
import { roomExists } from "@/lib/rooms";

export const dynamic = "force-dynamic";

export default async function PreferencesPage({
  params,
}: {
  params: Promise<{ roomNumber: string }>;
}) {
  const { roomNumber } = await params;
  if (!(await roomExists(roomNumber))) notFound();
  return <PreferencesForm />;
}
