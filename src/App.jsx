import React, { useState, useEffect, useRef } from 'react';
import { Newspaper, Menu, Search, TrendingUp, Clock, Share2, AlertCircle } from 'lucide-react';
import prankAudioFile from './assets/prank.mp3';

// Reliable backup news in case API fails
const FALLBACK_NEWS = [
  {
    title: "SpaceX Starship Successfully Catches Booster",
    source: { name: "TechCrunch" },
    urlToImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800",
    description: "In a historic achievement, SpaceX has successfully caught the Super Heavy booster using the launch tower's mechanical arms.",
    publishedAt: "2024-10-15T14:30:00Z"
  },
  {
    title: "Quantum Processor Achieves New Milestone",
    source: { name: "The Verge" },
    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    description: "The latest quantum chip demonstrates coherence times that surpass previous records, paving the way for scalable quantum computing.",
    publishedAt: "2024-10-14T09:15:00Z"
  },
  {
    title: "Global Summit on Climate Action Begins",
    source: { name: "Reuters" },
    urlToImage: "https://images.unsplash.com/photo-1569163139599-0f4517e36b51?auto=format&fit=crop&q=80&w=800",
    description: "World leaders gather to discuss urgent measures to combat rising global temperatures and transitioning to green energy.",
    publishedAt: "2024-10-13T11:00:00Z"
  },
  {
    title: "Revolutionary Battery Tech Promises 1000 Mile Range",
    source: { name: "Wired" },
    urlToImage: "https://images.unsplash.com/photo-1619641473202-0e2410712282?auto=format&fit=crop&q=80&w=800",
    description: "A new solid-state battery prototype has been unveiled, potentially solving range anxiety for electric vehicles forever.",
    publishedAt: "2024-10-15T16:45:00Z"
  },
  {
    title: "Stock Markets Hit Record Highs Amidst Tech Boom",
    source: { name: "Bloomberg" },
    urlToImage: "https://images.unsplash.com/photo-1611974765215-fadbf09d38fa?auto=format&fit=crop&q=80&w=800",
    description: "Major indices rally as investors pour capital into emerging cybersecurity and semiconductor sectors.",
    publishedAt: "2024-10-12T10:30:00Z"
  }
];

function App() {
  const [prankActive, setPrankActive] = useState(false);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  // Fetch News
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/technology/us.json');
        const data = await response.json();
        let articles = data.articles.filter(a => a.urlToImage);

        articles = articles.sort(() => Math.random() - 0.5);

        if (articles.length < 5) {
          articles = [...articles, ...FALLBACK_NEWS];
        }

        setNews(articles.slice(0, 10));
      } catch (error) {
        console.error("News fetch failed, using fallback", error);
        setNews(FALLBACK_NEWS.sort(() => Math.random() - 0.5));
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const triggerPrank = (e) => {
    if (e) e.preventDefault();
    if (prankActive) return;
    setPrankActive(true);

    if (audioRef.current) {
      audioRef.current.volume = 1.0;
      audioRef.current.currentTime = 13;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => console.log("Fullscreen denied:", err));
    }
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (!prankActive) {
        triggerPrank(e);
      }
    };
    window.addEventListener('click', handleClick, { capture: true });
    return () => window.removeEventListener('click', handleClick, { capture: true });
  }, [prankActive]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const heroNews = news[0] || FALLBACK_NEWS[0];
  const sideNews = news.slice(1, 5);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${prankActive ? 'prank-mode' : 'bg-slate-50 text-slate-900'}`}>
      <audio ref={audioRef} src={prankAudioFile} loop />

      {/* Header */}
      <header className={`sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-colors duration-300 ${prankActive ? 'bg-red-600' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:text-blue-600" />
              <div className="flex items-center gap-1 sm:gap-2">
                <Newspaper className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                <span className="text-lg sm:text-xl font-bold tracking-tight">GlobalPulse</span>
              </div>
            </div>

            <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
              {['World', 'Politics', 'Tech', 'Science', 'Health'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-blue-600 transition-colors">
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-4 text-gray-600">
              <Search className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              <button className="hidden xs:block bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Breaking News Banner */}
        <div className="bg-white border-l-4 border-blue-600 p-3 sm:p-4 mb-6 sm:mb-8 flex items-center justify-between shadow-sm rounded-r-lg overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded animate-pulse shrink-0">LIVE</span>
            <p className="font-medium text-slate-700 text-xs sm:text-sm md:text-base truncate">{heroNews.title}</p>
          </div>
          <Share2 className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-pointer shrink-0 ml-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Hero Article */}
            <article className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl aspect-video mb-3 sm:mb-4 shadow-md">
                <img
                  src={heroNews.urlToImage}
                  alt={heroNews.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.target.src = FALLBACK_NEWS[0].urlToImage }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-600 shadow-sm">
                  {heroNews.source?.name || "Top Story"}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 md:line-clamp-none">
                {heroNews.title}
              </h1>
              <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 text-sm sm:text-lg">{heroNews.description}</p>
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <span className="font-medium text-blue-600">{heroNews.source?.name}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {heroNews.publishedAt ? new Date(heroNews.publishedAt).toLocaleDateString() : 'Just now'}
                </div>
              </div>
            </article>

            {/* Sub Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {sideNews.map((article, index) => (
                <article key={index} className="group cursor-pointer flex flex-col h-full border-b border-gray-100 pb-6 md:border-0 md:pb-0">
                  <div className="overflow-hidden rounded-lg sm:rounded-xl aspect-[3/2] mb-3 shadow-sm">
                    <img
                      src={article?.urlToImage}
                      alt={article?.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = FALLBACK_NEWS[index % FALLBACK_NEWS.length].urlToImage }}
                    />
                  </div>
                  <span className="text-blue-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2">{article?.source?.name}</span>
                  <h3 className="text-base sm:text-xl font-bold mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{article?.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3 flex-grow">{article?.description}</p>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 mt-auto">
                    <Clock className="w-3 h-3" />
                    {article?.publishedAt ? new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 sm:space-y-8 mt-4 lg:mt-0">
            <div className="bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 shadow-lg">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-base sm:text-lg">Trending Now</h2>
              </div>
              <div className="space-y-5 sm:space-y-6">
                {news.slice(5, 10).map((article, i) => (
                  <div key={i} className="group cursor-pointer flex gap-3 sm:gap-4 items-start">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-200 group-hover:text-blue-600 transition-colors">0{i + 1}</span>
                    <div>
                      <h4 className="font-bold text-gray-800 text-xs sm:text-sm mb-0.5 sm:1 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article?.title}
                      </h4>
                      <span className="text-[10px] sm:text-xs text-gray-400">{article?.source?.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500 rounded-full blur-3xl opacity-20 transform translate-x-10 -translate-y-10"></div>
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mb-3 sm:mb-4" />
              <h3 className="font-bold text-lg sm:text-xl mb-1.5 sm:mb-2">Subscribe to Premium</h3>
              <p className="text-slate-300 text-xs sm:text-sm mb-5 sm:mb-6 leading-relaxed">Get unlimited access to exclusive content, in-depth analysis, and ad-free browsing.</p>
              <button className="w-full bg-blue-500 hover:bg-blue-400 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg hover:shadow-blue-500/25">
                Start Free Trial
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-12 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-[10px] sm:text-sm">&copy; 2024 GlobalPulse News. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
