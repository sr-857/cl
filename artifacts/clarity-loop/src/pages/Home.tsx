import { Link, useLocation } from "wouter";
import {
  ArrowRight, BookOpen, BrainCircuit, BarChart3,
  Sparkles, CheckCircle, ArrowUpRight, Flame, Target,
  ChevronRight, Youtube
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { stories } from "@/data/mock-data";

// ── Subject color map ─────────────────────────────────────────
const subjectColors: Record<string, string> = {
  Physics:     "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Chemistry:   "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Biology:     "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Mathematics: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

// ── Floating Story Preview Card (Hero right column) ──────────
function StoryPreviewCard() {
  return (
    <div className="relative">
      {/* Glow behind card */}
      <div className="absolute inset-0 scale-110 blur-3xl opacity-40 rounded-3xl bg-gradient-to-br from-primary/60 via-accent/40 to-secondary/50" />

      <div className="relative bg-card border border-border/60 rounded-3xl shadow-2xl p-6 max-w-sm w-full">
        {/* Reading progress bar */}
        <div className="h-1.5 w-full bg-muted rounded-full mb-5 overflow-hidden">
          <div className="reading-progress h-full rounded-full" style={{ width: "73%" }} />
        </div>

        {/* Subject + time */}
        <div className="flex items-center justify-between mb-4">
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-transparent text-xs px-3">
            Physics
          </Badge>
          <span className="text-xs text-muted-foreground">8 min read · 73% done</span>
        </div>

        {/* Story title */}
        <h3 className="font-story text-xl font-bold leading-snug mb-3">
          The Car Race and Velocity
        </h3>

        {/* Story snippet */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
          Two cars, same speed — yet moving in entirely different ways. This is velocity:
          not just how fast, but <em className="text-foreground/80">where you're going</em>.
        </p>

        {/* Key point chip */}
        <div className="flex items-start gap-2 bg-secondary/8 border border-secondary/20 rounded-2xl p-3 mb-5">
          <CheckCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
          <span className="text-xs font-medium">Velocity = Speed + Direction</span>
        </div>

        {/* Author row */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-black">R</div>
            <span className="text-xs font-medium text-muted-foreground">Rahul · Student</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-primary font-semibold">
            Continue <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Floating Doubt bubble */}
      <div className="absolute -bottom-5 -left-5 bg-card border border-border/60 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2 max-w-[180px] animate-bounce" style={{ animationDuration: "3s" }}>
        <Sparkles className="h-4 w-4 text-primary shrink-0" />
        <span className="text-xs font-semibold">"Simplify this for me…"</span>
      </div>

      {/* Floating score badge */}
      <div className="absolute -top-4 -right-4 bg-secondary text-secondary-foreground rounded-2xl shadow-xl px-3 py-2 flex items-center gap-1.5">
        <Target className="h-4 w-4" />
        <span className="text-sm font-black">3/3 Quiz!</span>
      </div>
    </div>
  );
}

// ── How It Works Step ────────────────────────────────────────
function Step({ n, icon, title, desc, last = false }: { n: string; icon: React.ReactNode; title: string; desc: string; last?: boolean }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
          {icon}
        </div>
        {!last && <div className="w-px flex-1 mt-2 min-h-[2rem] bg-gradient-to-b from-primary/30 to-transparent" />}
      </div>
      <div className="pb-8">
        <span className="text-xs font-black text-primary/60 tracking-widest uppercase block mb-1">Step {n}</span>
        <h4 className="font-bold text-base mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ── Story Preview Card ───────────────────────────────────────
function LibraryCard({ story }: { story: typeof stories[0] }) {
  return (
    <Link href="/auth">
      <div className="group bg-card border border-border/50 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/30 transition-all duration-300 cursor-pointer h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <Badge className={`${subjectColors[story.subject] ?? ''} border-transparent text-xs px-3`}>
            {story.subject}
          </Badge>
          <span className="text-xs text-muted-foreground">{story.readTime}</span>
        </div>
        <h4 className="font-story font-bold text-lg leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {story.title}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1 mb-5">
          {story.concept}
        </p>
        <div className="flex items-center text-primary text-sm font-bold mt-auto gap-1 group-hover:gap-2 transition-all">
          Read story <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

// ── Testimonial Card ─────────────────────────────────────────
function Testimonial({ quote, name, tag }: { quote: string; name: string; tag: string }) {
  return (
    <div className="bg-card border border-border/50 rounded-3xl p-6 hover:shadow-lg transition-shadow">
      <p className="text-sm leading-relaxed text-foreground/80 italic mb-5">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-black text-sm shrink-0">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold">{name}</p>
          <p className="text-xs text-muted-foreground">{tag}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleBrowse = () => setLocation(user ? "/library" : "/auth");

  const previewStories = stories.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      {/* ───────────────────────── HERO ──────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Ambient glow blobs */}
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[65%] rounded-full bg-primary/15 blur-[140px] -z-10" />
        <div className="absolute bottom-[-20%] right-[-5%] w-[45%] h-[55%] rounded-full bg-secondary/15 blur-[120px] -z-10" />
        <div className="absolute top-[30%] right-[25%] w-[20%] h-[20%] rounded-full bg-accent/20 blur-[80px] -z-10" />

        <div className="container mx-auto px-6 lg:px-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Headline + CTA */}
            <div className="max-w-xl">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-black px-4 py-2 rounded-full mb-8 border border-primary/25 tracking-wider uppercase">
                <Flame className="h-3.5 w-3.5" />
                Story-Based Learning Platform
              </div>

              {/* Big serif headline */}
              <h1 className="font-story text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight mb-6 text-foreground">
                Learn the way{" "}
                <span className="italic">stories</span> were
                <br />
                meant to{" "}
                <span
                  className="relative inline-block"
                  style={{
                    backgroundImage: "linear-gradient(135deg, hsl(35,91%,50%) 0%, hsl(45,95%,52%) 55%, hsl(158,64%,38%) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  teach.
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-md">
                Concepts that feel impossible in a textbook come alive through narrative.
                Read, understand, quiz — then track your growth.
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap gap-3 items-center">
                {user ? (
                  <Link href={user.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"}>
                    <Button
                      size="lg"
                      className="rounded-2xl h-13 px-8 text-base font-bold shadow-xl shadow-primary/30 hover:-translate-y-0.5 hover:shadow-primary/40 transition-all"
                    >
                      Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth">
                    <Button
                      size="lg"
                      className="rounded-2xl h-13 px-8 text-base font-bold shadow-xl shadow-primary/30 hover:-translate-y-0.5 hover:shadow-primary/40 transition-all"
                    >
                      Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleBrowse}
                  className="rounded-2xl h-13 px-6 text-base text-muted-foreground hover:text-foreground"
                >
                  Browse Stories →
                </Button>
              </div>

              {/* Trust row */}
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-border/40">
                <div className="text-center">
                  <div className="text-2xl font-black text-foreground">8+</div>
                  <div className="text-xs text-muted-foreground">Stories</div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-black text-foreground">4</div>
                  <div className="text-xs text-muted-foreground">Subjects</div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-black text-foreground">100%</div>
                  <div className="text-xs text-muted-foreground">Interactive</div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="flex items-center gap-1.5">
                  <Youtube className="h-4 w-4 fill-red-500 text-red-500" />
                  <span className="text-xs text-muted-foreground font-medium">Video linked</span>
                </div>
              </div>
            </div>

            {/* Right: Floating story preview card */}
            <div className="hidden lg:flex justify-center lg:justify-end">
              <StoryPreviewCard />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── HOW IT WORKS ──────────────────────── */}
      <section className="py-24 border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: label + description */}
            <div className="lg:sticky lg:top-28">
              <span className="text-xs font-black text-primary tracking-[0.2em] uppercase block mb-4">Process</span>
              <h2 className="font-story text-4xl md:text-5xl font-bold leading-[1.1] mb-6">
                From story<br />to mastery.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                Every concept follows a four-step journey designed to make it
                stick — not just for the exam, but for life.
              </p>
            </div>

            {/* Right: Steps */}
            <div className="pt-2">
              <Step
                n="01"
                icon={<BookOpen className="h-5 w-5" />}
                title="Read the Story"
                desc="Complex concepts wrapped in engaging narratives. You read like a novel, not a textbook."
              />
              <Step
                n="02"
                icon={<Sparkles className="h-5 w-5" />}
                title="Grasp the Concept"
                desc="Each story unpacks into a clear, structured concept explanation with key points."
              />
              <Step
                n="03"
                icon={<Target className="h-5 w-5" />}
                title="Test Yourself"
                desc="Immediate-feedback quizzes and exam mode let you verify understanding before moving on."
              />
              <Step
                n="04"
                icon={<BarChart3 className="h-5 w-5" />}
                title="Track Your Growth"
                desc="Dashboards surface weak topics, quiz history, and progress — so you study smarter."
                last
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── FEATURES ──────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="mb-14">
            <span className="text-xs font-black text-primary tracking-[0.2em] uppercase block mb-3">Features</span>
            <h2 className="font-story text-4xl md:text-5xl font-bold leading-tight max-w-xl">
              Built for how students actually learn.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <BookOpen className="h-6 w-6 text-primary" />,
                bg: "bg-primary/8",
                border: "hover:border-primary/40",
                title: "Story-Based Lessons",
                desc: "Physics, Chemistry, Biology, and Maths explained through immersive, character-driven stories.",
              },
              {
                icon: <BrainCircuit className="h-6 w-6 text-secondary" />,
                bg: "bg-secondary/8",
                border: "hover:border-secondary/40",
                title: "AI Doubt Solver",
                desc: "Highlight any text in a story to instantly simplify it, or open the chat to ask deeper questions.",
              },
              {
                icon: <Sparkles className="h-6 w-6 text-accent" />,
                bg: "bg-accent/10",
                border: "hover:border-accent/40",
                title: "Instant Quiz Feedback",
                desc: "Each quiz option gives immediate visual feedback — right or wrong — so you learn as you go.",
              },
              {
                icon: <BarChart3 className="h-6 w-6 text-primary" />,
                bg: "bg-primary/8",
                border: "hover:border-primary/40",
                title: "Student Dashboard",
                desc: "Track activity, identify weak topics, resume where you left off, and see score history at a glance.",
              },
              {
                icon: <Youtube className="h-6 w-6 fill-red-500 text-red-500" />,
                bg: "bg-red-500/8",
                border: "hover:border-red-400/40",
                title: "YouTube Integration",
                desc: "Every story links curated YouTube search results — watch to reinforce, then return to learn.",
              },
              {
                icon: <Target className="h-6 w-6 text-secondary" />,
                bg: "bg-secondary/8",
                border: "hover:border-secondary/40",
                title: "Teacher Dashboard",
                desc: "Performance trends, story analytics, at-risk student flags, and class-level score breakdowns.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className={`group bg-card border border-border/40 rounded-3xl p-7 hover:shadow-xl ${f.border} transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`h-12 w-12 ${f.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── STORY PREVIEWS ────────────────────── */}
      <section className="py-24 bg-muted/20 border-t border-border/40">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-black text-primary tracking-[0.2em] uppercase block mb-3">Library</span>
              <h2 className="font-story text-4xl md:text-5xl font-bold leading-tight">
                Start with a story.
              </h2>
            </div>
            <Button variant="outline" onClick={handleBrowse} className="rounded-2xl gap-2 self-start md:self-auto shrink-0">
              See all {stories.length} stories <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewStories.map(story => (
              <LibraryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── TESTIMONIALS ──────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="mb-12">
            <span className="text-xs font-black text-primary tracking-[0.2em] uppercase block mb-3">Testimonials</span>
            <h2 className="font-story text-4xl font-bold">What students say.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Testimonial
              quote="The story about Newton's laws was the first time physics actually clicked for me. I re-read it twice and got 100% on the quiz."
              name="Priya P."
              tag="Class 11 · Physics"
            />
            <Testimonial
              quote="I like that when I don't understand something, I can just highlight and ask. It's like having a tutor built into the page."
              name="Amit K."
              tag="Class 12 · Chemistry"
            />
            <Testimonial
              quote="The teacher dashboard shows me exactly which students need attention. I used to rely on gut feeling — now I have actual data."
              name="Ms. Sharma"
              tag="Science Teacher · 6 yrs"
            />
          </div>
        </div>
      </section>

      {/* ───────────────── FINAL CTA ─────────────────────────── */}
      <section className="relative overflow-hidden bg-[hsl(25,20%,10%)] py-28">
        {/* Glow */}
        <div className="absolute top-[-30%] left-[20%] w-[50%] h-[80%] bg-primary/20 blur-[120px] rounded-full -z-0" />
        <div className="absolute bottom-[-20%] right-[10%] w-[35%] h-[60%] bg-secondary/15 blur-[100px] rounded-full -z-0" />

        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-xs font-black text-primary/80 tracking-[0.2em] uppercase block mb-6">
            Get Started Today
          </span>
          <h2 className="font-story text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
            The smarter way to{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, hsl(35,91%,58%) 0%, hsl(45,95%,60%) 55%, hsl(158,64%,50%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              learn anything.
            </span>
          </h2>
          <p className="text-white/55 text-lg mb-10 leading-relaxed">
            Join thousands of students mastering Physics, Chemistry, Biology,
            and Mathematics — one story at a time.
          </p>

          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="rounded-2xl h-14 px-10 text-base font-bold bg-primary text-primary-foreground shadow-2xl shadow-primary/40 hover:-translate-y-1 hover:shadow-primary/60 transition-all"
                >
                  Start Learning — It's Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl h-14 px-10 text-base border-white/20 text-white hover:bg-white/10"
                >
                  I'm a Teacher
                </Button>
              </Link>
            </div>
          ) : (
            <Link href={user.role === "teacher" ? "/teacher-dashboard" : "/library"}>
              <Button
                size="lg"
                className="rounded-2xl h-14 px-10 text-base font-bold shadow-2xl shadow-primary/40 hover:-translate-y-1 transition-all"
              >
                {user.role === "teacher" ? "View Class Dashboard" : "Go to Library"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
