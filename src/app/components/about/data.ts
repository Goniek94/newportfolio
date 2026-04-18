// ─────────────────────────────────────────────
// BUILD ITEMS — expertise cards
// ─────────────────────────────────────────────
export const buildItems = [
  {
    icon: "⚡",
    title: "Real-time Systems",
    desc: "WebSocket auction engines, Socket.IO gateways with isolated rooms, atomic Prisma transactions.",
  },
  {
    icon: "💳",
    title: "Payment Infrastructure",
    desc: "Stripe Connect — seller onboarding, escrow payouts, webhook-driven state machines.",
  },
  {
    icon: "🤖",
    title: "AI Pipelines",
    desc: "Gemini Vision verification, Bull queues with exponential backoff — zero blocking of user flows.",
  },
  {
    icon: "🤝",
    title: "Client Delivery",
    desc: "Requirements gathering, feedback loops, stakeholder comms — delivered for a paying client on schedule, live at autosell.pl.",
  },
];

// ─────────────────────────────────────────────
// TECH STACK — all technologies
// ─────────────────────────────────────────────
export const allStack = [
  "TypeScript",
  "React 18",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "NestJS",
  "Express",
  "Socket.IO",
  "PostgreSQL",
  "MongoDB",
  "Prisma ORM",
  "Redis",
  "Docker",
  "Linux VPS",
  "NGINX",
  "Stripe Connect",
];

// ─────────────────────────────────────────────
// TERMINAL SCRIPT — animated profile terminal
// ─────────────────────────────────────────────
export type TermLine =
  | { type: "cmd"; text: string }
  | { type: "output"; text: string; color?: string }
  | { type: "blank" };

export const terminalScript: TermLine[] = [
  { type: "cmd", text: "cat contact.json" },
  { type: "blank" },
  { type: "output", text: '{ name: "Mateusz Goszczycki",' },
  { type: "output", text: '  role: "Full Stack Engineer",' },
  { type: "output", text: '  based: "Łowicz / Warsaw",' },
  { type: "output", text: '  open_to_relocation: true,' },
  { type: "output", text: '  client_work: "2+ yrs commercial",' },
  { type: "output", text: '  phone: "+48 516 223 029",' },
  { type: "output", text: '  status: "available" }', color: "#27c93f" },
  { type: "blank" },
  { type: "cmd", text: "echo $LOOKING_FOR" },
  { type: "blank" },
  {
    type: "output",
    text: "Mid-Level Full Stack · Remote · Open to relocation",
    color: "#D4AF37",
  },
  { type: "blank" },
  { type: "cmd", text: "cat client_experience.txt" },
  { type: "blank" },
  { type: "output", text: "Requirements gathering — check.", color: "#e1e1e1" },
  { type: "output", text: "Feedback loops — check.", color: "#e1e1e1" },
  { type: "output", text: "Stakeholder comms — check.", color: "#e1e1e1" },
  { type: "output", text: "Delivered on schedule — check.", color: "#27c93f" },
  { type: "blank" },
  { type: "cmd", text: "ls stack/" },
  { type: "blank" },
  {
    type: "output",
    text: "next.js  nestjs  postgres  redis  docker",
    color: "#4ec9b0",
  },
  { type: "blank" },
  { type: "cmd", text: "git log --oneline -3" },
  { type: "blank" },
  { type: "output", text: "a3f2c1d  Stripe Connect payouts", color: "#D4AF37" },
  {
    type: "output",
    text: "9b8e4f2  WebSocket auction engine",
    color: "#D4AF37",
  },
  { type: "output", text: "7c1d3a8  Gemini AI verification", color: "#D4AF37" },
  { type: "blank" },
  { type: "cmd", text: "cat value.txt" },
  { type: "blank" },
  {
    type: "output",
    text: "I take problems, not tickets.",
    color: "#e1e1e1",
  },
  {
    type: "output",
    text: "One commercial client. One investor NDA. All solo.",
    color: "#e1e1e1",
  },
  {
    type: "output",
    text: "Schema → API → UI → prod. Full ownership.",
    color: "#D4AF37",
  },
];

// ─────────────────────────────────────────────
// CHALLENGE BANK — random TypeScript/JS/NestJS quizzes
// ─────────────────────────────────────────────
export type Challenge = {
  title: string;
  question: string;
  options: { id: string; text: string }[];
  correct: string;
  explanation: string;
};

