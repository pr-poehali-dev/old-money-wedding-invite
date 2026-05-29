import { useState, useEffect, useRef } from "react";

const COUPLE = { him: "Александр", her: "Елизавета", date: "14 сентября 2026", venue: "Усадьба «Дворянское гнездо»", address: "Московская область, Рублёво-Успенское шоссе, 42" };

const WEDDING_DATE = new Date("2026-09-14T16:00:00");

const GALLERY = [
  { src: "https://cdn.poehali.dev/projects/7a5ac2a2-443d-4bbd-ba61-bc31852543f6/files/05053047-b746-4ef7-b06f-56224068a323.jpg", caption: "Наша история" },
  { src: "https://cdn.poehali.dev/projects/7a5ac2a2-443d-4bbd-ba61-bc31852543f6/files/97bef09c-418e-456b-a6f8-2451b3c61591.jpg", caption: "Место торжества" },
  { src: "https://cdn.poehali.dev/projects/7a5ac2a2-443d-4bbd-ba61-bc31852543f6/files/800066fc-4b12-4afd-9f0a-98aa9eb0dcb3.jpg", caption: "Вечер для вас" },
];

const SCHEDULE = [
  { time: "15:00", event: "Сбор гостей", desc: "Добро пожаловать" },
  { time: "16:00", event: "Церемония", desc: "Обмен клятвами" },
  { time: "17:00", event: "Фуршет", desc: "Шампанское и закуски" },
  { time: "18:00", event: "Торжественный ужин", desc: "Банкетный зал" },
  { time: "22:00", event: "Танцы", desc: "До рассвета" },
];

function useCountdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = WEDDING_DATE.getTime() - Date.now();
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("revealed"); } });
    }, { threshold: 0.12 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); } else { audioRef.current.play().catch(() => {}); }
    setPlaying(!playing);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    const onEnd = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => { audio.removeEventListener("timeupdate", onTime); audio.removeEventListener("ended", onEnd); };
  }, []);

  return (
    <div className="music-player">
      <audio ref={audioRef} src="" preload="none" />
      <div className="music-inner">
        <div className="music-note">{playing ? "♪" : "♩"}</div>
        <div className="music-info">
          <span className="music-title">Наша мелодия</span>
          <div className="music-bar"><div className="music-fill" style={{ width: `${progress}%` }} /></div>
        </div>
        <button className="music-btn" onClick={toggle}>{playing ? "⏸" : "▶"}</button>
      </div>
    </div>
  );
}

function CalendarWidget() {
  const month = 8;
  const year = 2026;
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const total = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let i = 1; i <= total; i++) cells.push(i);

  return (
    <div className="cal-wrap">
      <div className="cal-month">Сентябрь 2026</div>
      <div className="cal-grid-head">{days.map((d) => <div key={d} className="cal-day-head">{d}</div>)}</div>
      <div className="cal-grid">
        {cells.map((d, i) => (
          <div key={i} className={`cal-cell ${d === 14 ? "cal-wedding" : ""} ${!d ? "cal-empty" : ""}`}>
            {d}
            {d === 14 && <span className="cal-heart">♥</span>}
          </div>
        ))}
      </div>
      <div className="cal-note">Добавить в календарь</div>
    </div>
  );
}

