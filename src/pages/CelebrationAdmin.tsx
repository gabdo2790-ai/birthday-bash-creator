import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MessageCard } from "@/components/MessageCard";
import { ArrowLeft, Upload, Lock, Trash2, Image, Video, Loader2 } from "lucide-react";
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
import { useCelebration, useMessages, useDeleteMessage, useUpdateCelebration } from "@/hooks/useCelebration";
import { useVerifyPassword } from "@/hooks/useVerifyPassword";

const CelebrationAdmin = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: celebration, isLoading: celebrationLoading } = useCelebration(slug);
  const { data: messages = [], isLoading: messagesLoading } = useMessages(celebration?.id);
  const deleteMessage = useDeleteMessage();
  const updateCelebration = useUpdateCelebration();
  const { verifyPassword, isVerifying } = useVerifyPassword();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState(""); // Store verified admin password
  const [authError, setAuthError] = useState("");
  const [mainMedia, setMainMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    
    const result = await verifyPassword(slug, password, 'admin');
    if (result.valid) {
      setIsAuthenticated(true);
      setAdminPassword(password); // Store the verified admin password for later use
      setAuthError("");
      toast({
        title: "Welcome Admin! 🎉",
        description: "You now have access to manage the celebration.",
      });
    } else {
      setAuthError("Incorrect admin password. Please try again.");
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
    if (!mainMedia || !celebration) return;
    
    // For now, store the data URL directly (in production, use proper file storage)
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await updateCelebration.mutateAsync({
          id: celebration.id,
          data: {
            main_media_url: reader.result as string,
            main_media_type: mainMedia.type.startsWith("video/") ? "video" : "image",
          },
        });
        toast({
          title: "Media Uploaded! 🎉",
          description: "The main celebration media has been updated.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload media. Please try again.",
          variant: "destructive",
        });
      }
    };
    reader.readAsDataURL(mainMedia);
  };

  const handleDeleteMessage = async (id: string) => {
    if (!slug) return;
    try {
      await deleteMessage.mutateAsync({ messageId: id, slug, adminPassword });
      setDeleteId(null);
      toast({
        title: "Message Deleted",
        description: "The message has been removed from the wall.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (celebrationLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!celebration) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Celebration Not Found</h2>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur border-border shadow-lg">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto text-primary mb-4" />
            <CardTitle className="text-2xl text-foreground">Admin Access</CardTitle>
            <CardDescription>
              Enter the admin password to manage {celebration.birthday_person_name}'s celebration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50"
                />
                {authError && (
                  <p className="text-sm text-destructive">{authError}</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Access Admin Panel"}
              </Button>
              <button
                type="button"
                onClick={() => navigate(`/c/${slug}`)}
                className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Celebration
              </button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(`/c/${slug}`)}
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Celebration
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAuthenticated(false)}
            className="border-border text-foreground hover:bg-muted"
          >
            Logout
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">🎛️ Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Managing {celebration.birthday_person_name}'s celebration</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  {mediaPreview || celebration.main_media_url ? (
                    <div className="relative">
                      {(mainMedia?.type.startsWith("video/") || celebration.main_media_type === "video") ? (
                        <video src={mediaPreview || celebration.main_media_url || ""} className="max-h-48 mx-auto rounded-lg" controls />
                      ) : (
                        <img src={mediaPreview || celebration.main_media_url || ""} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
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
                disabled={!mainMedia || updateCelebration.isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Upload className="w-4 h-4 mr-2" />
                {updateCelebration.isPending ? "Uploading..." : "Upload Media"}
              </Button>
            </CardContent>
          </Card>

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
              {messagesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {messages.map((msg) => (
                    <MessageCard
                      key={msg.id}
                      message={{
                        id: msg.id,
                        name: msg.sender_name,
                        message: msg.message,
                        mediaUrl: msg.media_url || undefined,
                        mediaType: msg.media_type as "image" | "video" | undefined,
                        createdAt: msg.created_at,
                      }}
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

export default CelebrationAdmin;
