import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ContestCarousel = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchContests();
  }, []);

  useEffect(() => {
    if (contests.length > 1 && !loading) {
      startAutoRotate();
    }
    return () => clearTimeout(timerRef.current);
  }, [contests, currentIndex, loading, activeTab]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  const getNextDay = (dayOfWeek, hour, minute) => {
    const now = new Date();
    const result = new Date();
    const currentDay = now.getDay();
    let daysUntil = (dayOfWeek - currentDay + 7) % 7;

    if (daysUntil === 0) {
      const target = new Date();
      target.setHours(hour, minute, 0, 0);
      if (now >= target) daysUntil = 7;
    }

    result.setDate(now.getDate() + daysUntil);
    result.setHours(hour, minute, 0, 0);
    return result;
  };

  const generateContests = () => {
    const now = new Date();
    const leetcode = getNextDay(0, 8, 0);
    const atcoder = getNextDay(6, 17, 30);
    const codechef = getNextDay(3, 20, 0);
    const hackerrank = getNextDay(5, 19, 0);
    const cf1 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    cf1.setHours(20, 35, 0, 0);

    return [
      {
        id: "cf-1",
        name: "Codeforces Round #835 (Div. 2)",
        platform: "Codeforces",
        date: new Intl.DateTimeFormat("en-GB").format(cf1),
        time: new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).format(cf1),
        duration: "2h 15m",
        url: "https://codeforces.com/contests",
      },
      {
        id: "lc",
        name: "LeetCode Weekly Contest",
        platform: "LeetCode",
        date: new Intl.DateTimeFormat("en-GB").format(leetcode),
        time: new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).format(leetcode),
        duration: "1h 30m",
        url: "https://leetcode.com/contest/",
      },
      {
        id: "ac",
        name: "AtCoder Beginner Contest",
        platform: "AtCoder",
        date: new Intl.DateTimeFormat("en-GB").format(atcoder),
        time: new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).format(atcoder),
        duration: "1h 40m",
        url: "https://atcoder.jp/contests/",
      },
      {
        id: "cc",
        name: "CodeChef Starters",
        platform: "CodeChef",
        date: new Intl.DateTimeFormat("en-GB").format(codechef),
        time: new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).format(codechef),
        duration: "3h 0m",
        url: "https://www.codechef.com/contests",
      },
      {
        id: "hr",
        name: "HackerRank Weekly Challenge",
        platform: "HackerRank",
        date: new Intl.DateTimeFormat("en-GB").format(hackerrank),
        time: new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).format(hackerrank),
        duration: "48h 0m",
        url: "https://www.hackerrank.com/contests",
      },
    ];
  };

  const fetchContests = async () => {
    const placeholder = generateContests();
    setContests(placeholder);
    setLoading(false);
  };

  const startAutoRotate = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const filtered = activeTab === "all" ? contests : contests.filter(c => c.platform.toLowerCase() === activeTab.toLowerCase());
      if (filtered.length > 1) {
        setDirection(1);
        setCurrentIndex(prev => prev === filtered.length - 1 ? 0 : prev + 1);
      }
    }, 5000);
  };

  const handlePrev = () => {
    clearTimeout(timerRef.current);
    const filtered = activeTab === "all" ? contests : contests.filter(c => c.platform.toLowerCase() === activeTab.toLowerCase());
    if (filtered.length > 1) {
      setDirection(-1);
      setCurrentIndex(prev => prev === 0 ? filtered.length - 1 : prev - 1);
    }
  };

  const handleNext = () => {
    clearTimeout(timerRef.current);
    const filtered = activeTab === "all" ? contests : contests.filter(c => c.platform.toLowerCase() === activeTab.toLowerCase());
    if (filtered.length > 1) {
      setDirection(1);
      setCurrentIndex(prev => prev === filtered.length - 1 ? 0 : prev + 1);
    }
  };

  const getPlatformColor = (platform) => {
    const colors = {
      codeforces: "bg-red-500",
      leetcode: "bg-yellow-500",
      codechef: "bg-green-500",
      atcoder: "bg-blue-500",
      hackerrank: "bg-purple-500",
    };
    return colors[platform?.toLowerCase()] || "bg-blue-500";
  };

  const filtered = activeTab === "all" ? contests : contests.filter(c => c.platform.toLowerCase() === activeTab.toLowerCase());

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: (direction) => ({ x: direction > 0 ? -1000 : 1000, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                CP
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CodePrep<span className="text-blue-600">Pro</span></h1>
                <p className="text-sm text-gray-600">Empowering Student Success</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <span className="text-sm text-gray-600">Trusted by 50K+ Students</span>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Partner with Us
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            className="text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Upcoming <span className="text-blue-600">Coding Contests</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Connecting talented students with top-tier companies through competitive programming excellence
          </motion.p>
          
          
        </div>

        <div className="mb-8 flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "all" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border hover:border-blue-600"
            }`}
          >
            All Platforms
          </button>
          {["LeetCode", "Codeforces", "CodeChef", "AtCoder", "HackerRank"].map(platform => (
            <button
              key={platform}
              onClick={() => setActiveTab(platform)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab.toLowerCase() === platform.toLowerCase() ? "bg-blue-500 text-white" : "bg-white text-gray-700 border hover:border-blue-600"
              }`}
            >
              {platform}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-6 text-lg text-gray-600">Loading contests...</p>
          </div>
        ) : (
          <div className="relative max-w-4xl mx-auto">
            {filtered.length > 0 ? (
              <div className="relative h-96 flex items-center">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute w-full"
                  >
                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                      <div className="absolute top-3 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                        🔴 LIVE
                      </div>
                      
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{filtered[currentIndex]?.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">👥 12.5K+ Registered</span>
                            <span className="flex items-center">🏆 $50K Prize Pool</span>
                          </div>
                        </div>
                        <span className={`px-4 py-2 text-white text-sm font-bold rounded-full shadow-lg ${getPlatformColor(filtered[currentIndex]?.platform)}`}>
                          {filtered[currentIndex]?.platform}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">📅</div>
                            <div>
                              <p className="text-sm text-gray-500">Date</p>
                              <p className="font-semibold">{filtered[currentIndex]?.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">🕐</div>
                            <div>
                              <p className="text-sm text-gray-500">Time</p>
                              <p className="font-semibold">{filtered[currentIndex]?.time}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">⏱️</div>
                            <div>
                              <p className="text-sm text-gray-500">Duration</p>
                              <p className="font-semibold">{filtered[currentIndex]?.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">✅</div>
                            <div>
                              <p className="text-sm text-gray-500">Status</p>
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                <p className="font-semibold">Upcoming</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center space-x-4">
                        <a
                          href={filtered[currentIndex]?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
                        >
                          🚀 Register Now
                        </a>
                        <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                          📅 Add to Calendar
                        </button>
                      </div>

                      <div className="flex justify-center mt-6 gap-2">
                        {filtered.map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i === currentIndex ? "bg-blue-600" : "bg-gray-300"}`}></div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {filtered.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border hover:scale-110 transition-transform z-10"
                    >
                      ←
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border hover:scale-110 transition-transform z-10"
                    >
                      →
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border">
                <p className="text-xl font-semibold mb-2">No contests found for {activeTab}</p>
                <p className="text-gray-600">Try selecting another platform</p>
              </div>
            )}
          </div>
        )}

        
      </div>
    </div>
  );
};

export default ContestCarousel;