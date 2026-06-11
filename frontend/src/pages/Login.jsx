import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../store/slices/authSlice';
import { Shield, Key, MessageSquare, ArrowRight } from 'lucide-react'; 

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
    return () => { dispatch(reset()); };
  }, [user, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden font-sans">
      
      <div className="relative md:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-12 flex flex-col justify-between overflow-hidden border-r border-slate-900">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

        <div className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-sm text-white">
            QT
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white">QTechy Hub</span>
        </div>

        <div className="space-y-6 z-10 my-auto">
          <span className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-full w-fit">
            Clearance Verification
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Enterprise <br />
            <span className="text-indigo-400">Support Operations</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
            Verify your system credentials to access your dynamic dashboard metrics, queue allocations, and secure communication channels.
          </p>

          <div className="space-y-4 pt-4 text-xs font-bold text-slate-300">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-indigo-400" />
              <span>Role-Based Route Clearance Enforced</span>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare size={16} className="text-indigo-400" />
              <span>Threaded Mongoose Comments Protocol</span>
            </div>
          </div>
        </div>

        <div className="z-10 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} QTechy Inc. Secure Node Clearance System.
        </div>
      </div>

      <div className="md:w-1/2 bg-slate-950 flex items-center justify-center p-8 md:p-16 relative">
        <div className="max-w-md w-full space-y-8 bg-slate-900/40 p-8 rounded-2xl border border-slate-900 shadow-2xl backdrop-blur-md animate-fade-in">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Key size={22} className="text-indigo-400" /> Welcome Back
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Sign in with your cleared credentials to access your support panel.
            </p>
          </div>

          {isError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-medium">
              {message}
            </div>
          )}

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-slate-800 bg-slate-950 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-600"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Account Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-slate-800 bg-slate-950 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                {isLoading ? 'Verifying...' : 'Sign In'} <ArrowRight size={14} />
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-400">
            Don't have clearance yet?{' '}
            <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              Request credentials here
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;