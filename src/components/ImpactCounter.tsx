// src/components/ImpactCounter.tsx
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface CounterProps {
  end: number;
  duration: number;
  suffix?: string;
  prefix?: string;
}

const AnimatedCounter = ({ end, duration, suffix = "", prefix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export const ImpactCounter = () => {
  const stats = [
    {
      value: 62400,
      suffix: " kg",
      label: "Waste Segregated",
      icon: "♻️",
      color: "from-green-400 to-emerald-600",
    },
    {
      value: 1872,
      suffix: "",
      label: "Pickups Completed",
      icon: "🚛",
      color: "from-blue-400 to-blue-600",
    },
    {
      value: 4230,
      suffix: "+",
      label: "Citizens Rewarded",
      icon: "🏆",
      color: "from-yellow-400 to-orange-500",
    },
    {
      value: 98,
      suffix: "%",
      label: "Verified Disposals",
      icon: "✅",
      color: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.p
          className="text-center text-green-300 text-sm font-semibold uppercase tracking-widest mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          🇮🇳 Real Impact Across India
        </motion.p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                <AnimatedCounter
                  end={stat.value}
                  duration={2}
                  suffix={stat.suffix}
                />
              </div>
              <p className="text-green-200 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