export const CHALLENGES: Challenge[] = [
  {
    title: "DeepReadonly",
    question: `// What does this TypeScript utility do?

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

const config: DeepReadonly<{
  db: { host: string; port: number };
  debug: boolean;
}> = {
  db: { host: "localhost", port: 5432 },
  debug: false,
};

config.db.port = 3000; // What happens here?`,
    options: [
      { id: "a", text: "Compiles fine, port is updated to 3000" },
      {
        id: "b",
        text: "TypeScript error: Cannot assign to 'port' — it's readonly",
      },
      { id: "c", text: "Runtime error: property is not writable" },
      { id: "d", text: "Compiles fine, but port stays 5432 at runtime" },
    ],
    correct: "b",
    explanation:
      "DeepReadonly recursively marks all nested properties as readonly. Since db.port is nested inside an object, it becomes readonly too — TypeScript throws a compile-time error at assignment.",
  },
  {
    title: "Promise.all vs Promise.allSettled",
    question: `// What is logged to the console?

const p1 = Promise.resolve("ok");
const p2 = Promise.reject(new Error("fail"));
const p3 = Promise.resolve("done");

Promise.all([p1, p2, p3])
  .then((res) => console.log("then:", res))
  .catch((err) => console.log("catch:", err.message));`,
    options: [
      { id: "a", text: 'then: ["ok", Error, "done"]' },
      { id: "b", text: "catch: fail" },
      { id: "c", text: 'then: ["ok", undefined, "done"]' },
      { id: "d", text: "No output — unhandled rejection" },
    ],
    correct: "b",
    explanation:
      "Promise.all rejects immediately when any promise rejects. It short-circuits and jumps to .catch with the first rejection reason — in this case 'fail'.",
  },
  {
    title: "Closure in a loop",
    question: `// What does this print?

const fns: (() => number)[] = [];

for (var i = 0; i < 3; i++) {
  fns.push(() => i);
}

console.log(fns[0](), fns[1](), fns[2]());`,
    options: [
      { id: "a", text: "0 1 2" },
      { id: "b", text: "3 3 3" },
      { id: "c", text: "0 0 0" },
      { id: "d", text: "undefined undefined undefined" },
    ],
    correct: "b",
    explanation:
      "var is function-scoped, not block-scoped. All closures share the same 'i' variable. By the time any function is called, the loop has finished and i === 3. Using let instead would give 0 1 2.",
  },
  {
    title: "Event loop order",
    question: `// What is the output order?

console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");`,
    options: [
      { id: "a", text: "1 2 3 4" },
      { id: "b", text: "1 4 2 3" },
      { id: "c", text: "1 4 3 2" },
      { id: "d", text: "1 3 4 2" },
    ],
    correct: "c",
    explanation:
      "Synchronous code runs first (1, 4). Then microtasks (Promise .then → 3). Finally macrotasks (setTimeout → 2). Microtasks always drain before the next macrotask.",
  },
  {
    title: "TypeScript Conditional Types",
    question: `// What is the type of Result?

type IsArray<T> = T extends any[] ? "yes" : "no";

type Result = IsArray<string[]>;`,
    options: [
      { id: "a", text: '"yes" | "no"' },
      { id: "b", text: '"no"' },
      { id: "c", text: '"yes"' },
      { id: "d", text: "string[]" },
    ],
    correct: "c",
    explanation:
      'string[] extends any[] is true, so the conditional type resolves to "yes". Conditional types in TypeScript work like ternary operators at the type level.',
  },
  {
    title: "NestJS Dependency Injection",
    question: `// Which decorator makes a class injectable in NestJS?

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
}

// What happens if you forget @Injectable()?`,
    options: [
      { id: "a", text: "Nothing — NestJS injects it anyway" },
      { id: "b", text: "Runtime error: Nest can't resolve dependencies" },
      { id: "c", text: "TypeScript compile error" },
      { id: "d", text: "The class is treated as a plain object" },
    ],
    correct: "b",
    explanation:
      "@Injectable() tells NestJS's IoC container that this class can be managed and injected. Without it, the DI container won't know how to resolve the class and throws a runtime error.",
  },
];

// Pick a random challenge once per module load (i.e. per page load)
export const CHALLENGE =
  CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
