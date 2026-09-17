export async function sendNotify(
  message: string,
  meta?: { orderId?: string; requestId?: string; requestIds?: string[] },
) {
  try {
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        orderId: meta?.orderId,
        requestId: meta?.requestId,
        requestIds: meta?.requestIds,
      }),
    });
  } catch {
    /* SMS/카카오/화면 흐름은 유지 */
  }
}
