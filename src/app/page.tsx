import Image from "next/image";
import { GradientChart } from "@/components/ui/gradient-chart";

/* Default export method */
import GlowingBorderButton from "@/components/ui/glowing_border_button";

/* Named export method */
import { GlowingBorderButton2 } from "@/components/ui/glowing_border_button2";
import GlowingBorderButton3 from "@/components/ui/glowing_border_button3";
import GlowingBorderButton4 from "@/components/ui/glowing_border_button4";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1c1c1c] p-8 flex justify-center">
      <main className="flex flex-col gap-8 w-full max-w-4xl">
        <div className="flex flex-col items-center gap-8">
          <GlowingBorderButton>Version 1</GlowingBorderButton>
          <GlowingBorderButton2>Version 2</GlowingBorderButton2>
          <div className="flex justify-center gap-16">
            <GlowingBorderButton3>Version 3</GlowingBorderButton3>
            <GlowingBorderButton4>Version 4</GlowingBorderButton4>
          </div>
        </div>
        <GradientChart />
      </main>
    </div>
  );
}
