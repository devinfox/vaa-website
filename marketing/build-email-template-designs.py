#!/usr/bin/env python3
"""Generate marketing/email-template-designs.html for Voice Alchemy Academy.

Every email is a list of CRM email-builder blocks (header / text / image / button /
divider / spacer / columns / footer). The renderer below mirrors
voice-alchemy-academy-crm/components/email-builder/utils/blocks-to-html.ts so the
preview is what the funnel maker will output, and the block list beside each
preview is the exact build order.
"""
import html
import os


# ---------- brand ----------
INK = "#0b0817"
INK2 = "#120d24"
GOLD = "#ceb466"
GOLD_DARK = "#a88f46"
VIOLET = "#a855f7"
TEXT = "#2D2D2D"
MUTED = "#6F6A7A"
DIVIDER = "#E4E1EA"
CANVAS_BG = "#F5F5F5"
CONTENT_BG = "#FAFAFA"

IMG = "../public/images"
APP = "https://voicealchemyacademy.app"
SITE = "https://www.voicealchemyacademy.com"
LOGO = f"{IMG}/logo.png"

STUDENT_SIGNUP = f"{APP}/signup?role=student&src=email"
TRAINING = f"{APP}/dashboard/training-center"
DASHBOARD = f"{APP}/dashboard"
MENTORSHIP = f"{SITE}/mentorship"
MENTORSHIP_APPLY = f"{SITE}/mentorship#apply"
DEMO_SCHEDULER = "#SCHEDULING_LINK"
PLAYBOOK_URL = "#PLAYBOOK_PDF"
REPLY = "mailto:hello@voicealchemyacademy.com"
INSTAGRAM = "https://instagram.com/VoiceAlchemyAcademy"

FONT_STACK = "Arial, Helvetica, sans-serif"
DISPLAY = "Georgia, 'Times New Roman', serif"


# ---------- block helpers (properties match DEFAULT_BLOCK_PROPERTIES in the CRM) ----------
def header(note="Ink background, VAA gold logo"):
    return dict(type="header", note=note, props=dict(logoUrl=LOGO, companyName="Voice Alchemy Academy", bgColor=INK, textColor=GOLD, padding=28, align="center"))


def text(content, note, align="left", padding=32, fontSize=16, color=TEXT):
    return dict(type="text", note=note, props=dict(content=content, align=align, padding=padding, fontSize=fontSize, color=color))


def image(src, alt, note, width=100, align="center", padding=0, link=""):
    return dict(type="image", note=note, props=dict(src=src, alt=alt, width=width, align=align, padding=padding, link=link))


def button(label, url, note, bg=GOLD, fg=INK, padding=24, radius=999, fontSize=16, align="center", fullWidth=False):
    return dict(type="button", note=note, props=dict(text=label, url=url, bgColor=bg, textColor=fg, align=align, borderRadius=radius, padding=padding, fontSize=fontSize, fullWidth=fullWidth))


def divider(note="Divider", padding=8, width=84, color=DIVIDER):
    return dict(type="divider", note=note, props=dict(color=color, thickness=1, width=width, style="solid", padding=padding))


def spacer(h=24, note=None):
    return dict(type="spacer", note=note or f"Spacer {h}px", props=dict(height=h))


def col_text(content, align="left", fontSize=15, color=TEXT):
    return dict(type="text", content=content, align=align, fontSize=fontSize, color=color, src="", alt="", width=100)


def col_image(src, alt):
    return dict(type="image", content="", align="center", fontSize=16, color=TEXT, src=src, alt=alt, width=100)


def columns(cols, note, widths=None, gap=20, padding=32, showDivider=False):
    n = len(cols)
    widths = widths or [round(100 / n)] * n
    return dict(type="columns", note=note, props=dict(columnCount=n, columnWidths=widths, gap=gap, padding=padding, showDivider=showDivider, dividerColor=DIVIDER, dividerThickness=1, columnContent=cols))


def footer(text_line, note="Ink footer, Instagram + unsubscribe", audience_line=None):
    body = text_line if not audience_line else f"{text_line}<br><span style=\"color:#8A8399\">{audience_line}</span>"
    return dict(type="footer", note=note, props=dict(text=body, showSocial=True, socialLinks=[dict(name="Instagram", url=INSTAGRAM), dict(name="voicealchemyacademy.com", url="https://voicealchemyacademy.com")], unsubscribeUrl="{{unsubscribe_url}}", bgColor=INK2, textColor="#B7B0C7", padding=28))


# ---------- rich-text snippets used inside text blocks ----------
def eyebrow(t, color=GOLD_DARK):
    return f'<p style="margin:0 0 10px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:{color};font-weight:bold">{t}</p>'


def h1(t):
    return f'<p style="margin:0 0 14px 0;font-family:{DISPLAY};font-size:30px;line-height:1.15;color:{INK}">{t}</p>'


def p(t, last=False, size=16, color=TEXT):
    m = "0" if last else "0 0 14px 0"
    return f'<p style="margin:{m};font-size:{size}px;line-height:1.6;color:{color}">{t}</p>'


def small(t, color=MUTED):
    return f'<p style="margin:0;font-size:13px;line-height:1.5;color:{color}">{t}</p>'


def tip(label, t, color=GOLD_DARK):
    return (f'<p style="margin:0 0 6px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:{color};font-weight:bold">{label}</p>'
            f'<p style="margin:0;font-size:16px;line-height:1.6;color:{TEXT}">{t}</p>')


def colhead(t, color=GOLD_DARK):
    return f'<p style="margin:0 0 6px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:{color};font-weight:bold">{t}</p>'


# ---------- renderer (mirror of blocks-to-html.ts) ----------
def render_block(b):
    t, pr = b["type"], b["props"]
    if t == "header":
        return f'<tr><td style="background-color:{pr["bgColor"]};padding:{pr["padding"]}px;text-align:{pr["align"]}"><img src="{pr["logoUrl"]}" alt="{pr["companyName"]}" style="display:block;max-height:50px;width:auto;margin:0 auto"></td></tr>'
    if t == "text":
        return f'<tr><td class="email-text" style="padding:{pr["padding"]}px;text-align:{pr["align"]};font-size:{pr["fontSize"]}px;color:{pr["color"]};line-height:1.5">{pr["content"]}</td></tr>'
    if t == "image":
        margin = "margin:0 auto;" if pr["align"] == "center" else "margin:0;"
        img = f'<img src="{pr["src"]}" alt="{html.escape(pr["alt"])}" style="display:block;max-width:{pr["width"]}%;height:auto;border:0;{margin}">'
        if pr.get("link"):
            img = f'<a href="{pr["link"]}" style="display:block;{margin}max-width:{pr["width"]}%">{img}</a>'
        return f'<tr><td style="padding:{pr["padding"]}px">{img}</td></tr>'
    if t == "button":
        width = "100%" if pr["fullWidth"] else "auto"
        m = "margin:0 auto;" if pr["align"] == "center" else "margin:0;"
        return (f'<tr><td style="padding:{pr["padding"]}px;text-align:{pr["align"]}"><table role="presentation" cellpadding="0" cellspacing="0" style="{m}"><tr>'
                f'<td style="background-color:{pr["bgColor"]};border-radius:{pr["borderRadius"]}px;padding:14px 30px">'
                f'<a href="{pr["url"]}" style="display:inline-block;color:{pr["textColor"]};font-size:{pr["fontSize"]}px;font-weight:bold;text-decoration:none;width:{width};text-align:center">{pr["text"]}</a>'
                f'</td></tr></table></td></tr>')
    if t == "divider":
        return f'<tr><td style="padding:{pr["padding"]}px"><table role="presentation" cellpadding="0" cellspacing="0" style="width:{pr["width"]}%;margin:0 auto"><tr><td class="email-divider" style="border-top:{pr["thickness"]}px {pr["style"]} {pr["color"]}"></td></tr></table></td></tr>'
    if t == "spacer":
        return f'<tr><td style="height:{pr["height"]}px;line-height:{pr["height"]}px;font-size:1px">&nbsp;</td></tr>'
    if t == "columns":
        n, widths, gap = pr["columnCount"], pr["columnWidths"], pr["gap"]
        cells = []
        for i, c in enumerate(pr["columnContent"]):
            last = i == n - 1
            if c["type"] == "image" and c["src"]:
                inner = f'<img src="{c["src"]}" alt="{html.escape(c["alt"])}" style="display:block;max-width:{c["width"]}%;height:auto;border:0;margin:0 auto">'
            else:
                inner = f'<div class="email-text" style="text-align:{c["align"]};font-size:{c["fontSize"]}px;color:{c["color"]};line-height:1.5">{c["content"]}</div>'
            border = f'border-right:{pr["dividerThickness"]}px solid {pr["dividerColor"]};' if pr["showDivider"] and not last else ""
            pad = f'padding:0 {0 if last else gap // 2}px 0 {gap // 2 if i > 0 else 0}px;'
            cells.append(f'<td class="email-divider" style="width:{widths[i]}%;vertical-align:top;{border}{pad}">{inner}</td>')
        return f'<tr><td style="padding:{pr["padding"]}px"><table role="presentation" cellpadding="0" cellspacing="0" style="width:100%"><tr>{"".join(cells)}</tr></table></td></tr>'
    if t == "footer":
        links = " | ".join(f'<a href="{s["url"]}" style="color:{pr["textColor"]};margin:0 8px;text-decoration:none">{s["name"]}</a>' for s in pr["socialLinks"])
        return (f'<tr><td style="background-color:{pr["bgColor"]};padding:{pr["padding"]}px;text-align:center">'
                f'<p style="margin:0 0 14px 0;font-size:13px">{links}</p>'
                f'<p class="email-text-muted" style="margin:0 0 8px 0;font-size:13px;line-height:1.5;color:{pr["textColor"]}">{pr["text"]}</p>'
                f'<p style="margin:0;font-size:12px"><a href="{pr["unsubscribeUrl"]}" style="color:{pr["textColor"]}">Unsubscribe</a></p></td></tr>')
    raise ValueError(t)


