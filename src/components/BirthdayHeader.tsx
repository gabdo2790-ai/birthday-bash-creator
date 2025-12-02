import { cn } from "@/lib/utils";

interface BirthdayHeaderProps {
  name?: string;
  className?: string;
}

export const BirthdayHeader = ({ name = "Friend", className }: BirthdayHeaderProps) => {
  return (
    <div className={cn("text-center", className)}>
      <h1 className="font-display text-5xl md:text-7xl text-gradient neon-glow mb-4 animate-bounce-in">
        🎉 Happy Birthday {name}! 🎂
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: "0.2s" }}>
        Celebrate with love, joy, and wonderful wishes ✨
      </p>
    </div>
  );
};
