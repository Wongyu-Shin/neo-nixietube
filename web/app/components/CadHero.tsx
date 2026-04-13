"use client";

import dynamic from "next/dynamic";

const CadViewer3D = dynamic(() => import("./CadViewer3D"), { ssr: false });

export default function CadHero() {
  return <CadViewer3D />;
}
