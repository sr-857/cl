import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Users, TrendingUp, AlertOctagon, BookOpen, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { mockTeacherData, stories } from "@/data/mock-data";
import { useAuth } from "@/hooks/use-auth";

// Mock story performance data for the teacher view
const storyPerformance = stories.map((s, i) => ({
  id: s.id,
  title: s.title.length > 22 ? s.title.slice(0, 22) + "…" : s.title,
  fullTitle: s.title,
  subject: s.subject,
  avgScore: [88, 74, 65, 91, 58, 72][i % 6],
  attempts: [42, 38, 30, 47, 25, 35][i % 6],
  completion: [95, 82, 70, 98, 60, 78][i % 6],
}));

interface Student {
  name: string;
  score: number;
  status: string;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (!user) setLocation('/auth');
    if (user?.role === 'student') setLocation('/student-dashboard');
  }, [user]);

  if (!user || user.role !== 'teacher') return null;

  const getStatusBadge = (status: string) => {
    if (status === 'at-risk') return <Badge className="bg-destructive/10 text-destructive border-transparent">At Risk</Badge>;
    if (status === 'average') return <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-transparent">Average</Badge>;
    return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-transparent">Good</Badge>;
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <Navbar />

      <main className="container mx-auto px-4 pt-10">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold mb-2">Class Overview</h1>
          <p className="text-muted-foreground text-lg">
            Monitor student performance and identify areas needing attention.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="rounded-3xl shadow-md border-border/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="bg-primary/10 p-4 rounded-2xl">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <h2 className="text-4xl font-bold">{mockTeacherData.totalStudents}</h2>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-md border-border/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="bg-green-500/10 p-4 rounded-2xl">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Class Average</p>
                <h2 className="text-4xl font-bold">{mockTeacherData.avgScore}%</h2>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-md border-destructive/30 bg-destructive/5 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="bg-destructive/10 p-4 rounded-2xl">
                <AlertOctagon className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-destructive">At-Risk Students</p>
                <h2 className="text-4xl font-bold text-destructive">{mockTeacherData.atRiskCount}</h2>
                <p className="text-xs text-destructive/70 mt-0.5">score &lt; 50%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Performance Chart + Student Roster */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Line Chart */}
          <div className="lg:col-span-2">
            <Card className="rounded-3xl shadow-md border-border/50 h-full">
              <CardHeader className="pb-2 pt-6 px-8">
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Class average score over the last 5 weeks</CardDescription>
              </CardHeader>
              <CardContent className="p-6 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={mockTeacherData.weeklyPerformance}
                    margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgScore"
                      stroke="hsl(var(--primary))"
                      strokeWidth={4}
                      dot={{ r: 6, fill: 'hsl(var(--background))', strokeWidth: 3 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Student Roster */}
          <div className="lg:col-span-1">
            <Card className="rounded-3xl shadow-md border-border/50 h-full flex flex-col">
              <CardHeader className="px-8 pt-6 pb-4 border-b border-border/50">
                <CardTitle>Student Roster</CardTitle>
                <CardDescription>Click a student to view details</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-auto max-h-[360px]">
                <div className="divide-y divide-border/50">
                  {mockTeacherData.students.map((student, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 px-6 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <div>
                        <p className="font-semibold text-foreground text-sm">{student.name}</p>
                        <p className="text-xs text-muted-foreground">Score: {student.score}%</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(student.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Row 3: Story Performance */}
        <Card className="rounded-3xl shadow-md border-border/50 mb-8">
          <CardHeader className="px-8 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Story Performance</CardTitle>
                <CardDescription>Average quiz scores per story across all students</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {/* Bar chart */}
            <div className="h-[260px] mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={storyPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    formatter={(val: number) => [`${val}%`, 'Avg Score']}
                  />
                  <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Story detail rows */}
            <div className="space-y-4">
              {storyPerformance.map(sp => (
                <div key={sp.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4">
                  <div>
                    <p className="font-medium text-sm truncate">{sp.fullTitle}</p>
                    <p className="text-xs text-muted-foreground">{sp.subject} • {sp.attempts} attempts</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground mb-1">Avg Score</p>
                    <p className={`text-sm font-bold ${sp.avgScore >= 75 ? 'text-green-600' : sp.avgScore >= 60 ? 'text-yellow-600' : 'text-destructive'}`}>
                      {sp.avgScore}%
                    </p>
                  </div>
                  <div className="w-28 hidden md:block">
                    <p className="text-xs text-muted-foreground mb-1">Completion</p>
                    <Progress value={sp.completion} className="h-2" />
                  </div>
                  <Badge
                    className={`text-xs ${
                      sp.avgScore >= 75
                        ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                        : sp.avgScore >= 60
                          ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                          : 'bg-destructive/10 text-destructive'
                    } border-transparent`}
                  >
                    {sp.avgScore >= 75 ? 'Strong' : sp.avgScore >= 60 ? 'Average' : 'Needs Help'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Student Detail Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={(open) => { if (!open) setSelectedStudent(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {selectedStudent?.name.charAt(0)}
              </div>
              {selectedStudent?.name}
            </DialogTitle>
            <DialogDescription>Student performance overview</DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="mt-2 space-y-5">
              {/* Score & status */}
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-extrabold">{selectedStudent.score}%</span>
                    {getStatusBadge(selectedStudent.status)}
                  </div>
                </div>
                <div className="h-16 w-16 rounded-full border-4 border-primary/20 flex items-center justify-center">
                  <span className={`text-lg font-black ${selectedStudent.score >= 75 ? 'text-green-600' : selectedStudent.score >= 50 ? 'text-yellow-600' : 'text-destructive'}`}>
                    {selectedStudent.score >= 75 ? '👍' : selectedStudent.score >= 50 ? '📈' : '⚠️'}
                  </span>
                </div>
              </div>

              {/* Score progress bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Performance</span>
                  <span className="font-semibold">{selectedStudent.score}% / 100%</span>
                </div>
                <Progress value={selectedStudent.score} className="h-3 rounded-full" />
              </div>

              {/* Suggested action */}
              <div className={`p-4 rounded-2xl border ${
                selectedStudent.status === 'at-risk'
                  ? 'bg-destructive/5 border-destructive/20'
                  : selectedStudent.status === 'average'
                    ? 'bg-yellow-500/5 border-yellow-500/20'
                    : 'bg-green-500/5 border-green-500/20'
              }`}>
                <p className="text-sm font-semibold mb-1">
                  {selectedStudent.status === 'at-risk' ? '⚠️ Recommended Action' : selectedStudent.status === 'average' ? '📈 Suggested Next Steps' : '✅ Status'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedStudent.status === 'at-risk'
                    ? 'This student is scoring significantly below the class average. Consider a one-on-one review session and revisiting foundational concepts.'
                    : selectedStudent.status === 'average'
                      ? 'Performing near the class average. Encourage consistent practice and reviewing weak topic areas.'
                      : 'Performing well above the class average. This student could benefit from advanced challenges.'}
                </p>
              </div>

              <Button className="w-full rounded-xl" onClick={() => setSelectedStudent(null)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
