import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  avatar: string | null;
  class: string;
  batch: string;
  gender: string;
}

interface UserCardProps {
  user: User;
  isSelected: boolean;
  onSelect: () => void;
}

const UserCard = ({ user, isSelected, onSelect }: UserCardProps) => {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card
      variant={isSelected ? "glow" : "glass"}
      className={`p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
        isSelected ? "ring-2 ring-primary" : "hover:border-primary/30"
      }`}
      onClick={onSelect}
    >
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-4">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isSelected
                ? "bg-gradient-to-br from-primary to-primary/70"
                : "bg-gradient-to-br from-secondary to-muted"
            }`}
          >
            <span
              className={`text-2xl font-bold ${
                isSelected ? "text-primary-foreground" : "text-foreground"
              }`}
            >
              {initials}
            </span>
          </div>

          {/* Heart indicator */}
          <motion.div
            initial={false}
            animate={isSelected ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
          >
            <Heart className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
          </motion.div>
        </div>

        {/* Info */}
        <h3 className="font-semibold text-lg mb-1">{user.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">
          {user.class} • {user.batch}
        </p>

        {/* Select indicator */}
        <div
          className={`text-xs font-medium px-3 py-1 rounded-full transition-all duration-300 ${
            isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {isSelected ? "Selected as crush 💚" : "Tap to select"}
        </div>
      </div>
    </Card>
  );
};

export default UserCard;
