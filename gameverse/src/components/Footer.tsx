import { Gamepad2, Heart, Mail } from 'lucide-react';
import { useState } from 'react';

interface Props { onNavigate: (page: string) => void; }

export default function Footer({ onNavigate }: Props) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const sub = (e: React.FormEvent) => { e.preventDefault(); if (email.trim()) { setDone(true); setEmail(''); } };

  return (
    <footer className="border-t border-border/40 bg-surface/60">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Newsletter */}
        <div className="glass-card rounded-2xl p-6 sm:p-10 text-center mb-12 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary/[.05] blur-[60px]" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-purple/[.05] blur-[60px]" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center mx-auto mb-3"><Mail className="w-5 h-5 text-primary" /></div>
            <h3 className="font-head text-xl sm:text-2xl font-bold text-t1 mb-1">Stay Updated</h3>
            <p className="text-t4 text-sm max-w-md mx-auto mb-5">Get the latest games and exclusive content delivered to your inbox.</p>
            {done ? (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ok/10 text-ok text-sm font-medium">✓ You're subscribed!</div>
            ) : (
              <form onSubmit={sub} className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto">
                <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-input border border-border text-sm text-t1 placeholder:text-t4 focus:outline-none focus:border-primary/50" />
                <button className="w-full sm:w-auto px-5 py-2.5 rounded-xl grad-btn text-white font-medium text-sm whitespace-nowrap">Subscribe</button>
              </form>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg grad-btn grid place-items-center"><Gamepad2 className="w-3.5 h-3.5 text-white" /></div>
              <span className="font-head font-bold text-sm"><span className="text-t1">GAME</span><span className="text-cyan">VERSE</span></span>
            </button>
            <p className="text-[13px] text-t4 leading-relaxed">The ultimate destination for free online games. Play instantly — no downloads.</p>
          </div>
          {[
            { title: 'Quick Links', links: [{ l: 'Home', p: 'home' }, { l: 'Categories', p: 'categories' }, { l: 'Trending', p: 'trending' }, { l: 'New Games', p: 'new' }] },
            { title: 'Support', links: [{ l: 'Help Center', p: '' }, { l: 'Contact Us', p: '' }, { l: 'Report a Bug', p: '' }, { l: 'Request a Game', p: '' }] },
            { title: 'Legal', links: [{ l: 'Privacy Policy', p: '' }, { l: 'Terms of Service', p: '' }, { l: 'Cookie Policy', p: '' }, { l: 'DMCA', p: '' }] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-t1 text-sm mb-3">{col.title}</h4>
              <div className="space-y-2">{col.links.map(l => (
                <button key={l.l} onClick={() => l.p && onNavigate(l.p)} className="block text-[13px] text-t4 hover:text-primary transition-colors">{l.l}</button>
              ))}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-border/40 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-t4">© 2025 GameVerse. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[12px] text-t4">Made with <Heart className="w-3 h-3 text-err fill-err" /> for gamers</p>
          <div className="flex items-center gap-2">
            {['Discord', 'Twitter', 'YouTube'].map(s => (
              <button key={s} className="w-8 h-8 rounded-lg glass grid place-items-center text-t4 hover:text-t1 hover:bg-white/[.06] transition-all text-[10px] font-semibold">{s[0]}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
