import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Clock, ChevronRight, BookOpen, Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { stories } from "@/data/mock-data";
import { useProgress } from "@/hooks/use-progress";
import { useAuth } from "@/hooks/use-auth";
import { DoubtChat } from "@/components/chat/DoubtChat";
import { saveLastStory, logActivity } from "@/utils/storage";
import { useDebounce } from "@/hooks/use-debounce";

const SUBJECTS = ["All", "Physics", "Chemistry", "Biology", "Mathematics"];

export default function Library() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 280);
  const { getProgress } = useProgress();
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Auth protection — redirect to /auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      setLocation('/auth');
    }
  }, [user, loading]);

  if (loading || !user) return null;

  // Filter by subject + debounced search query
  const filteredStories = stories.filter(s => {
    const matchesSubject = filter === "All" || s.subject === filter;
    const q = debouncedSearch.trim().toLowerCase();
    const matchesSearch =
      q === "" ||
      s.title.toLowerCase().includes(q) ||
      s.concept.toLowerCase().includes(q) ||
      s.subject.toLowerCase().includes(q);
    return matchesSubject && matchesSearch;
  });

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Physics': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Chemistry': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Biology': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300';
      case 'Mathematics': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleStoryClick = (story: typeof stories[0]) => {
    // Track the last opened story and log the activity
    saveLastStory(story.id, story.title);
    logActivity({
      type: 'story_opened',
      message: `Opened "${story.title}"`,
      storyId: story.id,
      storyTitle: story.title,
    });
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold mb-3">Story Library</h1>
              <p className="text-lg text-muted-foreground">
                Pick a story to start learning a new concept today.
              </p>
            </div>

            {/* Search bar */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search stories..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 rounded-full bg-background"
              />
            </div>
          </div>

          {/* Subject filter pills */}
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map(sub => (
              <Button
                key={sub}
                variant={filter === sub ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(sub)}
                className="rounded-full"
              >
                {sub}
              </Button>
            ))}
          </div>
        </div>

        {/* Story grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map(story => {
            const progress = getProgress(story.id);
            const isCompleted = progress?.completed;

            return (
              <Link key={story.id} href={`/reader/${story.id}`} onClick={() => handleStoryClick(story)}>
                <div className="bg-card rounded-3xl p-6 shadow-md border border-border/50 hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer group h-full flex flex-col relative overflow-hidden">

                  {isCompleted && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                      ✓ {progress.score}/{progress.total}
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4 mt-2">
                    <Badge variant="outline" className={`${getSubjectColor(story.subject)} px-3 py-1 text-sm rounded-lg`}>
                      {story.subject}
                    </Badge>
                    <div className="flex items-center text-muted-foreground text-sm font-medium">
                      <Clock className="w-4 h-4 mr-1" />
                      {story.readTime}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {story.title}
                  </h3>

                  <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">
                    {story.concept}
                  </p>

                  <div className="flex items-center text-primary font-semibold mt-auto group-hover:translate-x-1 transition-transform">
                    {isCompleted ? 'Review Concept' : 'Start Reading'}
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-muted-foreground">
              {search ? `No stories match "${search}".` : 'No stories found for this subject yet.'}
            </h3>
            {search && (
              <Button variant="link" className="mt-2" onClick={() => setSearch("")}>
                Clear search
              </Button>
            )}
          </div>
        )}
      </main>

      <DoubtChat />
    </div>
  );
}
