import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, CalendarDays, CheckCircle2, Mail, MapPin, Menu, Mic2, Phone, Quote, Sparkles, Star, X } from 'lucide-react';
import './styles.css';

const SITE_ID = import.meta.env.VITE_NSI_ANALYTICS_ID || 'NSI_LNAF4X28TN';
const TRACKER_URL = import.meta.env.VITE_NSI_TRACKER_URL || 'http://localhost:4173/nsi-analytics.js';
const INQUIRY_API_URL = import.meta.env.VITE_NSI_INQUIRY_API_URL || 'http://localhost:4000/api/inquiries/submit';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/programs', label: 'Programs' },
  { path: '/events', label: 'Events' },
  { path: '/contact', label: 'Contact' },
];

function loadTracker() {
  if (!SITE_ID || !TRACKER_URL || document.querySelector('script[data-nsi-loaded="true"]')) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = TRACKER_URL;
  script.dataset.siteId = SITE_ID;
  script.dataset.nsiLoaded = 'true';
  document.body.appendChild(script);
}

function currentPath() {
  return window.location.pathname || '/';
}

function App() {
  const [path, setPath] = useState(currentPath());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    loadTracker();
    const onPop = () => setPath(currentPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    document.title = pageTitle(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [path]);

  const navigate = (nextPath) => {
    if (nextPath === path) return;
    window.history.pushState({}, '', nextPath);
    setPath(nextPath);
    setMenuOpen(false);
    window.nsi?.track?.('spa_navigation', { pagePath: nextPath });
  };

  return (
    <div className="site-shell">
      <Header path={path} navigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        {path === '/' && <Home navigate={navigate} />}
        {path === '/about' && <About navigate={navigate} />}
        {path === '/programs' && <Programs navigate={navigate} />}
        {path === '/events' && <Events navigate={navigate} />}
        {path === '/contact' && <Contact />}
        {!navItems.some((item) => item.path === path) && <NotFound navigate={navigate} />}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}

function pageTitle(path) {
  const item = navItems.find((nav) => nav.path === path);
  return item ? `${item.label} | Arjun Mehta` : 'Page Not Found | Arjun Mehta';
}

function Header({ path, navigate, menuOpen, setMenuOpen }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <button className="brand" onClick={() => navigate('/')} aria-label="Go to home">
          <span className="brand-mark"><Mic2 size={22} /></span>
          <span>
            <strong>Arjun Mehta</strong>
            <small>Motivational Speaker</small>
          </span>
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item.path} onClick={() => navigate(item.path)} className={path === item.path ? 'active' : ''}>
              {item.label}
            </button>
          ))}
        </nav>
        <button className="nav-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {menuOpen && (
        <nav className="mobile-nav container" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <button key={item.path} onClick={() => navigate(item.path)} className={path === item.path ? 'active' : ''}>
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

function Hero({ eyebrow, title, text, primary, secondary, navigate }) {
  return (
    <section      className="hero section" data-nsi-section="hero" data-nsi-section-title="Turn hesitation into focused action" data-nsi-section="quote-card" data-nsi-section-title="People do not need more pressure quote" data-nsi-section="stats" data-nsi-section-title="Sessions delivered and audience rating" data-nsi-section="programs" data-nsi-section-title="Motivational speaking programs" data-nsi-section="contact" data-nsi-section-title="Contact form section">
      <div className="container hero-grid">
        <div>
          <p className="eyebrow"><Sparkles size={16} /> {eyebrow}</p>
          <h1>{title}</h1>
          <p className="hero-text">{text}</p>
          <div className="hero-actions">
            {primary && <button className="btn primary" onClick={() => navigate(primary.path)}>{primary.label}<ArrowRight size={18} /></button>}
            {secondary && <button className="btn ghost" onClick={() => navigate(secondary.path)}>{secondary.label}</button>}
          </div>
        </div>
        <div className="hero-card">
          <Quote size={34} />
          <p>“People do not need more pressure. They need clarity, courage, and a repeatable system for action.”</p>
          <strong>Keynote theme</strong>
        </div>
      </div>
    </section>
  );
}

