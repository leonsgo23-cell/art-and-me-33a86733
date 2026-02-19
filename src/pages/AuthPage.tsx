import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Palette, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '@/src/integrations/supabase/client';

type Mode = 'login' | 'register';

export default function AuthPage({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        setMessage('Письмо с подтверждением отправлено на вашу почту. Пожалуйста, проверьте ящик.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Произошла ошибка';
      if (msg.includes('Invalid login credentials')) setError('Неверный email или пароль');
      else if (msg.includes('User already registered')) setError('Такой email уже зарегистрирован');
      else if (msg.includes('Password should be at least')) setError('Пароль должен быть не менее 6 символов');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-light flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="bg-vibrant p-2.5 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-vibrant/20">
              <Palette className="text-white" size={22} />
            </div>
            <span className="text-3xl font-black text-midnight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Art&amp;Me
            </span>
          </Link>
          <p className="text-midnight/50 mt-3 text-sm font-medium">
            {mode === 'login' ? 'Войдите в личный кабинет' : 'Создайте аккаунт'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-vibrant/5">
          <h1 className="text-3xl font-black text-midnight mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            {mode === 'login' ? 'Добро пожаловать' : 'Начните путь'}
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-medium">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-bold text-midnight/70 mb-2 uppercase tracking-widest">Ваше имя</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Анна"
                  required
                  className="w-full px-5 py-4 rounded-2xl border-2 border-vibrant/10 focus:border-vibrant outline-none transition text-midnight font-medium bg-warm-light"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-midnight/70 mb-2 uppercase tracking-widest">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-5 py-4 rounded-2xl border-2 border-vibrant/10 focus:border-vibrant outline-none transition text-midnight font-medium bg-warm-light"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-midnight/70 mb-2 uppercase tracking-widest">Пароль</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-vibrant/10 focus:border-vibrant outline-none transition text-midnight font-medium bg-warm-light pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-midnight/40 hover:text-vibrant transition"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-full bg-vibrant text-white font-black text-lg hover:bg-midnight transition-all shadow-lg shadow-vibrant/20 disabled:opacity-60 flex items-center justify-center gap-3 mt-2"
            >
              {loading && <Loader2 size={20} className="animate-spin" />}
              {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="text-center mt-8 text-midnight/50 text-sm font-medium">
            {mode === 'login' ? (
              <>Нет аккаунта?{' '}
                <Link to="/register" className="text-vibrant font-bold hover:underline">Зарегистрироваться</Link>
              </>
            ) : (
              <>Уже есть аккаунт?{' '}
                <Link to="/login" className="text-vibrant font-bold hover:underline">Войти</Link>
              </>
            )}
          </p>
        </div>

        <p className="text-center mt-6 text-midnight/30 text-xs font-medium">
          <Link to="/" className="hover:text-vibrant transition">← Вернуться на главную</Link>
        </p>
      </div>
    </div>
  );
}
