import { Link } from "react-router-dom";
import { FloatingBalloons } from "@/components/Balloon";
import { ConfettiEffect } from "@/components/ConfettiEffect";
import { BirthdayHeader } from "@/components/BirthdayHeader";
import { SparkleButton } from "@/components/SparkleButton";
import { Card } from "@/components/ui/card";
import { Gift, MessageSquareHeart, Cake } from "lucide-react";

const Index = () => {
  // This would come from your database/API
  const mainMedia: { url: string; type: "image" | "video" } = {
    url: "",
    type: "image",
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <ConfettiEffect />
      <FloatingBalloons />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30 -z-10" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <BirthdayHeader name="Dear One" />

          {/* Main Media Card */}
          <Card className="w-full max-w-2xl aspect-video bg-card/80 backdrop-blur border-2 border-primary/20 shadow-party overflow-hidden animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {mainMedia.url ? (
              mainMedia.type === "video" ? (
                <video
                  src={mainMedia.url}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                />
              ) : (
                <img
                  src={mainMedia.url}
                  alt="Birthday celebration"
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
                <Cake className="w-16 h-16 mb-4 text-primary animate-float" />
                <p className="text-lg font-medium">Birthday photo coming soon!</p>
                <p className="text-sm">Admin can upload the main celebration media</p>
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.6s" }}>
            <Link to="/add">
              <SparkleButton size="lg">
                <MessageSquareHeart className="w-5 h-5 mr-2" />
                Leave a Celebration Message
              </SparkleButton>
            </Link>
            <Link to="/wall">
              <SparkleButton size="lg" className="bg-secondary hover:bg-secondary/90">
                <Gift className="w-5 h-5 mr-2" />
                View Celebration Wall
              </SparkleButton>
            </Link>
          </div>
        </section>

        {/* Fun Stats Section */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { emoji: "🎈", label: "Balloons", value: "∞" },
            { emoji: "💝", label: "Love Sent", value: "100%" },
            { emoji: "🎁", label: "Wishes", value: "Many!" },
          ].map((stat, index) => (
            <Card 
              key={stat.label}
              className="p-6 text-center bg-card/80 backdrop-blur border-primary/10 hover:shadow-party transition-all duration-300 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${0.8 + index * 0.1}s` }}
            >
              <span className="text-4xl mb-2 block">{stat.emoji}</span>
              <p className="text-3xl font-bold text-gradient">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
};

export default Index;
