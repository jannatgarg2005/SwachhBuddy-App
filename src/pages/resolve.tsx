import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lightbulb, Recycle, BookOpen, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Try to import image — if missing, we fallback gracefully
let fiveRsImage: string | null = null;
try {
  fiveRsImage = new URL("@/assets/5Rs.jpg", import.meta.url).href;
} catch {
  fiveRsImage = null;
}

const tips = [
  "♻ Reuse glass jars as storage containers instead of buying plastic ones.",
  "♻ Turn old T-shirts into cleaning cloths instead of throwing them away.",
  "♻ Carry a reusable water bottle to reduce single-use plastic.",
  "♻ Use both sides of paper before recycling it.",
  "♻ Compost food scraps instead of mixing them with recyclables.",
  "♻ Donate old electronics (phones, laptops) to refurbishing centers.",
  "♻ Separate e-waste like batteries and chargers — never toss them in normal bins.",
  "♻ Avoid black plastic containers (many recycling plants can't process them).",
  "♻ Buy recycled products (notebooks, pens, bags) to close the recycling loop.",
  "♻ Keep recyclables dry — moisture makes paper and cardboard non-recyclable.",
];

const facts = [
  "🇮🇳 India generates 3.4M tonnes of plastic waste annually, only ~30% recycled.",
  "📄 Paper recycling rate in India is ~27%, lower than global avg (59%).",
  "🔌 90% of e-waste in India is handled by the informal sector.",
  "🍾 Glass recycling is high in India (~45–50%) due to reuse of bottles.",
  "🏡 75% of households follow source segregation regularly.",
  "🥤 PET bottles have ~70–80% recycling rate thanks to informal collection.",
];

const myths = [
  { myth: "All plastics are recyclable.", fact: "Only PET (♳) & HDPE (♴) are widely recycled." },
  { myth: "If an item has the recycling symbol, it will be recycled.", fact: "Depends on local recycling facilities." },
  { myth: "You don't need to clean containers before recycling.", fact: "Food residue contaminates whole batches." },
  { myth: "Glass can be recycled endlessly.", fact: "Broken/colored glass reduces quality and is often discarded." },
  { myth: "E-waste in regular bins is fine.", fact: "E-waste contains toxic heavy metals — needs special centers." },
  { myth: "Recycling alone solves waste problems.", fact: "Reduce & Reuse are even more important." },
];

const categories = [
  {
    title: "✅ General Recycling",
    dos: ["Rinse bottles, jars, and containers before recycling.", "Flatten cardboard boxes to save space.", "Separate paper, plastic, metal, glass, and e-waste.", "Remove caps, lids, and straws from bottles.", "Use recycling bins with clear labels.", "Reuse bags, jars, and boxes whenever possible.", "Check local recycling rules (they vary by city)."],
    donts: ["Don't recycle greasy pizza boxes or food-stained paper.", "Don't mix food waste with recyclables.", "Don't recycle broken glass (handle as general waste).", "Don't put e-waste in normal bins.", "Don't bag recyclables in plastic bags.", "Don't recycle items with leftover chemicals.", "Don't assume all plastics are recyclable."],
  },
  {
    title: "📰 Paper & Cardboard",
    dos: ["Recycle newspapers, magazines, office paper, and books.", "Flatten cardboard boxes before binning.", "Keep paper products dry and clean."],
    donts: ["Don't recycle food-stained paper.", "Don't recycle laminated or wax-coated paper.", "Don't shred paper too small."],
  },
  {
    title: "🧴 Plastic",
    dos: ["Recycle PET (♳) and HDPE (♴) containers.", "Rinse plastic containers.", "Remove caps, lids, straws before recycling."],
    donts: ["Don't recycle thin bags, wrappers, cling film.", "Don't recycle toys, hangers, or PVC pipes.", "Don't burn plastics (toxic fumes)."],
  },
  {
    title: "🍾 Glass",
    dos: ["Recycle bottles, jars, and glass containers.", "Rinse thoroughly.", "Separate by color if required."],
    donts: ["Don't recycle broken glass or ceramics.", "Don't recycle mirrors, bulbs, or window panes.", "Don't leave caps or corks attached."],
  },
  {
    title: "🥫 Metal",
    dos: ["Recycle aluminum & tin cans.", "Rinse cans before recycling."],
    donts: ["Don't recycle paint/chemical tins or gas cylinders.", "Don't recycle rusted items.", "Don't mix e-waste metals with cans."],
  },
  {
    title: "💻 E-Waste",
    dos: ["Recycle old phones, chargers, batteries at authorized centers.", "Remove personal data before disposal.", "Store safely, separate from wet waste."],
    donts: ["Don't throw e-waste in household bins.", "Don't burn or break batteries.", "Don't store e-waste too long (risk of leaks/fire)."],
  },
];

