import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFoundationFiles = [
  ".editorconfig",
  ".env.example",
  ".github/CODEOWNERS",
  ".github/labels.yml",
  ".github/pull_request_template.md",
  ".github/workflows/build.yml",
  ".github/workflows/label-sync.yml",
  ".github/workflows/lint.yml",
  ".github/workflows/test.yml",
  ".gitignore",
  ".node-version",
  ".npmrc",
  ".nvmrc",
  "CONTRIBUTING.md",
  "LICENSE",
  "README.md",
  "docker-compose.yml",
  "package.json",
  "pnpm-workspace.yaml",
  "tsconfig.base.json",
  "turbo.json"
];

const requiredReadmes = [
  ".github/README.md",
  "apps/README.md",
  "apps/api/README.md",
  "apps/web/README.md",
  "config/README.md",
  "developer-ai/README.md",
  "developer-ai/00_CONTEXT/README.md",
  "developer-ai/01_STANDARDS/README.md",
  "developer-ai/02_PATTERNS/README.md",
  "developer-ai/03_PLAYBOOKS/README.md",
  "developer-ai/04_PROMPTS/README.md",
  "developer-ai/05_CHECKLISTS/README.md",
  "docker/README.md",
  "docs/README.md",
  "docs/00_INDEX/README.md",
  "docs/01_FOUNDATION/README.md",
  "docs/02_ARCHITECTURE/README.md",
  "docs/03_SPECIFICATIONS/README.md",
  "docs/04_IMPLEMENTATION/README.md",
  "docs/05_BOOTSTRAP/README.md",
  "examples/README.md",
  "infrastructure/README.md",
  "packages/README.md",
  "packages/acquisition/README.md",
  "packages/ai/README.md",
  "packages/application/README.md",
  "packages/config/README.md",
  "packages/database/README.md",
  "packages/domain/README.md",
  "packages/events/README.md",
  "packages/intelligence/README.md",
  "packages/shared/README.md",
  "packages/ui/README.md",
  "prompts/README.md",
  "schemas/README.md",
  "scripts/README.md"
];

const errors = [];

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function listMarkdownFiles(dir) {
  const absoluteDir = path.join(root, dir);
  if (!fs.existsSync(absoluteDir)) return [];
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const relativePath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdownFiles(relativePath);
    return entry.isFile() && entry.name.endsWith(".md") ? [relativePath] : [];
  });
}

function fail(message) {
  errors.push(message);
}

for (const file of requiredFoundationFiles) {
  if (!exists(file)) fail(`Missing foundation file: ${file}`);
}

for (const file of requiredReadmes) {
  if (!exists(file)) fail(`Missing README file: ${file}`);
}

const docsFiles = listMarkdownFiles("docs").filter((file) => path.basename(file) !== "README.md");
const developerAiFiles = listMarkdownFiles("developer-ai").filter((file) => path.basename(file) !== "README.md");
const markdownFiles = [
  ...docsFiles,
  ...developerAiFiles,
  "README.md",
  "CONTRIBUTING.md",
  "CHANGELOG.md",
  "RELEASE_NOTES.md",
  "CONVERSION_REPORT.md"
].filter(exists);

const markdownByBaseName = new Map();
for (const file of [...docsFiles, ...developerAiFiles, "README.md", "CHANGELOG.md", "RELEASE_NOTES.md", "CONVERSION_REPORT.md"]) {
  const baseName = path.basename(file);
  const entries = markdownByBaseName.get(baseName) ?? [];
  entries.push(file);
  markdownByBaseName.set(baseName, entries);
}

for (const file of docsFiles) {
  const match = file.match(/^docs\/(\d{2})_[^/]+\/(\d{2})-(\d{3})_.+\.md$/);
  if (!match) {
    fail(`Documentation file is not numbered correctly: ${file}`);
    continue;
  }
  if (match[1] !== match[2]) {
    fail(`Folder number does not match document number: ${file}`);
  }
  const firstLine = read(file).split(/\r?\n/, 1)[0];
  if (firstLine !== `# ${path.basename(file)}`) {
    fail(`First heading does not match file name: ${file}`);
  }
}

const docsBySection = new Map();
for (const file of docsFiles) {
  const match = file.match(/^docs\/(\d{2})_[^/]+\/\d{2}-(\d{3})_.+\.md$/);
  if (!match) continue;
  const entries = docsBySection.get(match[1]) ?? [];
  entries.push(Number(match[2]));
  docsBySection.set(match[1], entries);
}

for (const [section, numbers] of docsBySection.entries()) {
  const sorted = numbers.toSorted((a, b) => a - b);
  for (let index = 0; index < sorted.length; index += 1) {
    const expected = index + 1;
    if (sorted[index] !== expected) {
      fail(`Document numbering gap in docs section ${section}: expected ${String(expected).padStart(3, "0")}`);
      break;
    }
  }
}

function resolvesReference(reference) {
  const cleanReference = reference.replace(/[`)>\]}.,;:]+$/u, "");
  if (cleanReference.startsWith("http://") || cleanReference.startsWith("https://") || cleanReference.startsWith("#")) {
    return true;
  }
  if (cleanReference.startsWith("developer-ai/") || cleanReference.startsWith("docs/")) {
    return exists(cleanReference);
  }
  if (cleanReference.startsWith(".ai/")) {
    return false;
  }
  if (exists(cleanReference)) {
    return true;
  }
  const baseName = path.basename(cleanReference);
  if (markdownByBaseName.has(baseName)) {
    return true;
  }
  return [...markdownByBaseName.keys()].some((knownBaseName) => knownBaseName.endsWith(`_${baseName}`));
}

const referencePattern = /(?<![A-Za-z0-9_.-])(?:\.ai\/|developer-ai\/|docs\/)?[A-Za-z0-9_./-]+\.md/g;

for (const file of markdownFiles) {
  const content = read(file);
  for (const match of content.matchAll(referencePattern)) {
    const reference = match[0];
    if (!resolvesReference(reference)) {
      fail(`Broken Markdown reference in ${file}: ${reference}`);
    }
  }
  if (content.includes(".ai/")) {
    fail(`Legacy .ai path reference found in ${file}`);
  }
}

if (errors.length > 0) {
  console.error("Repository verification failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

const phase = process.argv.includes("--phase") ? process.argv[process.argv.indexOf("--phase") + 1] : "lint";
console.log(`Repository verification passed (${phase}).`);
