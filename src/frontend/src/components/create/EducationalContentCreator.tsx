import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCourse } from "@/lib/backend";
import {
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface LessonItem {
  id: string;
  title: string;
  description: string;
  duration: string;
}

interface QuizQuestion {
  id: string;
  questionText: string;
  type: "multiple-choice" | "text";
  options: string[];
}

const COURSE_CATEGORIES = [
  "Crop Cultivation",
  "Pest & Disease Management",
  "Irrigation & Water Management",
  "Soil Health",
  "Equipment & Technology",
  "Business & Marketing",
  "Organic Farming",
  "Government Schemes",
];

export function EducationalContentCreator() {
  const [step, setStep] = useState(1);

  // Step 1 state
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [category, setCategory] = useState("Crop Cultivation");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">(
    "beginner",
  );
  const [price, setPrice] = useState("0");

  // Step 2 state
  const [lessons, setLessons] = useState<LessonItem[]>([
    { id: "1", title: "", description: "", duration: "10" },
  ]);

  // Step 3 state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: "1",
      questionText: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
    },
  ]);

  // Step 4 state
  const [certEnabled, setCertEnabled] = useState(true);

  const createCourse = useCreateCourse();

  const saveDraft = () => toast.success("Draft saved!");

  const addLesson = () => {
    setLessons((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        title: "",
        description: "",
        duration: "10",
      },
    ]);
  };

  const removeLesson = (id: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLesson = (id: string, field: keyof LessonItem, value: string) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    );
  };

  const addQuestion = () => {
    setQuizQuestions((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        questionText: "",
        type: "multiple-choice",
        options: ["", "", "", ""],
      },
    ]);
  };

  const updateQuestion = (
    id: string,
    field: keyof QuizQuestion,
    value: string,
  ) => {
    setQuizQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  };

  const updateOption = (qId: string, idx: number, value: string) => {
    setQuizQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.map((o, i) => (i === idx ? value : o)) }
          : q,
      ),
    );
  };

  const handlePublish = async () => {
    if (!courseTitle.trim()) {
      toast.error("Please add a course title.");
      return;
    }
    try {
      await createCourse.mutateAsync({
        educatorId: BigInt(1),
        title: courseTitle,
        description: courseDesc,
        thumbnailUrl: "",
        price: Number(price),
        category,
        level,
        durationMinutes: BigInt(
          lessons.reduce((acc, l) => acc + Number(l.duration || 0), 0),
        ),
        isCertified: certEnabled,
      });
      toast.success("🎓 Course published successfully!");
      setStep(1);
      setCourseTitle("");
      setCourseDesc("");
    } catch {
      toast.error("Failed to publish. Try again.");
    }
  };

  const STEPS = ["Details", "Lessons", "Assessment", "Certificate", "Publish"];
  const totalLessonMins = lessons.reduce(
    (a, l) => a + Number(l.duration || 0),
    0,
  );

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-foreground">
            Step {step} of 5: {STEPS[step - 1]}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round((step / 5) * 100)}%
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="space-y-4" data-ocid="edu-details-step">
          <div className="space-y-2">
            <Label htmlFor="course-title" className="text-sm font-semibold">
              Course Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="course-title"
              placeholder="e.g. Organic Tomato Farming Masterclass"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="rounded-xl"
              data-ocid="course-title-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-desc" className="text-sm font-semibold">
              Description
            </Label>
            <Textarea
              id="course-desc"
              placeholder="What will students learn? What's covered?"
              value={courseDesc}
              onChange={(e) => setCourseDesc(e.target.value)}
              rows={3}
              className="rounded-xl resize-none"
              data-ocid="course-desc-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  className="rounded-xl text-xs"
                  data-ocid="course-category-select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Level</Label>
              <Select
                value={level}
                onValueChange={(v) => setLevel(v as typeof level)}
              >
                <SelectTrigger
                  className="rounded-xl text-xs"
                  data-ocid="course-level-select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Price (₹) — 0 for free
            </Label>
            <Input
              type="number"
              min={0}
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="rounded-xl"
              data-ocid="course-price-input"
            />
          </div>

          <div
            className="aspect-video bg-muted/60 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/80 transition-smooth"
            data-ocid="course-thumbnail-upload"
          >
            <Upload className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">
              Upload Course Thumbnail
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Lessons */}
      {step === 2 && (
        <div className="space-y-4" data-ocid="edu-lessons-step">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {lessons.length} Lesson{lessons.length !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                Total: {totalLessonMins} min
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1 text-xs"
              onClick={addLesson}
              data-ocid="add-lesson-btn"
            >
              <Plus className="h-3.5 w-3.5" /> Add Lesson
            </Button>
          </div>

          <div className="space-y-3">
            {lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                className="bg-card border border-border rounded-xl p-3 space-y-2"
                data-ocid={`lesson-item.${idx + 1}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Lesson {idx + 1}
                  </span>
                  {lessons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLesson(lesson.id)}
                      aria-label="Remove lesson"
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <Input
                  placeholder="Lesson title"
                  value={lesson.title}
                  onChange={(e) =>
                    updateLesson(lesson.id, "title", e.target.value)
                  }
                  className="rounded-xl text-sm"
                  data-ocid={`lesson-title-input.${idx + 1}`}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Brief description"
                    value={lesson.description}
                    onChange={(e) =>
                      updateLesson(lesson.id, "description", e.target.value)
                    }
                    className="rounded-xl text-sm flex-1"
                  />
                  <div className="flex items-center gap-1 min-w-0">
                    <Input
                      type="number"
                      min={1}
                      placeholder="Min"
                      value={lesson.duration}
                      onChange={(e) =>
                        updateLesson(lesson.id, "duration", e.target.value)
                      }
                      className="rounded-xl text-sm w-16"
                    />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      min
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
                  <Video className="h-3.5 w-3.5" />
                  <span>Video upload placeholder</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="ml-auto h-6 text-xs px-2"
                  >
                    Upload
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Assessment */}
      {step === 3 && (
        <div className="space-y-4" data-ocid="edu-assessment-step">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">
              {quizQuestions.length} Question
              {quizQuestions.length !== 1 ? "s" : ""}
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1 text-xs"
              onClick={addQuestion}
              data-ocid="add-question-btn"
            >
              <Plus className="h-3.5 w-3.5" /> Add Question
            </Button>
          </div>
          <div className="space-y-4">
            {quizQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-card border border-border rounded-xl p-3 space-y-2"
                data-ocid={`quiz-question.${idx + 1}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Q{idx + 1}
                  </span>
                  <Select
                    value={q.type}
                    onValueChange={(v) => updateQuestion(q.id, "type", v)}
                  >
                    <SelectTrigger className="h-6 text-xs rounded-lg w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">
                        Multiple Choice
                      </SelectItem>
                      <SelectItem value="text">Text Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  placeholder="Question text..."
                  value={q.questionText}
                  onChange={(e) =>
                    updateQuestion(q.id, "questionText", e.target.value)
                  }
                  className="rounded-xl text-sm"
                />
                {q.type === "multiple-choice" && (
                  <div className="space-y-1.5 pl-2">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi.toString()}
                        className="flex items-center gap-2"
                      >
                        <span className="text-xs text-muted-foreground w-4">
                          {String.fromCharCode(65 + oi)}.
                        </span>
                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                          value={opt}
                          onChange={(e) =>
                            updateOption(q.id, oi, e.target.value)
                          }
                          className="rounded-lg text-xs h-8 flex-1"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Certificate */}
      {step === 4 && (
        <div className="space-y-4" data-ocid="edu-certificate-step">
          <div className="flex items-center justify-between bg-muted/40 rounded-xl p-3">
            <div>
              <Label className="text-sm font-semibold">
                Issue Completion Certificate
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Students receive a certificate upon finishing
              </p>
            </div>
            <Switch
              checked={certEnabled}
              onCheckedChange={setCertEnabled}
              data-ocid="cert-toggle"
            />
          </div>

          {certEnabled && (
            <div className="border-2 border-dashed border-border rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  <span className="text-sm font-semibold text-foreground">
                    Certificate Preview
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] border-accent/40 text-accent"
                >
                  Template
                </Badge>
              </div>
              <div className="bg-gradient-to-br from-muted/60 to-card rounded-xl p-4 border border-border text-center space-y-2">
                <GraduationCap className="h-8 w-8 text-accent mx-auto" />
                <p className="font-display font-bold text-base text-foreground">
                  Certificate of Completion
                </p>
                <p className="text-xs text-muted-foreground">
                  This is to certify that
                </p>
                <p className="font-semibold text-sm text-foreground border-b border-border pb-1 mx-8">
                  [Student Name]
                </p>
                <p className="text-xs text-muted-foreground">
                  has successfully completed
                </p>
                <p className="font-semibold text-sm text-foreground">
                  {courseTitle || "Course Title"}
                </p>
                <p className="text-xs text-muted-foreground">
                  AgriMarket Certified • {new Date().getFullYear()}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 5: Publish */}
      {step === 5 && (
        <div className="space-y-4" data-ocid="edu-publish-step">
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <p className="font-semibold text-foreground">Course Summary</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Title</span>
                <span className="font-medium text-foreground truncate max-w-[60%]">
                  {courseTitle || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium text-foreground">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Level</span>
                <span className="font-medium text-foreground capitalize">
                  {level}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lessons</span>
                <span className="font-medium text-foreground">
                  {lessons.length} ({totalLessonMins} min)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quiz Questions</span>
                <span className="font-medium text-foreground">
                  {quizQuestions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium text-foreground">
                  {Number(price) === 0 ? "Free" : `₹${price}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Certificate</span>
                <span
                  className={`font-medium ${certEnabled ? "text-success" : "text-muted-foreground"}`}
                >
                  {certEnabled ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={handlePublish}
            disabled={createCourse.isPending || !courseTitle.trim()}
            className="w-full h-12 bg-primary text-primary-foreground font-bold text-base rounded-xl gap-2"
            data-ocid="publish-course-btn"
          >
            <GraduationCap className="h-5 w-5" />
            {createCourse.isPending ? "Publishing..." : "Publish Course"}
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="gap-1 text-xs h-9"
          onClick={saveDraft}
          data-ocid="save-draft-btn"
        >
          <Save className="h-3.5 w-3.5" /> Save Draft
        </Button>
        <div className="flex gap-2 ml-auto">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              className="gap-1 h-9"
              onClick={() => setStep((s) => s - 1)}
              data-ocid="course-back-btn"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {step < 5 && (
            <Button
              type="button"
              className="bg-primary text-primary-foreground gap-1 h-9 px-4"
              onClick={() => setStep((s) => s + 1)}
              data-ocid="course-next-btn"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
