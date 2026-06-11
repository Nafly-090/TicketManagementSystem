import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Corrected import from react-router-dom
import { useSelector, useDispatch } from 'react-redux';
import { registerUser, reset } from '../store/slices/authSlice';
import { UserPlus, MessageSquare, UserCheck, ArrowRight } from 'lucide-react'; // Removed 'Sparkles'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', 
  });
  const { name, email, password, role } = formData;

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

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  const roleCards = [
    { value: 'user', name: 'User', desc: 'Standard Client', icon: MessageSquare },
    { value: 'agent', name: 'Agent', desc: 'Support Staff', icon: UserCheck },
    
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden font-sans">
      
      <div className="relative md:w-1/3 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-12 flex flex-col justify-between overflow-hidden border-r border-slate-900">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
        
        <div className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-sm text-white">
            QT
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white">QTechy Hub</span>
        </div>

        <div className="space-y-6 z-10 my-auto">
          <span className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-full w-fit">
            Registration Gate
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            Create System <br />
            <span className="text-indigo-400">Clearance Profile</span>
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
            Join our ticketing ecosystem. Select your operational clearance level and configure your dashboard.
          </p>
        </div>

        <div className="z-10 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} QTechy Inc. Registration protocol.
        </div>
      </div>

      <div className="md:w-2/3 bg-slate-950 flex items-center justify-center p-8 md:p-12 relative overflow-y-auto">
        <div className="max-w-xl w-full space-y-8 bg-slate-900/40 p-8 rounded-2xl border border-slate-900 shadow-2xl backdrop-blur-md animate-fade-in my-6">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <UserPlus size={22} className="text-indigo-400" /> Create Account
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Configure your clearance role and credential parameters.
            </p>
          </div>

          {isError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-medium">
              {message}
            </div>
          )}

          <form className="space-y-6" onSubmit={onSubmit}>
            
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Select Clearance Role</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roleCards.map((card) => {
                  const Icon = card.icon;
                  const isSelected = role === card.value;
                  return (
                    <button
                      key={card.value}
                      type="button"
                      onClick={() => handleRoleSelect(card.value)}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all duration-200 hover:scale-[1.03] ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500 text-white' 
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg w-fit ${isSelected ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-900 text-slate-500'}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white tracking-tight">{card.name}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">{card.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-slate-800 bg-slate-950 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-600"
                  placeholder="John Doe"
                />
              </div>
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

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                {isLoading ? 'Creating cleared profile...' : 'Register'} <ArrowRight size={14} />
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-400">
            Already have clearance?{' '}
            <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;