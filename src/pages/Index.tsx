import { useState, useEffect, useRef } from "react";

const COUPLE = {
  him: "Владислав",
  her: "Анастасия",
  date: "1 июля 2026",
  dateShort: "01.07.2026",
  venue: "«Ты Где»",
  address: "Уточните адрес у организаторов",
};

const WEDDING_DATE = new Date("2026-07-01T17:00:00");

const GALLERY = [
  {
    src: "https://cdn.poehali.dev/projects/7a5ac2a2-443d-4bbd-ba61-bc31852543f6/files/0b31728f-de84-489d-a590-7d4d722fc372.jpg",
    caption: "Наша история",
  },
  {
    src: "https://cdn.poehali.dev/projects/7a5ac2a2-443d-4bbd-ba61-bc31852543f6/files/e0b57bdb-d46d-4c3e-a767-466dc8b3c481.jpg",
    caption: "Летняя церемония",
  },
  {
    src: "https://cdn.poehali.dev/projects/7a5ac2a2-443d-4bbd-ba61-bc31852543f6/files/cd84ea0e-afbf-426a-a101-52a979c6417f.jpg",
    caption: "Вечер для вас",
  },
];

const SCHEDULE = [
  { time: "16:00", event: "Сбор гостей", desc: "Добро пожаловать" },
  { time: "17:00", event: "Церемония", desc: "Обмен клятвами" },
  { time: "18:00", event: "Фуршет", desc: "Шампанское и закуски" },
  { time: "19:00", event: "Торжественный ужин", desc: "Банкетный зал" },
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

function useReveal() {
  useEffect(() => {
    const run = () => {
      const els = document.querySelectorAll(".om-reveal:not(.om-revealed)");
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("om-revealed")),
        { threshold: 0.1 }
      );
      els.forEach((el) => obs.observe(el));
      return () => obs.disconnect();
    };
    const t = setTimeout(run, 50);
    return () => clearTimeout(t);
  }, []);
}

function CalendarWidget() {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  // July 2026: starts on Wednesday (3rd day, offset=2)
  const firstDay = new Date(2026, 6, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const total = 31;
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let i = 1; i <= total; i++) cells.push(i);

  return (
    <div className="om-cal">
      <div className="om-cal-ornament">
        <span className="om-cal-line" /><span className="om-cal-gem">◆</span><span className="om-cal-line" />
      </div>
      <div className="om-cal-month">Июль 2026</div>
      <div className="om-cal-head">{days.map((d) => <div key={d} className="om-cal-dh">{d}</div>)}</div>
      <div className="om-cal-grid">
        {cells.map((d, i) => (
          <div key={i} className={`om-cal-cell ${d === 1 ? "om-cal-wday" : ""} ${!d ? "om-cal-empty" : ""}`}>
            {d}
            {d === 1 && <span className="om-cal-heart">♥</span>}
          </div>
        ))}
      </div>
      <button className="om-cal-btn">Добавить в календарь</button>
    </div>
  );
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
    <div className="om-music">
      <audio ref={audioRef} src="" preload="none" />
      <span className="om-music-note" style={{ animation: playing ? "om-note 1.5s ease-in-out infinite" : "none" }}>♪</span>
      <div className="om-music-info">
        <span className="om-music-title">Наша мелодия</span>
        <div className="om-music-bar"><div className="om-music-fill" style={{ width: `${progress}%` }} /></div>
      </div>
      <button className="om-music-btn" onClick={toggle}>{playing ? "⏸" : "▶"}</button>
    </div>
  );
}