def render_email(blocks):
    body = "".join(render_block(b) for b in blocks)
    return (f'<div class="canvas" style="background:{CANVAS_BG}"><table role="presentation" cellpadding="0" cellspacing="0" class="email-container" '
            f'style="width:100%;max-width:600px;margin:0 auto;background-color:{CONTENT_BG};font-family:{FONT_STACK}">{body}</table></div>')


BLOCK_LABEL = dict(header="Header", text="Text", image="Image", button="Button", divider="Divider", spacer="Spacer", columns="Columns", footer="Footer")


def block_list(blocks):
    items = []
    for b in blocks:
        pr = b["props"]
        detail = b["note"]
        if b["type"] == "button":
            detail += f' &middot; <span class="sw" style="background:{pr["bgColor"]}"></span> {pr["bgColor"]} &rarr; <code>{html.escape(pr["url"])}</code>'
        if b["type"] == "image":
            detail += f' &middot; <code>{os.path.basename(pr["src"])}</code>'
        if b["type"] == "columns":
            detail += f' &middot; {pr["columnCount"]} columns'
            srcs = [os.path.basename(c["src"]) for c in pr["columnContent"] if c["src"]]
            if srcs:
                detail += " &middot; " + ", ".join(f"<code>{s}</code>" for s in srcs)
        items.append(f'<li><span class="bt bt-{b["type"]}">{BLOCK_LABEL[b["type"]]}</span><span>{detail}</span></li>')
    return "<ol class=\"blocks\">" + "".join(items) + "</ol>"


# =====================================================================
# EMAILS
# =====================================================================
FOOT_STUDENT = "Voice Alchemy Academy &middot; hello@voicealchemyacademy.com"
FOOT_TEACHER = "Voice Alchemy Academy &middot; Built for singers who want proof and coaches who want clarity."
ACCT = "You are receiving this because you created a Voice Alchemy Academy account."
LEAD = "You are receiving this because you asked for the free pitch guide on voicealchemyacademy.com."
PITCH_GUIDE_URL = "#PITCH_GUIDE_PDF"
BOOKING_URL = "#JULIA_BOOKING_LINK"
LIVE_PITCH = f"{IMG}/email/pitch_perfect_session.webp"
LIVE_KEYS = f"{IMG}/email/pitch_perfect_keyboard_session.webp"
LIVE_RHYTHM = f"{IMG}/email/rhythm_trainer_session.webp"
LIVE_SCALE = f"{IMG}/email/scale_trainer_session.webp"

E = []  # (role_key, email dict)

def email(role, n, name, timing, subject, preheader, cta, landing, why, assets, blocks, ship_first=False):
    E.append((role, dict(n=n, name=name, timing=timing, subject=subject, preheader=preheader, cta=cta, landing=landing, why=why, assets=assets, blocks=blocks, ship_first=ship_first)))

# ---------------- STUDENTS (app accounts) ----------------
email("students", 1, "Welcome / First Note", "Immediately after the student account is created",
    "Your voice is ready to become visible", "Start with one note. No special mic, no pressure.",
    "Open Pitch Perfect", "App &rarr; Training Center &rarr; Pitch Perfect",
    "The first email has one job: get the singer to sing a single note into Pitch Perfect and watch the needle move. "
    "Everything else (streaks, scales, courses, mentorship) only matters after that first visual proof. "
    "Do not list features here. The screenshot shows the tool actually listening so they know what they will see.",
    ["logo.png", "pitch_perfect_session.webp"], [
        header(),
        text(eyebrow("Welcome to Voice Alchemy") + h1("Start with one note.") +
             p("Hi {{first_name}},") +
             p("The fastest way to understand Voice Alchemy is simple: open Pitch Perfect, tap Start Mic, sing a comfortable note, and watch where your voice actually lands.") +
             p("No special microphone. No perfect warm-up. Just one note, one clear needle, and a little more truth than your ears can give you on their own.", last=True),
             "Eyebrow + headline + welcome copy (one rich-text block)"),
        image(LIVE_PITCH, "Pitch Perfect mid-session: target C4 matched at +3 cents, 91% target accuracy", "Pitch Perfect mid-session (wheel view), full-bleed"),
        text(tip("Try this today", "Sing one note for five seconds. Breathe. Sing it again. Watch whether the needle settles closer to the center the second time."), "Tip card: gold label + one instruction"),
        button("Open Pitch Perfect", TRAINING, "Gold pill button (student)"),
        divider(),
        text(small("Your free tools are ready any time you are. Pitch Perfect, Scale Trainer and Rhythm Trainer all live in your Training Center."), "Muted reassurance line", align="center", padding=20),
        footer(FOOT_STUDENT, audience_line=ACCT),
    ], ship_first=True)

email("students", 2, "Habit Builder / 30-Second Check", "Day 2",
    "The 30-second practice that tells you a lot", "A tiny check-in before your next song.",
    "Do the 30-second check", "App &rarr; Training Center",
    "Most new singers never come back for session two because they think practice has to be long. "
    "This shrinks the habit to something they can do between songs on a commute. Two steps, one screenshot of the whole "
    "Training Center so they see there is more than pitch, one button.",
    ["logo.png", "student_training_overview.webp"], [
        header(),
        text(eyebrow("Day 2 &middot; Build the habit") + h1("Give your voice 30 seconds.") +
             p("You do not need a long practice session to learn something useful today. Small sessions teach your voice that showing up can be easy.", last=True),
             "Eyebrow + headline + intro"),
        columns([
            col_text(colhead("Step 1") + p("Open Pitch Perfect and hold a few comfortable notes. Watch the needle settle.", last=True, size=15)),
            col_text(colhead("Step 2") + p("Tap into Scales or Rhythm for one quick round. That is enough to keep the thread alive.", last=True, size=15)),
        ], "Two columns: Step 1 / Step 2", showDivider=True, padding=24),
        image(f"{IMG}/email/student_training_overview.webp", "Training Center overview with streaks and scores", "Full-bleed screenshot"),
        button("Do the 30-second check", TRAINING, "Gold pill button"),
        divider(),
        text(small("One small practice is better than waiting for the perfect practice."), "Muted closing line", align="center", padding=20),
        footer(FOOT_STUDENT, audience_line=ACCT),
    ], ship_first=True)

