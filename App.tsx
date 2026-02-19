
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Star, Play, CheckCircle, Package, ChevronDown, Sparkles, Menu, X, Brush, ShieldCheck, Wine, Sparkle, Heart } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { PRICING, PROGRAM } from './constants';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 group cursor-pointer">
            <div className="bg-vibrant p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-vibrant/20">
              <Palette className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-midnight" style={{ fontFamily: "'Playfair Display', serif" }}>Art&Me</span>
          </div>
          <div className="hidden md:flex space-x-10 text-xs font-bold tracking-[0.2em] uppercase text-midnight/80">
            <a href="#about" className="hover:text-vibrant transition-colors">О нас</a>
            <a href="#program" className="hover:text-vibrant transition-colors">Программа</a>
            <a href="#studio" className="hover:text-vibrant transition-colors">Студия</a>
            <a href="#pricing" className="hover:text-vibrant transition-colors">Тарифы</a>
            <a href="#faq" className="hover:text-vibrant transition-colors">FAQ</a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-midnight/60 hover:text-vibrant transition-colors px-4 py-2">
              Войти
            </Link>
            <a href="#pricing" className="bg-vibrant text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-midnight transition-all shadow-xl hover:shadow-vibrant/40">
              Начать рисовать
            </a>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-midnight p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white border-t p-8 space-y-6 shadow-2xl animate-fade-in h-screen fixed inset-0 z-50 pt-24">
           <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-midnight">
            <X size={32} />
          </button>
          <a href="#about" className="block text-3xl font-serif italic text-midnight" onClick={() => setIsOpen(false)}>О курсе</a>
          <a href="#program" className="block text-3xl font-serif italic text-midnight" onClick={() => setIsOpen(false)}>Программа</a>
          <a href="#studio" className="block text-3xl font-serif italic text-midnight" onClick={() => setIsOpen(false)}>Студия</a>
          <a href="#pricing" className="block text-3xl font-serif italic text-midnight" onClick={() => setIsOpen(false)}>Тарифы</a>
          <Link to="/login" className="block text-3xl font-serif italic text-vibrant" onClick={() => setIsOpen(false)}>Войти</Link>
          <div className="pt-10">
            <a href="#pricing" className="block w-full text-center bg-vibrant text-white py-5 rounded-2xl font-bold text-xl shadow-lg" onClick={() => setIsOpen(false)}>Записаться</a>
          </div>
        </div>
      )}
    </nav>
  );
};

