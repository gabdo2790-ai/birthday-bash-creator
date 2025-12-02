import { Link } from "react-router-dom";
import { FloatingBalloons } from "@/components/Balloon";
import { MessageCard, Message } from "@/components/MessageCard";
import { SparkleButton } from "@/components/SparkleButton";
import { ArrowLeft, MessageSquareHeart, Heart } from "lucide-react";

// Sample messages - will be replaced with actual data from backend
const sampleMessages: Message[] = [
  {
    id: "1",
    name: "Sarah",
    message: "Happy birthday to the most amazing person! May all your dreams come true this year. You deserve all the happiness in the world! 🎉",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Mike",
    message: "Wishing you a fantastic birthday filled with love, laughter, and cake! 🎂",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Emma",
    message: "Another year of being awesome! Can't wait to celebrate with you. Have the best birthday ever! 🌟",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "David",
    message: "To many more years of friendship and adventures! Happy birthday! 🎈",
    createdAt: new Date().toISOString(),
  },
];

const Wall = () => {
  const messages = sampleMessages; // Replace with actual data fetch

  return (
    <main className="min-h-screen relative overflow-hidden">
      <FloatingBalloons />

      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30 -z-10" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <Link to="/add">
            <SparkleButton size="sm">
              <MessageSquareHeart className="w-4 h-4 mr-2" />
              Add Your Message
            </SparkleButton>
          </Link>
        </div>

        <div className="text-center mb-12 animate-fade-up">
          <h1 className="font-display text-4xl md:text-6xl text-gradient mb-4">
            🎁 Celebration Wall 🎁
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A collection of heartfelt wishes and beautiful memories from friends and family
          </p>
        </div>

        {messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MessageCard message={message} />
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
            <Link to="/add">
              <SparkleButton>
                <MessageSquareHeart className="w-4 h-4 mr-2" />
                Leave the First Message
              </SparkleButton>
            </Link>
          </div>
        )}

        {/* Footer decoration */}
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

export default Wall;