email("students", 3, "Scales + Rhythm Expansion", "Day 5",
    "Your pitch is only one part of the picture", "Try scales and rhythm next.",
    "Try scales and rhythm", "App &rarr; Training Center",
    "Once pitch makes sense, the app should feel bigger. Introducing the other two free trainers makes the product stickier "
    "and sets up the idea that practice can be measured, which is the bridge to courses and mentorship later. "
    "Both screenshots show the trainers mid-session so the copy can stay short.",
    ["logo.png", "scale_trainer_session.webp", "rhythm_trainer_session.webp"], [
        header(),
        text(eyebrow("Day 5 &middot; Two more free tools") + h1("Now train the parts around the note.") +
             p("Pitch matters. So does finding the next note cleanly, keeping time, and staying steady when the pattern changes.", last=True),
             "Eyebrow + headline + intro"),
        columns([
            col_image(LIVE_SCALE, "Scale Trainer mid-practice: four notes passed, G4 next, 97% overall"),
            col_image(LIVE_RHYTHM, "Rhythm Trainer at 90 BPM: 14 on-beat taps, 78% accuracy, best streak 9"),
        ], "Two columns: Scale Trainer / Rhythm Trainer in use", gap=12, padding=24),
        columns([
            col_text(colhead("Scale Trainer") + p("Use it when you want accuracy. Each note lights green when you hold it, and every step is scored.", last=True, size=15)),
            col_text(colhead("Rhythm Trainer") + p("Use it when you want timing. Tap along and see whether you rush or drag on every beat.", last=True, size=15)),
        ], "Two columns: explainer text under each screenshot", padding=24),
        button("Try scales and rhythm", TRAINING, "Gold pill button"),
        divider(),
        text(small("Together, they turn practice into something you can actually measure."), "Muted closing line", align="center", padding=20),
        footer(FOOT_STUDENT, audience_line=ACCT),
    ])

email("students", 4, "Upgrade Path / Next Layer", "Day 10, only if the student has practiced at least once",
    "When you want more than numbers", "Your practice data can become a plan.",
    "See 1:1 mentorship", "voicealchemyacademy.com/mentorship (courses linked in body)",
    "Nothing in the app can be bought today except mentorship with Julia, so the upgrade email points there. "
    "It only lands after the singer has felt value from the free tools. The tone is an invitation, never a paywall.",
    ["logo.png", "ai_coach_card.webp"], [
        header(),
        text(eyebrow("Day 10 &middot; The next layer") + h1("Your practice can become a plan.") +
             p("Once you can see what your voice is doing, the next question is: what should I work on next?") +
             p("That is where the deeper side of Voice Alchemy opens up: guided courses, coaching feedback that reads your practice data, lesson notes, and one-on-one mentorship with Julia for singers who want real structure.", last=True),
             "Eyebrow + headline + intro"),
        image(f"{IMG}/email/ai_coach_card.webp", "AI coach feedback card reading practice data", "Full-bleed screenshot"),
        columns([
            col_text(colhead("Coach feedback") + p("Strengths, focus areas and three drills, drawn from your real sessions.", last=True, size=14)),
            col_text(colhead("Courses") + p("A structured curriculum instead of a pile of videos.", last=True, size=14)),
            col_text(colhead("Mentorship") + p("A semester of live 1:1 lessons with the founder, inside the app.", last=True, size=14)),
        ], "Three columns: Coach feedback / Courses / Mentorship", gap=16, padding=24),
        button("See 1:1 mentorship", MENTORSHIP, "Gold pill button"),
        text(small(f'Keep using the free tools as your base. When you want a clearer path, the rest of the academy is here. <a href="{APP}/dashboard/courses" style="color:{GOLD_DARK}">Browse courses</a>.'), "Muted line with secondary courses link", align="center", padding=20),
        footer(FOOT_STUDENT, audience_line="Train first. Upgrade when you want deeper guidance."),
    ])

email("students", 5, "Re-engagement / One Note", "7 days with no app activity (repeat once at 14 days)",
    "Come back for one note", "No big restart needed.",
    "Sing one note", "App &rarr; Training Center &rarr; Pitch Perfect",
    "Lapsed singers feel guilty, and guilt keeps them away. This removes the drama: one comfortable note is enough to restart. "
    "Short, kind, the tool they already know shown listening, one button. No streak shaming, no feature list.",
    ["logo.png", "pitch_perfect_session.webp"], [
        header(),
        text(eyebrow("A gentle nudge") + h1("No big restart.") +
             p("If practice slipped for a few days, you do not have to make it dramatic.") +
             p("Open Pitch Perfect. Sing one comfortable note. Let that be enough to restart the thread. Momentum usually comes after the first tiny action, not before it.", last=True),
             "Eyebrow + headline + copy"),
        image(LIVE_KEYS, "Pitch Perfect keyboard view mid-session, C4 matched", "Pitch Perfect mid-session (keyboard view), full-bleed"),
        button("Sing one note", TRAINING, "Gold pill button"),
        divider(),
        text(small("Your tools are still there when you are ready."), "Muted closing line", align="center", padding=20),
        footer(FOOT_STUDENT, audience_line=ACCT),
    ])

# ---------------- STUDENT LEADS (email only, no account) ----------------
email("leads", 1, "Pitch Guide Delivery", "Immediately after the email is captured (exit-intent or footer form)",
    "Your pitch guide is here", "The 3 pitch mistakes almost every self-taught singer makes.",
    "Read the guide", "Hosted PDF (needs to be written), then student signup",
    "The website's exit-intent popup already promises this guide, and today nothing delivers it. This email keeps that promise "
    "and immediately offers a way to test the problem on their own voice. Every email in this track points back to account creation, never to another article.",
    ["logo.png", "pitch_perfect_session.webp"], [
        header(),
        text(eyebrow("Your free guide") + h1("The 3 pitch mistakes almost every self-taught singer makes.") +
             p("Hi {{first_name}},") +
             p("Here is the guide you asked for. It is short on purpose: three habits that make singers sound less in tune than they are, and one exercise for each.", last=True),
             "Eyebrow + headline + delivery copy"),
        button("Read the guide", PITCH_GUIDE_URL, "Gold pill button: PDF"),
        divider(),
        text(eyebrow("Then test it") + p("Reading about pitch is one thing. Seeing your own note drift is another. Pitch Perfect shows the needle live while you sing, so you can check each mistake against your real voice in under a minute.", last=True), "Second section: bridge to the app", padding=32),
        image(LIVE_PITCH, "Pitch Perfect mid-session with target C4 matched", "Pitch Perfect mid-session (wheel view), full-bleed"),
        button("Test it in Pitch Perfect, free", STUDENT_SIGNUP, "Gold pill button: signup"),
        footer(FOOT_STUDENT, audience_line=LEAD),
    ])

email("leads", 2, "The Mistake Your Ears Miss", "Day 2",
    "The mistake your ears miss", "Why sustained notes drift flat, and how to see it.",
    "See it live", "Student signup",
    "Teaches one concept from the guide in the email itself, so the reader gets value without opening a PDF. "
    "The concept chosen (flattening at the end of long notes) is the one Pitch Perfect makes most visible, which makes the CTA feel like the obvious next step.",
    ["logo.png", "pitch_perfect_session.webp"], [
        header(),
        text(eyebrow("Mistake #1") + h1("Long notes sink. Your ears forgive it.") +
             p("Most self-taught singers land a note in tune and then let it sag as the breath runs out. By the last beat they are 15 to 30 cents flat, and because it happened slowly, it sounds fine from the inside.") +
             p("The fix is not more effort. It is seeing the sag, so you can feel the moment support drops.", last=True),
             "Eyebrow + headline + lesson"),
        image(LIVE_KEYS, "Pitch Perfect keyboard view: needle, Hz and cents readout on a held C4", "Pitch Perfect mid-session (keyboard view), full-bleed"),
        text(tip("Try this", "Hold one note for eight slow counts with Pitch Perfect listening. Watch the cents number, not the note name. Where does it start to move?"), "Tip card"),
        button("See it live", STUDENT_SIGNUP, "Gold pill button: signup"),
        divider(),
        text(small("Free account, no card, works on your phone or laptop microphone."), "Muted reassurance line", align="center", padding=20),
        footer(FOOT_STUDENT, audience_line=LEAD),
    ])

