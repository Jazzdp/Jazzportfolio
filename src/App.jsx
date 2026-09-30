import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, ExternalLink, Github, Volume2, VolumeX,
  Search, ChevronLeft, ChevronRight as ChevronRightIcon,
  User, Mail, Grid, Heart, Code2, X,
  Sparkles, Briefcase, Info, Music, Award, MapPin, GraduationCap, Languages,
  Linkedin, Instagram
} from 'lucide-react';

// ---------- helpers ----------
const parseDuration = (d) => {
  if (!d || !d.includes(':')) return 0;
  const [m, s] = d.split(':').map(Number);
  return (m || 0) * 60 + (s || 0);
};

const fmt = (s) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

// Animated "now playing" bars
function EqBars() {
  return (
    <span className="inline-flex items-end gap-[2px] h-3.5">
      <span className="eq-bar" style={{ animationDelay: '0ms' }} />
      <span className="eq-bar" style={{ animationDelay: '160ms' }} />
      <span className="eq-bar" style={{ animationDelay: '320ms' }} />
    </span>
  );
}

// Shared row used by playlists + search results
function TrackRow({ idx, cover, title, subtitle, right, active, playing, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between gap-4 p-3 rounded-lg cursor-pointer border transition-colors ${
        active ? 'bg-[#2a2a2a] border-[#fa243c]/70' : 'bg-[#1d1d1d] border-transparent hover:bg-[#282828]'
      }`}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <span className="w-6 flex justify-center flex-shrink-0">
          {active && playing ? (
            <EqBars />
          ) : (
            <>
              <span className="text-sm text-gray-500 group-hover:hidden">{idx + 1}</span>
              <Play className="hidden group-hover:block h-3.5 w-3.5 text-white fill-current" />
            </>
          )}
        </span>
        <div className="h-10 w-10 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0 text-lg bg-[#282828]">
          {cover}
        </div>
        <div className="min-w-0">
          <h4 className={`text-sm font-semibold truncate ${active ? 'text-[#fa243c]' : ''}`}>{title}</h4>
          <p className="text-xs text-gray-400 truncate">{subtitle}</p>
        </div>
      </div>
      <div className="flex-shrink-0 text-xs text-gray-500">{right}</div>
    </div>
  );
}

// Editorial "Station" card — the new hobbies presentation
function StationCard({ station, active, playing, onClick, className = '' }) {
  return (
    <div
      onClick={onClick}
      className={`group relative h-56 rounded-xl overflow-hidden cursor-pointer bg-gradient-to-br ${station.gradient} shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        active ? 'ring-2 ring-[#fa243c] ring-offset-2 ring-offset-[#121212]' : ''
      } ${className}`}
    >
      {/* optional photo layer — add image: '/covers/chess.jpg' to any station later */}
      {station.image && <img src={station.image} alt="" className="absolute inset-0 h-full w-full object-cover" />}
      {/* giant watermark glyph */}
      <span className={`absolute -right-2 -bottom-7 text-[7.5rem] leading-none font-black select-none pointer-events-none text-white/10 ${station.image ? 'opacity-60' : ''}`}>
        {station.glyph}
      </span>
      <span className="absolute top-3 left-3 text-[9px] font-bold tracking-[0.22em] text-white/70">STATION</span>
      {active && playing && (
        <span className="absolute top-3 right-3"><EqBars /></span>
      )}
      <span className="absolute inset-0 flex items-center justify-center text-5xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
        {station.emoji}
      </span>
      <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-black/60 via-black/25 to-transparent">
        <h4 className="text-sm font-bold leading-tight">{station.name}</h4>
        <p className="text-[11px] text-white/75 truncate">{station.tagline}</p>
      </div>
    </div>
  );
}

export default function AppleMusicPortfolio() {
  // ---------- view + history ----------
  const [history, setHistory] = useState([{ tab: 'Listen Now', playlistId: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [currentTab, setCurrentTab] = useState('Listen Now');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ---------- detail panel + playback ----------
  const [selectedItem, setSelectedItem] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [likes, setLikes] = useState({});

  // ---------- simulated player ----------
  const mainRef = useRef(null);
  const [fakeElapsed, setFakeElapsed] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [muted, setMuted] = useState(false);

  // TODO: put your photo in /public and reference it as /pfp.jpg
  const profileImageUrl = '/pfp.jpg';

  const navigationItems = [
    { icon: Sparkles, label: 'Listen Now' },
    { icon: Grid, label: 'Browse Projects' },
    { icon: User, label: 'About & Bio' },
  ];

  // ---------- Projects ----------
  const projects = [
    {
      id: 1,
      title: '6th Sense',
      category: 'Full-Stack / AI',
      tech: 'React • MySQL • Spring Boot • Groq',
      desc: 'A platform connecting users with sellers to personalise fragrances, powered by AI.',
      liveUrl: 'https://front-end-eight-hazel.vercel.app/#/',
      githubUrl: 'https://github.com/Jazzdp/6thsenseDemo',
      highlights: [
        'AI-powered scent personalisation via Groq',
        'Full CRUD REST API built with Spring Boot',
        'Frontend deployed and live on Vercel',
      ],
      color: 'from-pink-500 to-rose-600',
    },
    {
      id: 2,
      title: 'Youtube Fan Insight Analyzer',
      category: 'Hackathon /AI',
      tech: 'Replit • Python • Gemeni',
      desc: 'Fan insights from YT comments based on given instructions. Api not maintained please use example data button',
      liveUrl: 'https://trend-tracker--jazzjdpr.replit.app/',
      githubUrl: 'https://github.com/Jazzdp/fan-insight-analyzer',
      highlights: [
        'AI-powered fan insights via Gemini',
        'Integration with YouTube API for comment analysis',
        'Real-time data processing and visualization',
      ],
      color: 'from-pink-500 to-rose-600',
    },
    {
      id: 3,
      title: 'JazzShell',
      category: 'Shell / CLI',
      tech: 'Java • Linux • Bash',
      desc: 'A custom Unix-style shell written in Java, supporting command execution and piping.',
      githubUrl: 'https://github.com/Jazzdp/Jazzshell',
      run: ['git clone https://github.com/Jazzdp/Jazzshell', 'cd Jazzshell', 'javac *.java', 'java Main'],
      highlights: [
        'Custom parser with piping and I/O redirection',
        'Built-in commands: cd, ls, echo, cat and more',
        'Spawns and manages OS processes from Java',
      ],
      color: 'from-purple-600 to-violet-700',
    },
  ];
  const featured = projects.find((p) => p.liveUrl) || projects[0];

  // ---------- Skills as "Songs" — evidence-based, no fake proficiency bars ----------
  const skillSongs = [
    { id: 1, name: 'React', album: 'Frontend', duration: '3:45', desc: 'Hooks, component architecture and state management in production apps.', usedIn: ['6th Sense'] },
    { id: 2, name: 'Spring Boot', album: 'Backend', duration: '4:00', desc: 'REST APIs, JPA and service layers for full-stack applications.', usedIn: ['6th Sense'] },
    { id: 3, name: 'Java', album: 'Languages', duration: '4:20', desc: 'My favourite language — from OOP design to systems-level CLI tools.', usedIn: ['JazzShell'] },
    { id: 4, name: 'MySQL & Database Design', album: 'Data Layer', duration: '5:15', desc: 'Schema design, relations and query work for real application data.', usedIn: ['6th Sense'] },
    { id: 5, name: 'AI Integration', album: 'Applied AI', duration: '4:30', desc: 'Wiring LLM APIs (Groq) into real products with sensible UX around them.', usedIn: ['6th Sense'] },
    { id: 6, name: 'Tailwind CSS', album: 'Styling', duration: '3:20', desc: 'Utility-first styling for fast, consistent interface building.', usedIn: ['6th Sense'] },
    { id: 7, name: 'Linux & Bash', album: 'Systems', duration: '4:50', desc: 'Comfortable on the command line — enough to write my own shell for it.', usedIn: ['JazzShell'] },
    { id: 8, name: 'Git & CI/CD', album: 'Workflow', duration: '3:55', desc: 'Branching discipline and deployment pipelines to Vercel and beyond.', usedIn: ['6th Sense', 'JazzShell'] },
    {id: 9, name: 'Unit Testing', album: 'Workflow', duration: '5:00', desc: 'Writing and maintaining tests to ensure code quality and prevent regressions.', usedIn: ['6th Sense'] },
    {id:10, name: 'Penetration Testing', album: 'Security', duration: '4:40', desc: 'Identifying and mitigating security vulnerabilities in web applications.', usedIn: ['6th Sense'] },
  ];

  // ---------- Hobbies as "Stations" ----------
  const hobbies = [
    {
      id: 1, name: 'Listening to Music', tagline: 'The permanent background score', emoji: '🎧', glyph: '♫',
      gradient: 'from-pink-500 via-rose-500 to-orange-400',
      desc: 'Curating playlists and hunting for new sounds across every genre.',
      detail: 'I live for music, wether it was exploring new genres or experimenting with new beats.',
    },
    {
      id: 2, name: 'Reading', tagline: 'Analog input, digital output', emoji: '📖', glyph: 'Aa',
      gradient: 'from-amber-400 via-orange-500 to-rose-500',
      desc: 'Design & systems books, self help and financial literacy, Korean folklore, Japanese literature.',
      detail: 'Design & systems books, self help and financial literacy, Korean folklore, Japanese literature.',
    },
    {
      id: 3, name: 'Drawing', tagline: 'Sketch first, commit later', emoji: '✏️', glyph: 'D',
      gradient: 'from-sky-400 via-cyan-500 to-blue-600',
      desc: 'Abstract painting and sketching.',
      detail: 'Abstract painting and sketching since childhood.',
    },
    {
      id: 4, name: 'Writing', tagline: 'Clear thoughts, clean paragraphs', emoji: '✍️', glyph: 'W',
      gradient: 'from-indigo-500 via-purple-500 to-fuchsia-500',
      desc: 'Essays and posts about tech, design and the in-between.',
      detail: 'I write about my life lessons and the truths i uncover while coming of age, soon to be published.',
    },
    {
      id: 5, name: 'Chess', tagline: 'Thinking three moves ahead', emoji: '♟️', glyph: '♞',
      gradient: 'from-zinc-600 to-neutral-900',
      desc: 'Blitz chess — pattern recognition and patience training.',
      detail: 'A new hobby i am exploring, which helps me develop deeper attention and strategic thinking.',
    },
    {
      id: 6, name: 'Graphic Design', tagline: 'Pixels with intention', emoji: '🎨', glyph: 'G',
      gradient: 'from-fuchsia-500 via-violet-500 to-indigo-500',
      desc: 'Posters, covers and interface mockups.',
      detail: 'Graphic design is where my engineering and aesthetics meet usually for my projects but also for my club activities.',
    },
    {
      id: 7, name: 'CTF', tagline: 'The hobby that compounds', emoji: '💻', glyph: '</>',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      desc: 'Small tools and experiments built purely for curiosity.',
      detail: 'Other than coding, I also enjoy participating in Capture The Flag (CTF) competitions to test my problem-solving and security skills.',
    },
  ];

  // ---------- Certifications — no music, credential links instead ----------
  const certifications = [
    {
      id: 1,
      name: 'License in Software Engineering',
      issuer: 'University of Algiers 1',
      year: '2023-2026',
      status: 'verified',
      note: 'Rank: 2/185, CGPA: 14/20.',
    },
     {
      id: 2,
      name: 'Master in Networking and Embedded Systems',
      issuer: 'University of Algiers 1',
      year: '2026',
      status: 'in-progress',
      note: 'Master’s degree in networking and embedded systems — expected graduation 2028.',
    },
    {
      id: 3,
      name: 'Ethical Hacker',
      issuer: 'Cisco Networking Academy',
      year: '2026', // TODO: set your real completion year
      status: 'verified',
      credentialUrl: 'https://www.credly.com/badges/fb4d57d9-07a1-413d-b548-a9ba513ef8f7/public_url', // TODO: paste your Credly / badge verification URL here — the "Verify Credential" button appears automatically
      note: 'Cisco NetAcad course covering security threats, network attacks, cryptography and ethical hacking methodology.',
    },
    {
      id: 4,
      name: 'NDG Linux Unhatched',
      issuer: 'Cisco Networking Academy · NDG',
      year: '2026',
      status: 'verified',
      credentialUrl: 'https://www.netacad.com/recognitions/verify/d7987ba3-d84b-42d0-a2c5-9f989b826267',
      note: 'Linux command-line fundamentals.',
    },
     {
      id: 5,
      name: 'NDG Linux Essentials',
      issuer: 'Cisco Networking Academy · NDG',
      year: '2026',
      status: 'in-progress',
      note: 'Linux command-line in depth.',
    },
     {
      id: 6,
      name: 'NASA Open Science Essentials',
      issuer: 'NASA',
      year: '2026',
      status: 'verified',
      credentialUrl: 'https://www.credly.com/badges/044e4b3b-ce42-44cf-b1b5-b2674ea5ee3f/public_url',
      note: 'Open science principles and practices.',
    },
    {
      id: 7,
      name: 'NASA Open Science 101',
      issuer: 'NASA',
      year: '2026',
      status: 'verified',
      credentialUrl: 'https://www.credly.com/badges/01ac4534-21b5-45c2-9998-0c9eea697acb/public_url',
      note: 'Open science principles and practices in depth.',
    },
    
  ];

  // ---------- Playlists ----------
  const playlists = [
    { id: 'projects', title: 'Projects', desc: 'Shipped and in-progress builds', items: projects, type: 'project', gradient: 'from-rose-500 to-orange-500', icon: Briefcase },
    { id: 'skills', title: 'Skill Set', desc: 'Core competencies, proven in real projects', items: skillSongs, type: 'skill', gradient: 'from-blue-500 to-indigo-600', icon: Code2 },
    { id: 'songs', title: 'Certifications', desc: 'Degrees & credentials — click to verify', items: certifications, type: 'song', gradient: 'from-emerald-500 to-teal-600', icon: Award },
    { id: 'hobbies', title: 'Stations', desc: 'Seven stations, always on', items: hobbies, type: 'hobby', gradient: 'from-fuchsia-500 to-purple-600', icon: Heart },
  ];

  // ---------- Socials ----------
  const socialLinks = [
    { icon: Github, label: 'GitHub', url: 'https://github.com/Jazzdp', color: 'bg-[#333333]' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/zioueche-hasnaa', color: 'bg-blue-600' },
    { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/dprjazz', color: 'bg-pink-600' },
    { icon: Mail, label: 'Email', url: 'mailto:hasnaa.zioueche@univ-alger.dz', color: 'bg-rose-500' },
  ];

  // ---------- Search ----------
  const searchIndex = [
    ...projects.map((p) => ({ type: 'project', data: p, label: p.title, sub: p.tech })),
    ...skillSongs.map((s) => ({ type: 'skill', data: s, label: s.name, sub: s.album })),
    ...certifications.map((c) => ({ type: 'song', data: c, label: c.name, sub: c.issuer })),
    ...hobbies.map((h) => ({ type: 'hobby', data: h, label: h.name, sub: h.desc })),
  ];
  const q = searchQuery.trim().toLowerCase();
  const searchResults = q
    ? searchIndex.filter((i) => i.label.toLowerCase().includes(q) || i.sub.toLowerCase().includes(q))
    : [];

  // ---------- derived playback ----------
  const totalSeconds = parseDuration(nowPlaying?.duration);
  const elapsed = fakeElapsed;
  const pct = totalSeconds ? Math.min(100, (elapsed / totalSeconds) * 100) : 0;
  const liked = nowPlaying ? !!likes[`${nowPlaying.type}-${nowPlaying.id}`] : false;
  const currentViewTitle =
    currentTab === 'Playlists' && selectedPlaylist ? selectedPlaylist.title
    : currentTab === 'Browse Projects' ? 'Browse'
    : currentTab;

  // ---------- actions ----------
  const subtitleFor = (type, d) =>
    type === 'project' ? d.category : type === 'skill' ? d.album : type === 'song' ? d.issuer : (d.tagline || 'Station');

  const normalize = (type, items) => items.map((d) => ({ type, data: d }));

  const openFromQueue = (items, idx) => {
    const entry = items[idx];
    if (!entry) return;
    setSelectedItem({ type: entry.type, data: entry.data });
    setNowPlaying({
      title: entry.data.title || entry.data.name,
      subtitle: subtitleFor(entry.type, entry.data),
      duration: entry.data.duration || null,
      emoji: entry.data.emoji || null,
      gradient: entry.data.gradient || null,
      type: entry.type,
      id: entry.data.id,
    });
    setIsPlaying(true);
    setQueue(items);
    setQueueIndex(idx);
    setFakeElapsed(0);
  };

  const skip = (dir) => {
    if (!queue.length) return;
    openFromQueue(queue, (queueIndex + dir + queue.length) % queue.length);
  };

  const togglePlay = () => {
    if (!nowPlaying) {
      if (certifications.length) openFromQueue(normalize('song', certifications), 0);
      return;
    }
    setIsPlaying((p) => !p);
  };

  const closeItem = () => setSelectedItem(null);

  const toggleLike = () => {
    if (!nowPlaying) return;
    const k = `${nowPlaying.type}-${nowPlaying.id}`;
    setLikes((l) => ({ ...l, [k]: !l[k] }));
  };

  const openProjectByTitle = (title) => {
    const idx = projects.findIndex((p) => p.title === title);
    if (idx >= 0) openFromQueue(normalize('project', projects), idx);
  };

  const goTo = (tab, playlistId = null) => {
    const entry = { tab, playlistId };
    const cur = history[historyIndex];
    if (!(cur && cur.tab === tab && cur.playlistId === playlistId)) {
      const trimmed = history.slice(0, historyIndex + 1);
      trimmed.push(entry);
      setHistory(trimmed);
      setHistoryIndex(trimmed.length - 1);
    }
    setSearchQuery('');
    setCurrentTab(tab);
    setSelectedPlaylist(playlistId ? playlists.find((p) => p.id === playlistId) : null);
    setSelectedItem(null);
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canBack = historyIndex > 0;
  const canForward = historyIndex < history.length - 1;
  const stepHistory = (dir) => {
    const idx = historyIndex + dir;
    if (idx < 0 || idx >= history.length) return;
    const e = history[idx];
    setHistoryIndex(idx);
    setSearchQuery('');
    setCurrentTab(e.tab);
    setSelectedPlaylist(e.playlistId ? playlists.find((p) => p.id === e.playlistId) : null);
    setSelectedItem(null);
    mainRef.current?.scrollTo({ top: 0 });
  };

  const onSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    if (totalSeconds) setFakeElapsed(ratio * totalSeconds);
  };

  // ---------- effects ----------
  useEffect(() => {
    if (!nowPlaying || !isPlaying) return;
    const total = parseDuration(nowPlaying.duration);
    if (!total) return;
    const iv = setInterval(() => {
      setFakeElapsed((e) => {
        if (e + 1 >= total) { clearInterval(iv); setIsPlaying(false); return total; }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [isPlaying, nowPlaying]);

  // Keyboard: Space = play/pause, ← → = skip, Esc = close
  useEffect(() => {
    const onKey = (e) => {
      const typing = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      if (e.key === 'Escape') setSelectedItem(null);
      if (typing) return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      if (e.key === 'ArrowRight') skip(1);
      if (e.key === 'ArrowLeft') skip(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const coverFor = (type, d) =>
    d.cover ? <img src={d.cover} alt="" className="h-full w-full object-cover" />
    : type === 'hobby' ? d.emoji
    : type === 'project' ? <div className={`h-full w-full bg-gradient-to-br ${d.color} flex items-center justify-center`}><Briefcase className="h-4 w-4 text-white/60" /></div>
    : type === 'skill' ? <div className="h-full w-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center"><Code2 className="h-4 w-4 text-white/60" /></div>
    : <div className="h-full w-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"><Music className="h-4 w-4 text-white/60" /></div>;

  const footerGradient =
    nowPlaying?.gradient ||
    (nowPlaying?.type === 'project' ? 'from-pink-500 to-rose-600'
      : nowPlaying?.type === 'skill' ? 'from-blue-500 to-indigo-600'
      : 'from-emerald-500 to-teal-600');

  return (
    <div className="fixed inset-0 flex bg-[#121212] text-white font-sans overflow-hidden">
      <style>{`
        html, body, #root { background:#121212 !important; height:100%; margin:0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", "Segoe UI", Roboto, sans-serif; -webkit-font-smoothing: antialiased; }
        ::selection { background: rgba(250,36,60,.35); }
        @keyframes fadeIn { from {opacity:0; transform:translateY(8px)} to {opacity:1; transform:translateY(0)} }
        .animate-fadeIn { animation: fadeIn .35s ease both }
        @keyframes slideIn { from {opacity:0; transform:translateX(28px)} to {opacity:1; transform:translateX(0)} }
        .animate-slideIn { animation: slideIn .3s cubic-bezier(.2,.8,.2,1) both }
        @keyframes eq { 0%,100% { height:3px } 50% { height:12px } }
        .eq-bar { width:3px; height:3px; background:#fa243c; border-radius:2px; animation: eq .9s ease-in-out infinite }
        @keyframes pingSlow { 0% { transform:scale(1); opacity:.9 } 80%,100% { transform:scale(2.6); opacity:0 } }
        .ping-slow { animation: pingSlow 1.6s cubic-bezier(0,0,.2,1) infinite }
        @keyframes blink { 50% { opacity:0 } }
        .cursor-blink { animation: blink 1.1s steps(1) infinite }
        .no-scrollbar::-webkit-scrollbar { display:none }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none }
        ::-webkit-scrollbar { width:10px }
        ::-webkit-scrollbar-track { background:transparent }
        ::-webkit-scrollbar-thumb { background:#3f3f3f; border-radius:8px; border:2px solid #121212 }
        ::-webkit-scrollbar-thumb:hover { background:#555 }
        input[type=range] { accent-color:#fa243c }
      `}</style>

      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-[#181818] border-r border-[#282828] flex-col justify-between p-4 z-10 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-6 bg-[#282828] rounded-lg">
            <div className="relative flex-shrink-0">
              <img src={profileImageUrl} alt="Profile" className="h-10 w-10 rounded-full object-cover ring-2 ring-[#323232]" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-[#282828]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold truncate">Jazz</h2>
              <p className="text-[11px] text-gray-400">Software Engineer</p>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Discover</h3>
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => goTo(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentTab === item.label ? 'bg-[#fa243c] text-white' : 'text-gray-300 hover:bg-[#282828]'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Library</h3>
            <div className="space-y-1">
              {playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => goTo('Playlists', p.id)}
                  className="w-full flex items-center gap-2.5 text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-[#282828] rounded-md transition-colors"
                >
                  <span className={`h-2 w-2 rounded-full bg-gradient-to-br ${p.gradient} flex-shrink-0`} />
                  <span className="truncate">{p.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10px] text-gray-600 text-center mb-3 leading-relaxed">
            Space = play · ← → = skip · Esc = close
          </p>
          <a
            href="mailto:hasnaa.zioueche@univ-alger.dz"
            className="flex items-center justify-center gap-2 bg-[#fa243c] hover:bg-[#e8223a] text-white text-xs font-semibold py-2.5 px-4 rounded-md transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Get In Touch</span>
          </a>
        </div>
      </aside>

      {/* MAIN COLUMN */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* TOP TOOLBAR */}
        <div className="h-14 flex items-center justify-between gap-4 px-4 md:px-6 border-b border-[#282828] bg-[#181818]/80 backdrop-blur-md flex-shrink-0 z-10">
          <div className="flex items-center gap-4 min-w-0">
            <div className="hidden md:flex items-center gap-2 mr-1">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => stepHistory(-1)}
                disabled={!canBack}
                title="Back"
                aria-label="Back"
                className="h-7 w-7 rounded-full bg-[#282828] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#323232] disabled:opacity-30 disabled:cursor-default transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => stepHistory(1)}
                disabled={!canForward}
                title="Forward"
                aria-label="Forward"
                className="h-7 w-7 rounded-full bg-[#282828] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#323232] disabled:opacity-30 disabled:cursor-default transition-colors"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
            <span className="hidden sm:block text-xs font-semibold text-gray-400 truncate max-w-[160px]">{currentViewTitle}</span>
          </div>

          <div className="relative w-44 sm:w-72 flex-shrink">
            <Search className="h-3.5 w-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && searchResults.length) openFromQueue(searchResults, 0); }}
              placeholder="Search projects, skills, certifications…"
              aria-label="Search"
              className="w-full bg-[#2a2a2a] text-xs text-gray-300 placeholder-gray-500 rounded-md pl-8 pr-7 py-1.5 outline-none focus:ring-1 focus:ring-[#fa243c]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <a
            href="https://github.com/Jazzdp"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="hidden md:flex h-7 w-7 rounded-full bg-[#282828] items-center justify-center text-gray-400 hover:text-white hover:bg-[#323232] transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* MAIN CONTENT */}
        <main ref={mainRef} className={`flex-1 bg-[#121212] overflow-y-auto pb-28 px-6 md:px-8 pt-8 transition-all ${selectedItem ? 'lg:pr-80' : ''}`}>

          {/* Mobile nav chips */}
          {!searchQuery.trim() && (
            <div className="lg:hidden flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
              {navigationItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => goTo(item.label)}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    currentTab === item.label ? 'bg-[#fa243c] border-[#fa243c] text-white' : 'border-[#3b3b3b] text-gray-300 hover:border-gray-400'
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* SEARCH RESULTS */}
          {searchQuery.trim() && (
            <div className="animate-fadeIn">
              <header className="mb-6">
                <h1 className="text-3xl font-extrabold tracking-tight">Search</h1>
                <p className="text-sm text-gray-400 mt-1">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for “{searchQuery}”
                </p>
                <div className="h-[1px] bg-[#282828] mt-4" />
              </header>
              {searchResults.length === 0 ? (
                <p className="text-sm text-gray-500">No matches. Try a different term.</p>
              ) : (
                <div className="space-y-2 max-w-3xl">
                  {searchResults.map((item, idx) => (
                    <TrackRow
                      key={`${item.type}-${item.data.id}`}
                      idx={idx}
                      cover={coverFor(item.type, item.data)}
                      title={item.label}
                      subtitle={item.sub}
                      right={<span className="text-[10px] uppercase tracking-wide bg-[#282828] px-2 py-0.5 rounded-full">{item.type}</span>}
                      active={selectedItem?.type === item.type && selectedItem?.data?.id === item.data.id}
                      playing={isPlaying}
                      onClick={() => openFromQueue(searchResults, idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: LISTEN NOW */}
          {!searchQuery.trim() && currentTab === 'Listen Now' && (
            <div className="animate-fadeIn max-w-5xl">
              {/* Featured hero */}
              <section className="mb-10">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#fa243c] via-[#d92b53] to-violet-700 p-7 md:p-10">
                  <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -left-10 -bottom-20 h-56 w-56 rounded-full bg-black/20 blur-2xl" />
                  <div className="relative">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 mb-3">Featured Project</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">{featured.title}</h2>
                    <p className="text-sm text-white/85 max-w-lg leading-relaxed mb-4">{featured.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featured.tech.split('•').map((t) => (
                        <span key={t} className="text-[11px] font-semibold bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">{t.trim()}</span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={featured.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white text-black text-xs font-bold px-5 py-2.5 rounded-full hover:scale-[1.03] transition-transform"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" /> Open Live Demo
                      </a>
        
                    </div>
                  </div>
                </div>
              </section>

              {/* Playlist grid */}
              <h3 className="text-xl font-bold mb-4">Made For You</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {playlists.map((pl) => (
                  <div
                    key={pl.id}
                    onClick={() => goTo('Playlists', pl.id)}
                    className="bg-[#1d1d1d] p-4 rounded-xl hover:bg-[#262626] cursor-pointer transition-colors group"
                  >
                    <div className={`relative h-32 rounded-lg mb-3 bg-gradient-to-br ${pl.gradient} flex items-center justify-center shadow-lg`}>
                      <pl.icon className="h-10 w-10 text-white/40 group-hover:scale-110 transition-transform" />
                      <button
                        onClick={(e) => { e.stopPropagation(); openFromQueue(normalize(pl.type, pl.items), 0); }}
                        aria-label={`Play ${pl.title}`}
                        className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-[#fa243c] flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all hover:scale-105"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                      </button>
                    </div>
                    <h4 className="font-bold text-sm truncate">{pl.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{pl.items.length} items</p>
                  </div>
                ))}
              </div>

              {/* Stations strip */}
              <h3 className="text-xl font-bold mb-1">Stations</h3>
              <p className="text-xs text-gray-400 mb-4">What plays between the commits — pick one, read the story.</p>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x mb-10">
                {hobbies.map((h, idx) => (
                  <StationCard
                    key={h.id}
                    station={h}
                    className="w-44 flex-shrink-0 snap-start"
                    active={selectedItem?.type === 'hobby' && selectedItem?.data?.id === h.id}
                    playing={isPlaying}
                    onClick={() => openFromQueue(normalize('hobby', hobbies), idx)}
                  />
                ))}
              </div>

              {/* Artist strip */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#1d1d1d] rounded-xl p-5 border border-[#282828]">
                <img src={profileImageUrl} alt="Jazz" className="h-14 w-14 rounded-full object-cover ring-2 ring-[#323232]" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">About the artist</p>
                  <h4 className="font-bold">Zioueche Hasnaa Nour — “Jazz”</h4>
                  <p className="text-xs text-gray-400">Software engineering student & full-stack developer · Algiers</p>
                </div>
                <button
                  onClick={() => goTo('About & Bio')}
                  className="text-xs font-bold border border-[#3b3b3b] hover:border-gray-400 px-4 py-2 rounded-full transition-colors flex-shrink-0"
                >
                  View Bio
                </button>
              </div>
            </div>
          )}

          {/* TAB: BROWSE PROJECTS */}
          {!searchQuery.trim() && currentTab === 'Browse Projects' && (
            <div className="animate-fadeIn max-w-5xl">
              <header className="mb-6">
                <h1 className="text-3xl font-extrabold tracking-tight">Browse</h1>
                <p className="text-sm text-gray-400 mt-1">Recent projects — click any card for details</p>
                <div className="h-[1px] bg-[#282828] mt-4" />
              </header>

              <div className="grid md:grid-cols-2 gap-4">
                {projects.map((p, idx) => (
                  <div
                    key={p.id}
                    onClick={() => openFromQueue(normalize('project', projects), idx)}
                    className="bg-[#1d1d1d] rounded-xl p-5 border border-[#282828] hover:border-[#3b3b3b] hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center shadow-lg`}>
                        <Briefcase className="h-5 w-5 text-white/50" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
                        p.liveUrl ? 'bg-emerald-500/15 text-emerald-400' : 'bg-violet-500/15 text-violet-300'
                      }`}>
                        {p.liveUrl ? '● Live' : '● CLI'}
                      </span>
                    </div>
                    <h4 className="font-bold mb-1">{p.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tech.split('•').map((t) => (
                        <span key={t} className="text-[10px] text-gray-400 bg-[#282828] px-2 py-0.5 rounded-full">{t.trim()}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ABOUT & BIO */}
          {!searchQuery.trim() && currentTab === 'About & Bio' && (
            <div className="max-w-2xl animate-fadeIn">
              <header className="mb-6">
                <h1 className="text-3xl font-extrabold tracking-tight">About Me</h1>
                <div className="h-[1px] bg-[#282828] mt-4" />
              </header>

              <div className="bg-gradient-to-br from-[#1d1d1d] to-[#232323] p-6 rounded-xl border border-[#282828] mb-4">
                <div className="flex items-center gap-4 mb-5">
                  <img src={profileImageUrl} alt="Jazz" className="h-16 w-16 rounded-full object-cover ring-2 ring-[#fa243c]/40" />
                  <div>
                    <h2 className="text-xl font-bold">Zioueche Hasnaa Nour</h2>
                    <p className="text-sm text-gray-400">Software Engineer · goes by “Jazz”</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-rose-500 font-semibold mb-3">
                  <Info className="h-4 w-4 mt-0.5" />
                  <span className="text-sm">Bio</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  Hi — I’m Zioueche Hasnaa Nour, though everyone calls me <span className="text-white font-semibold">Jazz</span>. I’m a
                  software engineering student at University of Algiers 1 with a love for building efficient, thoughtful applications.
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  I work across the stack — React on the front, Java and Spring Boot on the back — and I’m happiest when turning an
                  idea into something real. Away from the editor you’ll find me practising ethical hacking, producing music, or gaming.
                </p>

                <div className="grid sm:grid-cols-3 gap-3 mt-5">
                  {[
                    { icon: GraduationCap, label: 'Education', value: 'Software Eng., Univ. of Algiers 1' },
                    { icon: MapPin, label: 'Based in', value: 'Algiers, Algeria' },
                    { icon: Languages, label: 'Languages', value: 'Arabic · French · English' },
                  ].map((tile) => (
                    <div key={tile.label} className="bg-[#1a1a1a] rounded-lg p-3 border border-[#2a2a2a]">
                      <tile.icon className="h-4 w-4 text-rose-500 mb-2" />
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{tile.label}</p>
                      <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">{tile.value}</p>
                    </div>
                  ))}
                </div>
              </div>

            

              <div className="bg-[#1d1d1d] p-6 rounded-xl border border-[#282828]">
                <h3 className="text-sm font-bold mb-4 text-gray-300">Connect With Me</h3>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 ${link.color} px-4 py-3 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-opacity`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PLAYLISTS */}
          {!searchQuery.trim() && currentTab === 'Playlists' && selectedPlaylist && (
            <div className="animate-fadeIn max-w-5xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 mb-8">
                <div className={`h-36 w-36 rounded-xl bg-gradient-to-br ${selectedPlaylist.gradient} flex items-center justify-center shadow-2xl flex-shrink-0`}>
                  {(() => { const Icon = selectedPlaylist.icon; return <Icon className="h-14 w-14 text-white/50" />; })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-1">Playlist</p>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{selectedPlaylist.title}</h1>
                  <p className="text-sm text-gray-400 mt-1">{selectedPlaylist.desc} · {selectedPlaylist.items.length} items</p>
                </div>
                <button
                  onClick={() => openFromQueue(normalize(selectedPlaylist.type, selectedPlaylist.items), 0)}
                  className="flex items-center gap-2 bg-[#fa243c] hover:bg-[#e8223a] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors flex-shrink-0"
                >
                  <Play className="h-3.5 w-3.5 fill-current" /> Play
                </button>
              </div>

              {/* Stations get the editorial treatment */}
              {selectedPlaylist.id === 'hobbies' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedPlaylist.items.map((h, idx) => (
                    <StationCard
                      key={h.id}
                      station={h}
                      className="w-full"
                      active={selectedItem?.type === 'hobby' && selectedItem?.data?.id === h.id}
                      playing={isPlaying}
                      onClick={() => openFromQueue(normalize('hobby', selectedPlaylist.items), idx)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedPlaylist.items.map((item, idx) => (
                    <TrackRow
                      key={item.id}
                      idx={idx}
                      cover={coverFor(selectedPlaylist.type, item)}
                      title={item.title || item.name}
                      subtitle={item.tech || item.desc || subtitleFor(selectedPlaylist.type, item)}
                      right={
                        selectedPlaylist.type === 'project'
                          ? <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.liveUrl ? 'bg-emerald-500/15 text-emerald-400' : 'bg-violet-500/15 text-violet-300'}`}>{item.liveUrl ? 'LIVE' : 'CLI'}</span>
                          : selectedPlaylist.type === 'song'
                            ? (item.status === 'in-progress'
                                ? <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400">IN PROGRESS</span>
                                : <span>{item.year}</span>)
                            : <span>{item.duration}</span>
                      }
                      active={selectedItem?.type === selectedPlaylist.type && selectedItem?.data?.id === item.id}
                      playing={isPlaying}
                      onClick={() => openFromQueue(normalize(selectedPlaylist.type, selectedPlaylist.items), idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* DETAIL PANEL */}
      {selectedItem && (() => {
        const d = selectedItem.data;
        const t = selectedItem.type;
        const gradient = t === 'project' ? d.color
          : t === 'skill' ? 'from-blue-500 to-indigo-600'
          : t === 'song' ? 'from-emerald-500 to-teal-600'
          : d.gradient;
        return (
          <aside className="fixed right-0 top-0 bottom-20 w-full sm:w-80 bg-[#181818] border-l border-[#282828] z-30 overflow-y-auto animate-slideIn">
            <button
              onClick={closeItem}
              aria-label="Close panel"
              className="absolute top-4 right-4 h-7 w-7 rounded-full bg-[#282828] hover:bg-[#323232] flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6 pt-12">
              <div className={`rounded-xl h-44 flex items-center justify-center mb-5 bg-gradient-to-br ${gradient} shadow-2xl overflow-hidden relative`}>
                {t === 'hobby' ? (
                  <>
                    <span className="absolute -right-2 -bottom-8 text-[9rem] leading-none font-black text-white/10 select-none">{d.glyph}</span>
                    <span className="text-7xl">{d.emoji}</span>
                  </>
                ) : t === 'project' ? <Briefcase className="h-20 w-20 text-white/30" />
                : t === 'skill' ? <Code2 className="h-20 w-20 text-white/30" />
                : <Music className="h-20 w-20 text-white/30" />}
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-2">
                {t === 'song' ? 'Certification' : t === 'hobby' ? 'Station' : t}
                {queue.length > 0 && ` · ${queueIndex + 1} of ${queue.length}`}
              </p>
              <h2 className="text-2xl font-bold mb-1">{d.title || d.name}</h2>
              <p className="text-sm text-rose-400 font-semibold mb-4">{subtitleFor(t, d)}</p>

              {/* Project body */}
              {t === 'project' && (
                <>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">{d.desc}</p>
                  {d.highlights && (
                    <ul className="space-y-1.5 mb-4">
                      {d.highlights.map((h) => (
                        <li key={h} className="flex gap-2 text-xs text-gray-300 leading-relaxed">
                          <span className="text-rose-500 flex-shrink-0">▸</span>{h}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {d.tech.split('•').map((x) => (
                      <span key={x} className="text-[10px] text-gray-400 bg-[#282828] px-2 py-0.5 rounded-full">{x.trim()}</span>
                    ))}
                  </div>
                  {d.run && (
                    <div className="rounded-lg bg-black border border-[#2f2f2f] p-3.5 font-mono text-[11px] leading-relaxed mb-4">
                      <div className="flex gap-1.5 mb-2.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a3a]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a3a]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a3a]" />
                      </div>
                      {d.run.map((line) => (
                        <p key={line}><span className="text-emerald-400">$ </span><span className="text-gray-200">{line}</span></p>
                      ))}
                      <p><span className="text-emerald-400">jazz@shell</span> <span className="text-gray-500">~ $ </span><span className="cursor-blink text-gray-300">▊</span></p>
                    </div>
                  )}
                </>
              )}

              {/* Skill body — evidence instead of fake bars */}
              {t === 'skill' && (
                <>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">{d.desc}</p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Proven In</p>
                  {d.usedIn?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {d.usedIn.map((title) => (
                        <button
                          key={title}
                          onClick={() => openProjectByTitle(title)}
                          className="flex items-center gap-1.5 text-[11px] font-semibold bg-[#282828] hover:bg-[#333] border border-[#3b3b3b] hover:border-[#fa243c]/50 px-3 py-1.5 rounded-full transition-colors"
                        >
                          <Briefcase className="h-3 w-3 text-rose-400" />
                          {title}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Applied across coursework and personal builds.</p>
                  )}
                </>
              )}

              {/* Certification body */}
              {t === 'song' && (
                <>
                  
                  {d.status === 'in-progress' ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-amber-500/15 text-amber-400 px-2.5 py-1 rounded-full mb-4">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                      IN PROGRESS · {d.year}
                    </span>
                  ) : (
                    <p className="text-xs text-gray-500 mb-4">Completed {d.year}</p>
                  )}
                  {d.note && <p className="text-xs text-gray-400 leading-relaxed mb-4">{d.note}</p>}
                  {d.credentialUrl && (
                    <a
                      href={d.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold py-2.5 rounded-full transition-colors mb-4"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Verify Credential
                    </a>
                  )}
                </>
              )}

              {/* Hobby body */}
              {t === 'hobby' && <p className="text-sm text-gray-300 leading-relaxed">{d.detail || d.desc}</p>}

              {/* Project actions */}
              {t === 'project' && (
                <div className="flex gap-2.5 mt-5 mb-3">
                  {d.liveUrl && (
                    <a
                      href={d.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-[#fa243c] hover:bg-[#e8223a] text-white text-xs font-bold py-2.5 rounded-full transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                    </a>
                  )}
                  <a
                    href={d.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#282828] hover:bg-[#323232] text-white text-xs font-bold py-2.5 rounded-full transition-colors"
                  >
                    <Github className="h-3.5 w-3.5" /> Source
                  </a>
                </div>
              )}

              <button
                onClick={closeItem}
                className="w-full bg-[#282828] hover:bg-[#323232] text-white font-semibold py-2 rounded-full transition-colors text-sm mt-4"
              >
                Close
              </button>
            </div>
          </aside>
        );
      })()}

      {/* FOOTER: NOW PLAYING */}
      <footer className="fixed bottom-0 left-0 right-0 h-20 bg-[#181818]/95 backdrop-blur-md border-t border-[#282828] flex items-center justify-between gap-4 px-4 md:px-6 z-40">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0 w-1/3">
          {nowPlaying ? (
            <>
              <div className={`h-12 w-12 rounded-md bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-md ${footerGradient}`}>
                {nowPlaying.emoji ? <span className="text-xl">{nowPlaying.emoji}</span>
                 : nowPlaying.type === 'project' ? <Briefcase className="h-5 w-5 text-white/60" />
                 : nowPlaying.type === 'skill' ? <Code2 className="h-5 w-5 text-white/60" />
                 : <Music className="h-5 w-5 text-white/60" />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate flex items-center gap-2">
                  {nowPlaying.title}
                  {isPlaying && <EqBars />}
                </span>
                <span className="text-xs text-gray-400 truncate">{nowPlaying.subtitle}</span>
              </div>
              {nowPlaying.type === 'project' && selectedItem?.type === 'project' && (
                <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                  {selectedItem.data.liveUrl && (
                    <a href={selectedItem.data.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><ExternalLink className="h-4 w-4" /></a>
                  )}
                  {selectedItem.data.githubUrl && (
                    <a href={selectedItem.data.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Github className="h-4 w-4" /></a>
                  )}
                </div>
              )}
              <button onClick={toggleLike} aria-label="Like" className="flex-shrink-0">
                <Heart className={`h-4 w-4 transition-colors ${liked ? 'fill-[#fa243c] text-[#fa243c]' : 'text-gray-500 hover:text-white'}`} />
              </button>
            </>
          ) : (
            <span className="text-xs text-gray-500 truncate">Nothing playing — pick a station or a playlist</span>
          )}
        </div>

        {/* Center transport */}
        <div className="flex flex-col items-center gap-1.5 w-1/3 max-w-md">
          <div className="flex items-center gap-6">
            <button onClick={() => skip(-1)} disabled={!queue.length} aria-label="Previous"
              className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-default transition-colors">
              <SkipBack className="h-4 w-4 fill-current" />
            </button>
            <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}
              className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
              {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
            </button>
            <button onClick={() => skip(1)} disabled={!queue.length} aria-label="Next"
              className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-default transition-colors">
              <SkipForward className="h-4 w-4 fill-current" />
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-2 w-full">
            <span className="text-[10px] text-gray-500 w-9 text-right tabular-nums">{fmt(elapsed)}</span>
            <div onClick={onSeek} className="flex-1 h-1 bg-[#3b3b3b] rounded-full cursor-pointer group/pb relative">
              <div className="h-full bg-white rounded-full relative" style={{ width: `${pct}%` }}>
                <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-2.5 w-2.5 bg-white rounded-full opacity-0 group-hover/pb:opacity-100 transition-opacity shadow" />
              </div>
            </div>
            <span className="text-[10px] text-gray-500 w-9 tabular-nums">{fmt(totalSeconds)}</span>
          </div>
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center justify-end gap-3 w-1/3">
          <button onClick={() => setMuted((m) => !m)} aria-label="Mute" className="text-gray-400 hover:text-white transition-colors">
            {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <input
            type="range" min="0" max="100"
            value={muted ? 0 : Math.round(volume * 100)}
            onChange={(e) => { const v = Number(e.target.value) / 100; setVolume(v); setMuted(v === 0); }}
            className="w-20 cursor-pointer" aria-label="Volume"
          />
          <span className="flex items-center gap-2 text-[11px] font-semibold text-gray-300 bg-[#232323] border border-[#2f2f2f] px-3 py-1.5 rounded-full whitespace-nowrap">
            <span className="relative flex h-2 w-2">
              <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-green-500" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Open to Opportunities
          </span>
        </div>
      </footer>
    </div>
  );
}