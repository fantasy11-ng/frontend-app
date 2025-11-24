"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Plus,
  Calendar,
} from "lucide-react";
import LandingHeader from "./LandingHeader";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      <section className="relative min-h-screen text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/home.png)" }}
        />

        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative min-h-screen flex flex-col">
          <div className="flex-1 flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="">
              <div className="flex items-start space-x-4 max-w-2xl mt-32 sm:mt-40 md:mt-48">
                <div className="flex-shrink-0">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M39.9993 6.66699C58.4087 6.66699 73.3327 21.5908 73.3327 40.0003C73.3327 58.4097 58.4087 73.3337 39.9993 73.3337C21.5898 73.3337 6.66602 58.4097 6.66602 40.0003C6.66602 21.5908 21.5898 6.66699 39.9993 6.66699ZM45.5644 53.3333H34.431L29.8344 59.6567L31.6807 65.344C34.2983 66.2027 37.0947 66.667 39.9993 66.667C42.904 66.667 45.7003 66.2027 48.318 65.344L50.161 59.6567L45.5644 53.3333ZM17.6445 36.24L13.3401 39.3653L13.3327 40.0003C13.3327 45.766 15.1625 51.1043 18.273 55.466L24.6411 55.4667L29.0478 49.4L25.6211 38.8333L17.6445 36.24ZM62.351 36.24L54.3743 38.8333L50.9477 49.4L55.3544 55.4667L61.7257 55.466C64.8363 51.1043 66.666 45.766 66.666 40.0003L66.656 39.3637L62.351 36.24ZM47.6373 14.4436L43.331 17.5768V25.9668L52.311 32.4901L59.7743 30.0668L61.6217 24.3897C58.2227 19.6898 53.3287 16.1421 47.6373 14.4436ZM32.3612 14.4436C26.6686 16.1425 21.7739 19.6915 18.3747 24.3929L20.2211 30.0668L27.6845 32.4901L36.6643 25.9668V17.5768L32.3612 14.4436Z"
                      fill="#C3A863"
                    />
                  </svg>
                </div>

                <p className="text-base sm:text-lg text-white max-w-[432px]">
                  Compete with millions of fans across Africa. Build your
                  ultimate AFCON fantasy team, predict match outcomes, and win
                  incredible prizes.
                </p>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
                Build your Dream Team
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-medium text-[#070A11] mb-4 max-w-[684px] mx-auto">
              We&apos;ve got all the tools you need to dominate AFCON 2025
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Feature 1 */}
            <div className="space-y-6">
              <div>
              <div className="flex items-center space-x-2 text-[#070A11] text-sm">
                  <Calendar color="#800000" strokeWidth={2.5} /> Time management
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  Build your ultimate squad
                </h3>
                <p className="text-gray-600 mb-6">
                  Select from 24 nations and hundreds of players. Manage your
                  N100M budget wisely, choose your formation, and assign captain
                  roles to maximize points.
                </p>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center px-6 py-2 text-white font-medium rounded-full transition-colors"
                >
                  Build your team <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
                <Image
                  src="/images/Feature1.png"
                  alt="Team Builder"
                  width={500}
                  height={300}
                />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="space-y-6">
              <div>
              <div className="flex items-center space-x-2 text-[#070A11] text-sm">
                  <Calendar color="#800000" strokeWidth={2.5} /> Time management
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Predict every match
                </h3>
                <p className="text-gray-600 mb-6">
                  From group stages to the final, predict match outcomes,
                  scores, and key moment winners. Earn bonus points for accurate
                  predictions and climb the prediction leaderboard.
                </p>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center px-6 py-2 text-white font-medium rounded-full transition-colors"
                >
                  Start predicting <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
              <Image
                  src="/images/Feature2.png"
                  alt="Team Builder"
                  width={500}
                  height={300}
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="space-y-6">
              <div>
              <div className="flex items-center space-x-2 text-[#070A11] text-sm">
                  <Calendar color="#800000" strokeWidth={2.5} /> Time management
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Join Leagues & climb Rankings
                </h3>
                <p className="text-gray-600 mb-6">
                  Compete in the global league or create private leagues with
                  friends. Track your progress on multiple leaderboards and
                  compete for amazing prizes.
                </p>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center px-6 py-2 text-white font-medium rounded-full transition-colors"
                >
                  Join a league <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
              <Image
                  src="/images/Feature3.png"
                  alt="Team Builder"
                  width={500}
                  height={300}
                />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 text-[#070A11] text-sm">
                  <Calendar color="#800000" strokeWidth={2.5} /> Time management
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Track real life stats
                </h3>
                <p className="text-gray-600 mb-6">
                  Real-time player performance, goals, assists, and fantasy
                  points. Make informed transfer decisions.
                </p>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center px-6 py-2 text-white font-medium rounded-full transition-colors"
                >
                  View all stats <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
              <Image
                  src="/images/Feature4.png"
                  alt="Team Builder"
                  width={500}
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="prizes" className="py-20 bg-[#1A0000] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              $1M Prize Pool
            </h2>
            <p className="text-xl text-red-200">
              Compete for incredible prizes throughout the tournament.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 1st Place */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image src="/images/Gold.png" alt="Gold Trophy" width={40} height={40} className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Ultimate Fantasy11 Champion
              </h3>
              <p className="text-3xl font-bold text-yellow-400 mb-4">
                N1,000,000
              </p>
              <ul className="text-left space-y-2 text-red-100">
                <li className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  AFCON 2025 VIP Experience
                </li>
                <li className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Trophy Collection
                </li>
                <li className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Medal
                </li>
              </ul>
            </div>

            {/* 2nd Place */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20">
              <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image src="/images/Silver.png" alt="Silver Trophy" width={40} height={40} className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Second Place Champion</h3>
              <p className="text-3xl font-bold text-gray-300 mb-4">N750,000</p>
              <ul className="text-left space-y-2 text-red-100">
                <li className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  AFCON 2025 Premium Tickets
                </li>
                <li className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Signed Football
                </li>
                <li className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Medal
                </li>
              </ul>
            </div>

            {/* 3rd Place */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20">
              <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image src="/images/Bronze.png" alt="Bronze Trophy" width={40} height={40} className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Third Place Champion</h3>
              <p className="text-3xl font-bold text-amber-400 mb-4">N500,000</p>
              <ul className="text-left space-y-2 text-red-100">
                <li className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  AFCON 2025 Standard Tickets
                </li>
                <li className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Team Merchandise
                </li>
                <li className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Medal
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#1A0000] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              AFCON News & Fantasy Tips
            </h2>
            <p className="text-red-200 text-lg">
              Get the latest updates, expert analysis, and winning strategies to
              dominate your fantasy league this season.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((item) => (
              <Link
                key={item}
                href="/news"
                className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-colors border border-white/20"
              >
                <div className="h-48 flex items-center justify-center">
                <Image
                  src="/images/home.png"
                  alt="Team Builder"
                  width={500}
                  height={300}
                />                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    AFCON 2025 Fantasy: Complete Guide to Winning Your League
                  </h3>
                  <p className="text-red-100 text-sm mb-4">
                    Everything you need to know about dominating your fantasy
                    league this season.
                  </p>
                  <div className="flex items-center text-sm text-red-200">
                    <span>1 hour ago</span>
                    <span className="mx-2">•</span>
                    <span>12 min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/news"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-red-900 font-medium rounded-lg transition-colors"
            >
              View all news and tips <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg">
              Got questions? We&apos;ve got answers. Check out our comprehensive
              FAQ section.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "About AFCON 2026 Fantasy?",
                answer:
                  "AFCON 2026 Fantasy is a fantasy football platform where you can build your dream team, make predictions, and compete for amazing prizes during the African Cup of Nations tournament.",
              },
              {
                question: "How do I join a league?",
                answer:
                  "You can join the global league automatically when you create your team, or create/join private leagues with friends using a league code.",
              },
              {
                question: "Can I create my own league?",
                answer:
                  "Yes! You can create your own private league and invite friends to join. Share the league code with them to get started.",
              },
              {
                question: "Why can't I select a player?",
                answer:
                  "Players may be unavailable due to budget constraints, position limits, or if they're already in your team. Check your budget and team composition.",
              },
              {
                question: "About the Prize Pool?",
                answer:
                  "We have a $1M prize pool with cash prizes, VIP experiences, tickets, and exclusive merchandise for top performers throughout the tournament.",
              },
              {
                question: "How do I win?",
                answer:
                  "Win by earning the most points through your team's performance, accurate predictions, and strategic decisions. Climb the leaderboards to claim prizes!",
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="bg-gray-50 rounded-lg p-6 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <summary className="font-semibold text-gray-900 text-lg list-none flex items-center justify-between">
                  <span>{faq.question}</span>
                  <span className="text-green-600 text-2xl font-light">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/home.png)" }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to Dominate?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join millions of fans competing in Africa&apos;s biggest fantasy
            football game.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors mb-4"
          >
            Sign Up Now
          </Link>
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-green-400 hover:text-green-300 underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/Logo.png"
                  alt="Fantasyfi Logo"
                  width={140}
                  height={56}
                  className="object-contain h-10 w-auto"
                />
              </Link>
            </div>
            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/support"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Support
              </Link>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Fantasyfi. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
