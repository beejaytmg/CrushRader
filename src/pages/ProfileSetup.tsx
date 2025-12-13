import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, User, Camera, GraduationCap, Users, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [className, setClassName] = useState("");
  const [batch, setBatch] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Placeholder for Supabase
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Backend Required",
        description: "Connect Lovable Cloud to save your profile.",
      });
      navigate("/discover");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4"
          >
            <User className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-2">
            This helps others recognize you (only when mutual!)
          </p>
        </div>

        {/* Profile Card */}
        <Card variant="glass" className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-24 h-24 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
              >
                <Camera className="w-8 h-8 text-muted-foreground" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-lg">+</span>
                </div>
              </motion.div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="class"
                    type="text"
                    placeholder="e.g. CS-A"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="batch"
                    type="text"
                    placeholder="e.g. 2024"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="glow"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Complete Setup
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Your profile is only visible to mutual matches
        </p>
      </motion.div>
    </div>
  );
};

export default ProfileSetup;
