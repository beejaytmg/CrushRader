import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search, Filter, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import UserCard from "@/components/UserCard";

// Demo users for UI showcase
const demoUsers = [
  { id: "1", name: "Alex Johnson", avatar: null, class: "CS-A", batch: "2024", gender: "male" },
  { id: "2", name: "Sarah Williams", avatar: null, class: "CS-B", batch: "2024", gender: "female" },
  { id: "3", name: "Mike Chen", avatar: null, class: "IT-A", batch: "2023", gender: "male" },
  { id: "4", name: "Emily Davis", avatar: null, class: "CS-A", batch: "2024", gender: "female" },
  { id: "5", name: "Chris Brown", avatar: null, class: "EC-A", batch: "2023", gender: "male" },
  { id: "6", name: "Jessica Lee", avatar: null, class: "CS-B", batch: "2024", gender: "female" },
  { id: "7", name: "David Kim", avatar: null, class: "IT-B", batch: "2024", gender: "male" },
  { id: "8", name: "Amanda White", avatar: null, class: "CS-A", batch: "2023", gender: "female" },
];

const Discover = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrushes, setSelectedCrushes] = useState<string[]>([]);

  const handleCrushSelect = (userId: string) => {
    if (selectedCrushes.includes(userId)) {
      setSelectedCrushes(selectedCrushes.filter((id) => id !== userId));
      toast({
        title: "Crush Removed",
        description: "Your selection has been updated.",
      });
    } else {
      setSelectedCrushes([...selectedCrushes, userId]);
      toast({
        title: "Crush Added! 💚",
        description: "They'll never know unless it's mutual.",
      });
    }
  };

  const filteredUsers = demoUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.batch.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">Discover</h1>
          </div>
          <p className="text-muted-foreground">
            Browse people from your community. Tap the heart to select your crush.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, class, or batch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Users Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <UserCard
                  user={user}
                  isSelected={selectedCrushes.includes(user.id)}
                  onSelect={() => handleCrushSelect(user.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">Try a different search term</p>
          </motion.div>
        )}

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Card variant="glass" className="inline-flex items-center gap-3 px-6 py-3">
            <Heart className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              You've selected <span className="text-primary font-semibold">{selectedCrushes.length}</span> crushes
            </span>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Discover;
