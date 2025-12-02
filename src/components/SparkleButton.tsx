import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface SparkleButtonProps extends ButtonProps {
  showSparkle?: boolean;
}

export const SparkleButton = ({ 
  children, 
  className, 
  showSparkle = true,
  ...props 
}: SparkleButtonProps) => {
  return (
    <Button
      className={cn(
        "relative overflow-hidden group",
        "bg-gradient-birthday text-primary-foreground",
        "hover:shadow-glow hover:scale-105 transition-all duration-300",
        "font-semibold text-base px-6 py-3",
        className
      )}
      {...props}
    >
      {showSparkle && (
        <>
          <Sparkles className="w-4 h-4 mr-2 animate-sparkle" />
          <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </>
      )}
      {children}
    </Button>
  );
};