function Home({ navigate }) {
  return (
    <>
      <Hero
        eyebrow="High-energy talks for teams, students, and leaders"
        title="Turn hesitation into focused action."
        text="Arjun Mehta helps audiences build confidence, discipline, ownership, and everyday momentum through practical storytelling and interactive sessions."
        primary={{ label: 'Book a Session', path: '/contact' }}
        secondary={{ label: 'Explore Programs', path: '/programs' }}
        navigate={navigate}
      />
      <Stats />
      <section className="section">
        <div className="container cards three">
          {[
            ['Corporate Keynotes', 'Boost ownership, communication, and execution across your team.'],
            ['Student Motivation', 'Help students build discipline, confidence, and career clarity.'],
            ['Leadership Workshops', 'Interactive formats for managers and founders who want action.'],
          ].map(([title, body]) => <InfoCard key={title} title={title} body={body} />)}
        </div>
      </section>
    </>
  );
}

function About({ navigate }) {
  return (
    <>
      <PageHeader title="About Arjun" text="A speaker focused on practical motivation, clarity, and action systems." />
      <section className="section">
        <div className="container split">
          <div>
            <h2>Built for real audience outcomes.</h2>
            <p>Arjun combines business storytelling, student mentoring, and leadership coaching into sessions that feel energetic but practical. Every talk ends with clear next steps, not just applause.</p>
            <ul className="check-list">
              <li><CheckCircle2 /> 12+ years of speaking and training experience</li>
              <li><CheckCircle2 /> Sessions for colleges, startups, and corporate teams</li>
              <li><CheckCircle2 /> Focus on behavior change and measurable follow-through</li>
            </ul>
            <button className="btn primary" onClick={() => navigate('/contact')}>Invite Arjun <ArrowRight size={18} /></button>
          </div>
          <div className="feature-box">
            <h3>Signature belief</h3>
            <p>Motivation is not a mood. It is a method: clarity, commitment, environment, and consistent review.</p>
          </div>
        </div>
      </section>
    </>
  );
}

function Programs({ navigate }) {
  const programs = [
    ['Own Your Day', 'Productivity and discipline keynote for students and professionals.'],
    ['Lead With Energy', 'Leadership workshop for managers and founders.'],
    ['Confidence Code', 'Communication and stage confidence program.'],
    ['Career Clarity Sprint', 'Interactive student session on goals and next steps.'],
  ];
  return (
    <>
      <PageHeader title="Programs" text="Choose a keynote, workshop, or custom session for your audience." />
      <section className="section">
        <div className="container cards two">
          {programs.map(([title, body]) => <InfoCard key={title} title={title} body={body} />)}
        </div>
        <div className="container center-cta">
          <button className="btn primary" onClick={() => navigate('/contact')}>Request Program Details <ArrowRight size={18} /></button>
        </div>
      </section>
    </>
  );
}

