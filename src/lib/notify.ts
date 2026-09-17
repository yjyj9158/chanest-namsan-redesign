export async function sendNotify(
  message: string,
  meta?: { orderId?: string; requestId?: string; requestIds?: string[] },
): Promise<boolean> {
  try {
    const response = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        orderId: meta?.orderId,
        requestId: meta?.requestId,
        requestIds: meta?.requestIds,
      }),
    });
    const payload = (await response.json()) as { ok?: boolean };
    return response.ok && payload.ok === true;
  } catch {
    return false;
  }
}
