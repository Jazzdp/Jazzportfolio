import React, { useState } from 'react';
import { 
  Play, ExternalLink, Github, Terminal, 
  Layers, User, Mail, Grid, Heart, Code2, 
  FolderGit2, Sparkles, Briefcase, Info
} from 'lucide-react';

export default function AppleMusicPortfolio() {
  // Tracks which project is actively "Playing" in the bottom deck
  const [activeProject, setActiveProject] = useState(null);
  const [currentTab, setCurrentTab] = useState('Listen Now');

  // Navigation Items
  const navigationItems = [
    { icon: Sparkles, label: 'Listen Now' },
    { icon: Grid, label: 'Browse Projects' },
    { icon: User, label: 'About & Bio' },
  ];

  // Projects Matrix mapped as "Tracks/Albums"
  const projects = [
    { 
      id: 1, 
      title: 'E-Commerce Engine', 
      category: 'Full-Stack', 
      tech: 'Next.js • GraphQL • Stripe', 
      desc: 'High-performance headless commerce app with 1.2s load times.',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      color: 'from-pink-500 to-rose-600' 
    },
    { 
      id: 2, 
      title: 'AI Prompt Workspace', 
      category: 'AI / Frontend', 
      tech: 'React • OpenAI API • Tailwind', 
      desc: 'Collaborative engineering canvas built for prompt optimization.',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      color: 'from-blue-600 to-indigo-700' 
    },
    { 
      id: 3, 
      title: 'Crypto Analytics Deck', 
      category: 'Web3', 
      tech: 'TypeScript • Web3.js • Chart.js', 
      desc: 'Real-time blockchain monitoring tool processing millions in volume.',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      color: 'from-purple-600 to-violet-800' 
    },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#1e1e1e] text-white font-sans overflow-hidden select-none">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#282828] border-r border-[#333333] flex flex-col justify-between p-4 z-10">
        <div>
          {/* Developer Branding */}
          <div className="flex items-center space-x-3 px-2 py-3 mb-6 bg-[#323232] rounded-lg">
            <div className="h-8 w-8 rounded-full bg-rose-500 flex items-center justify-center font-bold text-sm">
              JD
            </div>
            <div>
              <h2 className="text-sm font-semibold truncate">Zioueche Hasnaa Nour</h2>
              <p className="text-[11px] text-gray-400">Software Engineer</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <h3 className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Discover</h3>
            {navigationItems.map((item) => (
              <button 
                key={item.label}
                onClick={() => setCurrentTab(item.label)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentTab === item.label ? 'bg-[#fa243c] text-white' : 'text-gray-300 hover:bg-[#333333]'}`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Core Technical Stack "Playlists" */}
          <div className="mt-8">
            <h3 className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Skills Stack</h3>
            <div className="space-y-1 text-sm text-gray-300 px-2">
              <div className="flex items-center space-x-2 py-1"><Code2 className="h-3.5 w-3.5 text-rose-400" /> <span>JavaScript / TS</span></div>
              <div className="flex items-center space-x-2 py-1"><Layers className="h-3.5 w-3.5 text-blue-400" /> <span>React / Next.js</span></div>
              <div className="flex items-center space-x-2 py-1"><Terminal className="h-3.5 w-3.5 text-green-400" /> <span>Node / Python</span></div>
            </div>
          </div>
        </div>

        {/* Quick Contact Action Button */}
        <a href="mailto:your.email@example.com" className="flex items-center justify-center space-x-2 bg-[#333333] hover:bg-[#444] text-white text-xs font-semibold py-2.5 px-4 rounded-md transition-colors border border-[#444]">
          <Mail className="h-3.5 w-3.5 text-rose-500" />
          <span>Get In Touch</span>
        </a>
      </aside>

      {/* 2. MAIN DISPLAY FRAME */}
      <main className="flex-1 bg-[#1f1f1f] overflow-y-auto pb-32 px-8 pt-8">
        
        {/* TAB 1: LISTEN NOW (DASHBOARD) */}
        {currentTab === 'Listen Now' && (
          <div className="animate-fadeIn">
            <header className="mb-6">
              <h1 className="text-3xl font-extrabold tracking-tight">Listen Now</h1>
              <p className="text-sm text-gray-400 mt-1">Top picks and recently updated software deployments.</p>
              <div className="h-[1px] bg-[#333333] mt-4"></div>
            </header>

            {/* Featured Grid */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4 text-gray-300">Featured Releases</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div 
                    key={project.id} 
                    onClick={() => setActiveProject(project)}
                    className="group cursor-pointer bg-[#282828] p-4 rounded-xl border border-transparent hover:border-[#444] transition-all"
                  >
                    <div className={`aspect-video w-full rounded-lg bg-gradient-to-br ${project.color} relative shadow-md flex flex-col justify-between p-4 mb-4`}>
                      <span className="bg-black/30 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full w-max text-white">
                        {project.category}
                      </span>
                      <FolderGit2 className="h-10 w-10 text-white/30 self-center group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <div className="bg-white text-black p-3 rounded-full shadow-lg">
                          <Play className="h-5 w-5 fill-black ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-base truncate mb-0.5">{project.title}</h3>
                    <p className="text-xs text-rose-400 font-medium truncate mb-2">{project.tech}</p>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{project.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: BROWSE PROJECTS */}
        {currentTab === 'Browse Projects' && (
          <div className="animate-fadeIn">
            <h1 className="text-3xl font-extrabold tracking-tight mb-6">Browse</h1>
            <p className="text-sm text-gray-400">Review complete digital builds and components catalogued by utility.</p>
            <div className="h-[1px] bg-[#333333] mt-4 mb-6"></div>
            
            {/* Simple list alternative view */}
            <div className="space-y-2">
              {projects.map((p) => (
                <div key={p.id} onClick={() => setActiveProject(p)} className="flex items-center justify-between p-3 bg-[#282828] hover:bg-[#333] rounded-lg cursor-pointer transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`h-10 w-10 rounded bg-gradient-to-br ${p.color}`} />
                    <div>
                      <h4 className="text-sm font-semibold">{p.title}</h4>
                      <p className="text-xs text-gray-400">{p.tech}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 bg-[#1e1e1e] px-3 py-1 rounded-md">{p.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ABOUT ME */}
        {currentTab === 'About & Bio' && (
          <div className="max-w-2xl animate-fadeIn">
            <h1 className="text-3xl font-extrabold tracking-tight mb-6">Artist Profile</h1>
            <div className="bg-[#282828] p-6 rounded-xl border border-[#333] space-y-4">
              <div className="flex items-center space-x-2 text-rose-500 font-semibold"><Info className="h-4 w-4" /> <span>Behind The Code</span></div>
              <p className="text-gray-300 text-sm leading-relaxed">
                I am a systems thinker turned frontend enthusiast focused on constructing pristine pixel interfaces and fast execution models. Like music orchestration, software engineering requires rhythmic code structures and harmonious dependencies.
              </p>
              <div className="pt-4 border-t border-[#3b3b3b] grid grid-cols-2 gap-4 text-xs text-gray-400">
                <div><strong>Current Location:</strong> San Francisco, CA</div>
                <div><strong>Experience:</strong> 3+ Years Production</div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 3. NOW PLAYING CONTROL DECK (PORTFOLIO HUB) */}
      <footer className="fixed bottom-0 left-0 right-0 h-20 bg-[#2d2d2d]/95 backdrop-blur-md border-t border-[#3c3c3c] flex items-center justify-between px-6 z-20">
        
        {/* Current Active Item Spec */}
        <div className="flex items-center space-x-3 w-1/3">
          {activeProject ? (
            <>
              <div className={`h-12 w-12 rounded bg-gradient-to-br ${activeProject.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                <Briefcase className="h-5 w-5 text-white/60" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{activeProject.title}</span>
                <span className="text-xs text-gray-400">{activeProject.category} Module</span>
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-400">Select a project tile to open inspection controls</span>
          )}
        </div>

        {/* Launch / Action Hub */}
        <div className="flex items-center space-x-3 justify-center w-1/3">
          {activeProject ? (
            <a 
              href={activeProject.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold py-2 px-4 rounded-md transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>Launch AppCode Repository</span>
            </a>
          ) : (
            <span className="text-sm text-gray-500">System Idle</span>
          )}
        </div>

        {/* Status Signature Right */}
        <div className="flex items-center space-x-2 justify-end w-1/3">
          <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
          <span className="text-xs text-gray-300">Available for Roles</span>
          <span className="text-lg">🟢</span>
        </div>
      </footer>
    </div>
  );
}