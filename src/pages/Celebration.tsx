import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FloatingBalloons } from "@/components/Balloon";
import { ConfettiEffect } from "@/components/ConfettiEffect";
import { BirthdayHeader } from "@/components/BirthdayHeader";
import { SparkleButton } from "@/components/SparkleButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, MessageSquareHeart, Cake, Lock } from "lucide-react";
import { useCelebration } from "@/hooks/useCelebration";

const Celebration = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: celebration, isLoading, error } = useCelebration(slug);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (celebration && password === celebration.view_password) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Cake className="w-16 h-16 mx-auto text-primary animate-float mb-4" />
          <p className="text-muted-foreground">Loading celebration...</p>
        </div>
      </main>
    );
  }

  if (error || !celebration) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Celebration Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This celebration doesn't exist or has been removed.
            </p>
            <Link to="/">
              <SparkleButton>Go Home</SparkleButton>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
        <FloatingBalloons />
        <Card className="w-full max-w-md bg-card/80 backdrop-blur border-primary/20 shadow-party">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto text-primary mb-4" />
            <CardTitle className="text-2xl text-gradient">
              🎂 {celebration.birthday_person_name}'s Celebration
            </CardTitle>
            <p className="text-muted-foreground">
              Enter the password to view this celebration
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50"
                />
                {authError && (
                  <p className="text-sm text-destructive">{authError}</p>
                )}
              </div>
              <SparkleButton type="submit" className="w-full">
                View Celebration 🎉
              </SparkleButton>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <ConfettiEffect />
      <FloatingBalloons />

      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30 -z-10" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <section className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <BirthdayHeader name={celebration.birthday_person_name} />

          <Card className="w-full max-w-2xl aspect-video bg-card/80 backdrop-blur border-2 border-primary/20 shadow-party overflow-hidden animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {celebration.main_media_url ? (
              celebration.main_media_type === "video" ? (
                <video
                  src={celebration.main_media_url}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                />
              ) : (
                <img
                  src={celebration.main_media_url}
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

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.6s" }}>
            <SparkleButton size="lg" onClick={() => navigate(`/c/${slug}/add`)}>
              <MessageSquareHeart className="w-5 h-5 mr-2" />
              Leave a Celebration Message
            </SparkleButton>
            <SparkleButton size="lg" className="bg-secondary hover:bg-secondary/90" onClick={() => navigate(`/c/${slug}/wall`)}>
              <Gift className="w-5 h-5 mr-2" />
              View Celebration Wall
            </SparkleButton>
          </div>
        </section>

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

export default Celebration;