email("leads", 3, "Before Your Next Rehearsal", "Day 5",
    "Try this before your next rehearsal", "A two-minute check-in that makes the app useful today.",
    "Start singing free", "Student signup",
    "Last email of the lead track. It ties the app to a real moment in their week (the next rehearsal, gig or choir night) "
    "so signing up has an immediate payoff instead of being a someday task. Shows the full Training Center so they see the streaks and scores waiting for them.",
    ["logo.png", "student_training_overview.webp"], [
        header(),
        text(eyebrow("A pre-rehearsal ritual") + h1("Two minutes before you sing with other people.") +
             p("Warm-ups tell your body you are about to sing. A pitch check tells you where your voice actually is today: a little sharp, a little heavy, or right on.") +
             p("Open Pitch Perfect, hold three comfortable notes, then run one round of scales. You will walk into rehearsal knowing something most singers only guess at.", last=True),
             "Eyebrow + headline + copy"),
        image(f"{IMG}/email/student_training_overview.webp", "Training Center with streaks, scores and trainers", "Full-bleed screenshot"),
        button("Start singing free", STUDENT_SIGNUP, "Gold pill button: signup"),
        divider(),
        text(small("This is the last email in this series. Your guide and the free tools stay available."), "Muted closing line", align="center", padding=20),
        footer(FOOT_STUDENT, audience_line=LEAD),
    ])

# ---------------- TEACHERS ----------------
V = VIOLET
email("teachers", 1, "Demo Request Received", "Immediately after the demo form is submitted",
    "We received your VAA demo request", "We will show the teacher workflow around your studio.",
    "Choose a demo time", "Scheduling link (needs a real URL)",
    "A coach who fills in a demo form expects a human reply, not a newsletter. This confirms receipt, reflects the pain they selected "
    "on the form, and says exactly what the walkthrough covers so the demo feels worth showing up for. Violet keeps teacher emails visually distinct.",
    ["logo.png", "teacher_students.webp"], [
        header(),
        text(eyebrow("Demo request received", color=V) + h1("Your demo will start between lessons.") +
             p("Hi {{first_name}},") +
             p("Thanks for asking to see Voice Alchemy Academy. We will keep the walkthrough practical: how your students practice, what you can see before a lesson, and how that turns into better assignments after it.", last=True),
             "Eyebrow (violet) + headline + copy"),
        image(f"{IMG}/email/teacher_students.webp", "Teacher roster with student practice data", "Full-bleed screenshot"),
        columns([
            col_text(colhead("We will show", color=V) + p("Student practice data before each lesson<br>Live lesson flow with automatic notes<br>Homework recordings in one place", last=True, size=15)),
            col_text(colhead("Also covered", color=V) + p("Scheduling and pending requests<br>Course builder and quizzes<br>How existing students move in", last=True, size=15)),
        ], "Two columns: demo agenda", showDivider=True, padding=24),
        button("Choose a demo time", DEMO_SCHEDULER, "Violet pill button (teacher)", bg=V, fg="#FFFFFF"),
        divider(),
        text(small("If you already have a student in mind who says they practiced but you are not sure, bring that example to the demo."), "Muted line: bring a student example", align="center", padding=20),
        footer(FOOT_TEACHER, audience_line="You are receiving this because you requested a platform demo."),
    ], ship_first=True)

email("teachers", 2, "Unbooked Reminder", "Day 3 if no demo time has been chosen",
    "Still want to see student practice data?", "Your walkthrough slot is still open.",
    "Pick a time", "Scheduling link",
    "Most demo requests go quiet because booking a time felt like one step too many. This is a short, human reminder that "
    "re-states the single most compelling thing in the product (seeing what students did between lessons) and asks for one click. No agenda repeat, no pressure.",
    ["logo.png", "coach_dashboard.webp"], [
        header(),
        text(eyebrow("Quick reminder", color=V) + h1("Still want to see what your students practiced?") +
             p("Hi {{first_name}},") +
             p("Your demo request is still open on our side. Most coaches book the walkthrough for one reason: to see a student's practice data on screen before a lesson, and decide whether that changes how they teach.") +
             p("It takes twenty minutes. Pick a time that suits your studio and we will build the demo around it.", last=True),
             "Eyebrow (violet) + headline + copy"),
        image(f"{IMG}/email/coach_dashboard.webp", "Coach dashboard with active students and live studio", "Full-bleed screenshot"),
        button("Pick a time", DEMO_SCHEDULER, "Violet pill button", bg=V, fg="#FFFFFF"),
        divider(),
        text(small(f'Not the right moment? Reply to this email and tell us when to check back, or read the <a href="{PLAYBOOK_URL}" style="color:{V}">practice visibility playbook</a> first.'), "Muted line with playbook link", align="center", padding=20),
        footer(FOOT_TEACHER, audience_line="You are receiving this because you requested a platform demo."),
    ])

email("teachers", 3, "Practice Visibility Playbook", "Day 5 if still unbooked, or the first email for teachers who only left an email",
    "Your practice visibility playbook", "A simple way to make between-lesson practice clearer.",
    "Download the playbook", "Hosted PDF (needs to be written), then demo form",
    "A softer offer for coaches who are curious but not ready for a sales call. The playbook names the real pain, "
    "students who say they practiced, and gives a method that works with or without software. VAA is then positioned as the "
    "operational version of the same idea. Requires the PDF to exist before this goes live.",
    ["logo.png", "teacher_student_detail.webp"], [
        header(),
        text(eyebrow("A resource for vocal coaches", color=V) + h1("Make practice easier to see.") +
             p("Most teachers are not short on care. They are short on visibility.") +
             p("This short playbook shows a simple way to make between-lesson practice more honest, more trackable, and less awkward to talk about with students. Use it even if you never change platforms.", last=True),
             "Eyebrow (violet) + headline + copy"),
        image(f"{IMG}/email/teacher_student_detail.webp", "Student detail page with practice history and notes", "Full-bleed screenshot"),
        button("Download the playbook", PLAYBOOK_URL, "Violet pill button", bg=V, fg="#FFFFFF"),
        text(small(f'Want the software version of the same idea? <a href="{SITE}/?view=teacher#teacher-demo" style="color:{V};font-weight:bold">Book a short demo</a> and we will show it around your studio.'), "Secondary text link to the demo form", align="center", padding=16),
        divider(),
        text(small("The question to ask before every lesson: what happened since we last met? VAA answers it with data."), "Muted closing line", align="center", padding=20),
        footer(FOOT_TEACHER, audience_line="You are receiving this because you asked about Voice Alchemy for teachers."),
    ])

email("teachers", 4, "Post-Demo Recap / Pilot", "Same day as the demo (sent by Julia, first paragraph personalized)",
    "Recap: how VAA would fit your studio", "A simple first step for your students.",
    "Plan the pilot", "Reply to Julia",
    "The serious buyer converts here. Instead of asking a coach to move their whole studio, the recap proposes a three-student pilot "
    "so adoption feels small and reversible. The three-column week-one plan makes the next step concrete.",
    ["logo.png", "teacher_courses.webp"], [
        header(),
        text(eyebrow("After your demo", color=V) + h1("A clean first week.") +
             p("Thank you for spending time with us today. Based on what you shared, the easiest first step is not moving your whole studio at once.") +
             p("Start with three students. Give them the free tools, assign one simple practice target, and look at their data before the next lesson.", last=True),
             "Eyebrow (violet) + headline + personalized recap"),
        image(f"{IMG}/email/teacher_courses.webp", "Teacher course builder", "Full-bleed screenshot"),
        columns([
            col_text(colhead("1. Invite", color=V) + p("Send three students to the app. They request you as their teacher and you approve.", last=True, size=14)),
            col_text(colhead("2. Assign", color=V) + p("Give each one a single scale or pitch target for the week.", last=True, size=14)),
            col_text(colhead("3. Review", color=V) + p("Open their practice data before the next lesson and run one live lesson in the app.", last=True, size=14)),
        ], "Three columns: week-one plan", gap=16, padding=24),
        button("Plan the pilot", REPLY, "Violet pill button (mailto reply)", bg=V, fg="#FFFFFF"),
        divider(),
        text(small("Reply to this email with the first students you would want to test with and we will set them up together."), "Muted closing line", align="center", padding=20),
        footer(FOOT_TEACHER, audience_line="You are receiving this because you attended a Voice Alchemy demo."),
    ])