const Index = () => {
  const time = useCountdown();
  const [gIdx, setGIdx] = useState(0);
  const [rsvp, setRsvp] = useState<string | null>(null);
  useReveal();

  const prev = () => setGIdx((i) => (i - 1 + GALLERY.length) % GALLERY.length);
  const next = () => setGIdx((i) => (i + 1) % GALLERY.length);

  return (
    <div className="om-root">

      {/* ── HERO ── */}
      <section className="om-hero">
        <div className="om-hero-bg" style={{ backgroundImage: `url(${GALLERY[0].src})` }} />
        <div className="om-hero-veil" />

        {/* Угловые декоры */}
        <div className="om-corner om-corner-tl" />
        <div className="om-corner om-corner-tr" />
        <div className="om-corner om-corner-bl" />
        <div className="om-corner om-corner-br" />

        <div className="om-hero-body">
          <p className="om-hero-tag om-reveal">Приглашение на бракосочетание</p>

          <div className="om-hero-orn om-reveal">
            <span className="om-hl" /><span className="om-hd">✦</span><span className="om-hl" />
          </div>

          <div className="om-hero-names om-reveal">
            <span className="om-hero-name">{COUPLE.him}</span>
            <span className="om-hero-amp">&</span>
            <span className="om-hero-name">{COUPLE.her}</span>
          </div>

          <div className="om-hero-orn om-reveal">
            <span className="om-hl" /><span className="om-hd">✦</span><span className="om-hl" />
          </div>

          <p className="om-hero-date om-reveal">{COUPLE.date}</p>
          <p className="om-hero-venue om-reveal">{COUPLE.venue}</p>

          <div className="om-hero-scroll om-reveal">
            <span className="om-scroll-line" />
            <span className="om-scroll-label">прокрутите</span>
          </div>
        </div>
      </section>

      {/* Плеер */}
      <MusicPlayer />

      {/* ── ТАЙМЕР ── */}
      <section className="om-band om-count-band">
        <p className="om-band-label om-reveal">До торжества</p>
        <div className="om-countdown om-reveal">
          {[
            { v: time.days, l: "дней" },
            { v: time.hours, l: "часов" },
            { v: time.minutes, l: "минут" },
            { v: time.seconds, l: "секунд" },
          ].map(({ v, l }, i) => (
            <div key={l} className="om-count-wrap">
              {i > 0 && <span className="om-count-colon">·</span>}
              <div className="om-count-box">
                <span className="om-count-num">{String(v).padStart(2, "0")}</span>
                <span className="om-count-lbl">{l}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ИСТОРИЯ ── */}
      <section className="om-section">
        <div className="om-sec-orn om-reveal">
          <span className="om-ol" /><span className="om-od">◆</span><span className="om-ol" />
        </div>
        <h2 className="om-sec-title om-reveal">Наша история</h2>
        <div className="om-story om-reveal">
          <p>Есть встречи, которые меняют всё. Владислав и Анастасия знают об этом не понаслышке — однажды судьба свела их вместе, и с тех пор каждый день стал особенным.</p>
          <p>Первое июля 2026 года станет началом нашей общей главы. Мы хотим встретить этот день в окружении самых близких.</p>
        </div>
        <p className="om-story-sig om-reveal">Владислав & Анастасия</p>
      </section>

      {/* ── ГАЛЕРЕЯ ── */}
      <section className="om-band om-gallery-band">
        <div className="om-sec-orn om-reveal">
          <span className="om-ol" /><span className="om-od">◆</span><span className="om-ol" />
        </div>
        <h2 className="om-sec-title om-reveal">Галерея</h2>
        <div className="om-gallery om-reveal">
          <button className="om-garrow" onClick={prev}>‹</button>
          <div className="om-gal-frame">
            <img key={gIdx} src={GALLERY[gIdx].src} alt={GALLERY[gIdx].caption} className="om-gal-img" />
            <div className="om-gal-cap">{GALLERY[gIdx].caption}</div>
          </div>
          <button className="om-garrow" onClick={next}>›</button>
        </div>
        <div className="om-gdots om-reveal">
          {GALLERY.map((_, i) => (
            <button key={i} className={`om-gdot ${i === gIdx ? "om-gdot-on" : ""}`} onClick={() => setGIdx(i)} />
          ))}
        </div>
      </section>

      {/* ── ПРОГРАММА ── */}
      <section className="om-section">
        <div className="om-sec-orn om-reveal">
          <span className="om-ol" /><span className="om-od">◆</span><span className="om-ol" />
        </div>
        <h2 className="om-sec-title om-reveal">Программа дня</h2>
        <div className="om-schedule">
          {SCHEDULE.map((item, i) => (
            <div key={i} className="om-sch-row om-reveal">
              <span className="om-sch-time">{item.time}</span>
              <div className="om-sch-middle">
                <div className="om-sch-dot" />
                {i < SCHEDULE.length - 1 && <div className="om-sch-vline" />}
              </div>
              <div className="om-sch-info">
                <span className="om-sch-event">{item.event}</span>
                <span className="om-sch-desc">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── КАЛЕНДАРЬ ── */}
      <section className="om-band om-cal-band">
        <div className="om-sec-orn om-reveal">
          <span className="om-ol" /><span className="om-od">◆</span><span className="om-ol" />
        </div>
        <h2 className="om-sec-title om-reveal">Дата свадьбы</h2>
        <div className="om-reveal"><CalendarWidget /></div>
      </section>

      {/* ── МЕСТО ── */}
      <section className="om-section">
        <div className="om-sec-orn om-reveal">
          <span className="om-ol" /><span className="om-od">◆</span><span className="om-ol" />
        </div>
        <h2 className="om-sec-title om-reveal">Место проведения</h2>
        <div className="om-place om-reveal">
          <span className="om-place-icon">⚜</span>
          <span className="om-place-name">{COUPLE.venue}</span>
          <span className="om-place-addr">{COUPLE.address}</span>
          <span className="om-place-when">{COUPLE.date} · 16:00</span>
          <button className="om-place-map">Открыть на карте</button>
        </div>
      </section>

      {/* ── RSVP ── */}
      <section className="om-band om-rsvp-band">
        <div className="om-sec-orn om-reveal" style={{ "--ol-color": "rgba(200,160,60,0.4)" } as React.CSSProperties}>
          <span className="om-ol om-ol-light" /><span className="om-od om-od-light">◆</span><span className="om-ol om-ol-light" />
        </div>
        <h2 className="om-sec-title om-sec-title-light om-reveal">Подтвердите присутствие</h2>
        <p className="om-rsvp-hint om-reveal">Пожалуйста, дайте нам знать до 15 июня 2026</p>

        {!rsvp ? (
          <div className="om-rsvp-btns om-reveal">
            <button className="om-rsvp-yes" onClick={() => setRsvp("yes")}>С радостью приду</button>
            <button className="om-rsvp-no" onClick={() => setRsvp("no")}>К сожалению, не смогу</button>
          </div>
        ) : (
          <div className="om-rsvp-thanks om-reveal">
            {rsvp === "yes"
              ? <><span className="om-thanks-heart">♥</span><span>Благодарим! Ждём вас 1 июля.</span><span className="om-thanks-heart">♥</span></>
              : <span>Жаль, что не сможете быть с нами. Благодарим за ответ.</span>
            }
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer className="om-footer">
        <div className="om-sec-orn om-footer-orn">
          <span className="om-ol om-ol-light" /><span className="om-od om-od-light">◆</span><span className="om-ol om-ol-light" />
        </div>
        <div className="om-footer-mono">В<span className="om-footer-amp">&</span>А</div>
        <p className="om-footer-names">{COUPLE.him} & {COUPLE.her}</p>
        <p className="om-footer-date">{COUPLE.dateShort}</p>
        <p className="om-footer-heart">♥</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=EB+Garamond:ital,wght@0,400;1,400&family=Montserrat:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cream:   #f9f4ec;
          --parch:   #f1e9d8;
          --parch2:  #e8dcc8;
          --gold:    #c9a84c;
          --gold2:   #e6cc80;
          --gold3:   #9a7735;
          --brown:   #3a2718;
          --brown2:  #5e4030;
          --brown3:  #8a6545;
          --text:    #2a1c10;
          --muted:   #7a6050;
          --shadow:  rgba(50,25,5,0.10);
          --border:  rgba(200,168,75,0.22);
          --border2: rgba(200,168,75,0.40);
        }

        .om-root {
          background: var(--cream); color: var(--text);
          font-family: 'EB Garamond', serif; overflow-x: hidden; min-height: 100vh;
        }

        /* ── HERO ── */
        .om-hero {
          position: relative; min-height: 100vh;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .om-hero-bg {
          position: absolute; inset: 0; background-size: cover; background-position: center 30%;
          animation: om-zoom 24s ease-in-out infinite alternate;
        }
        @keyframes om-zoom { from{transform:scale(1)} to{transform:scale(1.07)} }
        .om-hero-veil {
          position: absolute; inset: 0;
          background: linear-gradient(180deg,
            rgba(20,10,3,0.50) 0%,
            rgba(15,7,2,0.38) 45%,
            rgba(20,10,3,0.62) 100%);
        }

        /* Угловые украшения */
        .om-corner {
          position: absolute; width: 48px; height: 48px; z-index: 3;
          border-color: rgba(200,168,75,0.55); border-style: solid; border-width: 0;
        }
        .om-corner-tl { top: 28px; left: 28px; border-top-width: 1px; border-left-width: 1px; }
        .om-corner-tr { top: 28px; right: 28px; border-top-width: 1px; border-right-width: 1px; }
        .om-corner-bl { bottom: 28px; left: 28px; border-bottom-width: 1px; border-left-width: 1px; }
        .om-corner-br { bottom: 28px; right: 28px; border-bottom-width: 1px; border-right-width: 1px; }

        .om-hero-body {
          position: relative; z-index: 2; text-align: center; padding: 48px 32px;
          display: flex; flex-direction: column; align-items: center; gap: 16px;
          max-width: 740px;
        }
        .om-hero-tag {
          font-family: 'Montserrat', sans-serif; font-size: 10px;
          letter-spacing: 5px; text-transform: uppercase; color: rgba(220,190,130,0.85);
        }
        .om-hero-orn { display: flex; align-items: center; gap: 10px; width: 260px; }
        .om-hl { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(200,168,75,0.6), transparent); }
        .om-hd { color: rgba(200,168,75,0.8); font-size: 10px; flex-shrink: 0; }
        .om-hero-names {
          display: flex; align-items: center; justify-content: center;
          gap: 16px; flex-wrap: wrap;
        }
        .om-hero-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 9vw, 92px); font-weight: 300;
          color: #fff; letter-spacing: 2px;
          text-shadow: 0 2px 32px rgba(0,0,0,0.5);
        }
        .om-hero-amp {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(30px, 6vw, 66px);
          font-style: italic; color: var(--gold2); font-weight: 300;
        }
        .om-hero-date {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 3vw, 26px);
          color: rgba(220,190,130,0.92); letter-spacing: 4px;
        }
        .om-hero-venue {
          font-family: 'Montserrat', sans-serif; font-size: 11px;
          letter-spacing: 4px; text-transform: uppercase; color: rgba(255,255,255,0.5);
        }
        .om-hero-scroll {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          margin-top: 24px; animation: om-bounce 2.5s ease-in-out infinite;
        }
        .om-scroll-line { width: 1px; height: 36px; background: linear-gradient(rgba(200,168,75,0.5), transparent); }
        .om-scroll-label {
          font-family: 'Montserrat', sans-serif; font-size: 8px;
          letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.35);
        }
        @keyframes om-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }

        /* ── MUSIC ── */
        .om-music {
          position: fixed; bottom: 24px; right: 24px; z-index: 100;
          display: flex; align-items: center; gap: 10px;
          background: rgba(249,244,236,0.97); border: 1px solid var(--border2);
          border-radius: 40px; padding: 9px 15px;
          box-shadow: 0 4px 20px var(--shadow); backdrop-filter: blur(10px);
        }
        .om-music-note { font-size: 17px; color: var(--gold); }
        @keyframes om-note { 0%,100%{transform:scale(1) rotate(-5deg)} 50%{transform:scale(1.15) rotate(5deg)} }
        .om-music-info { display: flex; flex-direction: column; gap: 3px; min-width: 90px; }
        .om-music-title { font-family: 'Montserrat', sans-serif; font-size: 9px; letter-spacing: 1px; color: var(--brown2); }
        .om-music-bar { height: 2px; background: rgba(180,140,60,0.15); border-radius: 1px; overflow: hidden; }
        .om-music-fill { height: 100%; background: var(--gold); transition: width 0.5s linear; }
        .om-music-btn {
          background: var(--gold); color: var(--cream); border: none;
          width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
          font-size: 11px; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s; flex-shrink: 0;
        }
        .om-music-btn:hover { background: var(--gold3); }

        /* ── BANDS / SECTIONS ── */
        .om-band { background: var(--parch); padding: 80px 24px; text-align: center; }
        .om-section { max-width: 760px; margin: 0 auto; padding: 80px 24px; text-align: center; }
        .om-sec-orn {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; margin-bottom: 20px; max-width: 340px; margin-left: auto; margin-right: auto;
        }
        .om-ol { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--gold3), transparent); }
        .om-od { color: var(--gold); font-size: 9px; flex-shrink: 0; }
        .om-ol-light { background: linear-gradient(90deg, transparent, rgba(200,160,60,0.38), transparent); }
        .om-od-light { color: rgba(200,160,60,0.6); }
        .om-band-label {
          font-family: 'Montserrat', sans-serif; font-size: 9px;
          letter-spacing: 5px; text-transform: uppercase; color: var(--gold3); margin-bottom: 24px;
        }
        .om-sec-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(26px, 5vw, 44px); font-weight: 400; color: var(--brown);
          margin-bottom: 36px; letter-spacing: 1px;
        }
        .om-sec-title-light { color: rgba(245,232,208,0.95); }

        /* ── COUNTDOWN ── */
        .om-count-band { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .om-countdown { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; }
        .om-count-wrap { display: flex; align-items: center; }
        .om-count-box {
          display: flex; flex-direction: column; align-items: center;
          padding: 22px 20px; min-width: 86px;
          background: var(--cream); border: 1px solid var(--border);
          box-shadow: 0 2px 12px var(--shadow);
        }
        .om-count-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(38px, 7vw, 56px); font-weight: 300; color: var(--brown); line-height: 1;
        }
        .om-count-lbl {
          font-family: 'Montserrat', sans-serif; font-size: 8px;
          letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-top: 5px;
        }
        .om-count-colon {
          font-family: 'Cormorant Garamond', serif; font-size: 32px;
          color: var(--gold3); padding: 0 6px; align-self: flex-start; margin-top: 14px;
        }

        /* ── STORY ── */
        .om-story {
          max-width: 540px; margin: 0 auto 28px; display: flex; flex-direction: column; gap: 14px;
          font-size: 18px; line-height: 1.85; color: var(--brown2); font-style: italic;
        }
        .om-story-sig {
          font-family: 'Cormorant Garamond', serif; font-size: 28px;
          color: var(--gold3); font-style: italic;
        }

        /* ── GALLERY ── */
        .om-gallery-band { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .om-gallery { display: flex; align-items: center; justify-content: center; gap: 12px; max-width: 700px; margin: 0 auto; }
        .om-gal-frame { flex: 1; position: relative; overflow: hidden; }
        .om-gal-img {
          width: 100%; max-height: 480px; object-fit: cover; display: block;
          animation: om-gal-fade 0.5s ease;
          box-shadow: 0 8px 36px rgba(50,25,5,0.2);
        }
        @keyframes om-gal-fade { from{opacity:0;transform:scale(0.98)} to{opacity:1;transform:scale(1)} }
        .om-gal-cap {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: linear-gradient(transparent, rgba(20,10,3,0.65));
          color: rgba(255,255,255,0.88); padding: 32px 16px 12px;
          font-family: 'Cormorant Garamond', serif; font-size: 19px; font-style: italic; text-align: center;
        }
        .om-garrow {
          background: none; border: 1px solid var(--border2); color: var(--gold);
          width: 44px; height: 44px; font-size: 24px; cursor: pointer; flex-shrink: 0;
          transition: all 0.2s; display: flex; align-items: center; justify-content: center;
        }
        .om-garrow:hover { background: var(--gold); color: var(--cream); }
        .om-gdots { display: flex; justify-content: center; gap: 8px; margin-top: 20px; }
        .om-gdot {
          width: 7px; height: 7px; border-radius: 50%;
          border: 1px solid var(--gold3); background: transparent;
          cursor: pointer; padding: 0; transition: background 0.2s;
        }
        .om-gdot-on { background: var(--gold); border-color: var(--gold); }

        /* ── SCHEDULE ── */
        .om-schedule { max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; }
        .om-sch-row {
          display: grid; grid-template-columns: 64px 28px 1fr;
          align-items: start; padding: 4px 0;
        }
        .om-sch-time {
          font-family: 'Cormorant Garamond', serif; font-size: 22px;
          color: var(--gold); text-align: right; padding-top: 4px; font-weight: 500;
        }
        .om-sch-middle { display: flex; flex-direction: column; align-items: center; padding: 0 8px; }
        .om-sch-dot {
          width: 10px; height: 10px; border-radius: 50%;
          border: 2px solid var(--gold); background: var(--cream);
          margin-top: 8px; flex-shrink: 0;
        }
        .om-sch-vline { flex: 1; width: 1px; background: rgba(200,168,75,0.22); min-height: 36px; }
        .om-sch-info {
          display: flex; flex-direction: column; gap: 2px; text-align: left;
          padding-top: 4px; padding-bottom: 16px;
        }
        .om-sch-event { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--brown); }
        .om-sch-desc {
          font-family: 'Montserrat', sans-serif; font-size: 9px;
          letter-spacing: 1px; color: var(--muted); text-transform: uppercase;
        }

        /* ── CALENDAR ── */
        .om-cal-band { border-top: 1px solid var(--border); }
        .om-cal {
          max-width: 360px; margin: 0 auto;
          background: var(--cream); border: 1px solid var(--border);
          padding: 28px; box-shadow: 0 4px 20px var(--shadow); position: relative;
        }
        .om-cal-ornament {
          display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
        }
        .om-cal-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--gold3), transparent); }
        .om-cal-gem { color: var(--gold); font-size: 8px; }
        .om-cal-month {
          font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--brown);
          text-align: center; margin-bottom: 16px; letter-spacing: 1px;
        }
        .om-cal-head, .om-cal-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 2px; }
        .om-cal-dh {
          font-family: 'Montserrat', sans-serif; font-size: 8px; letter-spacing: 1px;
          text-transform: uppercase; color: var(--gold3); text-align: center; padding: 6px 0;
        }
        .om-cal-cell {
          aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
          font-family: 'EB Garamond', serif; font-size: 13px; color: var(--muted); position: relative;
        }
        .om-cal-empty { opacity: 0; pointer-events: none; }
        .om-cal-wday {
          background: var(--gold); color: var(--cream) !important;
          font-size: 15px; font-weight: 600;
          box-shadow: 0 2px 10px rgba(200,168,75,0.35);
        }
        .om-cal-heart { position: absolute; top: 1px; right: 2px; font-size: 7px; color: rgba(255,255,255,0.7); }
        .om-cal-btn {
          display: block; width: 100%; margin-top: 16px; background: none; border: none;
          border-top: 1px solid var(--border); padding-top: 14px;
          font-family: 'Montserrat', sans-serif; font-size: 9px;
          letter-spacing: 3px; text-transform: uppercase; color: var(--gold3);
          cursor: pointer; transition: color 0.2s;
        }
        .om-cal-btn:hover { color: var(--gold); }

        /* ── PLACE ── */
        .om-place {
          max-width: 420px; margin: 0 auto; background: var(--parch);
          border: 1px solid var(--border); padding: 44px 28px;
          box-shadow: 0 4px 20px var(--shadow);
          display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        .om-place-icon { font-size: 32px; color: var(--gold); }
        .om-place-name { font-family: 'Cormorant Garamond', serif; font-size: 30px; color: var(--brown); letter-spacing: 1px; }
        .om-place-addr {
          font-family: 'Montserrat', sans-serif; font-size: 10px; letter-spacing: 1px;
          color: var(--muted); text-align: center; line-height: 1.6;
        }
        .om-place-when { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-style: italic; color: var(--gold3); }
        .om-place-map {
          margin-top: 10px; background: none; border: 1px solid var(--border2);
          color: var(--gold3); padding: 10px 28px;
          font-family: 'Montserrat', sans-serif; font-size: 9px;
          letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.2s;
        }
        .om-place-map:hover { background: var(--gold); color: var(--cream); border-color: var(--gold); }

        /* ── RSVP ── */
        .om-rsvp-band { background: var(--brown); border-top: 1px solid rgba(200,168,75,0.15); }
        .om-rsvp-hint {
          font-family: 'Montserrat', sans-serif; font-size: 10px;
          letter-spacing: 2px; text-transform: uppercase; color: rgba(200,168,75,0.55);
          margin-bottom: 36px;
        }
        .om-rsvp-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .om-rsvp-yes {
          background: var(--gold); color: var(--brown); border: 1px solid var(--gold);
          padding: 13px 36px; font-family: 'Montserrat', sans-serif; font-size: 10px;
          letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; font-weight: 500;
        }
        .om-rsvp-yes:hover { background: var(--gold2); border-color: var(--gold2); }
        .om-rsvp-no {
          background: none; color: rgba(200,168,75,0.5); border: 1px solid rgba(200,168,75,0.25);
          padding: 13px 36px; font-family: 'Montserrat', sans-serif; font-size: 10px;
          letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.2s;
        }
        .om-rsvp-no:hover { color: var(--gold); border-color: rgba(200,168,75,0.5); }
        .om-rsvp-thanks {
          display: flex; align-items: center; gap: 14px; justify-content: center; flex-wrap: wrap;
          font-family: 'Cormorant Garamond', serif; font-size: 22px; font-style: italic;
          color: rgba(245,232,208,0.9);
        }
        .om-thanks-heart {
          font-size: 26px; color: var(--gold);
          animation: om-beat 1.3s ease-in-out infinite;
        }
        @keyframes om-beat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }

        /* ── FOOTER ── */
        .om-footer {
          background: var(--brown); text-align: center;
          padding: 48px 24px 72px; border-top: 1px solid rgba(200,168,75,0.12);
          display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        .om-footer-orn { max-width: 280px; width: 100%; margin-bottom: 8px; }
        .om-footer-mono {
          font-family: 'Cormorant Garamond', serif; font-size: 56px;
          color: var(--gold); letter-spacing: 6px; font-weight: 300;
          text-shadow: 0 0 36px rgba(200,168,75,0.2);
        }
        .om-footer-amp { font-style: italic; color: var(--gold3); margin: 0 4px; }
        .om-footer-names {
          font-family: 'Cormorant Garamond', serif; font-size: 22px;
          font-style: italic; color: rgba(245,232,208,0.65);
        }
        .om-footer-date {
          font-family: 'Montserrat', sans-serif; font-size: 9px;
          letter-spacing: 5px; text-transform: uppercase; color: rgba(200,168,75,0.45);
        }
        .om-footer-heart {
          font-size: 18px; color: var(--gold);
          animation: om-beat 2s ease-in-out infinite;
        }

        /* ── REVEAL ── */
        .om-reveal { opacity: 0; transform: translateY(26px); transition: opacity 0.85s ease, transform 0.85s ease; }
        .om-revealed { opacity: 1; transform: translateY(0); }

        @media (max-width: 600px) {
          .om-music { bottom: 12px; right: 12px; }
          .om-music-info { min-width: 70px; }
          .om-corner { width: 32px; height: 32px; }
          .om-corner-tl, .om-corner-tr { top: 16px; }
          .om-corner-bl, .om-corner-br { bottom: 16px; }
          .om-corner-tl, .om-corner-bl { left: 16px; }
          .om-corner-tr, .om-corner-br { right: 16px; }
          .om-count-box { min-width: 70px; padding: 16px 10px; }
          .om-count-num { font-size: 34px; }
          .om-count-colon { font-size: 24px; margin-top: 10px; }
          .om-gallery { gap: 6px; }
          .om-garrow { width: 36px; height: 36px; font-size: 20px; }
          .om-sch-row { grid-template-columns: 52px 24px 1fr; }
          .om-cal { padding: 18px; }
          .om-place { padding: 28px 16px; }
        }
      `}</style>
    </div>
  );
};

export default Index;
