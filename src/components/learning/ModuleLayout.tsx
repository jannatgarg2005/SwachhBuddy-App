// src/components/learning/ModuleLayout.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen, CheckCircle, FileText, Award,
  ArrowRight, ArrowLeft, Home, RotateCcw, SkipForward,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface LessonContent {
  introduction: string;
  keyPoints: string[];
  quiz: Quiz;
}

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  content: LessonContent;
}

interface ModuleLayoutProps {
  storageKey: string;
  title: string;
  subtitle: string;
  accentColor: string;
  backTab: string;
  nextRoute?: string;
  nextLabel?: string;
  certParam?: string;
  lessons: Lesson[];
  introVideo?: string;   // ← optional: path to video e.g. "/src/assets/basics.mp4"
}

const colorMap: Record<string, {
  ring: string; bg: string; border: string; text: string;
  btn: string; bullet: string; heading: string;
}> = {
  green:  { ring:"ring-green-500",  bg:"bg-green-50 dark:bg-green-950",   border:"border-green-300",  text:"text-green-600",  btn:"bg-green-600 hover:bg-green-700",   bullet:"text-green-600",  heading:"text-green-700 dark:text-green-400"  },
  blue:   { ring:"ring-blue-500",   bg:"bg-blue-50 dark:bg-blue-950",     border:"border-blue-300",   text:"text-blue-600",   btn:"bg-blue-600 hover:bg-blue-700",     bullet:"text-blue-600",   heading:"text-blue-700 dark:text-blue-400"    },
  purple: { ring:"ring-purple-500", bg:"bg-purple-50 dark:bg-purple-950", border:"border-purple-300", text:"text-purple-600", btn:"bg-purple-600 hover:bg-purple-700", bullet:"text-purple-600", heading:"text-purple-700 dark:text-purple-400" },
  teal:   { ring:"ring-teal-500",   bg:"bg-teal-50 dark:bg-teal-950",     border:"border-teal-300",   text:"text-teal-600",   btn:"bg-teal-600 hover:bg-teal-700",     bullet:"text-teal-600",   heading:"text-teal-700 dark:text-teal-400"    },
  cyan:   { ring:"ring-cyan-500",   bg:"bg-cyan-50 dark:bg-cyan-950",     border:"border-cyan-300",   text:"text-cyan-600",   btn:"bg-cyan-600 hover:bg-cyan-700",     bullet:"text-cyan-600",   heading:"text-cyan-700 dark:text-cyan-400"    },
  indigo: { ring:"ring-indigo-500", bg:"bg-indigo-50 dark:bg-indigo-950", border:"border-indigo-300", text:"text-indigo-600", btn:"bg-indigo-600 hover:bg-indigo-700", bullet:"text-indigo-600", heading:"text-indigo-700 dark:text-indigo-400" },
  orange: { ring:"ring-orange-500", bg:"bg-orange-50 dark:bg-orange-950", border:"border-orange-300", text:"text-orange-600", btn:"bg-orange-600 hover:bg-orange-700", bullet:"text-orange-600", heading:"text-orange-700 dark:text-orange-400" },
  amber:  { ring:"ring-amber-500",  bg:"bg-amber-50 dark:bg-amber-950",   border:"border-amber-300",  text:"text-amber-600",  btn:"bg-amber-600 hover:bg-amber-700",   bullet:"text-amber-600",  heading:"text-amber-700 dark:text-amber-400"  },
  lime:   { ring:"ring-lime-500",   bg:"bg-lime-50 dark:bg-lime-950",     border:"border-lime-300",   text:"text-lime-600",   btn:"bg-lime-600 hover:bg-lime-700",     bullet:"text-lime-600",   heading:"text-lime-700 dark:text-lime-400"    },
  red:    { ring:"ring-red-500",    bg:"bg-red-50 dark:bg-red-950",       border:"border-red-300",    text:"text-red-600",    btn:"bg-red-600 hover:bg-red-700",       bullet:"text-red-600",    heading:"text-red-700 dark:text-red-400"      },
};

