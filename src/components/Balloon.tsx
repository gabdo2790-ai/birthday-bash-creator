import { cn } from "@/lib/utils";

interface BalloonProps {
  color: "pink" | "purple" | "gold" | "sky" | "coral";
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

const colorClasses = {
  pink: "from-[hsl(320,85%,55%)] to-[hsl(320,85%,45%)]",
  purple: "from-[hsl(270,70%,60%)] to-[hsl(270,70%,50%)]",
  gold: "from-[hsl(45,100%,60%)] to-[hsl(35,100%,50%)]",
  sky: "from-[hsl(200,90%,65%)] to-[hsl(200,90%,55%)]",
  coral: "from-[hsl(10,80%,65%)] to-[hsl(10,80%,55%)]",
};

const sizeClasses = {
  sm: "w-10 h-12",
  md: "w-14 h-16",
  lg: "w-20 h-24",
};

export const Balloon = ({ color, size = "md", className, style }: BalloonProps) => {
  return (
    <div className={cn("relative animate-float", className)} style={style}>
      <div
        className={cn(
          "rounded-full bg-gradient-to-b relative",
          colorClasses[color],
          sizeClasses[size]
        )}
        style={{
          borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
        }}
      >
        {/* Shine effect */}
        <div className="absolute top-2 left-2 w-3 h-3 bg-white/40 rounded-full" />
      </div>
      {/* String */}
      <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-8 bg-muted-foreground/30" />
    </div>
  );
};

export const FloatingBalloons = () => {
  const balloons = [
    { color: "pink" as const, left: "5%", delay: "0s", size: "lg" as const },
    { color: "purple" as const, left: "15%", delay: "0.5s", size: "md" as const },
    { color: "gold" as const, left: "25%", delay: "1s", size: "sm" as const },
    { color: "sky" as const, left: "75%", delay: "0.3s", size: "md" as const },
    { color: "coral" as const, left: "85%", delay: "0.8s", size: "lg" as const },
    { color: "pink" as const, left: "92%", delay: "1.2s", size: "sm" as const },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {balloons.map((balloon, index) => (
        <div
          key={index}
          className="absolute bottom-0"
          style={{ 
            left: balloon.left,
            animationDelay: balloon.delay 
          }}
        >
          <Balloon
            color={balloon.color}
            size={balloon.size}
            className="animate-float-slow"
            style={{ animationDelay: balloon.delay }}
          />
        </div>
      ))}
    </div>
  );
};