email("teachers", 5, "Keep Your Spot?", "Day 10 after the demo if there has been no reply",
    "Should we keep a place for your studio?", "A yes or a not-now is equally welcome.",
    "Yes, keep my spot", "Reply to Julia",
    "Closes the loop politely. A coach who has gone quiet after a demo usually needs permission to say not now. "
    "Asking for a simple yes or no preserves goodwill, clears the pipeline, and often gets the real objection out in the reply. No image, no pitch, one question.",
    ["logo.png"], [
        header(),
        text(eyebrow("One question", color=V) + h1("Should we keep a place for your studio?") +
             p("Hi {{first_name}},") +
             p("We set aside onboarding time for the studios we demo, and we would rather hold yours than give it away by mistake.") +
             p("If a pilot still makes sense, hit the button and we will pick up where the demo left off. If the timing is wrong, a one-line reply saying not now is genuinely fine, and we will stop nudging.", last=True),
             "Eyebrow (violet) + headline + copy"),
        button("Yes, keep my spot", REPLY + "?subject=Keep%20my%20spot", "Violet pill button (mailto)", bg=V, fg="#FFFFFF"),
        text(small(f'<a href="{REPLY}?subject=Not%20now" style="color:{V};font-weight:bold">Not now</a> &middot; we will check back next semester.'), "Text link: Not now", align="center", padding=8),
        divider(),
        text(small("Either way, thank you for taking the time to look at what we are building for coaches."), "Muted closing line", align="center", padding=20),
        footer(FOOT_TEACHER, audience_line="You are receiving this because you attended a Voice Alchemy demo."),
    ])

email("teachers", 6, "Re-engagement / Between Lessons", "14 days with no reply at any stage",
    "The real problem is between lessons", "Most teaching tools manage lessons. This shows what happened between them.",
    "See the teacher workflow", "Website teacher view, then demo form",
    "A single thought-leadership email for coaches who went cold at any stage. It leads with the idea, not the product, "
    "so it earns a read even from someone who decided against a demo. The CTA goes to the website's teacher view rather than straight to a booking, which is a lower ask.",
    ["logo.png", "teacher_students.webp"], [
        header(),
        text(eyebrow("A thought for your studio", color=V) + h1("The real problem is between lessons.") +
             p("A lesson is thirty to sixty minutes. The other six days and twenty-three hours are where a voice actually changes, and most of us teach blind to them.") +
             p("Students say they practiced. Some did. Some did the wrong thing carefully. Some opened the app once and closed it. Until you can see the difference, every lesson starts with guesswork.", last=True),
             "Eyebrow (violet) + headline + essay"),
        image(f"{IMG}/email/teacher_students.webp", "Teacher roster with practice-this-week data", "Full-bleed screenshot"),
        text(tip("What changes", "When practice data arrives before the lesson, the first ten minutes stop being diagnosis and become work.", color=V), "Tip card (violet label)"),
        button("See the teacher workflow", f"{SITE}/?view=teacher", "Violet pill button", bg=V, fg="#FFFFFF"),
        divider(),
        text(small("This is the last automated email we send to coaches. Reply any time and a person will answer."), "Muted closing line", align="center", padding=20),
        footer(FOOT_TEACHER, audience_line="You are receiving this because you asked about Voice Alchemy for teachers."),
    ])

# ---------------- MENTORSHIP ----------------
email("mentorship", 1, "Voice Application Received", "Immediately after the application is submitted",
    "Your Voice Application is in", "Julia will read it personally.",
    "Start a gentle pitch check", "Student signup, then Pitch Perfect",
    "Applying to a founder-led program is an emotional step. This confirms the application landed, promises a personal reply, "
    "and gives the applicant something useful to do while they wait: create a free account and take a pitch check, so Julia has "
    "real data by the time the conversation happens. Warm, brief, no selling.",
    ["logo.png", "lesson_notes_card.webp"], [
        header(),
        text(eyebrow("Voice Application") + h1("Your application is in.") +
             p("Hi {{first_name}},") +
             p("Thank you for sharing your voice story with us. Julia reads every application personally, and we will follow up as soon as she has read yours.") +
             p("While you wait, you can begin getting familiar with the app. Start with a gentle pitch check. It gives you a simple snapshot of where your voice is today, and it gives Julia something real to talk about when you meet.", last=True),
             "Eyebrow + headline + confirmation copy"),
        image(f"{IMG}/email/lesson_notes_card.webp", "Lesson notes with AI summary, teacher feedback and homework", "Full-bleed screenshot"),
        text(tip("What happens next", "Julia replies from hello@voicealchemyacademy.com, usually within a few days. If it is a fit, she will suggest a time to talk and walk you through the semester."), "Tip card: what happens next"),
        button("Start a gentle pitch check", STUDENT_SIGNUP, "Gold pill button"),
        divider(),
        text(small(f'Explore <a href="{INSTAGRAM}" style="color:{GOLD_DARK}">@VoiceAlchemyAcademy</a> for philosophy, tips, tools and inspiring music.'), "Muted line with Instagram link", align="center", padding=20),
        footer(FOOT_STUDENT, audience_line="You are receiving this because you submitted a Voice Application."),
    ], ship_first=True)

email("mentorship", 2, "While Julia Reviews", "Day 2 after submission, if no reply has gone out yet",
    "While Julia reviews your application", "What a semester actually looks like.",
    "Open Pitch Perfect", "App &rarr; Training Center &rarr; Pitch Perfect",
    "Silence after an application breeds doubt. This fills the gap with substance: what the semester covers and how lessons live inside the app. "
    "It keeps the applicant engaged in the free tools so the eventual conversation starts from real practice, not from scratch.",
    ["logo.png", "student_my_lessons.webp"], [
        header(),
        text(eyebrow("Voice Application &middot; Day 2") + h1("While Julia reads your story.") +
             p("Applications are read in the order they arrive, and each one gets a proper read rather than a skim. In the meantime, here is what the semester looks like from the inside.", last=True),
             "Eyebrow + headline + copy"),
        columns([
            col_text(colhead("Weekly 1:1 lessons") + p("Live video with Julia, inside the app, with your practice data on screen.", last=True, size=14)),
            col_text(colhead("Notes that follow you") + p("Every lesson is summarized with homework that shows up in your trainers.", last=True, size=14)),
            col_text(colhead("The e-workbook") + p("Philosophy, warm-ups and exercises, plus your own working space.", last=True, size=14)),
        ], "Three columns: what the semester includes", gap=16, padding=24),
        image(f"{IMG}/email/student_my_lessons.webp", "My Lessons view with upcoming lesson and teacher", "Full-bleed screenshot"),
        text(p("If you have not tried it yet, a two-minute session in Pitch Perfect is the best way to make our first conversation concrete.", last=True), "Bridge copy", padding=32),
        button("Open Pitch Perfect", TRAINING, "Gold pill button"),
        footer(FOOT_STUDENT, audience_line="You are receiving this because you submitted a Voice Application."),
    ])

email("mentorship", 3, "Julia Would Like to Meet You", "Manual send when an application is accepted",
    "Julia would like to meet with you", "Let's find a time to talk about your semester.",
    "Book a conversation", "Booking link (needs a real URL) or reply",
    "The admissions email. It should feel like a personal note from Julia, not a system message, so the copy is first person and the photo shows a live online lesson. "
    "One CTA to book the call, plus a reply option for people who prefer email. Julia edits the opening line before sending.",
    ["logo.png", "mentorship-call.jpg"], [
        header(),
        text(eyebrow("From Julia") + h1("I would love to meet you.") +
             p("Hi {{first_name}},") +
             p("I read your application this week and something in it stayed with me. I think there is real work we could do together this semester, and I would like to talk it through with you properly, voice to voice.") +
             p("The call is relaxed: twenty to thirty minutes, no singing required, just where you are, where you want to go, and whether the way I work fits that.", last=True),
             "Eyebrow + headline + personal note (Julia edits line one)"),
        image(f"{IMG}/photos/mentorship-call.jpg", "A singer in a live online lesson with Julia on screen", "Full-bleed photo: live online lesson"),
        button("Book a conversation", BOOKING_URL, "Gold pill button: booking link"),
        text(small(f'Prefer email? Just <a href="{REPLY}?subject=Mentorship%20conversation" style="color:{GOLD_DARK}">reply to this message</a> with a few times that work.'), "Text link: reply instead", align="center", padding=8),
        divider(),
        text(small("Seats are limited each semester so every student gets real attention. This one is held for you until we speak."), "Muted closing line", align="center", padding=20),
        footer(FOOT_STUDENT, audience_line="You are receiving this because you submitted a Voice Application."),
    ])

