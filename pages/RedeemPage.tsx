import React, { useState, useContext, useEffect } from 'react';
import Confetti from 'react-confetti';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { UserContext } from '../contexts/UserContext';
import PerkCard from '../components/PerkCard';

type Perk = {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ElementType;
  category: 'Premium' | 'Mentorship' | 'Exam' | 'Daily' | 'Mystery';
};

const ALL_PERKS: Perk[] = [
  // Premium
  { id: 'premium-1', name: 'Premium Scheme Access', description: 'Unlock detailed guides & calculators.', price: 60, icon: () => <>🏆</>, category: 'Premium' },
  { id: 'premium-2', name: 'Exclusive Webinar', description: 'Attend govt strategy sessions.', price: 50, icon: () => <>🎤</>, category: 'Premium' },
  { id: 'premium-3', name: 'Monthly Masterclass', description: 'Webinar with expert panel.', price: 70, icon: () => <>🎓</>, category: 'Premium' },

  // Mentorship
  { id: 'mentorship-1', name: '1-on-1 Mentor Call', description: 'Talk to a verified expert.', price: 40, icon: () => <>📞</>, category: 'Mentorship' },
  { id: 'mentorship-2', name: 'Resume Review', description: 'Get resume feedback.', price: 30, icon: () => <>📝</>, category: 'Mentorship' },
  { id: 'mentorship-3', name: 'Mock Interview', description: 'Practice for govt job interview.', price: 35, icon: () => <>🎯</>, category: 'Mentorship' },

  // Exam
  { id: 'exam-1', name: 'Exam Prep Kit', description: 'Practice materials & tips.', price: 25, icon: () => <>📚</>, category: 'Exam' },
  { id: 'exam-2', name: 'Current Affairs Digest', description: 'Monthly e-mag for competitive exams.', price: 15, icon: () => <>📰</>, category: 'Exam' },
  { id: 'exam-3', name: 'Solved PYQs', description: 'Past paper solutions.', price: 20, icon: () => <>📄</>, category: 'Exam' },

  // Daily
  { id: 'daily-1', name: 'Daily Scheme Tip', description: 'Quick daily scheme tips.', price: 5, icon: () => <>📅</>, category: 'Daily' },
  { id: 'daily-2', name: 'Token Booster (Video)', description: 'Watch a 30s video for 10 tokens.', price: 0, icon: () => <>🎥</>, category: 'Daily' },
  { id: 'daily-3', name: 'Badge of Supporter', description: 'Special badge for engagement.', price: 5, icon: () => <>🏅</>, category: 'Daily' },

  // Mystery
  { id: 'mystery-1', name: '🎁 Mystery Box', description: 'Unlock a surprise reward!', price: 10, icon: () => <>🎁</>, category: 'Mystery' },
  { id: 'mystery-2', name: 'Secret Scheme Reveal', description: 'Unlock hidden high-benefit scheme.', price: 15, icon: () => <>🔍</>, category: 'Mystery' },
  { id: 'mystery-3', name: 'Lucky Spin', description: 'Try your luck for tokens or perks.', price: 20, icon: () => <>🎡</>, category: 'Mystery' },
];


const CATEGORIES: (Perk['category'] | 'All')[] = ['All', 'Premium', 'Mentorship', 'Exam', 'Daily', 'Mystery'];

const RedeemPage: React.FC = () => {
  const { tokenBalance, deductTokens, setTokenBalance } = useContext(UserContext);
  const [selectedCategory, setSelectedCategory] = useState<'All' | Perk['category']>('All');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [watched, setWatched] = useState(false);
  const [nextWatchTime, setNextWatchTime] = useState<number | null>(null);

  useEffect(() => {
    const lastTime = localStorage.getItem('lastAdWatched');
    if (lastTime) {
      const last = parseInt(lastTime, 10);
      const now = Date.now();
      const elapsed = now - last;
      if (elapsed < 8 * 60 * 60 * 1000) {
        setWatched(true);
        setNextWatchTime(last + 8 * 60 * 60 * 1000);
      }
    }
  }, []);

  const getTimeLeft = () => {
    if (!nextWatchTime) return '';
    const ms = nextWatchTime - Date.now();
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${h}h ${m}m remaining`;
  };

  const handleRedeem = (id: string, price: number) => {
    if (deductTokens(price)) {
      const perk = ALL_PERKS.find(p => p.id === id);
      setNotification({ message: `🎉 Redeemed "${perk?.name}"!`, type: 'success' });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setNotification({ message: `❌ Not enough tokens.`, type: 'error' });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAdComplete = () => {
    if (!watched) {
      const reward = Math.floor(Math.random() * 6) + 5; // 5-10
      setTokenBalance(tokenBalance + reward);
      const now = Date.now();
      localStorage.setItem('lastAdWatched', now.toString());
      setWatched(true);
      setNextWatchTime(now + 8 * 60 * 60 * 1000);
      setNotification({ message: `🎁 You earned ${reward} tokens!`, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const filtered = selectedCategory === 'All'
    ? ALL_PERKS
    : ALL_PERKS.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen px-6 py-12" style={{ backgroundColor: '#fff6f7' }}>
      {showConfetti && <Confetti />}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-red-700">Redeem Your Tokens</h1>
        <p className="text-gray-700 mt-2">Balance: <strong>{tokenBalance}</strong> tokens</p>
      </div>

      {notification && (
        <div className={`max-w-lg mx-auto mb-6 p-4 rounded shadow-md flex items-center space-x-2 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.type === 'success'
            ? <CheckCircleIcon className="w-6 text-green-500" />
            : <XCircleIcon className="w-6 text-red-500" />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border font-semibold transition ${
              selectedCategory === cat
                ? 'bg-red-600 text-white'
                : 'bg-white text-red-600 hover:bg-red-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filtered.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No perks in this category.</p>
        ) : (
          filtered.map(perk => (
            <PerkCard
              key={perk.id}
              perk={perk}
              userTokens={tokenBalance}
              onRedeem={handleRedeem}
            />
          ))
        )}
      </div>

      {/* 🎥 Watch Ad to Earn Tokens Section */}
      <div className="max-w-3xl mx-auto mt-12 bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-red-300 shadow-[0_5px_15px_rgba(220,38,38,0.5)]">
        <h2 className="text-2xl font-bold text-red-700 mb-4">🎥 Watch Ad & Earn Tokens</h2>

        {!watched ? (
          <>
            <video
              width="100%"
              height="auto"
              controls
              onEnded={handleAdComplete}
              className="rounded-md border"
            >
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="text-sm text-gray-600 mt-2">
              Watch the full video to earn between 5–10 tokens!
            </p>
          </>
        ) : (
          <p className="text-green-600 font-semibold mt-2">
            ✅ You’ve already earned tokens from the ad. <br />
            ⏳ {getTimeLeft()}
          </p>
        )}
      </div>
    </div>
  );
};

export default RedeemPage;
