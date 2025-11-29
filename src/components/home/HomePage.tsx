'use client';

import Link from 'next/link';
import { Users, Target, DollarSign, Crown, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useBlogPosts } from '@/lib/api';
import { BlogPostListItem } from '@/types/news';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatReadingTime = (minutes: number): string => {
  return `${minutes} min read`;
};

export default function HomePage() {
  const { user } = useAuth();
  const userName =
    user?.fullName ||
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.lastName || user?.email?.split('@')[0] || 'User');

  // Fetch latest news posts
  const { data: newsData } = useBlogPosts({ status: 'published', limit: 4 });
  const newsArticles = newsData?.items || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-lg text-gray-600">
            Ready to dominate AFCON 2025?
          </p>
        </div>

        {/* Gameweek Info Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-4 border-b border-gray-200">
          <span className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium">
            Gameweek 1
          </span>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">2 days left</span>
          </div>
          <Link
            href="/ranking"
            className="px-4 py-2 border-2 border-green-600 text-green-600 rounded-full text-sm font-medium hover:bg-green-600 hover:text-white transition-colors"
          >
            Top 11
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-full -mr-12 -mt-12 opacity-20"></div>
            <Users className="w-8 h-8 text-red-600 mb-4 relative z-10" />
            <p className="text-sm text-gray-600 mb-1">My Team</p>
            <p className="text-xs text-gray-500 mb-2">Players selected</p>
            <p className="text-2xl font-bold text-red-600">8/11</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-full -mr-12 -mt-12 opacity-20"></div>
            <Target className="w-8 h-8 text-red-600 mb-4 relative z-10" />
            <p className="text-sm text-gray-600 mb-1">Points</p>
            <p className="text-xs text-gray-500 mb-2">Total points</p>
            <p className="text-2xl font-bold text-red-600">247 pts</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-full -mr-12 -mt-12 opacity-20"></div>
            <Image src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764265435/Prize_pbqxgu.png" alt="Trophy" width={32} height={32} className="w-8 h-8 mb-4 relative z-10" />
            <p className="text-sm text-gray-600 mb-1">Rank</p>
            <p className="text-xs text-gray-500 mb-2">Global Ranking</p>
            <p className="text-2xl font-bold text-red-600">1,247</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-full -mr-12 -mt-12 opacity-20"></div>
            <DollarSign className="w-8 h-8 text-red-600 mb-4 relative z-10" />
            <p className="text-sm text-gray-600 mb-1">Budget</p>
            <p className="text-xs text-gray-500 mb-2">Remaining</p>
            <p className="text-2xl font-bold text-red-600">$15.5M</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Matches */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Upcoming Matches
              </h2>
              <p className="text-gray-600 mb-6">Next fixtures in AFCON 2025</p>
              
              <div className="space-y-4">
                {[
                  { home: 'Nigeria', away: 'Burundi', time: 'Today, 8:00 PM', status: 'LIVE', date: null },
                  { home: 'Nigeria', away: 'Burundi', time: '6:00 PM', status: null, date: 'Dec 21' },
                  { home: 'Nigeria', away: 'Burundi', time: '7:00 PM', status: null, date: 'Dec 21' },
                  { home: 'Nigeria', away: 'Burundi', time: '7:00 PM', status: null, date: 'Dec 21' },
                ].map((match, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          N
                        </div>
                        <span className="font-medium text-gray-900">{match.home}</span>
                      </div>
                      <span className="text-gray-500">VS</span>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          B
                        </div>
                        <span className="font-medium text-gray-900">{match.away}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">MD 1 • {match.time}</span>
                      {match.status === 'LIVE' ? (
                        <span className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                          LIVE
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
                          {match.date}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Play */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                How to Play
              </h2>
              
              <div className="space-y-4 mb-6">
                {[
                  { title: 'Create your Team', desc: 'Select 11 players within $100M budget' },
                  { title: 'Make Predictions', desc: 'Predict match outcomes and tournament winner' },
                  { title: 'Join Leagues', desc: 'Compete with friends or globally' },
                  { title: 'Win Prizes', desc: 'Earn points and climb the rankings' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                <Link
                  href="/predictor"
                  className="flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  Make Predictions <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <span className="text-gray-300">→</span>
                <Link
                  href="/prizes"
                  className="flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  Upcoming Prizes <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <span className="text-gray-300">→</span>
                <Link
                  href="/my-team"
                  className="flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  Create a Team <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <span className="text-gray-300">→</span>
                <Link
                  href="/league"
                  className="flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  Join a League <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Win Throughout Season */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Win throughout season
              </h2>
              
              <div className="space-y-4">
                {[
                  { icon: 'trophy', title: 'Game week Winner', subtitle: 'Week 3', points: '+50pts' },
                  { icon: 'target', title: 'Perfect Prediction', subtitle: 'Nigeria vs Egypt', points: '+25pts' },
                  { icon: 'crown', title: 'Top 1000', subtitle: 'Global ranking', badge: 'Achieved' },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {achievement.icon === 'trophy' ? (
                        <Image src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764265435/Prize_pbqxgu.png" alt="Trophy" width={24} height={24} className="w-6 h-6" />
                      ) : achievement.icon === 'target' ? (
                        <Target className="w-6 h-6 text-red-600" />
                      ) : (
                        <Crown className="w-6 h-6 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{achievement.title}</p>
                        <p className="text-sm text-gray-600">{achievement.subtitle}</p>
                      </div>
                    </div>
                    {achievement.points && (
                      <span className="text-red-600 font-semibold">{achievement.points}</span>
                    )}
                    {achievement.badge && (
                      <span className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                        {achievement.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <Link
                href="/predictor"
                className="mt-6 w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Make a Prediction
              </Link>
            </div>

            {/* Team Updates */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Team updates
              </h2>
              <p className="text-gray-600 mb-6 text-sm">Recent changes and notifications</p>
              
              <div className="space-y-4">
                {[
                  { message: 'Mohamed Salah scored 12 points', time: '2 hours ago' },
                  { message: 'You transferred in Sadio Mané', time: '1 day ago' },
                  { message: 'Your rank improved by 523 points', time: '3 days ago' },
                ].map((update, index) => (
                  <div key={index} className="pb-4 border-b border-gray-200 last:border-0">
                    <p className="text-sm text-gray-900 mb-1">{update.message}</p>
                    <p className="text-xs text-gray-500">{update.time}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/league"
                className="mt-6 w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Join a League
              </Link>
            </div>

            {/* Top 5 Players */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Current Top 5 Players
              </h2>
              
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Mohammed Salah', country: 'Egypt', position: 'FWD', points: 156, isCrown: true },
                  { rank: 2, name: 'Sadio Mané', country: 'Senegal', value: '$12.5M', points: 142 },
                  { rank: 3, name: 'Sadio Mané', country: 'Senegal', value: '$12.5M', points: 142 },
                  { rank: 4, name: 'Sadio Mané', country: 'Senegal', value: '$12.5M', points: 142 },
                  { rank: 5, name: 'Sadio Mané', country: 'Senegal', value: '$12.5M', points: 142 },
                ].map((player) => (
                  <div
                    key={player.rank}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {player.isCrown ? (
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                          <Crown className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{player.rank}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{player.name}</p>
                        <p className="text-xs text-gray-600">
                          {player.country} • {player.position || player.value}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-full">
                      {player.points}pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Latest News */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
            <Link
              href="/news"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              See all
            </Link>
          </div>

          {newsArticles.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-6">
              {newsArticles.map((article: BlogPostListItem) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group"
                >
                  <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 rounded-lg mb-3 flex items-center justify-center group-hover:opacity-90 transition-opacity overflow-hidden relative">
                    {article.coverImageUrl ? (
                      <Image
                        src={article.coverImageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                        unoptimized
                        priority
                      />
                    ) : (
                      <span className="text-white text-4xl">⚽</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{formatDate(article.createdAt)}</span>
                    <span className="mx-2">•</span>
                    <span>{formatReadingTime(article.readingTimeMinutes)}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No news articles available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

