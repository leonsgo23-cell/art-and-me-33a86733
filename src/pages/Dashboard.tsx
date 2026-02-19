import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Palette, Play, Lock, LogOut, User, CheckCircle, ShoppingCart, Loader2, ChevronDown } from 'lucide-react';
import { supabase } from '@/src/integrations/supabase/client';
import { useAuth } from '@/src/hooks/useAuth';
import { PROGRAM } from '@/constants';

interface Lesson {
  id: string;
  title: string;
  lesson_number: number;
  module_id: number;
  module_title: string;
  description: string | null;
  duration_minutes: number | null;
  video_url: string | null;
  sort_order: number;
}

// ─── МЕСТО ДЛЯ STRIPE ───────────────────────────────────────────────────────
// Когда будете добавлять Stripe, создайте функцию handlePurchase здесь:
// const handlePurchase = async (plan: 'online' | 'with_materials') => {
//   const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
//     body: { plan }
//   });
//   if (data?.url) window.location.href = data.url;
// };
// ────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading, hasCourseAccess } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [openModule, setOpenModule] = useState<number | null>(1);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (hasCourseAccess) {
      fetchLessons();
    }
  }, [hasCourseAccess]);

  const fetchLessons = async () => {
    setLessonsLoading(true);
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .order('sort_order');
    if (data) setLessons(data as Lesson[]);
    setLessonsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-light flex items-center justify-center">
        <Loader2 className="text-vibrant animate-spin" size={40} />
      </div>
    );
  }

  if (!user) return null;

  // Group lessons by module
  const lessonsByModule = lessons.reduce<Record<number, Lesson[]>>((acc, l) => {
    if (!acc[l.module_id]) acc[l.module_id] = [];
    acc[l.module_id].push(l);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-warm-light">
      {/* Header */}
      <header className="bg-white border-b border-vibrant/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-vibrant p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <Palette className="text-white" size={20} />
            </div>
            <span className="text-xl font-black text-midnight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Art&amp;Me
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-midnight/60 text-sm font-medium">
              <User size={16} />
              <span>{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-bold text-midnight/60 hover:text-vibrant transition px-4 py-2 rounded-full hover:bg-vibrant/5"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-midnight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Личный кабинет
          </h1>
          <p className="text-midnight/50 font-medium text-lg">
            {hasCourseAccess ? 'Ваши уроки готовы. Творите!' : 'Купите курс, чтобы открыть доступ к урокам'}
          </p>
        </div>

        {/* ACCESS GATE */}
        {!hasCourseAccess ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {/* Plan 1 */}
            <div className="bg-white p-10 rounded-[3rem] border-2 border-vibrant/10 hover:border-vibrant/30 transition-all flex flex-col shadow-sm">
              <h3 className="text-2xl font-black text-midnight mb-3">Online course</h3>
              <div className="text-5xl font-black text-vibrant mb-4">139 €</div>
              <p className="text-midnight/50 font-medium mb-8 text-sm">Для тех, у кого уже есть материалы</p>
              <ul className="space-y-3 mb-10 flex-grow text-sm font-bold text-midnight/70">
                {['30 видео-уроков', '13 модулей', '6 месяцев доступа', 'Сертификат'].map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-vibrant shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {/* STRIPE PLACEHOLDER: замените button на вызов handlePurchase('online') */}
              <button
                disabled
                className="w-full py-4 rounded-full bg-midnight/10 text-midnight/40 font-black cursor-not-allowed text-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Скоро — оплата онлайн
              </button>
            </div>

            {/* Plan 2 */}
            <div className="bg-white p-10 rounded-[3rem] border-4 border-vibrant shadow-2xl shadow-vibrant/10 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-vibrant text-white px-6 py-1.5 rounded-bl-2xl font-black text-xs uppercase tracking-widest">
                Бестселлер
              </div>
              <h3 className="text-2xl font-black text-midnight mb-3">Course + Materials</h3>
              <div className="text-5xl font-black text-vibrant mb-4">189 €</div>
              <p className="text-midnight/50 font-medium mb-8 text-sm">Всё включено — начните сразу!</p>
              <ul className="space-y-3 mb-10 flex-grow text-sm font-bold text-midnight/70">
                {['Всё из Online course', '8 холстов 30×40 см', 'Набор профи-красок', 'Кисти и палитра', 'Бесплатная доставка'].map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-vibrant shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {/* STRIPE PLACEHOLDER: замените button на вызов handlePurchase('with_materials') */}
              <button
                disabled
                className="w-full py-4 rounded-full bg-vibrant/20 text-vibrant/50 font-black cursor-not-allowed text-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Скоро — оплата онлайн
              </button>
            </div>
          </div>
        ) : (
          /* LESSONS VIEW */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar — module list */}
            <div className="lg:col-span-1 space-y-3">
              {PROGRAM.map((module) => {
                const moduleLessons = lessonsByModule[module.id] || [];
                const isOpen = openModule === module.id;
                return (
                  <div key={module.id} className="bg-white rounded-[2rem] overflow-hidden border border-vibrant/5 shadow-sm">
                    <button
                      onClick={() => setOpenModule(isOpen ? null : module.id)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-vibrant/5 transition"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-black text-vibrant/30 font-serif">
                          {module.id < 10 ? `0${module.id}` : module.id}
                        </span>
                        <span className="text-sm font-black text-midnight leading-tight pr-2">{module.title}</span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-vibrant/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 space-y-2 border-t border-vibrant/5 pt-3">
                        {lessonsLoading ? (
                          <div className="py-3 flex justify-center">
                            <Loader2 size={18} className="animate-spin text-vibrant/50" />
                          </div>
                        ) : moduleLessons.length === 0 ? (
                          <p className="text-xs text-midnight/40 font-medium py-2">Уроки загружаются...</p>
                        ) : (
                          moduleLessons.map(lesson => (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-3 ${
                                selectedLesson?.id === lesson.id
                                  ? 'bg-vibrant text-white'
                                  : 'hover:bg-vibrant/10 text-midnight/70'
                              }`}
                            >
                              <Play size={14} className="shrink-0" fill="currentColor" />
                              Урок {lesson.lesson_number}: {lesson.title}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Main — video player */}
            <div className="lg:col-span-2">
              {selectedLesson ? (
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-vibrant/5">
                  {selectedLesson.video_url ? (
                    <div className="aspect-video bg-midnight">
                      <video
                        key={selectedLesson.id}
                        controls
                        className="w-full h-full"
                        src={selectedLesson.video_url}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-midnight/5 flex flex-col items-center justify-center gap-4 text-midnight/30">
                      <Play size={48} />
                      <p className="font-bold text-sm">Видео скоро появится</p>
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-vibrant/10 text-vibrant text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        Модуль {selectedLesson.module_id}
                      </span>
                      {selectedLesson.duration_minutes && (
                        <span className="text-midnight/40 text-xs font-bold">
                          {selectedLesson.duration_minutes} мин
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-black text-midnight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Урок {selectedLesson.lesson_number}: {selectedLesson.title}
                    </h2>
                    {selectedLesson.description && (
                      <p className="text-midnight/60 font-medium leading-relaxed">{selectedLesson.description}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-[2.5rem] p-16 shadow-sm border border-vibrant/5 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                  <div className="bg-vibrant/10 p-6 rounded-full mb-6">
                    <Play className="text-vibrant" size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-midnight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Выберите урок
                  </h3>
                  <p className="text-midnight/50 font-medium max-w-xs">
                    Откройте любой модуль слева и нажмите на урок, чтобы начать просмотр
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
