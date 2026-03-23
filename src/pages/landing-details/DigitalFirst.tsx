import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Smartphone, Bell, BarChart3, Cpu, LineChart } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const DigitalFirst = () => {
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
          <Cpu className="text-green-600 w-10 h-10" />
          Digital First
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transforming Waste Management Through Technology 💻
        </p>
      </motion.div>

      {/* Why Digital First Matters */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold text-green-700">
          Why Digital First Matters
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Real-time tracking of waste collection",
            "Automation reduces delays & errors",
            "Accountability for authorities & providers",
            "Data-driven decisions for efficiency",
            "Citizen participation via apps & dashboards",
          ].map((point, i) => (
            <Card key={i}>
              <CardContent className="p-4">{point}</CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* How We Implement */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold text-green-700">
          How We Implement Digital First
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Cpu className="text-green-600 w-6 h-6 mt-1" />
              <p><strong>IoT Sensors:</strong> Track bins & vehicles in real-time.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Smartphone className="text-green-600 w-6 h-6 mt-1" />
              <p><strong>Smart Apps:</strong> Notifications for segregation & schedules.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <BarChart3 className="text-green-600 w-6 h-6 mt-1" />
              <p><strong>Data Dashboards:</strong> Transparent city-wide waste metrics.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Bell className="text-green-600 w-6 h-6 mt-1" />
              <p><strong>Automated Alerts:</strong> Report missed collections instantly.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <LineChart className="text-green-600 w-6 h-6 mt-1" />
              <p><strong>Analytics & Insights:</strong> Optimize routes & reduce costs.</p>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Impact Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="space-y-4"
      >
        <h2 className="text-2xl font-semibold text-green-700">
          Impact of Digital First
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Digitally enabled waste management brings{" "}
          <strong>efficiency, accountability, and engagement</strong>. 
          Authorities optimize operations, citizens track progress, and together 
          we create a smarter, cleaner India 🌱.
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
          <Link to="/">🌿 Back to Home</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default DigitalFirst;