import { useParams, Link, useNavigate } from "react-router-dom";
import { FloatingBalloons } from "@/components/Balloon";
import { MessageCard } from "@/components/MessageCard";
import { SparkleButton } from "@/components/SparkleButton";
import { ArrowLeft, MessageSquareHeart, Heart, Loader2 } from "lucide-react";
import { useCelebration, useMessages } from "@/hooks/useCelebration";

const CelebrationWall = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: celebration } = useCelebration(slug);
  const { data: messages = [], isLoading } = useMessages(celebration?.id);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <FloatingBalloons />

      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30 -z-10" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(`/c/${slug}`)}
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Celebration
          </button>
          <SparkleButton size="sm" onClick={() => navigate(`/c/${slug}/add`)}>
            <MessageSquareHeart className="w-4 h-4 mr-2" />
            Add Your Message
          </SparkleButton>
        </div>

        <div className="text-center mb-12 animate-fade-up">
          <h1 className="font-display text-4xl md:text-6xl text-gradient mb-4">
            🎁 {celebration?.birthday_person_name}'s Celebration Wall 🎁
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A collection of heartfelt wishes and beautiful memories from friends and family
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MessageCard 
                  message={{
                    id: message.id,
                    name: message.sender_name,
                    message: message.message,
                    mediaUrl: message.media_url || undefined,
                    mediaType: message.media_type as "image" | "video" | undefined,
                    createdAt: message.created_at,
                  }} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 mx-auto text-primary/50 mb-6 animate-float" />
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              No messages yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Be the first to leave a birthday wish!
            </p>
            <SparkleButton onClick={() => navigate(`/c/${slug}/add`)}>
              <MessageSquareHeart className="w-4 h-4 mr-2" />
              Leave the First Message
            </SparkleButton>
          </div>
        )}

        <div className="text-center mt-16 text-4xl space-x-2">
          <span className="animate-float inline-block">🎈</span>
          <span className="animate-float inline-block" style={{ animationDelay: "0.2s" }}>🎂</span>
          <span className="animate-float inline-block" style={{ animationDelay: "0.4s" }}>🎁</span>
          <span className="animate-float inline-block" style={{ animationDelay: "0.6s" }}>🎉</span>
          <span className="animate-float inline-block" style={{ animationDelay: "0.8s" }}>✨</span>
        </div>
      </div>
    </main>
  );
};

export default CelebrationWall;
