import dynamic from "next/dynamic";

const TourShell = dynamic(() => import("@/components/tour/TourShell").then((m) => m.TourShell), {
  ssr: false,
});

export const metadata = {
  title: "Virtual Tour · Ranco Village",
  description: "A scroll-driven walkthrough of Ranco Village — eight stops, four minutes.",
};

export default function VirtualTourPage() {
  return <TourShell />;
}
