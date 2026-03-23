import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Recycle,
  TrendingUp,
  Award,
  Shield,
  Smartphone,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import { ImpactCounter } from "@/components/ImpactCounter";

interface LandingProps {
  onUserTypeSelect: (
    type: "waste-collector" | "student" | "community-leader" | "employee"
  ) => void;
}

const Landing = ({ onUserTypeSelect }: LandingProps) => {
  const features = [
    { icon: <Users className="h-6 w-6" />, title: "Community Engagement", description: "Join citizens across India in the clean India mission", link: "/community-engagement" },
    { icon: <Recycle className="h-6 w-6" />, title: "Smart Segregation", description: "Learn proper waste sorting with AI-powered guidance", link: "/smart-segregation" },
    { icon: <TrendingUp className="h-6 w-6" />, title: "Progress Tracking", description: "Monitor your environmental impact in real-time", link: "/progress-tracking" },
    { icon: <Award className="h-6 w-6" />, title: "Rewards System", description: "Earn points and rewards for sustainable actions", link: "/rewards-system" },
    { icon: <Shield className="h-6 w-6" />, title: "Transparency", description: "Full transparency in waste management processes", link: "/transparency" },
    { icon: <Smartphone className="h-6 w-6" />, title: "Digital First", description: "Modern digital platform for seamless experience", link: "/digital-first" },
  ];

  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
        {/* Stronger overlay — ensures buttons always visible */}
        <div className="absolute inset-0 bg-black/55 z-0" />

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-24 text-center">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 1 }}
          >
            Your Swachhta Buddy
            <span className="block bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Swachh Buddy
            </span>
          </motion.h1>

          <motion.p
            className="mb-8 text-base md:text-2xl text-white/90 max-w-3xl mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
          >
            India's smart waste management platform — segregate, track, verify,
            and earn rewards for a cleaner nation. Every action matters.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }}
          >
            {/* Get Started — solid green, always visible */}
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg px-8 font-semibold">
              <Link to="/get-started">Get Started</Link>
            </Button>

            {/* Explore Learning — FIXED: white bg tint + explicit white border, visible on any theme */}
            <Button
              asChild size="lg"
              className="bg-white/15 hover:bg-white/25 text-white border-2 border-white/90 px-8 font-semibold backdrop-blur-sm"
            >
              <Link to="/learning">Explore Learning</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Animated Impact Counter */}
      <ImpactCounter />

      {/* About Us */}
      <section className="relative py-16 md:py-20 bg-gradient-to-r from-green-100 via-green-50 to-green-100 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

        <div className="relative container mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-green-800 mb-4 md:mb-6"
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 1 }}
          >
            About Us
          </motion.h2>

          <motion.p
            className="text-base md:text-xl text-green-700 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}
          >
            We are on a mission to inspire citizens across India to embrace
            sustainability, tackle waste challenges, and build a cleaner, greener
            future—together. 🌍
          </motion.p>

          <motion.div
            className="max-w-xl mx-auto bg-white/30 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl p-6 md:p-10 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}
          >
            <h3 className="text-2xl md:text-4xl font-bold text-green-900">
              <Typewriter
                words={["Learn 📘", "Play 🎮", "Resolve ♻", "Earn 🏆"]}
                loop={0} cursor cursorStyle="|"
                typeSpeed={100} deleteSpeed={60} delaySpeed={1500}
              />
            </h3>
            <p className="mt-4 text-green-800 text-base md:text-lg">
              Engage with eco-friendly challenges that are fun, impactful, and rewarding. 🌱
            </p>
            <div className="mt-6">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg" asChild>
                <Link to="/learning">Explore Learning Hub</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="mt-8 md:mt-12 flex flex-wrap justify-center gap-4 md:gap-6 text-green-600"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 1 }}
          >
            <div className="flex items-center gap-2"><Recycle className="h-5 w-5 md:h-6 md:w-6" /><span className="text-sm md:text-base">Reduce Waste</span></div>
            <div className="flex items-center gap-2"><Users className="h-5 w-5 md:h-6 md:w-6" /><span className="text-sm md:text-base">Empower Communities</span></div>
            <div className="flex items-center gap-2"><Smartphone className="h-5 w-5 md:h-6 md:w-6" /><span className="text-sm md:text-base">Go Digital</span></div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <motion.h2
              className="text-2xl md:text-4xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            >
              Powerful Features
            </motion.h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to participate in India's waste management revolution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link to={feature.link}>
                  <Card className="hover:shadow-eco transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                    <CardContent className="p-4 md:p-6">
                      <div className="mx-auto mb-3 md:mb-4 p-3 bg-primary/10 rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-primary">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-base md:text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-xs md:text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Credit */}
      <section className="py-3 md:py-4 bg-green-900 text-center">
        <p className="text-green-200 text-xs md:text-sm px-4">
          Built with ❤️ by Team{" "}
          <span className="font-bold text-white">NeuroX</span> for{" "}
          <span className="font-bold text-white">HACKXTRACT 2026</span>{" "}
          | Problem ID: Sustainable Development
        </p>
      </section>
    </div>
  );
};

export default Landing;
