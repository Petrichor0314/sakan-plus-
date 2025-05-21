import { useRef } from "react";
import Slider from "../components/Slider";
import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import Recommendations from "../components/home/Recommendations";
import Locations from "../components/home/Locations";
import Testimonials from "../components/home/Testimonials";
import HomeFooter from "../components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <div className="flex-1">
        <Services />
        <Recommendations />
        <Locations />
        <Testimonials />
        <HomeFooter />
      </div>
    </div>
  );
}
