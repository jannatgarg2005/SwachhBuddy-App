import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { Recycle, Trash2, Leaf, Users, BarChart3 } from "lucide-react";

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const SmartSegregation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 p-8 space-y-12">
      {/* Heading */}
      <motion.h1
        className="text-5xl font-extrabold text-green-800 flex items-center justify-center gap-3 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Recycle className="text-green-600 w-10 h-10" />
        Smart Segregation
      </motion.h1>

      {/* Intro */}
      <motion.section
        className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 space-y-4 border border-green-200"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <h2 className="text-3xl font-semibold text-green-700 flex items-center gap-2">
          <Leaf className="text-green-600" /> Smarter Waste, Cleaner Future ♻
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Waste management begins at the very first step —{" "}
          <strong>segregation</strong>. Smart segregation ensures recyclable,
          biodegradable, and non-recyclable waste are properly separated at the
          source, turning waste into valuable resources.
        </p>
      </motion.section>

      {/* Why Smart Segregation Matters */}
      <motion.section
        className="p-6 bg-emerald-50 rounded-2xl shadow-md border border-emerald-200"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <h2 className="text-2xl font-semibold text-green-800 flex items-center gap-2">
          <Users className="text-green-600" /> Why Smart Segregation Matters
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Efficient Recycling:</strong> Clean waste goes directly to
            recycling.
          </li>
          <li>
            <strong>Reduced Pollution:</strong> Stops harmful mixing of
            materials.
          </li>
          <li>
            <strong>Better Resource Use:</strong> Compost and recycle
            effectively.
          </li>
          <li>
            <strong>Time & Cost Saving:</strong> Less manual sorting later.
          </li>
        </ul>
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="p-6 bg-white rounded-2xl shadow-lg border-l-4 border-green-500"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <h2 className="text-2xl font-semibold text-green-800 flex items-center gap-2">
          <Trash2 className="text-green-600" /> How Smart Segregation Works
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Use three bins —{" "}
            <strong>Biodegradable, Recyclable, Non-Recyclable</strong>.
          </li>
          <li>IoT smart bins track and monitor waste in real time.</li>
          <li>Community hubs collect and weigh segregated waste.</li>
          <li>AI & automation sort recyclables at facilities.</li>
          <li>Citizens earn incentives for consistent segregation.</li>
        </ul>
      </motion.section>

      {/* Citizen Role */}
      <motion.section
        className="p-6 bg-emerald-50 rounded-2xl shadow-md"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <h2 className="text-2xl font-semibold text-green-800 flex items-center gap-2">
          <Users className="text-green-600" /> Citizen’s Role
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Use <strong>color-coded bins</strong> at home and offices.
          </li>
          <li>Avoid mixing hazardous and household waste.</li>
          <li>Join workshops and spread awareness.</li>
          <li>Report unsegregated waste collection digitally.</li>
          <li>Encourage neighbors to follow segregation rules.</li>
        </ul>
      </motion.section>

      {/* Impact */}
      <motion.section
        className="p-6 bg-white/80 rounded-2xl shadow-md border border-green-200"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={4}
      >
        <h2 className="text-2xl font-semibold text-green-800 flex items-center gap-2">
          <BarChart3 className="text-green-600" /> Impact of Smart Segregation
        </h2>
        <p className="text-gray-700 leading-relaxed">
          With proper segregation, landfill waste reduces, recycling industries
          get cleaner materials, composting increases, and neighborhoods stay
          healthier.
        </p>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="p-6 bg-green-600 text-white rounded-2xl shadow-lg text-center space-y-3"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={5}
      >
        <h2 className="text-2xl font-bold">Take the Next Step 🌱</h2>
        <p>
          Segregation may seem small, but it creates <strong>big impact</strong>.
          By making waste separation a daily habit, you empower recycling
          systems, reduce pollution, and protect future generations.
        </p>
        <p className="italic">
          Start today — simple steps at your home can lead to a smarter,
          sustainable tomorrow.
        </p>
      </motion.section>

      {/* Button */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Button
          asChild
          size="lg"
          className="bg-green-700 hover:bg-green-800 text-white rounded-xl px-6 py-3 shadow-md"
        >
          <Link to="/">🌍 Back to Home</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default SmartSegregation;