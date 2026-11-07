import type { Project, ProjectFile, ProjectKind } from "./types";

export const projectKinds: Record<
  ProjectKind,
  { label: string; detail: string; files: ProjectFile[] }
> = {
  web: {
    label: "Web page",
    detail: "HTML, CSS and JavaScript with a live preview",
    files: [
      {
        name: "index.html",
        language: "html",
        content: `<main class="card">
  <h1>Hello, Playground</h1>
  <p>Edit index.html, style.css and script.js. The preview updates as you type.</p>
  <button id="greet">Say hello</button>
  <p id="message"></p>
</main>
`,
      },
      {
        name: "style.css",
        language: "css",
        content: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: system-ui, sans-serif;
  background: #f4f6f8;
  color: #1d2329;
}

.card {
  max-width: 28rem;
  padding: 2rem;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.08);
}

button {
  padding: 0.6rem 1.1rem;
  border: 0;
  border-radius: 0.6rem;
  background: #0f7a5c;
  color: white;
  font: inherit;
  cursor: pointer;
}
`,
      },
      {
        name: "script.js",
        language: "javascript",
        content: `const button = document.querySelector("#greet");
const message = document.querySelector("#message");
let clicks = 0;

button.addEventListener("click", () => {
  clicks += 1;
  message.textContent = \`You clicked \${clicks} time\${clicks === 1 ? "" : "s"}.\`;
  console.log("Button clicked", clicks);
});
`,
      },
    ],
  },
  javascript: {
    label: "JavaScript",
    detail: "Run JavaScript and see console output",
    files: [
      {
        name: "main.js",
        language: "javascript",
        content: `// Press Run to see the output below.
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("world"));

const scores = [72, 95, 88];
const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
console.log("Average score:", average);
`,
      },
    ],
  },
  python: {
    label: "Python",
    detail: "Run Python 3 in your browser",
    files: [
      {
        name: "main.py",
        language: "python",
        content: `# Press Run to see the output below.
def greet(name):
    return f"Hello, {name}!"

print(greet("world"))

scores = [72, 95, 88]
average = sum(scores) / len(scores)
print("Average score:", average)
`,
      },
    ],
  },
};

export const kindOrder: ProjectKind[] = ["web", "javascript", "python"];

export function starterProject(kind: ProjectKind): Project {
  return { kind, files: projectKinds[kind].files.map((f) => ({ ...f })) };
}