const Index = () => {
  const time = useCountdown();
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [rsvp, setRsvp] = useState<string | null>(null);
  useScrollReveal();

  const prev = () => setGalleryIdx((i) => (i - 1 + GALLERY.length) % GALLERY.length);
  const next = () => setGalleryIdx((i) => (i + 1) % GALLERY.length);

  return (
    <div className="wedding-root">
      <div className="top-ornament">
        <span className="orn-line" /><span className="orn-diamond">◆</span><span className="orn-line" />
      </div>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-bg" style={{ backgroundImage: `url(${GALLERY[0].src})` }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-sup reveal">Приглашение на бракосочетание</p>
          <div className="hero-ampersand reveal">
            <span className="hero-name">{COUPLE.him}</span>
            <span className="amp">&</span>
            <span className="hero-name">{COUPLE.her}</span>
          </div>
          <div className="hero-divider reveal"><span className="div-line" /><span className="div-diamond">✦</span><span className="div-line" /></div>
          <p className="hero-date reveal">{COUPLE.date}</p>
          <p className="hero-venue reveal">{COUPLE.venue}</p>
        </div>
        <div className="scroll-hint">
          <span className="scroll-text">прокрутите</span>
          <span className="scroll-arrow">↓</span>
        </div>
      </section>

      <MusicPlayer />

      {/* COUNTDOWN */}
      <section className="section countdown-section">
        <div className="section-label reveal">До торжества осталось</div>
        <div className="countdown reveal">
          {[{ v: time.days, l: "дней" }, { v: time.hours, l: "часов" }, { v: time.minutes, l: "минут" }, { v: time.seconds, l: "секунд" }].map(({ v, l }) => (
            <div key={l} className="count-item">
              <span className="count-num">{String(v).padStart(2, "0")}</span>
              <span className="count-label">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="section story-section">
        <div className="section-ornament"><span className="orn-line" /><span className="orn-diamond">◆</span><span className="orn-line" /></div>
        <h2 className="section-title reveal">Наша история</h2>
        <div className="story-text reveal">
          <p>Мы встретились однажды осенью, когда золото листьев ещё не успело упасть на старую брусчатку. С тех пор каждый закат стал немного теплее, а каждое утро — поводом улыбнуться.</p>
          <p>Теперь мы хотим разделить этот особенный день с теми, кто нам дорог.</p>
        </div>
        <div className="story-sig reveal">
          <span className="sig">{COUPLE.him} & {COUPLE.her}</span>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section gallery-section">
        <div className="section-ornament"><span className="orn-line" /><span className="orn-diamond">◆</span><span className="orn-line" /></div>
        <h2 className="section-title reveal">Галерея</h2>
        <div className="gallery-slider reveal">
          <button className="gal-arrow gal-prev" onClick={prev}>‹</button>
          <div className="gal-img-wrap">
            <img src={GALLERY[galleryIdx].src} alt={GALLERY[galleryIdx].caption} className="gal-img" key={galleryIdx} />
            <div className="gal-caption">{GALLERY[galleryIdx].caption}</div>
          </div>
          <button className="gal-arrow gal-next" onClick={next}>›</button>
        </div>
        <div className="gal-dots">
          {GALLERY.map((_, i) => <button key={i} className={`gal-dot ${i === galleryIdx ? "active" : ""}`} onClick={() => setGalleryIdx(i)} />)}
        </div>
      </section>

      {/* SCHEDULE */}
      <section className="section schedule-section">
        <div className="section-ornament"><span className="orn-line" /><span className="orn-diamond">◆</span><span className="orn-line" /></div>
        <h2 className="section-title reveal">Программа дня</h2>
        <div className="schedule-list">
          {SCHEDULE.map((item, i) => (
            <div key={i} className="sch-item reveal">
              <div className="sch-time">{item.time}</div>
              <div className="sch-dot" />
              <div className="sch-info">
                <span className="sch-event">{item.event}</span>
                <span className="sch-desc">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALENDAR */}
      <section className="section calendar-section">
        <div className="section-ornament"><span className="orn-line" /><span className="orn-diamond">◆</span><span className="orn-line" /></div>
        <h2 className="section-title reveal">Дата свадьбы</h2>
        <div className="reveal"><CalendarWidget /></div>
      </section>

      {/* LOCATION */}
      <section className="section location-section">
        <div className="section-ornament"><span className="orn-line" /><span className="orn-diamond">◆</span><span className="orn-line" /></div>
        <h2 className="section-title reveal">Место проведения</h2>
        <div className="location-card reveal">
          <div className="loc-icon">⚜</div>
          <div className="loc-name">{COUPLE.venue}</div>
          <div className="loc-addr">{COUPLE.address}</div>
          <button className="loc-btn">Открыть на карте</button>
        </div>
      </section>

      {/* RSVP */}
      <section className="section rsvp-section">
        <div className="section-ornament rsvp-orn"><span className="orn-line-dark" /><span className="orn-diamond-light">◆</span><span className="orn-line-dark" /></div>
        <h2 className="section-title section-title-light reveal">Подтвердите присутствие</h2>
        <p className="rsvp-sub reveal">Пожалуйста, дайте нам знать до 1 сентября 2026</p>
        {!rsvp ? (
          <div className="rsvp-btns reveal">
            <button className="rsvp-yes" onClick={() => setRsvp("yes")}>Буду с радостью</button>
            <button className="rsvp-no" onClick={() => setRsvp("no")}>К сожалению, не смогу</button>
          </div>
        ) : (
          <div className="rsvp-thanks reveal">
            {rsvp === "yes"
              ? <><span className="thanks-heart">♥</span><span>Благодарим вас! Ждём с нетерпением.</span></>
              : <span>Жаль, что вы не сможете быть с нами. Спасибо за ответ.</span>
            }
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="wedding-footer">
        <div className="footer-orn"><span className="orn-line-dark" /><span className="orn-diamond-light">◆</span><span className="orn-line-dark" /></div>
        <p className="footer-names">{COUPLE.him} & {COUPLE.her}</p>
        <p className="footer-date">{COUPLE.date}</p>
        <p className="footer-heart">♥</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Montserrat:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cream: #f8f3ea;
          --parchment: #f0e8d6;
          --gold: #c9a84c;
          --gold-light: #e8c97a;
          --gold-dark: #9a7435;
          --brown: #3d2b1f;
          --brown-mid: #6b4e35;
          --brown-light: #a07850;
          --text: #2c1f14;
          --text-muted: #7a6050;
          --shadow: rgba(60,30,10,0.12);
        }

        .wedding-root {
          background: var(--cream);
          color: var(--text);
          font-family: 'EB Garamond', serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .top-ornament, .section-ornament, .footer-orn {
          display: flex; align-items: center; justify-content: center; gap: 12px; padding: 20px 0;
        }
        .orn-line { flex: 1; max-width: 200px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
        .orn-line-dark { flex: 1; max-width: 200px; height: 1px; background: linear-gradient(90deg, transparent, rgba(200,168,76,0.5), transparent); }
        .orn-diamond { color: var(--gold); font-size: 10px; }
        .orn-diamond-light { color: rgba(200,168,76,0.7); font-size: 10px; }
        .div-line { flex: 1; max-width: 120px; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); }
        .div-diamond { color: rgba(255,255,255,0.8); font-size: 12px; }
        .hero-divider { display: flex; align-items: center; justify-content: center; gap: 10px; margin: 16px 0; }

        /* HERO */
        .hero-section {
          position: relative; min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0; background-size: cover; background-position: center;
          animation: subtle-zoom 20s ease-in-out infinite alternate;
        }
        @keyframes subtle-zoom { from { transform: scale(1.0); } to { transform: scale(1.08); } }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(30,15,5,0.4) 0%, rgba(20,10,3,0.58) 50%, rgba(30,15,5,0.5) 100%);
        }
        .hero-content {
          position: relative; z-index: 2; text-align: center; padding: 40px 24px; max-width: 760px;
        }
        .hero-sup {
          font-family: 'Montserrat', sans-serif; font-size: 11px; letter-spacing: 5px; text-transform: uppercase;
          color: rgba(220,190,130,0.9); margin-bottom: 36px;
        }
        .hero-ampersand {
          display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap; margin-bottom: 8px;
        }
        .hero-name {
          font-family: 'Cormorant Garamond', serif; font-size: clamp(42px, 9vw, 88px);
          font-weight: 300; color: #fff; letter-spacing: 2px; text-shadow: 0 2px 24px rgba(0,0,0,0.5);
        }
        .amp {
          font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 7vw, 68px);
          color: var(--gold-light); font-style: italic; font-weight: 300;
        }
        .hero-date {
          font-family: 'Cormorant Garamond', serif; font-size: clamp(18px, 3vw, 28px);
          color: rgba(220,190,130,0.95); letter-spacing: 4px; margin-bottom: 10px;
        }
        .hero-venue {
          font-family: 'Montserrat', sans-serif; font-size: 11px; letter-spacing: 3px;
          text-transform: uppercase; color: rgba(255,255,255,0.6);
        }
        .scroll-hint {
          position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          color: rgba(255,255,255,0.45); z-index: 2; animation: bounce-down 2.5s ease-in-out infinite;
        }
        .scroll-text { font-family: 'Montserrat', sans-serif; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; }
        .scroll-arrow { font-size: 18px; }
        @keyframes bounce-down { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(9px)} }

        /* MUSIC */
        .music-player {
          position: fixed; bottom: 24px; right: 24px; z-index: 100;
          background: rgba(248,243,234,0.96); border: 1px solid rgba(200,168,76,0.5);
          border-radius: 50px; padding: 10px 16px; box-shadow: 0 4px 24px var(--shadow);
          backdrop-filter: blur(12px);
        }
        .music-inner { display: flex; align-items: center; gap: 10px; }
        .music-note { font-size: 18px; color: var(--gold); animation: note-pulse 2.5s ease-in-out infinite; }
        @keyframes note-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.9)} }
        .music-info { display: flex; flex-direction: column; gap: 4px; min-width: 100px; }
        .music-title { font-family: 'Montserrat', sans-serif; font-size: 10px; letter-spacing: 1px; color: var(--brown-mid); }
        .music-bar { height: 2px; background: rgba(180,140,80,0.2); border-radius: 2px; overflow: hidden; }
        .music-fill { height: 100%; background: var(--gold); transition: width 0.5s linear; }
        .music-btn {
          background: var(--gold); color: var(--cream); border: none; width: 30px; height: 30px;
          border-radius: 50%; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s; flex-shrink: 0;
        }
        .music-btn:hover { background: var(--gold-dark); }

        /* SECTIONS */
        .section { max-width: 800px; margin: 0 auto; padding: 80px 24px; text-align: center; }
        .section-label {
          font-family: 'Montserrat', sans-serif; font-size: 10px; letter-spacing: 4px;
          text-transform: uppercase; color: var(--gold); margin-bottom: 32px;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif; font-size: clamp(28px, 5vw, 46px);
          font-weight: 400; color: var(--brown); margin-bottom: 32px; letter-spacing: 1px;
        }
        .section-title-light { color: rgba(240,225,195,0.95) !important; }

        /* COUNTDOWN */
        .countdown-section { background: var(--parchment); max-width: 100%; padding: 80px 24px; }
        .countdown { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
        .count-item {
          display: flex; flex-direction: column; align-items: center;
          background: white; border: 1px solid rgba(200,168,76,0.25); min-width: 90px; padding: 24px 16px;
          box-shadow: 0 2px 12px var(--shadow);
        }
        .count-num {
          font-family: 'Cormorant Garamond', serif; font-size: 52px; font-weight: 300;
          color: var(--brown); line-height: 1;
        }
        .count-label {
          font-family: 'Montserrat', sans-serif; font-size: 9px; letter-spacing: 2px;
          text-transform: uppercase; color: var(--gold); margin-top: 6px;
        }

        /* STORY */
        .story-text {
          max-width: 560px; margin: 0 auto 32px; display: flex; flex-direction: column; gap: 16px;
          font-size: 19px; line-height: 1.85; color: var(--brown-mid); font-style: italic;
        }
        .story-sig { font-family: 'Cormorant Garamond', serif; font-size: 30px; color: var(--gold-dark); font-style: italic; }

        /* GALLERY */
        .gallery-section { background: var(--parchment); max-width: 100%; padding: 80px 24px; }
        .gallery-slider { display: flex; align-items: center; justify-content: center; gap: 16px; max-width: 700px; margin: 0 auto; }
        .gal-img-wrap { flex: 1; position: relative; overflow: hidden; }
        .gal-img {
          width: 100%; max-height: 500px; object-fit: cover; display: block;
          animation: fade-gal 0.5s ease;
          box-shadow: 0 8px 40px rgba(60,30,10,0.22);
        }
        @keyframes fade-gal { from{opacity:0;transform:scale(0.98)} to{opacity:1;transform:scale(1)} }
        .gal-caption {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: linear-gradient(transparent, rgba(25,12,3,0.65));
          color: rgba(255,255,255,0.92); padding: 32px 16px 14px;
          font-family: 'Cormorant Garamond', serif; font-size: 20px; font-style: italic; text-align: center;
        }
        .gal-arrow {
          background: none; border: 1px solid var(--gold); color: var(--gold);
          width: 46px; height: 46px; font-size: 26px; cursor: pointer; flex-shrink: 0;
          transition: all 0.2s; display: flex; align-items: center; justify-content: center;
        }
        .gal-arrow:hover { background: var(--gold); color: var(--cream); }
        .gal-dots { display: flex; justify-content: center; gap: 8px; margin-top: 20px; }
        .gal-dot {
          width: 8px; height: 8px; border-radius: 50%; border: 1px solid var(--gold);
          background: transparent; cursor: pointer; transition: background 0.2s; padding: 0;
        }
        .gal-dot.active { background: var(--gold); }

        /* SCHEDULE */
        .schedule-list { max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; }
        .sch-item {
          display: grid; grid-template-columns: 65px 24px 1fr;
          align-items: start; gap: 0 16px; padding: 18px 0;
          border-bottom: 1px solid rgba(200,168,76,0.15);
        }
        .sch-time {
          font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--gold);
          text-align: right; padding-top: 2px; font-weight: 500;
        }
        .sch-dot {
          width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--gold);
          background: var(--cream); margin-top: 8px; position: relative; flex-shrink: 0;
        }
        .sch-dot::before {
          content: ''; position: absolute; top: 16px; left: 3px; width: 1px;
          height: 44px; background: rgba(200,168,76,0.25);
        }
        .sch-item:last-child .sch-dot::before { display: none; }
        .sch-info { display: flex; flex-direction: column; gap: 3px; text-align: left; }
        .sch-event { font-family: 'Cormorant Garamond', serif; font-size: 21px; color: var(--brown); }
        .sch-desc { font-family: 'Montserrat', sans-serif; font-size: 10px; letter-spacing: 1px; color: var(--text-muted); text-transform: uppercase; }

        /* CALENDAR */
        .cal-wrap {
          max-width: 380px; margin: 0 auto;
          background: white; border: 1px solid rgba(200,168,76,0.3); padding: 32px;
          box-shadow: 0 4px 24px var(--shadow);
        }
        .cal-month {
          font-family: 'Cormorant Garamond', serif; font-size: 26px; color: var(--brown);
          text-align: center; margin-bottom: 20px; letter-spacing: 1px;
        }
        .cal-grid-head, .cal-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 2px; }
        .cal-day-head {
          font-family: 'Montserrat', sans-serif; font-size: 9px; letter-spacing: 1px;
          text-transform: uppercase; color: var(--gold); text-align: center; padding: 8px 0;
        }
        .cal-cell {
          aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
          font-family: 'EB Garamond', serif; font-size: 14px; color: var(--brown-mid); position: relative;
        }
        .cal-empty { opacity: 0; pointer-events: none; }
        .cal-wedding {
          background: var(--gold); color: white !important; font-weight: 600; font-size: 16px;
          box-shadow: 0 2px 12px rgba(200,168,76,0.4);
        }
        .cal-heart { position: absolute; top: 1px; right: 2px; font-size: 7px; color: rgba(255,255,255,0.75); }
        .cal-note {
          text-align: center; margin-top: 20px; font-family: 'Montserrat', sans-serif;
          font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
          color: var(--gold); cursor: pointer; border-top: 1px solid rgba(200,168,76,0.2);
          padding-top: 16px; transition: color 0.2s;
        }
        .cal-note:hover { color: var(--gold-dark); }

        /* LOCATION */
        .location-card {
          max-width: 420px; margin: 0 auto; background: white;
          border: 1px solid rgba(200,168,76,0.3); padding: 48px 32px;
          box-shadow: 0 4px 24px var(--shadow); display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .loc-icon { font-size: 34px; color: var(--gold); }
        .loc-name { font-family: 'Cormorant Garamond', serif; font-size: 27px; color: var(--brown); }
        .loc-addr { font-family: 'Montserrat', sans-serif; font-size: 11px; letter-spacing: 1px; color: var(--text-muted); text-align: center; line-height: 1.7; }
        .loc-btn {
          margin-top: 10px; background: none; border: 1px solid var(--gold); color: var(--gold-dark);
          padding: 10px 32px; font-family: 'Montserrat', sans-serif; font-size: 10px; letter-spacing: 3px;
          text-transform: uppercase; cursor: pointer; transition: all 0.2s;
        }
        .loc-btn:hover { background: var(--gold); color: var(--cream); }

        /* RSVP */
        .rsvp-section { background: var(--brown); max-width: 100%; padding: 80px 24px; }
        .rsvp-sub {
          font-family: 'Montserrat', sans-serif; font-size: 10px; letter-spacing: 2px;
          color: rgba(200,168,76,0.65); text-transform: uppercase; margin-bottom: 40px;
        }
        .rsvp-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .rsvp-yes {
          background: var(--gold); color: var(--brown); border: none;
          padding: 14px 36px; font-family: 'Montserrat', sans-serif; font-size: 11px;
          letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; font-weight: 500;
        }
        .rsvp-yes:hover { background: var(--gold-light); }
        .rsvp-no {
          background: none; color: rgba(200,168,76,0.65); border: 1px solid rgba(200,168,76,0.35);
          padding: 14px 36px; font-family: 'Montserrat', sans-serif; font-size: 11px;
          letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.2s;
        }
        .rsvp-no:hover { border-color: var(--gold); color: var(--gold); }
        .rsvp-thanks {
          display: flex; align-items: center; gap: 12px; justify-content: center;
          font-family: 'Cormorant Garamond', serif; font-size: 22px; font-style: italic;
          color: rgba(240,225,195,0.9);
        }
        .thanks-heart { font-size: 30px; color: var(--gold); animation: beat 1.2s ease-in-out infinite; }
        @keyframes beat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }

        /* FOOTER */
        .wedding-footer {
          text-align: center; padding: 60px 24px 80px; background: var(--brown);
          border-top: 1px solid rgba(200,168,76,0.15);
        }
        .footer-names { font-family: 'Cormorant Garamond', serif; font-size: 34px; color: rgba(240,225,195,0.92); margin-bottom: 8px; font-style: italic; }
        .footer-date { font-family: 'Montserrat', sans-serif; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--gold); margin-bottom: 20px; }
        .footer-heart { font-size: 22px; color: var(--gold); animation: beat 2s ease-in-out infinite; }

        /* SCROLL REVEAL */
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.9s ease, transform 0.9s ease; }
        .revealed { opacity: 1; transform: translateY(0); }

        @media (max-width: 600px) {
          .music-player { bottom: 12px; right: 12px; }
          .music-info { min-width: 70px; }
          .sch-item { grid-template-columns: 50px 18px 1fr; }
          .cal-wrap { padding: 18px; }
          .gallery-slider { gap: 8px; }
          .gal-arrow { width: 36px; height: 36px; font-size: 20px; }
          .count-item { min-width: 72px; padding: 18px 10px; }
          .count-num { font-size: 40px; }
          .location-card { padding: 32px 20px; }
        }
      `}</style>
    </div>
  );
};

export default Index;
