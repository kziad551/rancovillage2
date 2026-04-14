"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CompoundScene = dynamic(() => import("./CompoundScene"), { ssr: false });

export default function CompoundLazy(props: React.ComponentProps<typeof CompoundScene>) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <CompoundScene {...props} />;
}
