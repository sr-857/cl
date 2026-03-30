import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Trophy, AlertTriangle, BookOpen, ChevronRight, Clock, Activity, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockStudentData, stories } from "@/data/mock-data";
import { useAuth } from "@/hooks/use-auth";
import { DoubtChat } from "@/components/chat/DoubtChat";
import { useProgress } from "@/hooks/use-progress";
import { getActivityLog, getLastStory, ActivityLog } from "@/utils/storage";
import { computeAccuracy, timeAgo } from "@/utils/logic";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { progress } = useProgress();
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [lastStory, setLastStory] = useState<{ storyId: number; storyTitle: string } | null>(null);

  useEffect(() => {
    if (!user) setLocation('/auth');
    if (user?.role === 'teacher') setLocation('/teacher-dashboard');
  }, [user]);

  // Load activity and last story from localStorage
  useEffect(() => {
    setActivityLog(getActivityLog());
    setLastStory(getLastStory());
  }, []);

  // Refresh activity when progress changes
  useEffect(() => {
    setActivityLog(getActivityLog());
  }, [progress]);

  if (!user || user.role !== 'student') return null;

  // --- Compute live stats from progress ---
  const completedCount = Object.keys(progress).length;
  const accuracy = computeAccuracy(progress) || mockStudentData.accuracy;

  // Compute weak topics: subjects where completed quizzes scored < 70%
  const subjectScores: Record<string, { score: number; total: number }> = {};
  Object.entries(progress).forEach(([storyId, p]) => {
    const story = stories.find(s => s.id === Number(storyId));
    if (story) {
      if (!subjectScores[story.subject]) subjectScores[story.subject] = { score: 0, total: 0 };
      subjectScores[story.subject].score += p.score;
      subjectScores[story.subject].total += p.total;
    }
  });
  const dynamicWeakTopics = Object.entries(subjectScores)
    .filter(([, v]) => v.total > 0 && (v.score / v.total) < 0.7)
    .map(([subject]) => subject);

  // Fall back to mock weak topics if no progress yet
  const weakTopics = dynamicWeakTopics.length > 0 ? dynamicWeakTopics : mockStudentData.weakTopics;

  // Stories not completed yet
  const incompleteStories = stories.filter(s => !progress[s.id]);

  // Activity icon helper
  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'story_opened': return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'story_completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'quiz_attempted': return <Activity className="h-4 w-4 text-orange-500" />;
      case 'quiz_completed': return <Trophy className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <Navbar />

      <main className="container mx-auto px-4 pt-10">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-muted-foreground text-lg">Here's an overview of your learning journey.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="rounded-3xl shadow-md border-border/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="bg-primary/10 p-4 rounded-2xl">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Accuracy</p>
                <h2 className="text-4xl font-bold">{accuracy}%</h2>
                <div className="mt-2">
                  <Progress value={accuracy} className="h-1.5 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-md border-border/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="bg-green-500/10 p-4 rounded-2xl">
                <Trophy className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stories Completed</p>
                <h2 className="text-4xl font-bold">{completedCount > 0 ? completedCount : mockStudentData.completed}</h2>
                <p className="text-xs text-muted-foreground mt-1">of {stories.length} total</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-md border-border/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="bg-destructive/10 p-4 rounded-2xl">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Topics Need Review</p>
                <h2 className="text-4xl font-bold">{weakTopics.length}</h2>
                <p className="text-xs text-muted-foreground mt-1">score &lt; 70%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Center Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Resume Last Story */}
            {lastStory && (
              <Card className="rounded-3xl shadow-md border-primary/30 bg-primary/5">
                <CardContent className="p-6 flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">Resume where you left off</p>
                    <h3 className="font-bold text-lg truncate">{lastStory.storyTitle}</h3>
                  </div>
                  <Link href={`/reader/${lastStory.storyId}`}>
                    <Button size="sm" className="rounded-full shrink-0">
                      Continue <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Weekly Performance Chart */}
            <Card className="rounded-3xl shadow-md border-border/50">
              <CardHeader className="pb-2 pt-6 px-8">
                <CardTitle>Weekly Performance</CardTitle>
                <CardDescription>Your quiz scores over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="p-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockStudentData.weeklyPerformance}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} domain={[0, 100]} />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted))' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Continue Learning */}
            <Card className="rounded-3xl shadow-md border-border/50">
              <CardHeader className="px-8 pt-6">
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>
                  {incompleteStories.length > 0
                    ? `${incompleteStories.length} ${incompleteStories.length === 1 ? 'story' : 'stories'} left to explore`
                    : "All stories completed — great work!"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 px-8">
                {incompleteStories.length > 0 ? (
                  <div className="space-y-3">
                    {incompleteStories.slice(0, 4).map(story => (
                      <Link key={story.id} href={`/reader/${story.id}`}>
                        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/50 border border-transparent hover:border-border/50 transition-colors cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <BookOpen className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">{story.title}</h4>
                              <p className="text-xs text-muted-foreground">{story.subject} • {story.readTime}</p>
                            </div>
                          </div>
                          <ChevronRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform shrink-0" />
                        </div>
                      </Link>
                    ))}
                    {incompleteStories.length > 4 && (
                      <Link href="/library">
                        <Button variant="ghost" className="w-full rounded-xl text-muted-foreground" size="sm">
                          View all {incompleteStories.length} remaining stories →
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <Trophy className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">You've completed all available stories! 🎉</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card className="rounded-3xl shadow-md border-border/50">
              <CardHeader className="px-8 pt-6">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" /> Recent Activity
                </CardTitle>
                <CardDescription>Your latest learning actions</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-6">
                {activityLog.length > 0 ? (
                  <div className="space-y-3">
                    {activityLog.slice(0, 8).map(entry => (
                      <div key={entry.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          {getActivityIcon(entry.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{entry.message}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Clock className="h-3 w-3" />
                          {timeAgo(entry.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground text-sm">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    No activity yet. Start reading a story to track your progress!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Weak Topics / Focus Areas */}
            <Card className="rounded-3xl shadow-md border-destructive/20 bg-destructive/5">
              <CardHeader className="px-8 pt-6">
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" /> Focus Areas
                </CardTitle>
                <CardDescription>Topics where you scored below 70%</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-4">
                {weakTopics.map((topic, i) => {
                  // Compute actual % for this subject
                  const subjectData = subjectScores[topic];
                  const pct = subjectData && subjectData.total > 0
                    ? Math.round((subjectData.score / subjectData.total) * 100)
                    : null;

                  // Map topic to subject for navigation
                  const subjectMap: Record<string, string> = {
                    Physics: 'Physics',
                    Chemistry: 'Chemistry',
                    Biology: 'Biology',
                    Mathematics: 'Mathematics',
                    Thermodynamics: 'Physics',
                    'Organic Chemistry': 'Chemistry',
                    Optics: 'Physics',
                  };
                  const filterSubject = subjectMap[topic] || topic;

                  return (
                    <div key={i} className="bg-background rounded-xl border border-destructive/10 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">{topic}</span>
                        <Badge variant="destructive" className="text-xs">
                          {pct !== null ? `${pct}%` : 'Review needed'}
                        </Badge>
                      </div>
                      {pct !== null && (
                        <Progress value={pct} className="h-1.5 mb-3" />
                      )}
                      <Link href={`/library`} onClick={() => {}}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            // Navigate to library — the user can then filter by subject
                            setLocation('/library');
                          }}
                        >
                          Practice {filterSubject} stories →
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quiz Scores Summary */}
            {Object.keys(progress).length > 0 && (
              <Card className="rounded-3xl shadow-md border-border/50">
                <CardHeader className="px-8 pt-6">
                  <CardTitle>Quiz History</CardTitle>
                  <CardDescription>Scores from completed stories</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-6 space-y-3">
                  {Object.entries(progress).map(([storyId, p]) => {
                    const story = stories.find(s => s.id === Number(storyId));
                    if (!story) return null;
                    const pct = Math.round((p.score / p.total) * 100);
                    return (
                      <div key={storyId}>
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="font-medium truncate mr-2 max-w-[160px]">{story.title}</span>
                          <span className={`font-bold shrink-0 ${pct >= 70 ? 'text-green-600' : 'text-destructive'}`}>
                            {p.score}/{p.total}
                          </span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <DoubtChat />
    </div>
  );
}
