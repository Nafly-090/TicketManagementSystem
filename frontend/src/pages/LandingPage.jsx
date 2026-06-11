import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Shield, UserCheck, MessageSquare, ArrowRight, Zap, Database, Lock } from 'lucide-react';

// Import your LinkedIn Image Asset (Vite will package this relative path cleanly)
import linkedinImg from '../assets/Linkedln.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = 400); 

    const particleCount = 65;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = 400;
    };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0; // [3, 4]

      const connectionDist = 120 + scrollPercent * 100; 
      const speedMultiplier = 1 + scrollPercent * 4; 

      particles.forEach((p, idx) => {
        p.x += p.speedX * speedMultiplier;
        p.y += p.speedY * speedMultiplier;

        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;

        ctx.fillStyle = `rgba(99, 102, 241, ${0.4 + scrollPercent * 0.5})`; 
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * (0.15 + scrollPercent * 0.25);
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between overflow-x-hidden">
      
      <header className="fixed top-0 inset-x-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-900 h-16 flex items-center px-6 lg:px-16 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-sm text-white">
            QT
          </div>
          <span className="font-extrabold text-lg tracking-wider">QTechy</span>
        </div>

        <nav className="flex items-center gap-6">
          {user ? (
            <Link 
              to="/dashboard" 
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-sm font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-sm font-bold rounded-lg transition-all hover:scale-105 duration-200 shadow-lg shadow-indigo-500/20"
            >
              Join Portal
            </Link>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 lg:px-16 max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
        <span className="px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-full animate-pulse">
          Release Version 1.0.0
        </span>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight max-w-4xl leading-tight">
          Role-Based <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500">Ticket Management</span> Hub
        </h1>
        
        <p className="text-slate-400 text-md md:text-lg max-w-2xl leading-relaxed">
          An enterprise-grade, secure customer service dashboard designed with clean separation of roles for Administrators, Support Engineers, and Clients.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link 
            to="/register" 
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-sm font-extrabold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            Create Test Account <ArrowRight size={16} />
          </Link>
          <Link 
            to="/login" 
            className="px-8 py-3.5 border border-slate-800 hover:bg-slate-900 text-sm font-extrabold rounded-xl transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-16 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="bg-slate-900/40 p-8 border border-slate-900 rounded-2xl hover:border-indigo-500/20 transition-all duration-300 space-y-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 w-fit rounded-xl">
            <MessageSquare size={24} />
          </div>
          <h3 className="text-lg font-bold text-white">Client Portal</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Submit bugs and feature requests, view historical ticket indices, and converse in threaded support conversations with assigned technicians.
          </p>
        </div>

        <div className="bg-slate-900/40 p-8 border border-slate-900 rounded-2xl hover:border-indigo-500/20 transition-all duration-300 space-y-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 w-fit rounded-xl">
            <UserCheck size={24} />
          </div>
          <h3 className="text-lg font-bold text-white">Support Agent Hub</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Access assigned queues, log status transitions directly into custom audit timelines, and write threaded technical feedback on active cases.
          </p>
        </div>

        <div className="bg-slate-900/40 p-8 border border-slate-900 rounded-2xl hover:border-indigo-500/20 transition-all duration-300 space-y-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 w-fit rounded-xl">
            <Shield size={24} />
          </div>
          <h3 className="text-lg font-bold text-white">Administrator Console</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Complete management capabilities including dashboard metric indexing, user/agent clearance updates, dynamic ticket allocations, and deletions.
          </p>
        </div>

      </section>

      <section className="py-16 bg-slate-950 border-t border-slate-900 px-6 lg:px-16 w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Zap className="text-indigo-500" size={28} />
            <h4 className="font-bold text-sm">Vite + React</h4>
            <p className="text-xs text-slate-400">Blazing fast compilation and hot-reloads.</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Database className="text-indigo-500" size={28} />
            <h4 className="font-bold text-sm">Mongoose Service Layers</h4>
            <p className="text-xs text-slate-400">Enterprise data mapping with complete isolation of business logic.</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Lock className="text-indigo-500" size={28} />
            <h4 className="font-bold text-sm">JWT Authentication</h4>
            <p className="text-xs text-slate-400">Robust token-based routes and role check middleware.</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto w-full border-t border-slate-900">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-8 md:p-12 border border-indigo-500/10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          
                    <div className="relative group max-w-[2800px] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 hover:border-indigo-500/30">
            <a href="https://www.linkedin.com/in/aj-naflan" target="_blank" rel="noopener noreferrer">
              <img 
                src={linkedinImg} 
                alt="AJ Naflan LinkedIn Profile Preview Card" 
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg shadow-lg">
                  Visit LinkedIn Profile
                </span>
              </div>
            </a>
          </div>

          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-6 max-w-2xl">
            <div>
              <span className="px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-full">
                Software Solution By
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mt-4 tracking-tight">
                AJ NAFLAN
              </h2>
              <p className="text-indigo-400 font-bold text-sm md:text-md mt-2">
                MERN Stack Developer | AI Developer | Mobile App Developer
              </p>
              <p className="text-slate-400 text-xs mt-1">
                BICT (Hons) Special in Software Technologies
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-indigo-400">Call:</span>
                <a href="tel:0766593949" className="hover:text-white transition-colors">0766593949</a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-400">Email:</span>
                <a href="mailto:naflan265@gmail.com" className="hover:text-white transition-colors">naflan265@gmail.com</a>
              </div>
            </div>

          </div>

        </div>
      </section>

      <section className="relative w-full h-[400px] overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-slate-950/20 pointer-events-none">
          <h3 className="text-xl font-black uppercase tracking-widest text-indigo-400 animate-pulse">Connection Matrix</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">Scroll down to watch the neural node grid expand as you approach the portal footer.</p>
        </div>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </section>

      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6 lg:px-16 w-full text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-sm text-white">
              QT
            </div>
            <span className="font-extrabold text-sm tracking-wider">QTechy Ticket Management Portal</span>
          </div>

          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} QTechy. Created as an Associate MERN Engineer Full-Stack Task.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;