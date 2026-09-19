"use client";

import { AdminPwaBanner, PwaRegister } from "@/components/PwaInstallBanner";

export function AdminPwaChrome() {
  return (
    <>
      <PwaRegister />
      <AdminPwaBanner />
    </>
  );
}