function Events({ navigate }) {
  const events = [
    ['Aug 30', 'Founders Momentum Session', 'Indore'],
    ['Sep 12', 'Student Leadership Day', 'Bhopal'],
    ['Oct 04', 'Corporate Ownership Keynote', 'Online'],
  ];
  return (
    <>
      <PageHeader title="Upcoming Events" text="Sample events for analytics testing and page engagement tracking." />
      <section className="section">
        <div className="container timeline">
          {events.map(([date, title, location]) => (
            <article className="event-card" key={title}>
              <div className="event-date"><CalendarDays size={18} /> {date}</div>
              <div>
                <h3>{title}</h3>
                <p><MapPin size={16} /> {location}</p>
              </div>
              <button className="btn small" onClick={() => navigate('/contact')}>Enquire</button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function Contact() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const formMeta = useMemo(() => ({
    formId: 'speaker-contact-main',
    formName: 'Motivational Speaker Contact Form',
    formType: 'contact',
  }), []);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      siteId: SITE_ID,
      ...formMeta,
      pageUrl: window.location.href,
      pagePath: window.location.pathname,
      pageSlug: window.location.pathname.replace(/^\//, '') || 'home',
      referrer: document.referrer || null,
      data,
      metadata: {
        source: 'motivational_speaker_test_site',
        submittedAt: new Date().toISOString(),
        language: navigator.language,
        screen: `${window.screen.width}x${window.screen.height}`,
      },
    };

    try {
      const res = await fetch(INQUIRY_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      window.nsi?.track?.('form_submit', {
        formId: formMeta.formId,
        formName: formMeta.formName,
        formType: formMeta.formType,
        pagePath: window.location.pathname,
      });

      if (!res.ok) throw new Error('Inquiry API failed');
      setStatus('success');
      setMessage('Thank you. Your enquiry has been submitted successfully.');
      form.reset();
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('Form submitted locally, but inquiry API did not respond. Check backend and CORS.');
    }
  }

  return (
    <>
      <PageHeader title="Contact Us" text="Invite Arjun for a keynote, workshop, college event, or leadership session." />
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-panel">
            <h2>Let’s plan your session.</h2>
            <p>Fill this form to test inquiry capture in your analytics panel.</p>
            <div className="contact-line"><Mail size={18} /> booking@arjunmehta.test</div>
            <div className="contact-line"><Phone size={18} /> +91 99999 99999</div>
            <div className="contact-line"><MapPin size={18} /> Indore, India</div>
          </div>
          <form
            className="contact-form"
            onSubmit={handleSubmit}
            data-nsi-form="true"
            data-nsi-form-id="speaker-contact-main"
            data-nsi-form-name="Motivational Speaker Contact Form"
            data-nsi-form-type="contact"
          >
            <label>Full Name<input name="name" required placeholder="Amit Sharma" /></label>
            <label>Email<input name="email" type="email" required placeholder="amit@example.com" /></label>
            <label>Phone<input name="phone" required placeholder="9999999999" /></label>
            <label>Organization<input name="company" placeholder="Company / College name" /></label>
            <label>Event Type
              <select name="eventType" defaultValue="Corporate Keynote">
                <option>Corporate Keynote</option>
                <option>College Session</option>
                <option>Leadership Workshop</option>
                <option>Online Webinar</option>
              </select>
            </label>
            <label>Message<textarea name="message" required rows="5" placeholder="Tell us about your audience and preferred date." /></label>
            <button className="btn primary full" type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Submitting...' : 'Submit Enquiry'} <ArrowRight size={18} />
            </button>
            {message && <p className={`form-message ${status}`}>{message}</p>}
          </form>
        </div>
      </section>
    </>
  );
}

function Stats() {
  return (
    <section className="stats">
      <div className="container stats-grid">
        {[['500+', 'Sessions delivered'], ['80k+', 'People inspired'], ['4.9/5', 'Average audience rating']].map(([num, label]) => (
          <div key={label}><strong>{num}</strong><span>{label}</span></div>
        ))}
      </div>
    </section>
  );
}

function PageHeader({ title, text }) {
  return <section className="page-header"><div className="container"><p className="eyebrow"><Star size={16} /> Speaker Website</p><h1>{title}</h1><p>{text}</p></div></section>;
}

function InfoCard({ title, body }) {
  return <article className="info-card"><div className="card-icon"><Mic2 size={20} /></div><h3>{title}</h3><p>{body}</p></article>;
}

function NotFound({ navigate }) {
  return <section className="section"><div className="container"><h1>Page not found</h1><p>This route does not exist.</p><button className="btn primary" onClick={() => navigate('/')}>Go Home</button></div></section>;
}

function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div><strong>Arjun Mehta</strong><p>Motivational speaker website for NSI analytics local testing.</p></div>
        <div className="footer-links">{navItems.map((item) => <button key={item.path} onClick={() => navigate(item.path)}>{item.label}</button>)}</div>
      </div>
    </footer>
  );
}

createRoot(document.getElementById('root')).render(<App />);
