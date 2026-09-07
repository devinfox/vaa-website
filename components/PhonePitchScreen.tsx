import Image from 'next/image'
import { Activity, BookOpen, Home, Mic, Music2, Sparkles, User } from 'lucide-react'

/**
 * A faithful mobile rendition of the app's Training Center, built in CSS so
 * it can animate inside the iPhone frame. Colors and type mirror the real app.
 */
export function PhonePitchScreen() {
  const bars = [0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.95, 0.65, 0.8, 0.45, 0.9, 0.55, 0.75, 0.4]
  return (
    <div className="absolute inset-0 flex flex-col bg-[#0d0a1c] text-[10px] text-white/80">
      {/* status bar spacer */}
      <div className="h-11" />

      {/* header */}
      <div className="flex items-center justify-between px-4">
        <Image src="/images/logo.png" alt="Voice Alchemy Academy" width={92} height={22} className="h-[18px] w-auto" />
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-gold-light to-gold-dark" />
      </div>

      <div className="mt-4 px-4">
        <div className="font-display text-[19px] font-semibold leading-none text-white">Training Center</div>
        <div className="mt-1 text-[9px] text-white/50">Track your pitch improvement over time</div>
      </div>

      {/* tabs */}
      <div className="mx-4 mt-3 flex gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1">
        <div className="flex-1 rounded-lg py-1.5 text-center text-white/55">Overview</div>
        <div className="flex-1 rounded-lg bg-violet py-1.5 text-center font-semibold text-white shadow-[0_0_14px_rgba(168,85,247,0.6)]">
          Pitch
        </div>
        <div className="flex-1 rounded-lg py-1.5 text-center text-white/55">Scales</div>
      </div>

      {/* live pitch card */}
      <div className="mx-4 mt-3 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/50">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" />
            </span>
            Live
          </div>
          <div className="rounded-full border border-mint/30 bg-mint/10 px-2 py-0.5 text-[9px] font-semibold text-mint">
            In tune
          </div>
        </div>

        <div className="mt-2 flex items-end justify-between">
          <div>
            <div className="font-display text-[44px] font-semibold leading-none text-gold-gradient">
              A<span className="text-[22px]">4</span>
            </div>
            <div className="mt-1 text-[9px] text-white/45">440.0 Hz · +3 cents</div>
          </div>
          <div className="flex h-10 items-center gap-[3px]">
            {bars.map((h, i) => (
              <span
                key={i}
                className="wave-bar w-[3px] rounded-full bg-gradient-to-t from-violet to-magenta"
                style={{ height: `${h * 100}%`, animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
        </div>

        {/* cents meter */}
        <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="absolute inset-y-0 left-1/2 w-1/4 -translate-x-1/2 rounded-full bg-mint/25" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-white/40" />
          <div className="pitch-needle absolute inset-y-[-2px] left-1/2 w-1 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_10px_rgba(206,180,102,0.9)]" />
        </div>
        <div className="mt-1 flex justify-between text-[8px] text-white/35">
          <span>−50¢</span>
          <span>0</span>
          <span>+50¢</span>
        </div>
      </div>

      {/* stats */}
      <div className="mx-4 mt-3 grid grid-cols-3 gap-2">
        {[
          { l: 'Streak', v: '12', s: 'days', c: 'text-gold' },
          { l: 'Best', v: '94%', s: 'score', c: 'text-mint' },
          { l: 'Week', v: '5', s: 'sessions', c: 'text-cyan' },
        ].map((k) => (
          <div key={k.l} className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
            <div className={`text-[8px] font-semibold ${k.c}`}>{k.l}</div>
            <div className="mt-0.5 text-[15px] font-bold leading-none text-white">{k.v}</div>
            <div className="text-[8px] text-white/40">{k.s}</div>
          </div>
        ))}
      </div>

      {/* AI coach */}
      <div className="mx-4 mt-3 rounded-2xl border border-violet/30 bg-violet/10 p-3">
        <div className="flex items-center gap-1.5 font-display text-[12px] font-semibold text-white">
          <Sparkles className="h-3 w-3 text-gold" /> AI Coach Feedback
        </div>
        <p className="mt-1 leading-snug text-white/65">
          Your A4 is steadier than last week. Breath runs out on the descending scale — try pacing the exhale.
        </p>
      </div>

      {/* tab bar */}
      <div className="mt-auto flex items-center justify-around border-t border-white/10 bg-black/30 px-3 pb-5 pt-2.5 text-white/40">
        <Home className="h-4 w-4" />
        <BookOpen className="h-4 w-4" />
        <div className="-mt-6 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet to-[#7c3aed] text-white shadow-[0_8px_24px_rgba(168,85,247,0.55)]">
          <Mic className="h-5 w-5" />
        </div>
        <Activity className="h-4 w-4 text-gold" />
        <User className="h-4 w-4" />
      </div>
      <Music2 className="sr-only" />
    </div>
  )
}
