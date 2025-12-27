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
    console.log("GlobalPulse News V2.1 Initialized");
    const fetchNews = async () => {
      try {
        // Using Saurav.tech as a proxy for free news data (Tech category)
        const response = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/technology/us.json');
        const data = await response.json();
        let articles = data.articles.filter(a => a.urlToImage); // Only keeping ones with images

        // Randomize
        articles = articles.sort(() => Math.random() - 0.5);

        // If too few, fill with fallback
        if (articles.length < 5) {
          articles = [...articles, ...FALLBACK_NEWS];
        }

        setNews(articles.slice(0, 10)); // Keep top 10
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
    // Prevent default navigation
    if (e) e.preventDefault();

    if (prankActive) return;
    setPrankActive(true);

    console.log("PRANK TRIGGERED - STARTING AUDIO AT 13s");

    // Play Local Audio
    if (audioRef.current) {
      audioRef.current.volume = 1.0;
      audioRef.current.currentTime = 13; // Set to 13 seconds as requested
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }

    // Fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => console.log("Fullscreen denied:", err));
    }
  };

  // Global click hijacker
  useEffect(() => {
    const handleClick = (e) => {
      if (!prankActive) {
        // If clicking anywhere, trigger the prank
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
      {/* Audio Element */}
      <audio ref={audioRef} src={prankAudioFile} loop />

      {/* Header */}
      <header className={`sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 ${prankActive ? 'bg-red-600' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Menu className="w-6 h-6 cursor-pointer hover:text-blue-600" />
              <div className="flex items-center gap-2">
                <Newspaper className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold tracking-tight">GlobalPulse</span>
              </div>
            </div>

            <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
              {['World', 'Politics', 'Tech', 'Science', 'Health'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-blue-600 transition-colors">
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4 text-gray-600">
              <Search className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breaking News Banner */}
        <div className="bg-white border-l-4 border-blue-600 p-4 mb-8 flex items-center justify-between shadow-sm rounded-r-lg">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">LIVE</span>
            <p className="font-medium text-slate-700">{heroNews.title}</p>
          </div>
          <Share2 className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-pointer" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Source */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Article */}
            <article className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl aspect-video mb-4 shadow-md">
                <img
                  src={heroNews.urlToImage}
                  alt={heroNews.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.target.src = FALLBACK_NEWS[0].urlToImage }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-600 shadow-sm">
                  {heroNews.source?.name || "Top Story"}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-3 leading-tight group-hover:text-blue-600 transition-colors">{heroNews.title}</h1>
              <p className="text-gray-600 mb-4 line-clamp-3 text-lg">{heroNews.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="font-medium text-blue-600">{heroNews.source?.name}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {heroNews.publishedAt ? new Date(heroNews.publishedAt).toLocaleDateString() : 'Just now'}
                </div>
              </div>
            </article>

            {/* Sub Articles Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {sideNews.map((article, index) => (
                <article key={index} className="group cursor-pointer flex flex-col h-full">
                  <div className="overflow-hidden rounded-xl aspect-[3/2] mb-3 shadow-sm">
                    <img
                      src={article?.urlToImage}
                      alt={article?.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = FALLBACK_NEWS[index % FALLBACK_NEWS.length].urlToImage }}
                    />
                  </div>
                  <span className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">{article?.source?.name}</span>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{article?.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-grow">{article?.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-auto">
                    <Clock className="w-3 h-3" />
                    {article?.publishedAt ? new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-lg">Trending Now</h2>
              </div>
              <div className="space-y-6">
                {news.slice(5, 10).map((article, i) => (
                  <div key={i} className="group cursor-pointer flex gap-4 items-start">
                    <span className="text-3xl font-bold text-gray-200 group-hover:text-blue-600 transition-colors">0{i + 1}</span>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article?.title}
                      </h4>
                      <span className="text-xs text-gray-400">{article?.source?.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 transform translate-x-10 -translate-y-10"></div>
              <AlertCircle className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="font-bold text-xl mb-2">Subscribe to Premium</h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">Get unlimited access to exclusive content, in-depth analysis, and ad-free browsing.</p>
              <button className="w-full bg-blue-500 hover:bg-blue-400 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-blue-500/25">
                Start Free Trial
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">&copy; 2024 GlobalPulse News. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
