import { WordRotate } from "@/components/magicui/word-rotate";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import SearchBar from "@/components/SearchBar";
// Assuming you have a Button component from shadcn/ui
// import { Button } from "@/components/ui/button"; // Replaced by ShimmerButton
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { InteractiveGridPattern } from "../magicui/interactive-grid-pattern";
import { InteractiveHoverButton } from "../magicui/interactive-hover-button";

export default function Hero() {
  const rotatingWords = [
    "Innovative Spaces",
    "Your Future Home",
    "Modern Living",
    "Dream Properties",
    "Luxury Estates",
  ];

  return (
    <div className="relative flex h-[calc(100vh-80px)] min-h-[600px] w-full flex-col items-center justify-center rounded-lg border bg-background md:shadow-xl">
      <InteractiveGridPattern
        squaresClassName="hover:fill-blue-500"
        width={60}
        height={40}
        squares={[24, 24]}
        className={cn(
          "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] -skew-y-12", // Changed skew-y-12 to -skew-y-12
          "fill-current text-muted-foreground/30"
        )}
      />
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition-all ease-in-out hover:scale-105 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground mb-2">
          Discover
        </AnimatedShinyText>
        <div className="h-[70px] sm:h-[80px] md:h-[90px] lg:h-[110px] flex items-center justify-center mb-6">
          <WordRotate
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-primary via-primary/80 to-primary"
            words={rotatingWords}
            duration={2500}
            align="center"
          />
        </div>

        <p className="max-w-xl md:max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground mb-10 mx-auto">
          We connect you with cutting-edge properties and visionary designs.
          Explore premier listings and find a residence that defines your style.
        </p>

        <div className="w-full ">
          <SearchBar variant="home" />
          <div className="mt-8 flex justify-center">
            <InteractiveHoverButton className="shadow-xl whitespace-nowrap text-lg px-8 py-3">
              {" "}
              {/* Increased py slightly for ShimmerButton */}
              Explore Now
            </InteractiveHoverButton>
          </div>
        </div>
      </div>
    </div>
  );
}
