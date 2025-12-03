import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FloatingBalloons } from "@/components/Balloon";
import { ConfettiEffect } from "@/components/ConfettiEffect";
import { SparkleButton } from "@/components/SparkleButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Send, PartyPopper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCelebration, useAddMessage } from "@/hooks/useCelebration";

const CelebrationAddMessage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: celebration } = useCelebration(slug);
  const addMessage = useAddMessage();
  
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast({
        title: "Oops!",
        description: "Please fill in your name and message 🎈",
        variant: "destructive",
      });
      return;
    }

    if (!celebration) return;

    try {
      await addMessage.mutateAsync({
        celebration_id: celebration.id,
        sender_name: name.trim(),
        message: message.trim(),
      });
      
      setShowSuccess(true);
      toast({
        title: "🎉 Message Sent!",
        description: "Your birthday wishes have been added to the celebration!",
      });

      setTimeout(() => {
        navigate(`/c/${slug}/wall`);
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <FloatingBalloons />
      {showSuccess && <ConfettiEffect run={true} />}

      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30 -z-10" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <button
          onClick={() => navigate(`/c/${slug}`)}
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Celebration
        </button>

        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8 animate-fade-up">
            <h1 className="font-display text-4xl md:text-5xl text-gradient mb-4">
              🎈 Leave Your Wishes for {celebration?.birthday_person_name} 🎈
            </h1>
            <p className="text-muted-foreground">
              Share your heartfelt birthday message and make this day even more special!
            </p>
          </div>

          {showSuccess ? (
            <Card className="bg-card/80 backdrop-blur border-primary/20 shadow-party animate-bounce-in text-center p-12">
              <PartyPopper className="w-20 h-20 mx-auto text-primary mb-6 animate-float" />
              <h2 className="text-2xl font-bold text-gradient mb-4">Thank You! 🎉</h2>
              <p className="text-muted-foreground">
                Your message has been added to the celebration wall!
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Redirecting to the wall...
              </p>
            </Card>
          ) : (
            <Card className="bg-card/80 backdrop-blur border-primary/20 shadow-party animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <span>✨</span>
                  Write Your Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="What's your name? 🌟"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-background/50 border-border focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground">Birthday Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Share your birthday wishes... 🎂"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="bg-background/50 border-border focus:border-primary resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="media" className="text-foreground">Photo or Video (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="media"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="media" className="cursor-pointer">
                        {preview ? (
                          <div className="relative">
                            {file?.type.startsWith("video/") ? (
                              <video src={preview} className="max-h-48 mx-auto rounded-lg" />
                            ) : (
                              <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                            )}
                            <p className="text-sm text-muted-foreground mt-2">Click to change</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">
                              Click to upload a photo or video
                            </p>
                            <p className="text-sm text-muted-foreground/60 mt-1">
                              Make it memorable! 📸
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <SparkleButton
                    type="submit"
                    className="w-full"
                    disabled={addMessage.isPending}
                  >
                    {addMessage.isPending ? (
                      <>Sending... ✨</>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Birthday Wishes
                      </>
                    )}
                  </SparkleButton>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
};

export default CelebrationAddMessage;
