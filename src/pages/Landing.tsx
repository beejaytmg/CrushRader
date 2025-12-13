import { motion } from "framer-motion";
import { Heart, Shield, Eye, EyeOff, Sparkles, Users, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: EyeOff,
      title: "100% Anonymous",
      description: "Your crushes stay secret until they're mutual. No one can see who liked them.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Minimal data storage. Your secrets are safe with military-grade encryption.",
    },
    {
      icon: Heart,
      title: "Mutual Matches Only",
      description: "A match is revealed only when both users select each other. No stalking.",
    },
    {
      icon: Zap,
      title: "Instant Reveal",
      description: "The moment you match, you'll both know. Magic happens in real-time.",
    },
  ];

  const howItWorks = [
    { step: "01", title: "Sign Up", description: "Create your anonymous profile in seconds" },
    { step: "02", title: "Discover", description: "Browse people from your community" },
    { step: "03", title: "Select Crush", description: "Tap to secretly mark your crush" },
    { step: "04", title: "Match!", description: "Both select each other? It's a match!" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/10 to-transparent rounded-full blur-2xl" />
      </div>

      {/* Header */}
      <header className="relative z-10">
        <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <Heart className="w-8 h-8 text-primary fill-primary" />
              <div className="absolute inset-0 w-8 h-8 bg-primary/30 blur-lg" />
            </div>
            <span className="text-xl font-bold">CrushRadar</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Login
            </Button>
            <Button variant="glow" onClick={() => navigate("/auth")}>
              Get Started
            </Button>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Discover mutual connections secretly</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Find Your Crush
            <br />
            <span className="gradient-text">Without The Risk</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            The privacy-first mutual crush detection app. Select your crushes anonymously. 
            Only reveal when it's mutual. Zero awkwardness guaranteed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="hero" size="xl" onClick={() => navigate("/auth")} className="w-full sm:w-auto">
              <Heart className="w-5 h-5" />
              Start Finding Matches
            </Button>
            <Button variant="glass" size="xl" className="w-full sm:w-auto">
              <Eye className="w-5 h-5" />
              How It Works
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-8 mt-16"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Anonymous</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Data Leaks</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground">Possibilities</div>
            </div>
          </motion.div>
        </div>

        {/* Floating hearts animation */}
        <div className="absolute top-1/2 left-10 float">
          <Heart className="w-6 h-6 text-primary/30 fill-primary/30" />
        </div>
        <div className="absolute top-1/3 right-16 float" style={{ animationDelay: "1s" }}>
          <Heart className="w-8 h-8 text-primary/20 fill-primary/20" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 float" style={{ animationDelay: "2s" }}>
          <Heart className="w-5 h-5 text-primary/40 fill-primary/40" />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Privacy</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We take your privacy seriously. Here's how we keep your crushes secret.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass" className="p-6 h-full hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Four simple steps to find your match. No complications, just connections.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {howItWorks.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center"
            >
              <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              {index < howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Card variant="glow" className="p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="relative z-10">
              <Lock className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your Match?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join thousands of users who've found their mutual crushes without the awkwardness.
              </p>
              <Button variant="hero" size="xl" onClick={() => navigate("/auth")}>
                <Heart className="w-5 h-5" />
                Get Started Free
              </Button>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              <span className="font-semibold">CrushRadar</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CrushRadar. Your secrets are safe with us.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
