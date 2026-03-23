import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { Leaf, Recycle, Users, Globe2, Sprout } from "lucide-react";

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const CommunityEngagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 p-8 space-y-12">
      {/* Heading */}
        <motion.h1
        className="text-5xl font-extrabold text-green-800 flex items-center justify-center gap-3 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        >
        <Leaf className="text-green-600 w-10 h-10" />
        Community Engagement
        </motion.h1>


      {/* Intro Section */}
      <motion.section
        className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 space-y-4 border border-green-200"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <h2 className="text-3xl font-semibold text-green-700 flex items-center gap-2">
          <Globe2 className="text-green-600" /> Together for a Cleaner, Greener India 🌍
        </h2>
        <p className="text-gray-700 leading-relaxed">
          The <strong>Swachh Bharat Digital Mission</strong> is more than just a
          program — it’s a people’s movement. Real change begins when communities
          come together, share responsibility, and take action for a sustainable
          future.
        </p>
      </motion.section>

      {/* Why It Matters */}
      <motion.section
        className="p-6 bg-emerald-50 rounded-2xl shadow-md border border-emerald-200"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <h2 className="text-2xl font-semibold text-green-800 flex items-center gap-2">
          <Users className="text-green-600" /> Why Community Engagement Matters
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Communities are the backbone of waste management.</li>
          <li>Active participation ensures long-term cleanliness and sustainability.</li>
          <li>Awareness spreads faster when citizens educate each other.</li>
          <li>Every household, school, and workplace can become a changemaker.</li>
        </ul>
      </motion.section>

      {/* How You Can Participate */}
      <motion.section
        className="p-6 bg-white rounded-2xl shadow-lg border-l-4 border-green-500"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <h2 className="text-2xl font-semibold text-green-800 flex items-center gap-2">
          <Sprout className="text-green-600" /> How You Can Participate
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Local Clean-Up Drives:</strong> Create litter-free streets and public spaces.</li>
          <li><strong>Awareness Campaigns:</strong> Spread knowledge on segregation and recycling.</li>
          <li><strong>Composting & Recycling Workshops:</strong> Turn waste into resources.</li>
          <li><strong>Volunteer & Youth Engagement:</strong> Empower students and NGOs.</li>
          <li><strong>Digital Participation:</strong> Report waste issues and share success stories.</li>
        </ul>
      </motion.section>

      {/* Impact */}
      <motion.section
        className="p-6 bg-emerald-50 rounded-2xl shadow-md"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <h2 className="text-2xl font-semibold text-green-800 flex items-center gap-2">
          <Recycle className="text-green-600" /> Impact of Collective Action
        </h2>
        <p className="text-gray-700 leading-relaxed">
          When communities engage actively, waste generation reduces, segregation becomes 
          a habit, recycling improves, and public spaces remain clean and healthy.
        </p>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="p-6 bg-green-600 text-white rounded-2xl shadow-lg text-center space-y-3"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={4}
      >
        <h2 className="text-2xl font-bold">Call to Action 🚀</h2>
        <p>
          Every small effort counts. Whether it’s segregating waste at home, 
          volunteering in a clean-up drive, or teaching others about sustainable practices — 
          your participation strengthens the <strong>Clean India Mission</strong>.
        </p>
        <p className="italic">
          Together, let’s make India cleaner, greener, and healthier for generations to come.
        </p>
      </motion.section>

      {/* Button */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Button asChild size="lg" className="bg-green-700 hover:bg-green-800 text-white rounded-xl px-6 py-3 shadow-md">
          <Link to="/">🌱 Back to Home</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default CommunityEngagement;