email("mentorship", 4, "Not This Semester", "Manual send when there is no seat, or the fit is not right yet",
    "About your Voice Application", "Not this semester, and what we can offer instead.",
    "Keep training free", "App &rarr; Training Center",
    "A no that still feels like Voice Alchemy. It is honest about the seat limit, keeps the door open for the next intake, "
    "and points the singer at the free tools so the relationship continues instead of ending. Never templated-cold; Julia can add a line.",
    ["logo.png", "student_training_overview.webp"], [
        header(),
        text(eyebrow("Voice Application") + h1("Not this semester, and I am sorry about that.") +
             p("Hi {{first_name}},") +
             p("Thank you for trusting me with your story. The mentorship runs with a small number of seats so each singer gets real attention, and this intake is full.") +
             p("I would like to keep your application on file for the next semester. In the meantime, everything in the Training Center is free, and if you use it, I will be able to see how your voice has moved when we talk again.", last=True),
             "Eyebrow + headline + honest no (Julia can personalize)"),
        image(f"{IMG}/email/student_training_overview.webp", "Training Center with free trainers", "Full-bleed screenshot"),
        button("Keep training free", TRAINING, "Gold pill button"),
        divider(),
        text(small("We open applications once per semester. You will hear from us first when the next one opens."), "Muted closing line", align="center", padding=20),
        footer(FOOT_STUDENT, audience_line="You are receiving this because you submitted a Voice Application."),
    ])

email("mentorship", 5, "Application Started, Not Finished", "2 hours after a started application is abandoned (only if the email field was captured)",
    "Your Voice Application is waiting", "You do not need perfect answers.",
    "Finish your application", "voicealchemyacademy.com/mentorship#apply",
    "Recovers people who opened the application and froze on the long-answer questions. The message lowers the bar: "
    "the application is not a test, a few honest sentences beat polished ones. "
    "Note: the website form only submits on completion today, so this needs the email field saved on blur before it can fire.",
    ["logo.png", "julia-zoom.jpg"], [
        header(),
        text(eyebrow("Voice Application") + h1("You do not need perfect answers.") +
             p("If you started the Voice Application and stepped away, that is completely fine.") +
             p("The application is not a test. It is a way for Julia to understand where your voice has been, what you want from it, and what kind of support would actually help. Write honestly. A few clear sentences are better than trying to sound polished.", last=True),
             "Eyebrow + headline + copy"),
        image(f"{IMG}/photos/julia-zoom.jpg", "Julia coaching a student in a live online lesson", "Full-bleed photo of Julia"),
        text(tip("Julia looks for", "Openness, curiosity, and a willingness to practice between lessons. Not experience, not genre, not a perfect voice."), "Tip card: what Julia looks for"),
        button("Finish your application", MENTORSHIP_APPLY, "Gold pill button"),
        divider(),
        text(small("Founder-led mentorship &middot; limited seats each semester &middot; all genres and levels welcome."), "Muted closing line", align="center", padding=20),
        footer(FOOT_STUDENT, audience_line="You are receiving this because you started a Voice Application."),
    ])

email("mentorship", 6, "Keep This Door Open?", "7 days after an abandoned application, last touch",
    "Want to keep this door open?", "One more chance to finish, or start free instead.",
    "Finish your application", "voicealchemyacademy.com/mentorship#apply",
    "Final nudge for non-completers. It offers two honest exits: finish the application, or skip it and train free in the app. "
    "Either keeps the person in the Voice Alchemy world. After this, no more mentorship emails to this address.",
    ["logo.png", "stage-mic.jpg"], [
        header(),
        text(eyebrow("Last note on this") + h1("Want to keep this door open?") +
             p("Your Voice Application is still saved where you left it. If the timing was wrong, there is no need to explain, and there is no deadline except the seat count.") +
             p("If you would rather not apply right now, that is fine too. The Training Center is free, and plenty of mentorship students started there first.", last=True),
             "Eyebrow + headline + copy"),
        image(f"{IMG}/photos/stage-mic.jpg", "A stage microphone in warm light", "Full-bleed photo"),
        button("Finish your application", MENTORSHIP_APPLY, "Gold pill button"),
        text(small(f'Or <a href="{STUDENT_SIGNUP}" style="color:{GOLD_DARK};font-weight:bold">start free in the app</a> and apply whenever you are ready.'), "Text link: start free instead", align="center", padding=8),
        divider(),
        text(small("This is the last email about your application. We will not chase you again."), "Muted closing line", align="center", padding=20),
        footer(FOOT_STUDENT, audience_line="You are receiving this because you started a Voice Application."),
    ])

# =====================================================================
# ROLES
# =====================================================================
ROLES = dict(
    students=dict(
        title="Students", kicker="Free app accounts", color=GOLD, rgb="206,180,102",
        goal="Get a new singer to sing one note in Pitch Perfect, turn that into a small habit, then show the deeper layer (coaching feedback, courses, mentorship) only after they have felt value.",
        trigger="Student account created in the app.",
        audience="Self-taught singers and artists who do not know if they are actually improving.",
        cta_note="Gold buttons. Every CTA lands inside the app.",
        sequence=[("Email 1", "Immediately", "Welcome / First Note"), ("Email 2", "Day 2", "30-Second Check"), ("Email 3", "Day 5", "Scales + Rhythm"), ("Email 4", "Day 10", "Upgrade Path"), ("Email 5", "7 days idle", "Re-engagement")],
    ),
    leads=dict(
        title="Student Leads", kicker="Email captured, no account yet", color=GOLD, rgb="206,180,102",
        goal="Deliver the pitch guide the website already promises, teach one thing, then convert the reader into a free account. Three emails, then stop.",
        trigger="Email submitted through the exit-intent popup or the footer form without creating an account.",
        audience="Visitors who were curious but not ready to sign up.",
        cta_note="Gold buttons. Every CTA goes to student signup. If they create an account, move them to the Students track and stop this one.",
        sequence=[("Email 1", "Immediately", "Pitch Guide Delivery"), ("Email 2", "Day 2", "The Mistake Your Ears Miss"), ("Email 3", "Day 5", "Before Your Next Rehearsal")],
    ),
    teachers=dict(
        title="Teachers &amp; Studios", kicker="Platform demo requests", color=VIOLET, rgb="168,85,247",
        goal="Turn a demo request into a booked walkthrough, then into a three-student pilot, and close the loop cleanly when a coach goes quiet. Concierge tone, sold through the coach's own workflow pain.",
        trigger="Teacher demo form submitted on the website (or a teacher email captured without a demo request).",
        audience="Independent vocal coaches and studio owners whose students say they practiced, but who cannot see what actually happened.",
        cta_note="Violet buttons. CTAs go to the scheduler, the playbook, or a reply to Julia.",
        sequence=[("Email 1", "Immediately", "Demo Received"), ("Email 2", "Day 3, unbooked", "Unbooked Reminder"), ("Email 3", "Day 5, unbooked", "Playbook"), ("Email 4", "Same day as demo", "Post-Demo Recap"), ("Email 5", "Day 10, no reply", "Keep Your Spot?"), ("Email 6", "14 days idle", "Between Lessons")],
    ),
    mentorship=dict(
        title="Mentorship Applicants", kicker="Voice Applications", color=GOLD, rgb="206,180,102",
        goal="Confirm the application, keep the applicant warm inside the free app until Julia replies, then handle both outcomes (a seat, or not this semester) with the same care. This is the only paid product today, so it gets the most personal treatment.",
        trigger="Voice Application submitted on /mentorship, or started and abandoned.",
        audience="Adults ready to invest a semester in one-on-one work with the founder.",
        cta_note="Gold buttons. Founder voice, first person where possible. Emails 3 and 4 are sent by hand from the CRM.",
        sequence=[("Email 1", "Immediately", "Application Received"), ("Email 2", "Day 2", "While Julia Reviews"), ("Email 3", "Manual, accepted", "Meet Julia"), ("Email 4", "Manual, no seat", "Not This Semester"), ("Email 5", "2 h after abandon", "Finish Application"), ("Email 6", "7 d after abandon", "Keep This Door Open?")],
    ),
)

