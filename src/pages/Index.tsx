import { useState, useEffect, useRef } from "react";

const COUPLE = {
  him: "Александр",
  her: "Елизавета",
  date: "14 сентября 2026",
  venue: "Grand Palace Ballroom",
  address: "Москва, Тверская ул., 28",
};

const WEDDING_DATE = new Date("2026-09-14T18:00:00");

const GALLERY = [
  {
    src: "https://cdn.poehali.dev/projects/7a5ac2a2-443d-4bbd-ba61-bc31852543f6/files/4ed067b7-d784-4268-aa44-0145093249c1.jpg",
    caption: "Мы",
  },
  {
    src: "https://cdn.poehali.dev/projects/7a5ac2a2-443d-4bbd-ba61-bc31852543f6/files/25fc7b93-c809-41c6-ab66-9155835048e1.jpg",
    caption: "Церемония",
  },
  {
    src: "https://cdn.poehali.dev/projects/7a5ac2a2-443d-4bbd-ba61-bc31852543f6/files/9b907b9d-b945-4c4f-9c03-bd7d7761b09e.jpg",
    caption: "Банкет",
  },
];

const SCHEDULE = [
  { time: "17:00", event: "Сбор гостей", icon: "✦" },
  { time: "18:00", event: "Церемония", icon: "♢" },
  { time: "19:00", event: "Коктейльный час", icon: "◇" },
  { time: "20:00", event: "Торжественный ужин", icon: "✦" },
  { time: "23:00", event: "Танцевальная ночь", icon: "♢" },
];

function useCountdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = WEDDING_DATE.getTime() - Date.now();
      if (diff <= 0) return;
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

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".lx-reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("lx-revealed")),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function Particles() {
  const items = useRef(
    Array.from({ length: 18 }, () => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`,
      size: `${1 + Math.random() * 2}px`,
      opacity: 0.3 + Math.random() * 0.4,
    }))
  );
  return (
    <div className="particles" aria-hidden>
      {items.current.map((p, i) => (
        <span key={i} className="particle" style={{
          left: p.left, animationDelay: p.delay, animationDuration: p.duration,
          width: p.size, height: p.size, opacity: p.opacity,
        }} />
      ))}
    </div>
  );
}

function CalendarWidget() {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const firstDay = new Date(2026, 8, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const total = 30;
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let i = 1; i <= total; i++) cells.push(i);
  return (
    <div className="lx-cal">
      <div className="lx-cal-month">Сентябрь 2026</div>
      <div className="lx-cal-head">{days.map((d) => <div key={d} className="lx-cal-dh">{d}</div>)}</div>
      <div className="lx-cal-grid">
        {cells.map((d, i) => (
          <div key={i} className={`lx-cal-cell ${d === 14 ? "lx-cal-wday" : ""} ${!d ? "lx-cal-empty" : ""}`}>
            {d}
            {d === 14 && <span className="lx-cal-star">✦</span>}
          </div>
        ))}
      </div>
      <button className="lx-cal-add">+ Добавить в календарь</button>
    </div>
  );
}

const Index = () => {
  const time = useCountdown();
  const [idx, setIdx] = useState(0);
  const [rsvp, setRsvp] = useState<string | null>(null);
  useReveal();

  return (
    <div className="lx-root">

      {/* ── HERO ── */}
      <section className="lx-hero">
        <Particles />
        <div className="lx-hero-bg" style={{ backgroundImage: `url(${GALLERY[0].src})` }} />
        <div className="lx-hero-veil" />
        <div className="lx-hero-body">
          <div className="lx-tag lx-reveal">Wedding Invitation</div>
          <div className="lx-divider lx-reveal"><span className="lx-dl" /><span className="lx-ds">✦</span><span className="lx-dl" /></div>
          <h1 className="lx-hero-title lx-reveal">
            <span className="lx-name">{COUPLE.him}</span>
            <span className="lx-amp">&</span>
            <span className="lx-name">{COUPLE.her}</span>
          </h1>
          <div className="lx-divider lx-reveal"><span className="lx-dl" /><span className="lx-ds">✦</span><span className="lx-dl" /></div>
          <p className="lx-hero-date lx-reveal">{COUPLE.date}</p>
          <p className="lx-hero-venue lx-reveal">{COUPLE.venue}</p>
          <div className="lx-hero-scroll lx-reveal">
            <span className="lx-scroll-line" />
            <span className="lx-scroll-dot" />
          </div>
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      <section className="lx-count-section">
        <p className="lx-section-tag lx-reveal">До торжества</p>
        <div className="lx-countdown lx-reveal">
          {[
            { v: time.days, l: "дней" },
            { v: time.hours, l: "часов" },
            { v: time.minutes, l: "минут" },
            { v: time.seconds, l: "секунд" },
          ].map(({ v, l }, i) => (
            <div key={l} className="lx-count-item">
              {i > 0 && <span className="lx-count-sep">:</span>}
              <div className="lx-count-box">
                <span className="lx-count-num">{String(v).padStart(2, "0")}</span>
                <span className="lx-count-lbl">{l}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="lx-section lx-gallery-section">
        <div className="lx-section-header lx-reveal">
          <div className="lx-divider"><span className="lx-dl" /><span className="lx-ds">✦</span><span className="lx-dl" /></div>
          <h2 className="lx-section-title">Галерея</h2>
        </div>
        <div className="lx-gallery lx-reveal">
          <div className="lx-gal-main">
            <img key={idx} src={GALLERY[idx].src} alt={GALLERY[idx].caption} className="lx-gal-img" />
            <div className="lx-gal-overlay">
              <span className="lx-gal-caption">{GALLERY[idx].caption}</span>
              <div className="lx-gal-nav">
                <button className="lx-gal-btn" onClick={() => setIdx((i) => (i - 1 + GALLERY.length) % GALLERY.length)}>‹</button>
                <div className="lx-gal-dots">
                  {GALLERY.map((_, i) => <button key={i} className={`lx-dot ${i === idx ? "lx-dot-active" : ""}`} onClick={() => setIdx(i)} />)}
                </div>
                <button className="lx-gal-btn" onClick={() => setIdx((i) => (i + 1) % GALLERY.length)}>›</button>
              </div>
            </div>
          </div>
          <div className="lx-gal-thumbs">
            {GALLERY.map((g, i) => (
              <button key={i} className={`lx-thumb ${i === idx ? "lx-thumb-active" : ""}`} onClick={() => setIdx(i)}>
                <img src={g.src} alt={g.caption} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCHEDULE ── */}
      <section className="lx-section lx-sch-section">
        <div className="lx-section-header lx-reveal">
          <div className="lx-divider"><span className="lx-dl" /><span className="lx-ds">✦</span><span className="lx-dl" /></div>
          <h2 className="lx-section-title">Программа вечера</h2>
        </div>
        <div className="lx-sch-list">
          {SCHEDULE.map((item, i) => (
            <div key={i} className="lx-sch-row lx-reveal">
              <span className="lx-sch-icon">{item.icon}</span>
              <span className="lx-sch-time">{item.time}</span>
              <span className="lx-sch-sep" />
              <span className="lx-sch-event">{item.event}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CALENDAR ── */}
      <section className="lx-section">
        <div className="lx-section-header lx-reveal">
          <div className="lx-divider"><span className="lx-dl" /><span className="lx-ds">✦</span><span className="lx-dl" /></div>
          <h2 className="lx-section-title">Дата</h2>
        </div>
        <div className="lx-reveal"><CalendarWidget /></div>
      </section>

      {/* ── LOCATION ── */}
      <section className="lx-section">
        <div className="lx-section-header lx-reveal">
          <div className="lx-divider"><span className="lx-dl" /><span className="lx-ds">✦</span><span className="lx-dl" /></div>
          <h2 className="lx-section-title">Место</h2>
        </div>
        <div className="lx-location lx-reveal">
          <div className="lx-loc-icon">◈</div>
          <div className="lx-loc-name">{COUPLE.venue}</div>
          <div className="lx-loc-addr">{COUPLE.address}</div>
          <div className="lx-loc-time">{COUPLE.date} · 17:00</div>
          <button className="lx-loc-map">Открыть на карте</button>
        </div>
      </section>

      {/* ── RSVP ── */}
      <section className="lx-section lx-rsvp-section">
        <div className="lx-section-header lx-reveal">
          <div className="lx-divider"><span className="lx-dl" /><span className="lx-ds">✦</span><span className="lx-dl" /></div>
          <h2 className="lx-section-title">Ваш ответ</h2>
        </div>
        <p className="lx-rsvp-sub lx-reveal">Пожалуйста, подтвердите до 1 сентября 2026</p>
        {!rsvp ? (
          <div className="lx-rsvp-btns lx-reveal">
            <button className="lx-rsvp-yes" onClick={() => setRsvp("yes")}>Приду с радостью</button>
            <button className="lx-rsvp-no" onClick={() => setRsvp("no")}>Не смогу прийти</button>
          </div>
        ) : (
          <div className="lx-rsvp-thanks lx-reveal">
            {rsvp === "yes"
              ? <><span className="lx-thanks-star">✦</span><span>Прекрасно! Ждём вас.</span><span className="lx-thanks-star">✦</span></>
              : <span>Жаль, что не выйдет. Благодарим за ответ.</span>
            }
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer className="lx-footer">
        <div className="lx-divider lx-footer-div"><span className="lx-dl" /><span className="lx-ds">✦</span><span className="lx-dl" /></div>
        <div className="lx-footer-monogram">
          {COUPLE.him[0]}<span className="lx-footer-amp">&</span>{COUPLE.her[0]}
        </div>
        <p className="lx-footer-names">{COUPLE.him} & {COUPLE.her}</p>
        <p className="lx-footer-date">{COUPLE.date}</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black:  #080808;
          --dark:   #101010;
          --dark2:  #161616;
          --dark3:  #1a1710;
          --gold:   #c8a84b;
          --gold2:  #e4c97e;
          --gold3:  #9a7830;
          --text:   #e8dcc8;
          --muted:  #6a5f47;
          --border: rgba(200,168,75,0.16);
          --border2:rgba(200,168,75,0.35);
        }

        .lx-root {
          background: var(--black); color: var(--text);
          font-family: 'Cormorant Garamond', serif; overflow-x: hidden; min-height: 100vh;
        }

        /* PARTICLES */
        .particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 1; }
        .particle {
          position: absolute; bottom: -4px; border-radius: 50%; background: var(--gold);
          animation: float-up linear infinite;
        }
        @keyframes float-up {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(-100vh) scale(0.2); opacity: 0; }
        }

        /* HERO */
        .lx-hero {
          position: relative; min-height: 100vh;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .lx-hero-bg {
          position: absolute; inset: 0; background-size: cover; background-position: center;
          animation: lx-zoom 22s ease-in-out infinite alternate;
          filter: brightness(0.3) saturate(0.6);
        }
        @keyframes lx-zoom { from{transform:scale(1)} to{transform:scale(1.09)} }
        .lx-hero-veil {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(200,168,75,0.07) 0%, transparent 55%),
            linear-gradient(180deg, rgba(8,8,8,0.25) 0%, rgba(8,8,8,0.1) 40%, rgba(8,8,8,0.65) 100%);
        }
        .lx-hero-body {
          position: relative; z-index: 2; text-align: center; padding: 40px 24px;
          display: flex; flex-direction: column; align-items: center; gap: 18px;
        }
        .lx-tag {
          font-family: 'Montserrat', sans-serif; font-size: 10px;
          letter-spacing: 6px; text-transform: uppercase; color: var(--gold);
          border: 1px solid var(--border2); padding: 7px 22px;
        }
        .lx-hero-title {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap; justify-content: center;
        }
        .lx-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(44px, 9vw, 96px); font-weight: 400; color: var(--text);
          text-shadow: 0 0 60px rgba(200,168,75,0.18); letter-spacing: 2px;
        }
        .lx-amp {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 6vw, 70px); font-style: italic; color: var(--gold); font-weight: 400;
        }
        .lx-hero-date {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(11px, 2vw, 15px); letter-spacing: 6px; text-transform: uppercase; color: var(--gold2);
        }
        .lx-hero-venue {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(16px, 2.5vw, 22px); font-style: italic; color: rgba(232,220,200,0.45);
        }
        .lx-hero-scroll {
          display: flex; flex-direction: column; align-items: center; gap: 0; margin-top: 20px;
          animation: scroll-bounce 2.5s ease-in-out infinite;
        }
        .lx-scroll-line { width: 1px; height: 44px; background: linear-gradient(var(--gold), transparent); }
        .lx-scroll-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); }
        @keyframes scroll-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }

        /* DIVIDERS */
        .lx-divider { display: flex; align-items: center; gap: 12px; width: 100%; max-width: 360px; }
        .lx-dl { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--gold3), transparent); }
        .lx-ds { color: var(--gold3); font-size: 10px; flex-shrink: 0; }

        /* SECTIONS */
        .lx-section { max-width: 860px; margin: 0 auto; padding: 90px 24px; text-align: center; }
        .lx-section-header { display: flex; flex-direction: column; align-items: center; gap: 16px; margin-bottom: 48px; }
        .lx-section-tag {
          font-family: 'Montserrat', sans-serif; font-size: 10px;
          letter-spacing: 5px; text-transform: uppercase; color: var(--gold); margin-bottom: 8px;
        }
        .lx-section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 5vw, 48px); font-weight: 400; color: var(--text); letter-spacing: 1px;
        }

        /* COUNTDOWN */
        .lx-count-section {
          background: var(--dark2); padding: 80px 24px; text-align: center;
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
        }
        .lx-countdown { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; }
        .lx-count-item { display: flex; align-items: center; }
        .lx-count-box {
          display: flex; flex-direction: column; align-items: center; padding: 28px 24px; min-width: 96px;
          background: var(--dark3); border: 1px solid var(--border); position: relative;
        }
        .lx-count-box::before {
          content:''; position: absolute; inset: 4px; border: 1px solid var(--border); pointer-events: none;
        }
        .lx-count-num {
          font-family: 'Playfair Display', serif;
          font-size: clamp(38px, 7vw, 62px); font-weight: 400; color: var(--gold2); line-height: 1;
        }
        .lx-count-lbl {
          font-family: 'Montserrat', sans-serif;
          font-size: 8px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-top: 8px;
        }
        .lx-count-sep {
          font-family: 'Playfair Display', serif; font-size: 36px; color: var(--gold3);
          padding: 0 4px; align-self: flex-start; margin-top: 18px;
        }

        /* GALLERY */
        .lx-gallery-section { background: var(--dark); max-width: 100%; padding: 90px 24px; }
        .lx-gallery { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 10px; }
        .lx-gal-main { position: relative; overflow: hidden; }
        .lx-gal-img {
          width: 100%; max-height: 520px; object-fit: cover; display: block;
          animation: gal-fade 0.5s ease; filter: brightness(0.85) saturate(0.8);
        }
        @keyframes gal-fade { from{opacity:0;transform:scale(1.03)} to{opacity:1;transform:scale(1)} }
        .lx-gal-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: linear-gradient(transparent, rgba(8,8,8,0.8));
          padding: 40px 24px 20px; display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .lx-gal-caption {
          font-family: 'Playfair Display', serif; font-size: 22px;
          font-style: italic; color: rgba(232,220,200,0.85);
        }
        .lx-gal-nav { display: flex; align-items: center; gap: 14px; }
        .lx-gal-btn {
          background: none; border: 1px solid var(--border2); color: var(--gold);
          width: 40px; height: 40px; font-size: 22px; cursor: pointer;
          transition: all 0.2s; display: flex; align-items: center; justify-content: center;
        }
        .lx-gal-btn:hover { background: var(--gold); color: var(--black); border-color: var(--gold); }
        .lx-gal-dots { display: flex; gap: 8px; }
        .lx-dot { width: 6px; height: 6px; border-radius: 50%; border: 1px solid var(--gold3); background: transparent; cursor: pointer; padding: 0; transition: all 0.2s; }
        .lx-dot-active { background: var(--gold); border-color: var(--gold); }
        .lx-gal-thumbs { display: flex; gap: 8px; }
        .lx-thumb {
          flex: 1; overflow: hidden; border: 1px solid var(--border);
          opacity: 0.45; transition: all 0.25s; cursor: pointer; padding: 0; background: none;
        }
        .lx-thumb img { width: 100%; height: 80px; object-fit: cover; display: block; }
        .lx-thumb-active { opacity: 1; border-color: var(--gold); }
        .lx-thumb:hover { opacity: 0.8; }

        /* SCHEDULE */
        .lx-sch-section {
          background: var(--dark3); max-width: 100%; padding: 90px 24px;
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
        }
        .lx-sch-list { max-width: 520px; margin: 0 auto; display: flex; flex-direction: column; }
        .lx-sch-row {
          display: flex; align-items: center; gap: 16px; padding: 20px 0;
          border-bottom: 1px solid rgba(200,168,75,0.07);
        }
        .lx-sch-row:last-child { border-bottom: none; }
        .lx-sch-icon { color: var(--gold3); font-size: 11px; width: 14px; text-align: center; flex-shrink: 0; }
        .lx-sch-time {
          font-family: 'Playfair Display', serif; font-size: 22px;
          color: var(--gold); min-width: 60px; text-align: right; flex-shrink: 0;
        }
        .lx-sch-sep { width: 1px; height: 22px; background: var(--border2); flex-shrink: 0; }
        .lx-sch-event { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--text); text-align: left; }

        /* CALENDAR */
        .lx-cal {
          max-width: 380px; margin: 0 auto; background: var(--dark2);
          border: 1px solid var(--border); padding: 32px; position: relative;
        }
        .lx-cal::before { content:''; position: absolute; inset: 6px; border: 1px solid var(--border); pointer-events: none; }
        .lx-cal-month {
          font-family: 'Playfair Display', serif; font-size: 26px; color: var(--text);
          text-align: center; margin-bottom: 24px; letter-spacing: 1px;
        }
        .lx-cal-head, .lx-cal-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 2px; }
        .lx-cal-dh {
          font-family: 'Montserrat', sans-serif; font-size: 8px;
          letter-spacing: 1px; text-transform: uppercase; color: var(--muted); text-align: center; padding: 8px 0;
        }
        .lx-cal-cell {
          aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif; font-size: 14px; color: var(--muted); position: relative;
        }
        .lx-cal-empty { opacity: 0; pointer-events: none; }
        .lx-cal-wday {
          background: var(--gold); color: var(--black); font-weight: 500; font-size: 16px;
          box-shadow: 0 0 24px rgba(200,168,75,0.3);
        }
        .lx-cal-star { position: absolute; top: 1px; right: 2px; font-size: 7px; color: rgba(8,8,8,0.65); }
        .lx-cal-add {
          display: block; width: 100%; margin-top: 20px; background: none; border: none;
          border-top: 1px solid var(--border); padding-top: 16px;
          font-family: 'Montserrat', sans-serif; font-size: 9px;
          letter-spacing: 3px; text-transform: uppercase; color: var(--gold3); cursor: pointer; transition: color 0.2s;
        }
        .lx-cal-add:hover { color: var(--gold); }

        /* LOCATION */
        .lx-location {
          max-width: 440px; margin: 0 auto; background: var(--dark2);
          border: 1px solid var(--border); padding: 48px 32px;
          display: flex; flex-direction: column; align-items: center; gap: 12px; position: relative;
        }
        .lx-location::before { content:''; position: absolute; inset: 6px; border: 1px solid var(--border); pointer-events: none; }
        .lx-loc-icon { font-size: 36px; color: var(--gold); line-height: 1; }
        .lx-loc-name { font-family: 'Playfair Display', serif; font-size: 26px; color: var(--text); }
        .lx-loc-addr { font-family: 'Montserrat', sans-serif; font-size: 11px; letter-spacing: 1px; color: var(--muted); text-align: center; line-height: 1.7; }
        .lx-loc-time { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-style: italic; color: var(--gold3); }
        .lx-loc-map {
          margin-top: 10px; background: none; border: 1px solid var(--border2);
          color: var(--gold); padding: 10px 32px;
          font-family: 'Montserrat', sans-serif; font-size: 9px; letter-spacing: 3px;
          text-transform: uppercase; cursor: pointer; transition: all 0.25s;
        }
        .lx-loc-map:hover { background: var(--gold); color: var(--black); border-color: var(--gold); }

        /* RSVP */
        .lx-rsvp-section {
          background: var(--dark3); max-width: 100%; padding: 90px 24px;
          border-top: 1px solid var(--border);
        }
        .lx-rsvp-sub {
          font-family: 'Montserrat', sans-serif; font-size: 10px;
          letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 40px;
        }
        .lx-rsvp-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .lx-rsvp-yes {
          background: var(--gold); color: var(--black); border: 1px solid var(--gold);
          padding: 14px 40px; font-family: 'Montserrat', sans-serif; font-size: 10px;
          letter-spacing: 4px; text-transform: uppercase; cursor: pointer; transition: all 0.25s; font-weight: 500;
        }
        .lx-rsvp-yes:hover { background: var(--gold2); border-color: var(--gold2); }
        .lx-rsvp-no {
          background: none; color: var(--muted); border: 1px solid var(--border);
          padding: 14px 40px; font-family: 'Montserrat', sans-serif; font-size: 10px;
          letter-spacing: 4px; text-transform: uppercase; cursor: pointer; transition: all 0.25s;
        }
        .lx-rsvp-no:hover { border-color: var(--border2); color: var(--text); }
        .lx-rsvp-thanks {
          display: flex; align-items: center; gap: 16px; justify-content: center;
          font-family: 'Playfair Display', serif; font-size: 24px; font-style: italic;
          color: var(--text); flex-wrap: wrap;
        }
        .lx-thanks-star { color: var(--gold); display: inline-block; animation: spin-slow 4s linear infinite; }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        /* FOOTER */
        .lx-footer {
          text-align: center; padding: 60px 24px 80px; background: var(--black);
          border-top: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .lx-footer-div { max-width: 300px; width: 100%; }
        .lx-footer-monogram {
          font-family: 'Playfair Display', serif; font-size: 54px; color: var(--gold);
          letter-spacing: 4px; text-shadow: 0 0 40px rgba(200,168,75,0.22);
        }
        .lx-footer-amp { font-style: italic; color: var(--gold3); margin: 0 6px; }
        .lx-footer-names { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-style: italic; color: rgba(232,220,200,0.55); }
        .lx-footer-date { font-family: 'Montserrat', sans-serif; font-size: 9px; letter-spacing: 5px; text-transform: uppercase; color: var(--muted); }

        /* REVEAL */
        .lx-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.9s ease, transform 0.9s ease; }
        .lx-revealed { opacity: 1; transform: translateY(0); }

        @media (max-width: 600px) {
          .lx-count-box { min-width: 70px; padding: 16px 10px; }
          .lx-count-num { font-size: 34px; }
          .lx-count-sep { font-size: 26px; margin-top: 12px; }
          .lx-gal-thumbs { display: none; }
          .lx-location, .lx-cal { padding: 24px 16px; }
          .lx-sch-time { font-size: 18px; min-width: 50px; }
        }
      `}</style>
    </div>
  );
};

export default Index;
