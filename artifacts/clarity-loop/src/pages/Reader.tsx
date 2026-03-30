import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, GraduationCap, Sparkles, Youtube, PlayCircle, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { stories } from "@/data/mock-data";
import { useProgress } from "@/hooks/use-progress";
import { useAuth } from "@/hooks/use-auth";
import { DoubtChat } from "@/components/chat/DoubtChat";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { saveLastStory, logActivity } from "@/utils/storage";
import { getSimplification } from "@/utils/logic";

/** Parse YouTube video ID from a watch URL, or return null */
function getVideoId(url: string): string | null {
  try {
    return new URL(url).searchParams.get("v");
  } catch {
    return null;
  }
}

/** Build a YouTube search URL from a query string */
function ytSearchUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

/** Single YouTube card — thumbnail preview → opens in new tab */
function YouTubeCard({ link }: { link: { title: string; searchQuery: string; videoId?: string } }) {
  const [expanded, setExpanded] = useState(false);
  const searchUrl = ytSearchUrl(link.searchQuery);

  const subjectColors = [
    "from-orange-500 to-amber-400",
    "from-emerald-500 to-teal-400",
    "from-blue-500 to-indigo-400",
    "from-purple-500 to-pink-400",
  ];
  const colorClass = subjectColors[link.title.length % subjectColors.length];

  if (expanded && link.videoId) {
    return (
      <div className="rounded-2xl overflow-hidden border border-border/50 shadow-lg">
        <div className="aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${link.videoId}?autoplay=0&rel=0`}
            title={link.title}
            className="w-full h-full"
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="p-3 bg-card flex items-center justify-between">
          <span className="text-sm font-medium text-foreground truncate">{link.title}</span>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground shrink-0" onClick={() => setExpanded(false)}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <a
      href={searchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl overflow-hidden border border-border/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className={`relative aspect-video bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <PlayCircle className="h-8 w-8 text-white fill-white" />
          </div>
          <span className="text-white/80 text-xs font-medium tracking-wider uppercase">Watch on YouTube</span>
        </div>
        <div className="absolute bottom-2 right-2">
          <div className="bg-black/70 text-white text-xs px-2 py-0.5 rounded font-bold flex items-center gap-1">
            <Youtube className="h-3 w-3 fill-red-500 text-red-500" /> YouTube
          </div>
        </div>
      </div>
      {/* Title */}
      <div className="p-3 bg-card flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground line-clamp-1">{link.title}</p>
        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
      </div>
    </a>
  );
}

export default function Reader() {
  const [, params] = useRoute("/reader/:id");
  const [, setLocation] = useLocation();
  const storyId = Number(params?.id);
  const story = stories.find(s => s.id === storyId);
  const { saveProgress, getProgress } = useProgress();
  const { user, loading } = useAuth();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [examModeOpen, setExamModeOpen] = useState(false);
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);
  const [viewedQuestions, setViewedQuestions] = useState<Set<number>>(new Set());

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizLocked, setQuizLocked] = useState<Record<number, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
  const [simplifyOpen, setSimplifyOpen] = useState(false);
  const [simplifyText, setSimplifyText] = useState("");
  const [simplification, setSimplification] = useState("");

  useEffect(() => {
    if (!loading && !user) setLocation('/auth');
  }, [user, loading]);

  useEffect(() => {
    if (story) {
      saveLastStory(story.id, story.title);
      logActivity({ type: 'story_opened', message: `Started reading "${story.title}"`, storyId: story.id, storyTitle: story.title });
    }
  }, [storyId]);

  useEffect(() => {
    if (!loading && !story) setLocation('/library');
  }, [story, loading]);

  useEffect(() => {
    if (!story) return;
    const existing = getProgress(storyId);
    if (existing?.completed) { setShowResults(true); setFinalScore(existing.score); }
  }, [storyId]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(() => {
        const sel = window.getSelection();
        const text = sel?.toString().trim();
        if (text && text.length > 5) {
          const range = sel!.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setSelection({ text, x: rect.left + rect.width / 2, y: rect.top + window.scrollY - 10 });
        } else {
          setSelection(null);
        }
      }, 10);
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  if (loading || !user || !story) return null;

  const toggleQuestion = (index: number) => {
    setOpenQuestions(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
    setViewedQuestions(prev => new Set([...prev, index]));
  };

  const handleQuizSelect = (qIndex: number, optIndex: number) => {
    if (quizLocked[qIndex]) return;
    setQuizAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
    setQuizLocked(prev => ({ ...prev, [qIndex]: true }));
    logActivity({ type: 'quiz_attempted', message: `Answered a question in "${story.title}"`, storyId: story.id, storyTitle: story.title });
  };

  const submitQuiz = () => {
    let score = 0;
    story.quiz.forEach((q, i) => { if (quizAnswers[i] === q.answer) score++; });
    setFinalScore(score);
    setShowResults(true);
    saveProgress(story.id, score, story.quiz.length);
    logActivity({ type: 'quiz_completed', message: `Completed quiz for "${story.title}" — ${score}/${story.quiz.length}`, storyId: story.id, storyTitle: story.title });
  };

  const retakeQuiz = () => {
    setShowResults(false);
    setQuizAnswers({});
    setQuizLocked({});
    setFinalScore(0);
  };

  const handleAskDoubt = () => {
    if (selection) {
      window.dispatchEvent(new CustomEvent("open-chat", { detail: { query: selection.text } }));
      setSelection(null);
    }
  };

  const handleSimplify = () => {
    if (selection) {
      setSimplifyText(selection.text);
      setSimplification(getSimplification(selection.text));
      setSimplifyOpen(true);
      setSelection(null);
    }
  };

  const allAnswered = Object.keys(quizAnswers).length === story.quiz.length;

  const subjectColors: Record<string, string> = {
    Physics:     "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Chemistry:   "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    Biology:     "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    Mathematics: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  };

  return (
    <div className="min-h-screen bg-background relative pb-40">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full z-50 h-1 bg-muted">
        <div className="reading-progress h-full transition-all duration-200 ease-out" style={{ width: `${scrollProgress}%` }} />
      </div>

      <Navbar />

      {/* Floating progress pill */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border/50 shadow-xl rounded-full px-4 py-2">
        <div className="h-2 w-20 bg-muted rounded-full overflow-hidden">
          <div className="reading-progress h-full rounded-full transition-all duration-200" style={{ width: `${scrollProgress}%` }} />
        </div>
        <span className="text-xs font-bold text-muted-foreground tabular-nums">{Math.round(scrollProgress)}%</span>
      </div>

      <main className="max-w-2xl mx-auto px-6 pt-10">
        {/* Back + Meta */}
        <div className="flex items-center justify-between mb-10">
          <Button variant="ghost" onClick={() => setLocation("/library")} className="-ml-3 text-muted-foreground hover:text-foreground gap-1">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Badge className={`${subjectColors[story.subject] ?? ''} border-transparent text-xs px-3`}>
              {story.subject}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">{story.readTime}</span>
          </div>
        </div>

        {/* Hero / Title */}
        <div className="mb-12">
          <h1 className="font-story text-4xl md:text-5xl font-bold leading-[1.15] tracking-tight mb-6 text-foreground">
            {story.title}
          </h1>
          <div className="h-px bg-gradient-to-r from-primary via-accent to-transparent" />
        </div>

        {/* ── The Story ──────────────────────────────────────────── */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-2xl">📖</span>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">The Story</h2>
          </div>
          <div className="relative pl-5 border-l-4 border-primary/40">
            <p className="font-story text-xl md:text-2xl leading-relaxed text-foreground/90 story-dropcap italic">
              {story.story}
            </p>
          </div>
        </section>

        {/* ── Core Concept ───────────────────────────────────────── */}
        <section className="mb-14">
          <div className="bg-primary/5 border border-primary/15 rounded-3xl p-7">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-black">C</span>
              </div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Core Concept</h2>
            </div>
            <p className="text-base md:text-lg leading-relaxed text-foreground/85">{story.concept}</p>
          </div>
        </section>

        {/* ── Key Points ─────────────────────────────────────────── */}
        <section className="mb-14">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5 flex items-center gap-2">
            <span className="text-xl">🔑</span> Key Points
          </h2>
          <ul className="space-y-3">
            {story.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3 bg-card rounded-2xl p-4 border border-border/50 hover:border-secondary/40 hover:shadow-md transition-all">
                <span className="h-6 w-6 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm md:text-base font-medium leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Watch & Learn ──────────────────────────────────────── */}
        {story.youtubeLinks && story.youtubeLinks.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-2 mb-5">
              <Youtube className="h-5 w-5 fill-red-500 text-red-500" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Watch &amp; Learn</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {story.youtubeLinks.map((link, i) => (
                <YouTubeCard key={i} link={link} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Opens YouTube search in a new tab — no autoplay.
            </p>
          </section>
        )}

        <div className="h-px bg-border/50 mb-14" />

        {/* ── Exam Practice ──────────────────────────────────────── */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Exam Practice</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {viewedQuestions.size}/{story.questions.length} questions reviewed
              </p>
            </div>
            <Button
              onClick={() => setExamModeOpen(true)}
              variant="outline"
              className="rounded-full border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              Exam Mode
            </Button>
          </div>

          {/* Q&A toggle */}
          <div className="space-y-3 mb-12">
            {story.questions.map((q, i) => (
              <div key={i} className={`border rounded-2xl overflow-hidden bg-card transition-all ${viewedQuestions.has(i) ? 'border-secondary/40 shadow-sm' : 'border-border/50'}`}>
                <button
                  onClick={() => toggleQuestion(i)}
                  className="w-full text-left px-5 py-4 font-semibold flex items-center justify-between hover:bg-muted/40 transition-colors gap-3"
                >
                  <span className="flex items-center gap-2 text-base">
                    {viewedQuestions.has(i)
                      ? <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                      : <span className="w-4 h-4 rounded-full border-2 border-border shrink-0" />}
                    {q.q}
                  </span>
                  {openQuestions.includes(i)
                    ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                </button>
                {openQuestions.includes(i) && (
                  <div className="px-5 pb-5 pt-3 bg-muted/20 border-t border-border/30 text-sm leading-relaxed">
                    <span className="font-bold text-secondary mr-2">Answer:</span>
                    {q.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quiz */}
          <div className="bg-gradient-to-br from-primary/8 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-7">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📝</span>
              <h3 className="text-xl font-bold">Concept Quiz</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              {showResults ? `Final score: ${finalScore}/${story.quiz.length}` : "Select one answer per question, then submit."}
            </p>

            <div className="space-y-10">
              {story.quiz.map((q, qIndex) => (
                <div key={qIndex}>
                  <p className="font-semibold text-base mb-4">{qIndex + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = quizAnswers[qIndex] === optIndex;
                      const isCorrect  = q.answer === optIndex;
                      const isLocked   = quizLocked[qIndex];

                      let cls = "border-border/50 bg-card hover:border-primary hover:bg-primary/5 text-foreground";
                      if (isLocked || showResults) {
                        if (isCorrect)              cls = "border-secondary bg-secondary/10 text-secondary dark:text-secondary";
                        else if (isSelected)        cls = "border-destructive bg-destructive/10 text-destructive";
                        else                        cls = "border-border/30 bg-card opacity-40 pointer-events-none";
                      } else if (isSelected)        cls = "border-primary bg-primary/10 text-primary";

                      return (
                        <button
                          key={optIndex}
                          disabled={isLocked || showResults}
                          onClick={() => handleQuizSelect(qIndex, optIndex)}
                          className={`text-left px-4 py-3.5 rounded-xl border-2 transition-all font-medium text-sm ${cls}`}
                        >
                          <span className="font-bold mr-2 opacity-60">{String.fromCharCode(65 + optIndex)}.</span>
                          {opt}
                          {(isLocked || showResults) && isCorrect && <span className="ml-2 text-secondary font-black">✓</span>}
                          {(isLocked || showResults) && isSelected && !isCorrect && <span className="ml-2 text-destructive font-black">✗</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-primary/15 flex flex-col items-center gap-4">
              {!showResults ? (
                <Button
                  size="lg"
                  onClick={submitQuiz}
                  disabled={!allAnswered}
                  className="rounded-full px-12 h-13 text-base font-bold shadow-lg shadow-primary/20"
                >
                  {allAnswered ? "Submit Quiz →" : `Answer all ${story.quiz.length} questions to submit`}
                </Button>
              ) : (
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 w-full">
                  <div className={`text-6xl font-black mb-3 ${finalScore === story.quiz.length ? 'text-secondary' : finalScore >= Math.ceil(story.quiz.length * 0.6) ? 'text-primary' : 'text-destructive'}`}>
                    {finalScore} / {story.quiz.length}
                  </div>
                  <p className="text-lg font-medium text-muted-foreground mb-6">
                    {finalScore === story.quiz.length ? "Perfect score! Brilliant. 🎉"
                      : finalScore >= Math.ceil(story.quiz.length * 0.6) ? "Great effort! Review the missed ones."
                      : "Keep practicing — re-read the key points!"}
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <Button variant="outline" onClick={retakeQuiz} className="rounded-full">Retake Quiz</Button>
                    <Button onClick={() => setLocation("/library")} className="rounded-full">Back to Library</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <DoubtChat />

      {/* Text-selection floating toolbar */}
      {selection && (
        <div
          className="fixed z-50 -translate-x-1/2 animate-in fade-in zoom-in-75 duration-150"
          style={{ left: selection.x, top: selection.y - window.scrollY }}
        >
          <div className="bg-card text-card-foreground shadow-2xl rounded-2xl py-1 px-1 flex items-center gap-1 border border-border -translate-y-full">
            <Button size="sm" variant="ghost" onClick={handleSimplify} className="h-8 text-xs font-bold px-3 gap-1">
              <Sparkles className="w-3 h-3 text-primary" /> Simplify
            </Button>
            <div className="w-px h-5 bg-border/70" />
            <Button size="sm" variant="ghost" onClick={handleAskDoubt} className="h-8 text-xs font-bold px-3 text-primary">
              Ask Doubt
            </Button>
          </div>
        </div>
      )}

      {/* Exam Mode Dialog */}
      <Dialog open={examModeOpen} onOpenChange={setExamModeOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-secondary" /> Exam Mode
            </DialogTitle>
            <DialogDescription>Quick revision — no distractions.</DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            <div className="p-4 bg-muted/40 rounded-2xl border border-border/40">
              <h4 className="font-bold mb-2 text-xs uppercase tracking-widest text-muted-foreground">TL;DR</h4>
              <p className="text-sm leading-relaxed">{story.concept}</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Key Takeaways</h4>
              <ul className="space-y-2">
                {story.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start text-sm bg-background rounded-xl p-3 border border-border/40 gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-black shrink-0">{i + 1}</div>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Short Answers</h4>
              <div className="space-y-3">
                {story.questions.map((q, i) => (
                  <div key={i} className="bg-primary/5 border border-primary/15 rounded-xl p-4">
                    <p className="font-semibold text-sm mb-1">Q: {q.q}</p>
                    <p className="text-sm text-muted-foreground">A: {q.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Simplify Dialog */}
      <Dialog open={simplifyOpen} onOpenChange={setSimplifyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Simplified Explanation
            </DialogTitle>
            <DialogDescription>Your selected text, broken down simply.</DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div className="p-3 bg-muted/50 rounded-xl border border-border/50 text-sm italic text-muted-foreground line-clamp-3">
              "{simplifyText}"
            </div>
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-base leading-relaxed">
              {simplification}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
