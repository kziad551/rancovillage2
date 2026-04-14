import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Housing } from "@/components/home/Housing";
import { TourTeaser } from "@/components/home/TourTeaser";
import { Amenities } from "@/components/home/Amenities";
import { Community } from "@/components/home/Community";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Housing />
      <TourTeaser />
      <Amenities />
      <Community />
    </>
  );
}