export const ModuleLayout: React.FC<ModuleLayoutProps> = ({
  storageKey, title, subtitle, accentColor,
  backTab, nextRoute, nextLabel, certParam,
  lessons, introVideo,
}) => {
  const navigate = useNavigate();
  const c = colorMap[accentColor] ?? colorMap.green;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [showVideo, setShowVideo]               = useState(!!introVideo);
  const [currentLesson, setCurrentLesson]       = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [quizAnswers, setQuizAnswers]           = useState<Record<number, number>>({});
  const [activeTab, setActiveTab]               = useState<'content' | 'quiz'>('content');

  const backRoute = `/learning?tab=${backTab}`;

  // ── Persist ──────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { completedLessons: cl, quizAnswers: qa, currentLesson: cur, videoWatched } = JSON.parse(saved);
        if (cl)  setCompletedLessons(cl);
        if (qa)  setQuizAnswers(qa);
        if (cur !== undefined) setCurrentLesson(cur);
        // If user already watched/skipped the video, don't show it again
        if (videoWatched && introVideo) setShowVideo(false);
      }
    } catch { /* ignore */ }
  }, [storageKey, introVideo]);

  const saveState = (cl: number[], qa: Record<number, number>, cur: number, videoWatched: boolean) => {
    localStorage.setItem(storageKey, JSON.stringify({ completedLessons: cl, quizAnswers: qa, currentLesson: cur, videoWatched }));
  };

  useEffect(() => {
    saveState(completedLessons, quizAnswers, currentLesson, !showVideo);
  }, [completedLessons, quizAnswers, currentLesson, showVideo]);

  useEffect(() => { setActiveTab('content'); }, [currentLesson]);

  const handleSkipVideo = () => {
    setShowVideo(false);
    saveState(completedLessons, quizAnswers, currentLesson, true);
  };

  const handleComplete = (id: number) => {
    if (!completedLessons.includes(id)) {
      const updated = [...completedLessons, id];
      setCompletedLessons(updated);
      toast.success(`✅ "${lessons[id].title}" completed!`);
    }
  };

  const handleQuizAnswer = (lessonId: number, idx: number) => {
    if (quizAnswers[lessonId] !== undefined) return;
    const updated = { ...quizAnswers, [lessonId]: idx };
    setQuizAnswers(updated);
    if (idx === lessons[lessonId].content.quiz.correct) {
      toast.success('🎉 Correct!');
      handleComplete(lessonId);
    } else {
      toast.error('❌ Incorrect — read the explanation below.');
    }
  };

  const handleRestart = () => {
    setCompletedLessons([]); setQuizAnswers({}); setCurrentLesson(0);
    setActiveTab('content');
    if (introVideo) setShowVideo(true);
    localStorage.removeItem(storageKey);
    toast.success('Course restarted! 🔄');
  };

  const lesson      = lessons[currentLesson];
  const isCompleted = completedLessons.includes(currentLesson);
  const allDone     = completedLessons.length === lessons.length;
  const progress    = Math.round((completedLessons.length / lessons.length) * 100);

  const cardCols = lessons.length <= 3 ? "grid-cols-1 md:grid-cols-3"
    : lessons.length <= 4              ? "grid-cols-2 md:grid-cols-4"
    : lessons.length <= 6              ? "grid-cols-2 md:grid-cols-3"
    :                                    "grid-cols-2 md:grid-cols-4";

  // ── Intro Video Screen ────────────────────────────────────────────────
  if (showVideo && introVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl space-y-4">
          <div className="text-center mb-2">
            <h1 className={`text-2xl md:text-3xl font-bold ${c.heading}`}>{title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          </div>

          <Card className={`border-2 ${c.border} overflow-hidden`}>
            <CardContent className="p-0 relative">
              <video
                ref={videoRef}
                src={introVideo}
                controls
                autoPlay
                className="w-full rounded-t-xl"
                onEnded={handleSkipVideo}
              />
              {/* Skip button overlay */}
              <div className="absolute top-3 right-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleSkipVideo}
                  className="flex items-center gap-1.5 bg-black/60 text-white hover:bg-black/80 border-0 backdrop-blur-sm"
                >
                  <SkipForward className="h-3.5 w-3.5" /> Skip Video
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => navigate(backRoute)} className="flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5" /> Back
            </Button>
            <Button className={`${c.btn} text-white flex items-center gap-2`} onClick={handleSkipVideo}>
              Start Learning <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Module ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 p-3 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* Header */}
        <div className="flex flex-wrap gap-3 justify-between items-start">
          <div>
            <h1 className={`text-xl md:text-3xl font-bold ${c.heading}`}>{title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className="flex gap-2">
            {introVideo && (
              <Button variant="outline" size="sm" onClick={() => setShowVideo(true)} className="flex items-center gap-1.5">
                ▶ Rewatch Intro
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleRestart} className="flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" /> Restart
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate(backRoute)} className="flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5" /> Back
            </Button>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Course Progress</span>
              <Badge variant="secondary">{completedLessons.length}/{lessons.length} complete</Badge>
            </div>
            <Progress value={progress} className="h-2" />
            {allDone && !nextRoute && (
              <p className={`text-center font-bold mt-3 text-sm ${c.text}`}>
                🏅 All lessons complete! Download your certificate below.
              </p>
            )}
            {allDone && nextRoute && (
              <p className={`text-center font-bold mt-3 text-sm ${c.text}`}>
                🎉 Module complete! Proceed to the {nextLabel} below.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Proceed / Certificate card */}
        {allDone && (
          <Card className={`border-2 ${c.border} ${c.bg}`}>
            <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                {nextRoute ? (
                  <>
                    <p className={`font-bold text-base ${c.heading}`}>🎉 Module Complete!</p>
                    <p className="text-sm text-muted-foreground">You're ready for the {nextLabel}.</p>
                  </>
                ) : (
                  <>
                    <p className={`font-bold text-base ${c.heading}`}>🏅 Track Complete!</p>
                    <p className="text-sm text-muted-foreground">All 3 modules done — download your certificate!</p>
                  </>
                )}
              </div>
              {nextRoute ? (
                <Button className={`${c.btn} text-white flex items-center gap-2 flex-shrink-0`} onClick={() => navigate(nextRoute)}>
                  Proceed to {nextLabel} <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button className={`${c.btn} text-white flex items-center gap-2 flex-shrink-0`} onClick={() => navigate(`${backRoute}&cert=${certParam}`)}>
                  <Award className="h-4 w-4" /> Get Certificate
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Lesson cards grid */}
        <div className={`grid ${cardCols} gap-2`}>
          {lessons.map((l, i) => (
            <Card key={l.id}
              className={`cursor-pointer transition-all hover:shadow-md active:scale-[0.98]
                ${currentLesson === i ? `ring-2 ${c.ring} shadow-md` : ''}
                ${completedLessons.includes(i) ? `${c.bg} ${c.border}` : ''}`}
              onClick={() => {
                setCurrentLesson(i);
                setActiveTab('content');
                setTimeout(() => document.getElementById('lesson-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
              }}>
              <CardHeader className="p-3 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    <FileText className="h-2.5 w-2.5 mr-0.5" />reading
                  </Badge>
                  {completedLessons.includes(i) && <CheckCircle className={`h-4 w-4 ${c.text}`} />}
                </div>
                <CardTitle className="text-xs leading-tight">{l.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{l.duration}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Active lesson */}
        <Card id="lesson-content">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <BookOpen className="h-5 w-5 flex-shrink-0" />
              <span>{lesson.title}</span>
              {isCompleted && <CheckCircle className={`h-5 w-5 ${c.text} flex-shrink-0`} />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'content' | 'quiz')}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="content">📖 Lesson</TabsTrigger>
                <TabsTrigger value="quiz" disabled={!isCompleted}>{isCompleted ? '✅ Quiz' : '🔒 Quiz'}</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4 mt-0">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{lesson.content.introduction}</p>
                <div className="bg-muted/30 rounded-xl p-4">
                  <h4 className={`font-semibold text-sm ${c.heading} mb-3`}>Key Points</h4>
                  <ul className="space-y-2">
                    {lesson.content.keyPoints.map((pt, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className={`${c.bullet} font-bold flex-shrink-0`}>•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={() => { handleComplete(currentLesson); setTimeout(() => setActiveTab('quiz'), 400); }}
                  disabled={isCompleted} className={`w-full ${c.btn} text-white`} size="lg">
                  {isCompleted
                    ? <><CheckCircle className="h-4 w-4 mr-2" />Completed — Take Quiz!</>
                    : <><Award className="h-4 w-4 mr-2" />Mark Complete & Unlock Quiz</>}
                </Button>
                {isCompleted && (
                  <Button variant="outline" className={`w-full ${c.border} ${c.text}`} onClick={() => setActiveTab('quiz')}>
                    Go to Quiz →
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="quiz" className="space-y-4 mt-0">
                <div className="bg-muted/20 rounded-xl p-4">
                  <p className="font-semibold text-sm md:text-base mb-4">❓ {lesson.content.quiz.question}</p>
                  <div className="space-y-2">
                    {lesson.content.quiz.options.map((opt, i) => {
                      const answered   = quizAnswers[currentLesson] !== undefined;
                      const isSelected = quizAnswers[currentLesson] === i;
                      const isCorrect  = i === lesson.content.quiz.correct;
                      let variant: 'default' | 'destructive' | 'outline' = 'outline';
                      if (answered) { if (isCorrect) variant = 'default'; else if (isSelected) variant = 'destructive'; }
                      return (
                        <Button key={i} variant={variant}
                          className={`w-full text-left justify-start h-auto py-3 px-4 text-sm whitespace-normal
                            ${answered && isCorrect ? 'bg-green-600 hover:bg-green-600 text-white border-green-600' : ''}`}
                          onClick={() => handleQuizAnswer(currentLesson, i)}
                          disabled={answered && !isSelected && !isCorrect}>
                          <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                          {answered && isCorrect && <CheckCircle className="h-4 w-4 ml-auto flex-shrink-0" />}
                        </Button>
                      );
                    })}
                  </div>
                  {quizAnswers[currentLesson] !== undefined && (
                    <div className={`mt-4 p-3 rounded-lg text-sm
                      ${quizAnswers[currentLesson] === lesson.content.quiz.correct
                        ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {quizAnswers[currentLesson] === lesson.content.quiz.correct
                        ? '🎉 Correct! '
                        : `❌ Incorrect. Correct: ${lesson.content.quiz.options[lesson.content.quiz.correct]}. `}
                      <span className="font-medium">{lesson.content.quiz.explanation}</span>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Lesson nav */}
            <div className="flex justify-between mt-4 pt-4 border-t gap-2">
              <Button variant="outline" onClick={() => setCurrentLesson(p => Math.max(0, p - 1))} disabled={currentLesson === 0} className="flex items-center gap-1.5">
                <ArrowLeft className="h-4 w-4" /> Previous
              </Button>
              <span className="text-xs text-muted-foreground self-center">{currentLesson + 1} / {lessons.length}</span>
              <Button variant="outline"
                onClick={() => { if (isCompleted) setCurrentLesson(p => Math.min(lessons.length - 1, p + 1)); else toast.error('Complete this lesson first!'); }}
                disabled={currentLesson === lessons.length - 1} className="flex items-center gap-1.5">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};