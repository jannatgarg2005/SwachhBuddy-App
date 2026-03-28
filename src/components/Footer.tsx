// src/components/Footer.tsx
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-green-900 text-green-100 py-8 md:py-16 relative overflow-hidden">
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-green-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-green-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">

        {/* Mobile: brand row + 2-col links | Desktop: 4-col grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-white">Swachh Buddy</h2>
            <p className="text-green-200 text-xs md:text-sm">
              Your Swachhta Buddy — Join us in creating a cleaner, greener India. Empower communities, track waste, and earn rewards for sustainability.
            </p>
            <p className="text-green-400 text-xs mt-2 font-semibold">
              Team NeuroX | Built for Environment | 2026
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-2 md:mb-4 text-sm md:text-base">Quick Links</h3>
            <ul className="space-y-1.5 text-green-200 text-xs md:text-sm">
              <li><Link to="/get-started" className="hover:text-white transition-colors">Get Started</Link></li>
              <li><Link to="/learning" className="hover:text-white transition-colors">Learning Hub</Link></li>
              <li><Link to="/play" className="hover:text-white transition-colors">Play &amp; Earn</Link></li>
              <li><Link to="/resolve" className="hover:text-white transition-colors">Resolve Issues</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-2 md:mb-4 text-sm md:text-base">Resources</h3>
            <ul className="space-y-1.5 text-green-200 text-xs md:text-sm">
              <li><Link to="/learning/waste-basics" className="hover:text-white transition-colors">Waste Basics</Link></li>
              <li><Link to="/learning/waste-advance" className="hover:text-white transition-colors">Advanced Module</Link></li>
              <li><Link to="/rewards" className="hover:text-white transition-colors">Rewards</Link></li>
              <li><Link to="/live-map" className="hover:text-white transition-colors">Live Map</Link></li>
            </ul>
          </div>

          {/* Contact — hidden on mobile, shown on desktop */}
          <div className="hidden md:block">
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <p className="text-green-200 text-sm mb-2">Email: neuroxteam23@gmail.com</p>
            <p className="text-green-200 text-sm mb-4">Built for Environment</p>
            <SocialIcons />
          </div>
        </div>

        {/* Social icons on mobile — shown below the grid */}
        <div className="flex items-center justify-between mt-5 md:hidden">
          <p className="text-green-300 text-xs">neuroxteam23@gmail.com</p>
          <SocialIcons />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-green-700 mt-6 md:mt-12 pt-4 md:pt-6 text-center text-green-200 text-xs md:text-sm">
          &copy; {new Date().getFullYear()} Swachh Buddy by NeuroX. All rights reserved. | Sustainable Development
        </div>
      </div>
    </footer>
  );
};

const SocialIcons = () => (
  <div className="flex gap-3">
    <a href="#" className="text-green-200 hover:text-white transition-colors" aria-label="Facebook">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    </a>
    <a href="#" className="text-green-200 hover:text-white transition-colors" aria-label="Twitter">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
      </svg>
    </a>
    <a href="#" className="text-green-200 hover:text-white transition-colors" aria-label="Instagram">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    </a>
    <a href="#" className="text-green-200 hover:text-white transition-colors" aria-label="LinkedIn">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    </a>
  </div>
);

export default Footer;
