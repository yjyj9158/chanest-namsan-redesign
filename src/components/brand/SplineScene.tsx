"use client";

import Spline from "@splinetool/react-spline";

export default function SplineScene({ url }: { url: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-50" aria-hidden>
      <Spline scene={url} />
    </div>
  );
}
