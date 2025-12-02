import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export interface Message {
  id: string;
  name: string;
  message: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  createdAt: string;
}

interface MessageCardProps {
  message: Message;
  className?: string;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

export const MessageCard = ({ message, className, onDelete, showDelete }: MessageCardProps) => {
  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:shadow-party hover:-translate-y-1",
        "bg-card border-border/50",
        className
      )}
    >
      {message.mediaUrl && (
        <div className="relative aspect-video overflow-hidden">
          {message.mediaType === "video" ? (
            <video
              src={message.mediaUrl}
              className="w-full h-full object-cover"
              controls
            />
          ) : (
            <img
              src={message.mediaUrl}
              alt={`From ${message.name}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
      )}
      <CardContent className="p-5">
        <div className="flex items-start gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary mt-1 animate-sparkle" />
          <h3 className="font-semibold text-lg text-foreground">{message.name}</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">{message.message}</p>
        <p className="text-xs text-muted-foreground/60 mt-3">
          {new Date(message.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        {showDelete && onDelete && (
          <button
            onClick={() => onDelete(message.id)}
            className="mt-3 text-sm text-destructive hover:underline"
          >
            Delete
          </button>
        )}
      </CardContent>
    </Card>
  );
};