# =====================================================================
# PAGE
# =====================================================================
CSS = f"""
:root{{--ink:{INK};--ink2:{INK2};--ink3:#1a1333;--gold:{GOLD};--gold-l:#e8d59f;--gold-d:{GOLD_DARK};--violet:{VIOLET};--fg:#f3effa;--muted:#a79fbb;--line:rgba(255,255,255,.09)}}
*{{box-sizing:border-box}}
html{{scroll-behavior:smooth}}
body{{margin:0;background:var(--ink);color:var(--fg);font:15px/1.6 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background-image:radial-gradient(1100px 520px at 50% -12%,rgba(168,85,247,.16),transparent 60%),radial-gradient(800px 500px at 100% 10%,rgba(206,180,102,.07),transparent 60%)}}
a{{color:var(--gold)}}
.wrap{{max-width:1180px;margin:0 auto;padding:0 24px 96px}}
.top{{padding:56px 0 28px;text-align:center}}
.top img{{height:44px;width:auto}}
.top h1{{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:52px;line-height:1.02;letter-spacing:-.01em;margin:26px 0 12px}}
.top h1 em{{font-style:normal;background:linear-gradient(90deg,var(--gold-l),var(--gold),var(--gold-d));-webkit-background-clip:text;background-clip:text;color:transparent}}
.top p{{max-width:720px;margin:0 auto;color:var(--muted);font-size:16px}}
.legend{{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:26px 0 0}}
.legend span{{display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border:1px solid var(--line);border-radius:999px;font-size:13px;color:var(--fg);background:rgba(255,255,255,.03)}}
.dot{{width:10px;height:10px;border-radius:50%;display:inline-block}}
.jump{{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:22px 0 0}}
.jump a{{text-decoration:none;font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:8px 14px;border-radius:8px;border:1px solid var(--line)}}
.jump a:hover{{color:var(--fg);border-color:rgba(255,255,255,.25)}}
.tools{{display:flex;justify-content:flex-end;gap:8px;margin:36px 0 -8px}}
.tools button{{background:transparent;border:1px solid var(--line);color:var(--muted);padding:7px 12px;border-radius:8px;font:600 12px/1 Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}}
.tools button:hover{{color:var(--fg);border-color:rgba(255,255,255,.25)}}
section.role{{margin-top:44px;scroll-margin-top:24px}}
.rolecard{{border-radius:24px;padding:30px 32px;border:1px solid rgba(var(--rgb),.28);background:linear-gradient(140deg,rgba(var(--rgb),.14) 0%,rgba(var(--rgb),.04) 45%,rgba(18,13,36,.75) 100%);box-shadow:0 0 48px rgba(var(--rgb),.08)}}
.rolecard .kicker{{font-size:12px;letter-spacing:.2em;text-transform:uppercase;font-weight:700;color:rgb(var(--rgb))}}
.rolecard h2{{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:40px;line-height:1.05;margin:8px 0 18px}}
.facts{{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px 28px}}
.facts div b{{display:block;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgb(var(--rgb));margin-bottom:6px}}
.facts div{{color:#e9e4f4;font-size:14.5px}}
.seq{{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}}
.seq span{{display:inline-flex;flex-direction:column;padding:10px 14px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid var(--line);min-width:150px}}
.seq span b{{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgb(var(--rgb))}}
.seq span i{{font-style:normal;font-size:13px;color:var(--fg)}}
.seq span em{{font-style:normal;font-size:12px;color:var(--muted)}}
details.email{{margin-top:14px;border:1px solid var(--line);border-radius:18px;background:rgba(255,255,255,.025);overflow:hidden}}
details.email[open]{{border-color:rgba(var(--rgb),.35)}}
summary{{list-style:none;cursor:pointer;display:flex;align-items:center;gap:16px;padding:18px 22px;user-select:none}}
summary::-webkit-details-marker{{display:none}}
summary .num{{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-family:"Cormorant Garamond",Georgia,serif;font-size:22px;font-weight:600;color:var(--ink);background:rgb(var(--rgb));flex:none}}
summary .t{{flex:1;min-width:0}}
summary .t b{{display:block;font-size:17px;font-weight:600}}
summary .t span{{display:block;font-size:13px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
summary .chip{{font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;padding:5px 10px;border-radius:999px;border:1px solid rgba(var(--rgb),.5);color:rgb(var(--rgb));flex:none}}
summary .chev{{width:22px;height:22px;flex:none;transition:transform .2s;color:var(--muted)}}
details[open] summary .chev{{transform:rotate(180deg)}}
.panel{{display:grid;grid-template-columns:minmax(0,640px) minmax(300px,1fr);gap:28px;padding:6px 22px 26px;border-top:1px solid var(--line)}}
.canvas{{padding:24px 12px;border-radius:14px;overflow:hidden;margin-top:16px}}
.side{{padding-top:16px}}
.side h4{{margin:0 0 8px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgb(var(--rgb))}}
.side .why{{font-size:14.5px;color:#e9e4f4;margin:0 0 22px}}
.meta{{display:grid;grid-template-columns:110px 1fr;gap:8px 12px;font-size:13.5px;margin:0 0 22px}}
.meta dt{{color:var(--muted);letter-spacing:.04em}}
.meta dd{{margin:0;color:var(--fg)}}
.meta dd code,.blocks code{{font:12.5px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--gold-l);background:rgba(255,255,255,.05);padding:1px 6px;border-radius:5px;word-break:break-all}}
ol.blocks{{list-style:none;margin:0;padding:0;counter-reset:b}}
ol.blocks li{{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-top:1px solid var(--line);font-size:13.5px;color:#d9d3e6}}
ol.blocks li::before{{counter-increment:b;content:counter(b);width:18px;flex:none;color:var(--muted);font-size:12px;padding-top:2px}}
.bt{{flex:none;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:6px;background:rgba(255,255,255,.07);color:var(--fg);min-width:66px;text-align:center}}
.bt-header,.bt-footer{{background:rgba(255,255,255,.14)}}
.bt-button{{background:rgba(var(--rgb),.25);color:#fff}}
.bt-image,.bt-columns{{background:rgba(168,85,247,.22)}}
.sw{{display:inline-block;width:10px;height:10px;border-radius:3px;vertical-align:-1px;margin-right:2px}}
.assets{{margin-top:18px;font-size:12.5px;color:var(--muted)}}
.note{{margin:44px 0 0;padding:22px 26px;border-radius:18px;border:1px solid var(--line);background:rgba(255,255,255,.03);font-size:14px;color:#d9d3e6}}
.note b{{color:var(--fg)}}
.note ul{{margin:8px 0 0;padding-left:18px}}
@media (max-width:960px){{.panel{{grid-template-columns:1fr}}.top h1{{font-size:40px}}}}
@media print{{body{{background:#fff;color:#111}}details{{break-inside:avoid}}}}
"""

CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>'


def render_email_details(role_key, e):
    r = ROLES[role_key]
    chip = '<span class="chip">Ship first</span>' if e.get("ship_first") else ""
    meta = f"""<dl class="meta">
<dt>Timing</dt><dd>{e['timing']}</dd>
<dt>Subject</dt><dd>{e['subject']}</dd>
<dt>Preheader</dt><dd>{e['preheader']}</dd>
<dt>Button</dt><dd>{e['cta']}</dd>
<dt>Lands on</dt><dd>{e['landing']}</dd>
</dl>"""
    assets = ", ".join(f"<code>{a}</code>" for a in e["assets"])
    return f"""<details class="email" id="{role_key}-email-{e['n']}">
<summary><span class="num">{e['n']}</span><span class="t"><b>Email {e['n']} &middot; {e['name']}</b><span>{e['subject']} &middot; {e['timing']}</span></span>{chip}{CHEV}</summary>
<div class="panel">
<div>{render_email(e['blocks'])}</div>
<div class="side">
<h4>Why this email exists</h4>
<p class="why">{e['why']}</p>
<h4>Send details</h4>
{meta}
<h4>Build it in the funnel maker</h4>
{block_list(e['blocks'])}
<p class="assets">Upload to the CRM image block: {assets} (from <code>vaa-website/public/images/</code>).</p>
</div>
</div>
</details>"""


