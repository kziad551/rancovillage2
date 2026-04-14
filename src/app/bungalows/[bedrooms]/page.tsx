import { notFound } from "next/navigation";
import { units } from "@/lib/data";
import { UnitDetail } from "@/components/shared/UnitDetail";

export async function generateStaticParams() {
  return units.filter((u) => u.category === "bungalows").map((u) => ({ bedrooms: u.slug }));
}

export default function Page({ params }: { params: { bedrooms: string } }) {
  const unit = units.find((u) => u.category === "bungalows" && u.slug === params.bedrooms);
  if (!unit) return notFound();
  return <UnitDetail unit={unit} />;
}