// 5 R's fallback if image is missing
const FiveRsFallback = () => (
  <div className="mx-auto max-w-md w-full rounded-xl border border-green-300 bg-white shadow-lg p-4 md:p-6">
    <h3 className="text-center font-bold text-green-800 text-base md:text-lg mb-4">The 5 R's of Waste Management</h3>
    <div className="grid grid-cols-5 gap-2 text-center">
      {[
        { r: "Refuse", emoji: "🚫", color: "bg-red-50 border-red-200" },
        { r: "Reduce", emoji: "📉", color: "bg-orange-50 border-orange-200" },
        { r: "Reuse", emoji: "🔄", color: "bg-yellow-50 border-yellow-200" },
        { r: "Recycle", emoji: "♻️", color: "bg-green-50 border-green-200" },
        { r: "Recover", emoji: "💡", color: "bg-blue-50 border-blue-200" },
      ].map((item) => (
        <div key={item.r} className={`p-2 md:p-3 rounded-lg border ${item.color} flex flex-col items-center gap-1`}>
          <span className="text-xl md:text-2xl">{item.emoji}</span>
          <span className="text-xs font-bold text-gray-700">{item.r}</span>
        </div>
      ))}
    </div>
  </div>
);

const Resolve = () => {
  const navigate = useNavigate();
  const [tip, setTip] = useState("");
  const [factIndex, setFactIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setTip(tips[Math.floor(Math.random() * tips.length)]);
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % facts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8 md:space-y-12 bg-gradient-to-b from-green-50 to-white min-h-screen">
      <div className="container mx-auto max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1" />
          <motion.h1
            className="text-2xl md:text-4xl font-extrabold text-green-800 text-center drop-shadow-md flex-1"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            🌍 Resolve & Recycle
          </motion.h1>
          <div className="flex-1 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-xs md:text-sm">
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </div>
        </div>

        <motion.p
          className="text-green-700 font-semibold text-center text-sm md:text-base max-w-2xl mx-auto mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Learn eco-friendly practices, follow the 5 R's, and discover how to recycle different materials.
        </motion.p>

        {/* 5R's Image — with fallback if missing */}
        <div className="flex justify-center">
          {fiveRsImage && !imgError ? (
            <motion.img
              src={fiveRsImage}
              alt="5Rs of Recycling"
              className="w-full max-w-xs md:max-w-md rounded-xl shadow-lg border border-green-300 object-contain"
              onError={() => setImgError(true)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.6 },
                scale: { duration: 0.6 },
                y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              }}
              whileHover={{ scale: 1.05 }}
            />
          ) : (
            <FiveRsFallback />
          )}
        </div>

        {/* Category Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {categories.map((cat, idx) => (
            <AccordionItem key={idx} value={`cat-${idx}`}>
              <AccordionTrigger className="text-base md:text-xl font-bold text-green-700 text-left">
                {cat.title}
              </AccordionTrigger>
              <AccordionContent>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mt-3 md:mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-green-300 shadow hover:shadow-xl transition-all">
                    <CardHeader className="pb-2 md:pb-4">
                      <CardTitle className="text-green-600 font-bold text-sm md:text-base">Do's ✅</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-4 md:pl-6 space-y-1.5 text-gray-700 text-xs md:text-sm font-medium">
                        {cat.dos.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-red-300 shadow hover:shadow-xl transition-all">
                    <CardHeader className="pb-2 md:pb-4">
                      <CardTitle className="text-red-600 font-bold text-sm md:text-base">Don'ts ❌</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-4 md:pl-6 space-y-1.5 text-gray-700 text-xs md:text-sm font-medium">
                        {cat.donts.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Tip of the Day */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6, type: "spring" }}
        >
          <Card className="bg-green-50 border-green-400 shadow-md">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-green-700 font-bold text-sm md:text-base">
                <Lightbulb className="h-4 w-4 md:h-5 md:w-5" /> Recycling Tip of the Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.p
                key={tip}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-gray-700 font-medium text-xs md:text-sm"
              >
                {tip}
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Did You Know */}
        <Card className="bg-blue-50 border-blue-400 shadow-md">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="flex items-center gap-2 text-blue-700 font-bold text-sm md:text-base">
              <BookOpen className="h-4 w-4 md:h-5 md:w-5" /> Did You Know?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.p
              key={factIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-gray-700 font-medium text-center text-xs md:text-sm"
            >
              {facts[factIndex]}
            </motion.p>
          </CardContent>
        </Card>

        {/* Myth vs Fact */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          <Card className="bg-yellow-50 border-yellow-400 shadow-md">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-yellow-700 font-bold text-sm md:text-base">
                <Recycle className="h-4 w-4 md:h-5 md:w-5" /> Recycling Myths vs Facts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              {myths.map((m, i) => (
                <motion.div
                  key={i}
                  className="p-3 md:p-4 border rounded-lg shadow-sm bg-white"
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-red-600 font-semibold text-xs md:text-sm">❌ Myth: {m.myth}</p>
                  <p className="text-green-700 font-bold text-xs md:text-sm mt-1">✅ Fact: {m.fact}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
};

export default Resolve;
