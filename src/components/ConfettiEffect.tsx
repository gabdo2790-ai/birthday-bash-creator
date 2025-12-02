import { useEffect, useState } from "react";
import Confetti from "react-confetti";

interface ConfettiEffectProps {
  run?: boolean;
  recycle?: boolean;
}

export const ConfettiEffect = ({ run = true, recycle = false }: ConfettiEffectProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(run);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (run && !recycle) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [run, recycle]);

  if (!showConfetti) return null;

  return (
    <Confetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={recycle}
      numberOfPieces={200}
      gravity={0.1}
      colors={[
        "hsl(320, 85%, 55%)",
        "hsl(270, 70%, 60%)",
        "hsl(45, 100%, 60%)",
        "hsl(200, 90%, 65%)",
        "hsl(10, 80%, 65%)",
        "#ffffff",
      ]}
    />
  );
};