const AICreativeInspiration = () => {
  const [quote, setQuote] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const getInspiration = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Напиши одну короткую вдохновляющую фразу на русском для женщины, которая начинает рисовать. Тепло, ярко и мотивирующе. До 12 слов.',
        config: { temperature: 1.0 }
      });
      setQuote(response.text || "Твое творчество — это яркий танец красок на холсте.");
    } catch (error) {
      setQuote("Твое сердце полно красок. Просто дай им свободу проявиться.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getInspiration(); }, []);

  return (
    <div className="bg-white/70 backdrop-blur-sm p-8 rounded-[2.5rem] border-2 border-vibrant/10 shadow-xl text-center max-w-lg mx-auto mt-12 group hover:border-vibrant transition-all">
      <Sparkles className="mx-auto text-vibrant mb-3 animate-pulse" size={24} />
      <p className="italic text-midnight text-xl leading-relaxed font-medium font-serif">
        {loading ? "..." : `«${quote.trim()}»`}
      </p>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  return (
    <details className="group border-b border-vibrant/10 py-8">
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <h3 className="text-xl font-bold text-midnight group-hover:text-vibrant transition-colors pr-8">{question}</h3>
        <div className="bg-vibrant/10 p-2 rounded-full text-vibrant group-open:rotate-180 transition-transform flex-shrink-0">
          <ChevronDown size={20} />
        </div>
      </summary>
      <p className="mt-6 text-midnight/80 font-light leading-relaxed text-lg animate-fade-in pl-6 border-l-4 border-vibrant/40">{answer}</p>
    </details>
  );
};

export default function App() {
  return (
    <div className="min-h-screen selection:bg-vibrant/20 selection:text-vibrant overflow-x-hidden">
      <Navbar />

      {/* 1. HERO */}
      <section className="relative pt-32 pb-24 lg:pt-64 lg:pb-48 bg-warm-light overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-vibrant/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute top-0 right-0 -z-10 w-full lg:w-1/2 h-full">
          <img 
             src="/images/celebration.jpg" 
             alt="Атмосфера творчества" 
             className="h-full w-full lg:rounded-bl-[250px] object-cover" 
           />
           <div className="absolute inset-0 bg-gradient-to-l from-transparent via-warm-light/60 to-warm-light lg:from-transparent lg:to-warm-light lg:w-1/4"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:w-7/12 relative z-10">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white shadow-xl border-l-4 border-vibrant text-midnight font-bold text-[11px] tracking-[0.2em] uppercase mb-10">
              <Sparkle size={16} className="text-vibrant" />
              <span>Твой путь к творчеству</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-midnight leading-[0.9] mb-10 tracking-tighter">
              Создайте уют и <span className="text-vibrant italic font-normal serif">8 собственных картин</span> — не выходя из дома
            </h1>
            <p className="text-xl md:text-2xl text-midnight/90 max-w-xl mb-12 leading-relaxed font-medium">
              Обретите любимое хобби, спокойствие и уверенность в своем таланте. Пошаговое обучение от экспертов художественной студии.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <a href="#pricing" className="w-full sm:w-auto text-center bg-vibrant text-white px-16 py-7 rounded-full text-xl font-bold hover:shadow-vibrant hover:-translate-y-2 transition-all duration-300">
                Начать рисовать
              </a>
              <div className="flex items-center gap-4 bg-white/80 p-3 rounded-2xl backdrop-blur-sm border border-vibrant/10">
                <div className="text-sm font-bold text-midnight/80">
                  <span className="text-vibrant font-black text-lg">30</span> уроков • <span className="text-vibrant font-black text-lg">13</span> модулей
                </div>
              </div>
            </div>
            <AICreativeInspiration />
          </div>
        </div>
      </section>

      {/* 2. ВЫ УЗНАЕТЕ СЕБЯ */}
      <section className="py-32 bg-white" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-black mb-12 leading-tight tracking-tight text-midnight">Вы узнаете <br/><span className="text-vibrant">себя?</span></h2>
              <div className="space-y-8">
                {[
                  { title: "Страх чистого листа", text: "Вы мечтаете рисовать, но боитесь испортить холст и не знаете, с чего начать." },
                  { title: "Поиск качественного досуга", text: "Хочется переключиться после работы на что-то созидательное и красивое." },
                  { title: "Недостаток базы", text: "Думаете, что рисование — это только для талантливых от природы, а не навык." },
                  { title: "Желание украсить дом", text: "Хотите создавать вещи, которые будут наполнять интерьер вашим характером." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 items-start group">
                    <div className={`flex-shrink-0 mt-1 w-12 h-12 rounded-2xl bg-vibrant/10 flex items-center justify-center text-vibrant shadow-sm group-hover:bg-vibrant group-hover:text-white transition-all`}>
                      <span className="font-bold text-xl">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-midnight">{item.title}</h3>
                      <p className="text-lg text-midnight/70 font-medium leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
                <div className="bg-slate-50 rounded-[3rem] shadow-2xl rotate-2 overflow-hidden aspect-[4/5]">
                  <img src="/images/group1.jpg" alt="Процесс рисования" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 z-20 border border-slate-100">
                   <div className="bg-sunny/20 p-3 rounded-full text-sunny"><Heart fill="currentColor" /></div>
                   <div className="text-midnight font-bold">100% творчество</div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ВАШ ПЕРВЫЙ ВЕЧЕР */}
      <section className="py-32 bg-vibrant/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-[4rem] p-8 md:p-24 shadow-xl relative overflow-hidden flex flex-col lg:flex-row gap-16 items-center">
                <div className="lg:w-1/2 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black mb-12 text-midnight leading-tight">Ваш первый вечер <br/><span className="text-vibrant italic">рисования</span></h2>
                    <div className="space-y-8 text-xl font-medium text-midnight/80 leading-relaxed italic font-serif">
                        <p>«Представьте: вы зажигаете свечи, включаете любимый плейлист и наливаете чашку ароматного чая. Перед вами — чистый холст и сочные краски.</p>
                        <p>Вы открываете первый урок и просто следуете за кистью мастера. Никакой спешки. Только запах акрила, мягкое скольжение кисти и то самое чувство, когда из ничего рождается красота.</p>
                        <p className="text-vibrant font-black not-italic text-2xl">К концу вечера вы с удивлением смотрите на свою первую картину и понимаете: я МОГУ.»</p>
                    </div>
                </div>
                <div className="lg:w-1/2 w-full">
                    <div className="rounded-[2rem] shadow-2xl transform lg:scale-110 lg:rotate-3 overflow-hidden aspect-square bg-slate-50">
                      <img src="/images/group2.jpg" alt="Эстетика живописи" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 6. О СТУДИИ */}
      <section className="py-32 bg-white" id="studio">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-4 mb-8">
                <Wine size={32} className="text-vibrant" />
                <h2 className="text-5xl font-black text-midnight tracking-tight">Студия Art&Wine</h2>
              </div>
              <div className="space-y-6 text-xl font-medium text-midnight/80 leading-relaxed">
                <p>Мы — художественная студия с многолетним опытом живых мастер-классов. Наш онлайн-курс — это не просто видео, а концентрат вдохновения.</p>
                <p>Мы видели, как в руках новичков рождаются шедевры. Через наши студии прошли более 20 тысяч гостей, и этот опыт мы бережно упаковали в курс Art&Me.</p>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-8">
                <div className="bg-warm-light p-6 rounded-3xl border border-vibrant/5">
                  <div className="text-4xl font-black text-vibrant">10+</div>
                  <p className="text-sm font-bold uppercase tracking-widest text-midnight/50 mt-1">Лет опыта</p>
                </div>
                <div className="bg-warm-light p-6 rounded-3xl border border-vibrant/5">
                  <div className="text-4xl font-black text-vibrant">20k+</div>
                  <p className="text-sm font-bold uppercase tracking-widest text-midnight/50 mt-1">Довольных гостей</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
                <div className="rounded-[4rem] shadow-2xl h-[500px] overflow-hidden bg-slate-50">
                  <img src="/images/group3.jpg" alt="Наша студия" className="w-full h-full object-cover" />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ГАЛЕРЕЯ РАБОТ */}
      <section className="py-32 bg-warm-light overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-8 italic serif text-midnight">Ваши будущие работы</h2>
            <p className="text-midnight/50 text-xl font-medium">Эти картины вы напишете сами, шаг за шагом</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { src: "/images/painting-sunset.png", title: "Золотой закат" },
              { src: "/images/painting-winter.png", title: "Зимняя сказка" },
              { src: "/images/painting-ballet.png", title: "Грация" },
              { src: "/images/painting-bicycle.png", title: "Цветочный этюд" },
              { src: "/images/portrait.jpg", title: "Портрет вдохновения" },
              { src: "/images/group1.jpg", title: "Атмосфера студии" },
              { src: "/images/group2.jpg", title: "Наши ученики" },
              { src: "/images/group4.jpg", title: "Праздник красок" }
            ].map((item, i) => (
              <div key={i} className="group relative rounded-3xl overflow-hidden shadow-lg aspect-[4/5] bg-white border border-slate-100">
                <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                <div className="absolute inset-0 bg-midnight/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6 text-center">
                    <p className="text-white font-bold text-lg leading-tight uppercase tracking-widest">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. ПРОГРАММА */}
      <section className="py-32 bg-white" id="program">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
             <h2 className="text-5xl md:text-8xl font-black mb-8 text-midnight tracking-tighter">Программа обучения</h2>
             <p className="text-midnight/50 text-xl font-medium uppercase tracking-[0.2em] text-xs font-bold">Путь от первого мазка до коллекции работ</p>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            {PROGRAM.map((module) => (
              <details key={module.id} className="group bg-warm-light rounded-[2.5rem] overflow-hidden border border-vibrant/5 transition-all">
                <summary className="flex items-center justify-between cursor-pointer py-10 px-8 list-none group-open:bg-vibrant/5">
                  <div className="flex items-center gap-8">
                    <span className="text-5xl font-black text-vibrant/20 font-serif leading-none">{module.id < 10 ? `0${module.id}` : module.id}</span>
                    <h3 className="text-xl font-black tracking-tight text-midnight">{module.title}</h3>
                  </div>
                  <div className="bg-vibrant/10 p-3 rounded-full group-open:rotate-180 transition-transform text-vibrant">
                    <ChevronDown size={24} />
                  </div>
                </summary>
                <div className="px-10 pb-12 pt-6 animate-fade-in text-midnight/80 leading-relaxed text-lg font-medium">
                  <p className="mb-6">{module.description}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-vibrant/10 text-vibrant rounded-full text-sm font-bold">
                    <Play size={16} fill="currentColor" />
                    <span>{module.lessons} видео-урока</span>
                  </div>
                </div>
              </details>
            ))}
        </div>
      </section>

      {/* 9. ТАРИФЫ */}
      <section className="py-32 bg-vibrant/5" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-6xl font-black text-midnight tracking-tighter">Ваш формат обучения</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-white p-12 rounded-[4rem] border-2 border-transparent hover:border-vibrant/20 transition-all flex flex-col h-full shadow-sm">
                <h3 className="text-3xl font-black mb-6 text-midnight">Online course</h3>
                <div className="text-6xl font-black text-vibrant mb-8">139 €</div>
                <p className="text-lg font-bold text-midnight/50 mb-10 italic">Для тех, у кого уже есть краски и холсты</p>
                <ul className="space-y-6 mb-16 flex-grow">
                  {[
                    "Полная программа: 13 модулей",
                    "30 пошаговых видео-уроков",
                    "8 готовых картин по итогу",
                    "Доступ к платформе на 6 месяцев",
                    "Поддержка в закрытом чате",
                    "Сертификат об окончании"
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-4 text-midnight font-bold">
                      <CheckCircle size={20} className="text-vibrant shrink-0 mt-1" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-6 rounded-full bg-midnight text-white font-black text-xl hover:bg-vibrant transition-all">Купить курс</button>
            </div>

            <div className="bg-white p-12 rounded-[4rem] border-4 border-vibrant shadow-2xl flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-vibrant text-white px-8 py-2 rounded-bl-3xl font-black text-xs uppercase tracking-widest">Бестселлер</div>
                <h3 className="text-3xl font-black mb-6 text-midnight">Course + Materials</h3>
                <div className="text-6xl font-black text-vibrant mb-8">189 €</div>
                <p className="text-lg font-bold text-midnight/50 mb-10 italic">Начните сразу — мы всё пришлем!</p>
                
                <div className="mb-10 p-6 bg-vibrant/5 rounded-3xl border border-vibrant/10">
                    <p className="font-black text-sm uppercase tracking-widest text-vibrant mb-4 flex items-center gap-2">
                        <Package size={18} /> Что внутри бокса:
                    </p>
                    <ul className="grid grid-cols-1 gap-2 text-sm font-bold text-midnight/70">
                        <li>• 8 холстов (30×40 см)</li>
                        <li>• Набор профессионального акрила</li>
                        <li>• 5 качественных кистей</li>
                        <li>• Палитра и фартук</li>
                        <li>• Бесплатная доставка</li>
                    </ul>
                </div>

                <ul className="space-y-6 mb-16 flex-grow">
                  {[
                    "Всё из тарифа Online course",
                    "Премиальный бокс материалов",
                    "Идеально для подарка себе",
                    "Начните творить через 2 дня"
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-4 text-midnight font-bold">
                      <CheckCircle size={20} className="text-vibrant shrink-0 mt-1" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-6 rounded-full bg-vibrant text-white font-black text-xl hover:bg-midnight transition-all shadow-xl shadow-vibrant/20">Хочу с набором</button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="py-48 bg-midnight relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-40">
           <img src="/images/group4.jpg" alt="Фон успеха" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-6xl md:text-9xl font-black text-white mb-16 leading-none tracking-tighter">
            Начните историю <br /> своего успеха <br />
            <span className="text-vibrant italic serif font-normal">одним мазком</span>
          </h2>
          <p className="text-white/70 text-2xl mb-20 max-w-2xl mx-auto font-medium">
            Ваше новое расслабляющее хобби и 8 картин уже ждут вас. Разрешите себе творить.
          </p>
          <a href="#pricing" className="inline-block bg-white text-midnight px-20 py-8 rounded-full text-3xl font-black hover:scale-105 transition-all shadow-2xl hover:bg-vibrant hover:text-white">
            Я хочу рисовать!
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-warm-light border-t border-vibrant/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center space-x-2">
                <Palette className="text-vibrant" size={28} />
                <span className="text-3xl font-black text-midnight" style={{ fontFamily: "'Playfair Display', serif" }}>Art&Me</span>
            </div>
            <div className="text-center md:text-right text-midnight/50 font-bold uppercase tracking-widest text-xs">
                <p>© 2024 Art&Me Online. Проект художественной студии Art&Wine.</p>
                <div className="flex gap-8 mt-4 justify-center md:justify-end">
                    <a href="#" className="hover:text-vibrant">Оферта</a>
                    <a href="#" className="hover:text-vibrant">Политика конфиденциальности</a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
