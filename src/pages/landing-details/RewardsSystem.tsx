import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Gift, Star } from "lucide-react";

const RewardsSystem = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8 space-y-10">
      {/* Heading */}
      <h1 className="text-5xl font-extrabold text-green-800 flex items-center justify-center gap-3 text-center">
        <Gift className="w-12 h-12 text-green-600" />
        Reward System
      </h1>

      {/* Section 1 */}
      <section className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-700">
          Clean Habits, Smart Rewards 🎁
        </h2>
        <p className="text-gray-700 leading-relaxed">
          To make cleanliness a part of daily life, the{" "}
          <strong>Swachh Bharat Digital Mission</strong> introduces a{" "}
          <strong>Reward System</strong>. Every citizen who actively
          participates in waste segregation, recycling, and community
          engagement earns exciting benefits. This system turns good habits into
          rewarding experiences.
        </p>
      </section>

      {/* Section 2 */}
      <section className="bg-green-50 border-l-4 border-green-400 rounded-lg p-5 space-y-3">
        <h2 className="text-xl font-semibold text-green-700">
          Why a Reward System?
        </h2>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li>Encourages citizens to adopt sustainable waste practices.</li>
          <li>Builds long-term motivation to participate in community efforts.</li>
          <li>
            Creates a sense of recognition and celebration for positive action.
          </li>
          <li>Makes cleanliness not just a duty, but a rewarding lifestyle.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="bg-white shadow-md rounded-xl p-6 space-y-3">
        <h2 className="text-xl font-semibold text-green-700">
          How the Reward System Works
        </h2>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li>
            <strong>Earn Points:</strong> Get points for waste segregation,
            clean-up drives, and reporting activities.
          </li>
          <li>
            <strong>Track Progress:</strong> Points are stored in your digital
            account on the platform.
          </li>
          <li>
            <strong>Redeem Rewards:</strong> Use your points for discounts and
            offers.
          </li>
          <li>
            <strong>Stay Consistent:</strong> The more you participate, the
            bigger the rewards.
          </li>
        </ul>
      </section>

      {/* Section 4 */}
      <section className="bg-green-100 rounded-xl p-6 space-y-3">
        <h2 className="text-xl font-semibold text-green-700 flex items-center gap-2">
          <Star className="w-5 h-5 text-green-600" /> Available Rewards 🎉
        </h2>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li>
            Discounts on <strong>Metro Tickets</strong> 🚇
          </li>
          <li>
            Discounts on <strong>Movie Tickets</strong> 🎬
          </li>
          <li>
            Offers on <strong>Mall Expenses & Shopping</strong> 🛍
          </li>
          <li>
            Special deals on <strong>Restaurants and Cafes</strong> 🍴
          </li>
          <li>
            Exclusive <strong>Eco-friendly Products</strong> at lower prices 🌱
          </li>
        </ul>
      </section>

      {/* Section 5 */}
      <section className="bg-white shadow-md rounded-xl p-6 space-y-3">
        <h2 className="text-xl font-semibold text-green-700">
          Impact of Rewards
        </h2>
        <p className="text-gray-700 leading-relaxed">
          By linking rewards with eco-friendly actions, citizens feel valued for
          their contribution. This system motivates individuals, inspires
          communities, and accelerates India’s journey towards a cleaner and
          greener nation.
        </p>
      </section>

      {/* Section 6 */}
      <section className="bg-green-50 rounded-xl border border-green-200 p-6 space-y-3">
        <h2 className="text-xl font-semibold text-green-700">
          Start Earning Today 🌟
        </h2>
        <p className="text-gray-700">
          Your daily actions can create a cleaner India <strong>and</strong>{" "}
          unlock exciting rewards. Whether it’s a metro ride, a movie night, or
          a shopping trip — your commitment to cleanliness pays off in real
          benefits.
        </p>
        <p className="italic text-gray-600">
          Segregate waste, join clean-up drives, report issues — and enjoy the
          rewards of a cleaner tomorrow.
        </p>
      </section>

      {/* Back Button */}
      <div className="flex justify-center">
        <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default RewardsSystem;