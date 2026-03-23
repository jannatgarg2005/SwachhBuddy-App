import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BarChart3, FileText, Cpu, MessageSquare, ShieldCheck, CheckCircle2, Search } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Transparency = () => {
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
          <Search className="text-green-600 w-10 h-10" />
          Transparency
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Building Trust Through Openness 🔍
        </p>
      </motion.div>

      {/* Why Transparency Matters */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold text-green-700">
          Why Transparency Matters
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Trust:</strong> Citizens & organizations feel confident.</li>
          <li><strong>Accountability:</strong> Authorities stay answerable.</li>
          <li><strong>Fair Use:</strong> Prevents corruption & misuse of resources.</li>
          <li><strong>Participation:</strong> Encourages citizen monitoring.</li>
        </ul>
      </motion.section>

      {/* How Transparency is Ensured */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold text-green-700">
          How Transparency is Ensured
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <BarChart3 className="text-green-600 w-6 h-6 mt-1" />
              <p><strong>Open Dashboards:</strong> Citizens view real-time data.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <FileText className="text-green-600 w-6 h-6 mt-1" />
              <p><strong>Public Reports:</strong> Budgets & progress shared openly.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Cpu className="text-green-600 w-6 h-6 mt-1" />
              <p><strong>Digital Monitoring:</strong> IoT & apps ensure no hidden gaps.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <MessageSquare className="text-green-600 w-6 h-6 mt-1" />
              <p><strong>Citizen Feedback:</strong> Report issues, share suggestions.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <ShieldCheck className="text-green-600 w-6 h-6 mt-1" />
              <p><strong>Independent Audits:</strong> Authenticity verified regularly.</p>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Citizen’s Role */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold text-green-700">
          Citizen’s Role in Transparency
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Monitor dashboards & progress.",
            "Report uncollected waste instantly.",
            "Participate in surveys with honest feedback.",
            "Encourage fair practices locally.",
            "Hold authorities accountable.",
          ].map((role, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-start gap-3">
                <CheckCircle2 className="text-green-600 w-6 h-6 mt-1" />
                <p>{role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Impact */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="space-y-4"
      >
        <h2 className="text-2xl font-semibold text-green-700">
          Impact of Transparency
        </h2>
        <p className="text-gray-700 leading-relaxed">
          A transparent system creates <strong>trust, fairness & efficiency</strong>. 
          Citizens know their contributions matter, while authorities remain accountable. 
          Together, this strengthens the Clean India movement 🌍.
        </p>
      </motion.section>

      {/* CTA */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl font-bold text-green-800">Open India, Clean India 🌍</h2>
        <p className="text-gray-600 italic">
          Let’s keep the mission open, fair, and visible for all.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl shadow-md"
        >
          <Link to="/">🔍 Back to Home</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default Transparency;