import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MessageCard, Message } from "@/components/MessageCard";
import { ArrowLeft, Upload, Lock, Trash2, Image, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Sample messages for demo
const sampleMessages: Message[] = [
  {
    id: "1",
    name: "Sarah",
    message: "Happy birthday to the most amazing person! May all your dreams come true! 🎉",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Mike",
    message: "Wishing you a fantastic birthday filled with love! 🎂",
    createdAt: new Date().toISOString(),
  },
];

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [mainMedia, setMainMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  // Simple password check - in production, use proper auth
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, password is "birthday123"
    if (password === "birthday123") {
      setIsAuthenticated(true);
      toast({
        title: "Welcome Admin! 🎉",
        description: "You now have access to manage the celebration.",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainMedia(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast({
        title: "Media Selected! 📸",
        description: "Click 'Upload' to save the main celebration media.",
      });
    }
  };

  const handleUpload = async () => {
    if (!mainMedia) return;
    // Simulate upload - replace with actual backend integration
    toast({
      title: "Media Uploaded! 🎉",
      description: "The main celebration media has been updated.",
    });
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
    setDeleteId(null);
    toast({
      title: "Message Deleted",
      description: "The message has been removed from the wall.",
    });
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur border-border shadow-lg">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto text-primary mb-4" />
            <CardTitle className="text-2xl text-foreground">Admin Access</CardTitle>
            <CardDescription>
              Enter the admin password to manage the celebration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Access Admin Panel
              </Button>
              <Link
                to="/"
                className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Home
              </Link>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Demo password: birthday123
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAuthenticated(false)}
            className="border-border text-foreground hover:bg-muted"
          >
            Logout
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-8">🎛️ Admin Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Upload className="w-5 h-5" />
                Main Celebration Media
              </CardTitle>
              <CardDescription>
                Upload the main photo or video that appears on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="mainMedia"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                <label htmlFor="mainMedia" className="cursor-pointer">
                  {mediaPreview ? (
                    <div className="relative">
                      {mainMedia?.type.startsWith("video/") ? (
                        <video src={mediaPreview} className="max-h-48 mx-auto rounded-lg" controls />
                      ) : (
                        <img src={mediaPreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                      )}
                      <p className="text-sm text-muted-foreground mt-2">Click to change</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center gap-4 mb-4">
                        <Image className="w-8 h-8 text-muted-foreground" />
                        <Video className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        Click to upload photo or video
                      </p>
                    </>
                  )}
                </label>
              </div>
              <Button
                onClick={handleUpload}
                disabled={!mainMedia}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Media
              </Button>
            </CardContent>
          </Card>

          {/* Messages Management */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Trash2 className="w-5 h-5" />
                Manage Messages ({messages.length})
              </CardTitle>
              <CardDescription>
                View and delete messages from the celebration wall
              </CardDescription>
            </CardHeader>
            <CardContent>
              {messages.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {messages.map((message) => (
                    <MessageCard
                      key={message.id}
                      message={message}
                      showDelete
                      onDelete={(id) => setDeleteId(id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No messages to manage
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The message will be permanently removed from the celebration wall.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground hover:bg-muted">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDeleteMessage(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default Admin;
