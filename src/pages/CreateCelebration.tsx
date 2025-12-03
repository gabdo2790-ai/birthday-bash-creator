import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FloatingBalloons } from "@/components/Balloon";
import { SparkleButton } from "@/components/SparkleButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Sparkles, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateCelebration } from "@/hooks/useCelebration";

const CreateCelebration = () => {
  const [name, setName] = useState("");
  const [viewPassword, setViewPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const createCelebration = useCreateCelebration();

  const generateSlug = () => {
    return `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted!", { name, viewPassword, adminPassword });
    
    if (!name.trim() || !viewPassword.trim() || !adminPassword.trim()) {
      console.log("Validation failed - missing fields");
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const slug = generateSlug();
    console.log("Generated slug:", slug);
    
    try {
      console.log("Calling createCelebration.mutateAsync...");
      const result = await createCelebration.mutateAsync({
        slug,
        birthday_person_name: name.trim(),
        view_password: viewPassword,
        admin_password: adminPassword,
      });
      console.log("Success! Result:", result);
      
      setCreatedSlug(slug);
      toast({
        title: "🎉 Celebration Created!",
        description: "Your birthday celebration page is ready!",
      });
    } catch (error) {
      console.error("Error creating celebration:", error);
      toast({
        title: "Error",
        description: "Failed to create celebration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const celebrationUrl = createdSlug 
    ? `${window.location.origin}/c/${createdSlug}` 
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(celebrationUrl);
    setCopied(true);
    toast({
      title: "Link Copied! 📋",
      description: "Share this link with friends and family",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (createdSlug) {
    return (
      <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        <FloatingBalloons />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30 -z-10" />
        
        <Card className="w-full max-w-lg bg-card/80 backdrop-blur border-primary/20 shadow-party animate-bounce-in">
          <CardHeader className="text-center">
            <Sparkles className="w-16 h-16 mx-auto text-primary mb-4 animate-float" />
            <CardTitle className="text-3xl text-gradient">Celebration Ready! 🎉</CardTitle>
            <CardDescription className="text-lg">
              Share this link with friends and family
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Celebration Link</Label>
              <div className="flex gap-2">
                <Input 
                  value={celebrationUrl} 
                  readOnly 
                  className="bg-background/50 text-sm"
                />
                <SparkleButton onClick={copyLink} size="icon" className="shrink-0">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </SparkleButton>
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <p><strong>View Password:</strong> {viewPassword}</p>
              <p><strong>Admin Password:</strong> {adminPassword}</p>
              <p className="text-muted-foreground text-xs mt-2">
                Save these passwords! View password is for guests, Admin password is for you.
              </p>
            </div>

            <div className="flex gap-2">
              <SparkleButton 
                onClick={() => navigate(`/c/${createdSlug}`)} 
                className="flex-1"
              >
                View Celebration
              </SparkleButton>
              <SparkleButton 
                onClick={() => navigate(`/c/${createdSlug}/admin`)} 
                className="flex-1 bg-secondary hover:bg-secondary/90"
              >
                Admin Panel
              </SparkleButton>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <FloatingBalloons />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30 -z-10" />
      
      <Card className="w-full max-w-lg bg-card/80 backdrop-blur border-primary/20 shadow-party animate-fade-up">
        <CardHeader className="text-center">
          <Gift className="w-16 h-16 mx-auto text-primary mb-4" />
          <CardTitle className="text-3xl text-gradient">Create a Celebration 🎂</CardTitle>
          <CardDescription>
            Set up a birthday celebration page for someone special
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Birthday Person's Name</Label>
              <Input
                id="name"
                placeholder="Enter their name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="viewPassword">View Password (for guests)</Label>
              <Input
                id="viewPassword"
                type="text"
                placeholder="Password to view celebration..."
                value={viewPassword}
                onChange={(e) => setViewPassword(e.target.value)}
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground">
                Share this with people who should see the celebration
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminPassword">Admin Password (for you)</Label>
              <Input
                id="adminPassword"
                type="text"
                placeholder="Password to manage celebration..."
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground">
                Use this to upload media and manage messages
              </p>
            </div>

            <SparkleButton 
              type="submit" 
              className="w-full"
              disabled={createCelebration.isPending}
            >
              {createCelebration.isPending ? "Creating..." : "Create Celebration 🎉"}
            </SparkleButton>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default CreateCelebration;