def render_role(key):
    r = ROLES[key]
    facts = f"""<div class="facts">
<div><b>Goal</b>{r['goal']}</div>
<div><b>Trigger</b>{r['trigger']}</div>
<div><b>Who</b>{r['audience']}</div>
<div><b>Buttons &amp; landing</b>{r['cta_note']}</div>
</div>"""
    seq = "".join(f"<span><b>{a}</b><i>{c}</i><em>{b}</em></span>" for a, b, c in r["sequence"])
    emails = "".join(render_email_details(key, e) for k, e in E if k == key)
    return f"""<section class="role" id="{key}" style="--rgb:{r['rgb']}">
<div class="rolecard">
<div class="kicker">{r['kicker']}</div>
<h2>{r['title']}</h2>
{facts}
<div class="seq">{seq}</div>
</div>
{emails}
</section>"""


def page():
    roles = "".join(render_role(k) for k in ["students", "leads", "teachers", "mentorship"])
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Voice Alchemy Academy · Email Templates &amp; Funnels</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>{CSS}</style>
</head>
<body>
<div class="wrap">
<header class="top">
<img src="{LOGO}" alt="Voice Alchemy Academy">
<h1>Email templates <em>&amp; funnels</em></h1>
<p>Twenty finished emails for the four people who reach the website: singers who start free, visitors who only leave an email, coaches who ask for a demo, and adults who apply for mentorship with Julia. Every preview is built from the CRM funnel maker's own blocks, so the list beside each email is the exact build order.</p>
<div class="legend">
<span><i class="dot" style="background:{GOLD}"></i> Student &amp; mentorship buttons</span>
<span><i class="dot" style="background:{VIOLET}"></i> Teacher buttons</span>
<span><i class="dot" style="background:{INK};border:1px solid rgba(255,255,255,.3)"></i> Ink header &amp; footer, light 600px body</span>
<span>Merge tags: <code style="color:{GOLD}">{{{{first_name}}}}</code> <code style="color:{GOLD}">{{{{unsubscribe_url}}}}</code></span>
</div>
<nav class="jump"><a href="#students">Students</a><a href="#leads">Student leads</a><a href="#teachers">Teachers</a><a href="#mentorship">Mentorship</a></nav>
</header>
<div class="tools"><button type="button" onclick="document.querySelectorAll('details.email').forEach(d=>d.open=true)">Expand all</button><button type="button" onclick="document.querySelectorAll('details.email').forEach(d=>d.open=false)">Collapse all</button></div>
{roles}
<div class="note">
<b>Audit of the previous version, and what changed</b>
<ul>
<li><b>Coverage.</b> The old doc had 10 emails: students 5, teachers 3, mentorship 2, and nothing for visitors who only left an email. It is now 20: students 5, student leads 3, teachers 6, mentorship 6.</li>
<li><b>Gaps filled.</b> Teachers: unbooked reminder, keep-your-spot close, 14-day re-engagement. Mentorship: day-2 hold, acceptance, not-this-semester, 7-day last touch. Leads: the pitch guide the exit-intent popup already promises, plus two follow-ups.</li>
<li><b>Screenshots.</b> Trainer emails now show the popups mid-session: Pitch Perfect with a live session panel and a matched C4 (wheel and keyboard views), the Scale Trainer four notes into C major, and the Rhythm Trainer mid-bar with session stats. Captured from the app with a microphone feed, then the session state was set in the DOM so no number reads zero.</li>
<li><b>Naming.</b> The tool is <b>Pitch Perfect</b>, as labeled in the app, and it lives in the <b>Training Center</b>. "Pitch Trainer" is only the tab name.</li>
</ul>
<b style="display:block;margin-top:18px">How this ships</b>
<ul>
<li><b>Installed from the CRM.</b> Templates &amp; Funnels &rarr; Funnels &rarr; <b>Install VAA campaign</b> creates every email below as an editable template built from the standard blocks (header, text, image, columns, button, divider, footer) and wires the funnels with the delays shown. Edit any of them in the template editor afterwards.</li>
<li><b>Triggered from the website.</b> Every form on voicealchemyacademy.com posts first name, last name and email to the CRM. A singer's email enrolls the Student Leads track, a demo request enrolls the Teachers track, a coach's email alone enrolls the Playbook track, and a Voice Application enrolls the Mentorship track. A new student account enrolls the Students track and ends any lead track for the same address.</li>
<li><b>Delays, not conditions.</b> The CRM sends each phase a fixed number of days after the previous one. "Only if unbooked" and "only if practiced" are not evaluated; pause or remove a person from the funnel page when the condition no longer applies.</li>
<li><b>Sent by hand:</b> Teachers 4 and 5, Mentorship 3 and 4. Pick the lead on the template's Send dialog; Julia edits the first paragraph first. Mentorship 5 and 6 are not installed: the website only submits a finished application.</li>
<li><b>Links to fill in</b> (CRM env vars): <code>EMAIL_LINK_DEMO_SCHEDULING</code>, <code>EMAIL_LINK_PLAYBOOK_PDF</code>, <code>EMAIL_LINK_PITCH_GUIDE_PDF</code>, <code>EMAIL_LINK_JULIA_BOOKING</code>. Until set, scheduling and booking buttons fall back to a mailto reply and the two PDF buttons point at the app.</li>
<li><b>Images</b> are served from the website's <code>/images/</code> folder (<code>NEXT_PUBLIC_EMAIL_IMAGE_BASE</code>). Re-capture <code>coach_dashboard.webp</code> without the demo teacher name before Teachers 2 goes out.</li>
</ul>
</div>
</div>
</body>
</html>"""


def export_json(path):
    """Dump every email as CRM email-builder blocks so the CRM's starter
    installer can create the same templates a person would build by hand.
    Image paths are rewritten to {{IMAGE_BASE}}/... and resolved by the CRM."""
    import json

    def fix_src(v):
        return v.replace(IMG, "{{IMAGE_BASE}}") if isinstance(v, str) else v

    out = {"roles": {}, "emails": []}
    for key, r in ROLES.items():
        out["roles"][key] = dict(title=html.unescape(r["title"]), kicker=r["kicker"], goal=r["goal"], trigger=r["trigger"], audience=r["audience"], cta_note=r["cta_note"])
    for role, e in E:
        blocks = []
        for b in e["blocks"]:
            props = dict(b["props"])
            for k in ("src", "logoUrl"):
                if k in props:
                    props[k] = fix_src(props[k])
            if b["type"] == "columns":
                props["columnContent"] = [dict(c, src=fix_src(c.get("src", ""))) for c in props["columnContent"]]
            blocks.append(dict(type=b["type"], note=b["note"], properties=props))
        out["emails"].append(dict(
            key=f"{role}-{e['n']}", role=role, n=e["n"], name=e["name"], timing=e["timing"],
            subject=html.unescape(e["subject"]), preheader=html.unescape(e["preheader"]), cta=e["cta"],
            landing=html.unescape(e["landing"]), why=e["why"], ship_first=e["ship_first"], assets=e["assets"], blocks=blocks,
        ))
    with open(path, "w") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
    print("wrote", path, len(out["emails"]), "emails")


def inline_images(page_html):
    """Embed every ../public/images/... reference as a data URI so the page
    is a single self-contained file (the Desktop copy)."""
    import base64, mimetypes
    base = os.path.dirname(os.path.abspath(__file__))
    cache = {}

    def repl(m):
        rel = m.group(1)
        if rel not in cache:
            fp = os.path.normpath(os.path.join(base, rel))
            mime = mimetypes.guess_type(fp)[0] or "application/octet-stream"
            with open(fp, "rb") as fh:
                cache[rel] = f"data:{mime};base64," + base64.b64encode(fh.read()).decode()
        return f'src="{cache[rel]}"'

    return re.sub(r'src="(\.\./public/images/[^"]+)"', repl, page_html)


if __name__ == "__main__":
    import argparse, re
    ap = argparse.ArgumentParser()
    ap.add_argument("out", nargs="?", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "email-template-designs.html"))
    ap.add_argument("--inline", action="store_true", help="embed images as data URIs")
    ap.add_argument("--json", metavar="PATH", help="also export the emails as CRM builder blocks")
    args = ap.parse_args()
    content = page()
    if args.inline:
        content = inline_images(content)
    with open(args.out, "w") as f:
        f.write(content)
    print("wrote", args.out, os.path.getsize(args.out), "bytes")
    if args.json:
        export_json(args.json)
