import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BarChart3, Users, Trophy, Leaf } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ProgressTracking = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8 space-y-12">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl font-extrabold text-green-800 flex items-center justify-center gap-3">
          <BarChart3 className="text-green-600 w-10 h-10" />
          Progress Tracking
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Monitor change, measure impact, and celebrate collective progress 📊
        </p>
      </motion.div>

      {/* Why It Matters */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="space-y-4"
      >
        <h2 className="text-2xl font-semibold text-green-700">
          Why Progress Tracking Matters
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <BarChart3 className="text-green-600 w-6 h-6 mt-1" />
              <p>Provides <strong>real-time data</strong> on cleanliness and waste management.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Users className="text-green-600 w-6 h-6 mt-1" />
              <p>Builds <strong>accountability</strong> among citizens and authorities.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Trophy className="text-green-600 w-6 h-6 mt-1" />
              <p>Encourages <strong>healthy competition</strong> between communities.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Leaf className="text-green-600 w-6 h-6 mt-1" />
              <p>Helps measure the <strong>impact</strong> of every eco-initiative.</p>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Impact */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="space-y-3"
      >
        <h2 className="text-2xl font-semibold text-green-700">
          Impact of Progress Tracking
        </h2>
        <p className="text-gray-700 leading-relaxed">
          With effective tracking, India can create{" "}
          <strong>transparent, data-driven</strong> waste management. It improves
          efficiency, builds trust, and ensures long-term transformation.
        </p>
      </motion.section>

      {/* CTA */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center"
      >
        <Button
          asChild
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl shadow-md"
        >
          <Link to="/">🌱 Back to Home</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default ProgressTracking;