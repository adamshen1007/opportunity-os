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
const expectedPackageManager = "pnpm@11.7.0";
const expectedNodeEngine = ">=24 <25";
const expectedPnpmEngine = "11.7.0";
const expectedNodeVersion = "24";
const placeholderOnlyRoots = ["apps", "packages"];
const phase = process.argv.includes("--phase") ? process.argv[process.argv.indexOf("--phase") + 1] : "lint";
const phaseOneAliases = new Set(["review", "phase1", "phase-1", "phase-1-milestone-1", "shared-infrastructure"]);
const isPhaseOne = phaseOneAliases.has(phase);
const phaseOneImplementationRoot = "packages/config";
const prohibitedConfigDependencyPatterns = [
  /(^|[/@-])apps?($|[/@-])/iu,
  /(^|[/@-])api($|[/@-])/iu,
  /(^|[/@-])application($|[/@-])/iu,
  /(^|[/@-])acquisition($|[/@-])/iu,
  /(^|[/@-])connector(s)?($|[/@-])/iu,
  /(^|[/@-])ai($|[/@-])/iu,
  /(^|[/@-])workflow(s)?($|[/@-])/iu,
  /(^|[/@-])database($|[/@-])/iu,
  /(^|[/@-])domain($|[/@-])/iu,
  /(^|[/@-])business($|[/@-])/iu,
  /(^|[/@-])intelligence($|[/@-])/iu
];
const engineeringKitRequiredEnvironmentVariables = [
  "APP_NAME",
  "NODE_ENV",
  "PORT",
  "DATABASE_URL",
  "REDIS_URL",
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "OPENAI_MODEL",
  "ANTHROPIC_MODEL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "LOG_LEVEL",
  "OTEL_EXPORTER_ENDPOINT"
];
const engineeringKitOptionalEnvironmentVariables = [
  "SENTRY_DSN",
  "LANGFUSE_API_KEY",
  "LANGSMITH_API_KEY"
];

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readTrimmed(relativePath) {
  return read(relativePath).trim();
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

function listFiles(dir) {
  const absoluteDir = path.join(root, dir);
  if (!fs.existsSync(absoluteDir)) return [];
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const relativePath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(relativePath);
    return entry.isFile() ? [relativePath] : [];
  });
}

function fail(message) {
  errors.push(message);
}

function parseEnvExampleVariables(relativePath) {
  if (!exists(relativePath)) return [];

  return read(relativePath)
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line) => line.match(/^([A-Z][A-Z0-9_]*)=/u)?.[1])
    .filter(Boolean);
}

function parseExportedConstArray(relativePath, exportName) {
  if (!exists(relativePath)) return [];

  const content = read(relativePath);
  const match = content.match(new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s+as\\s+const`, "u"));
  if (!match) return [];

  return [...match[1].matchAll(/"([A-Z][A-Z0-9_]*)"/gu)].map((entry) => entry[1]);
}

function assertSameVariableSet(label, expectedVariables, actualVariables) {
  const expected = new Set(expectedVariables);
  const actual = new Set(actualVariables);

  for (const variableName of expected) {
    if (!actual.has(variableName)) {
      fail(`${label} is missing required variable name: ${variableName}`);
    }
  }

  for (const variableName of actual) {
    if (!expected.has(variableName)) {
      fail(`${label} contains undocumented variable name: ${variableName}`);
    }
  }
}

function assertNoDuplicateVariables(label, variables) {
  const seen = new Set();
  for (const variableName of variables) {
    if (seen.has(variableName)) {
      fail(`${label} contains duplicate variable name: ${variableName}`);
    }
    seen.add(variableName);
  }
}

for (const file of requiredFoundationFiles) {
  if (!exists(file)) fail(`Missing foundation file: ${file}`);
}

for (const file of requiredReadmes) {
  if (!exists(file)) fail(`Missing README file: ${file}`);
}

if (exists("package.json")) {
  try {
    const packageJson = JSON.parse(read("package.json"));
    if (packageJson.packageManager !== expectedPackageManager) {
      fail(`package.json packageManager must be "${expectedPackageManager}" but found "${packageJson.packageManager ?? "missing"}"`);
    }
    if (packageJson.engines?.node !== expectedNodeEngine) {
      fail(`package.json engines.node must be "${expectedNodeEngine}" but found "${packageJson.engines?.node ?? "missing"}"`);
    }
    if (packageJson.engines?.pnpm !== expectedPnpmEngine) {
      fail(`package.json engines.pnpm must be "${expectedPnpmEngine}" but found "${packageJson.engines?.pnpm ?? "missing"}"`);
    }
  } catch (error) {
    fail(`package.json must be valid JSON: ${error.message}`);
  }
}

for (const versionFile of [".node-version", ".nvmrc"]) {
  if (exists(versionFile) && readTrimmed(versionFile) !== expectedNodeVersion) {
    fail(`${versionFile} must contain "${expectedNodeVersion}" but found "${readTrimmed(versionFile)}"`);
  }
}

function isReadmePlaceholder(file) {
  return path.basename(file) === "README.md";
}

function isAllowedPhaseOneImplementationFile(file) {
  return file.startsWith(`${phaseOneImplementationRoot}/`) && !isReadmePlaceholder(file);
}

for (const placeholderRoot of placeholderOnlyRoots) {
  for (const file of listFiles(placeholderRoot)) {
    if (isReadmePlaceholder(file)) continue;
    if (isPhaseOne && isAllowedPhaseOneImplementationFile(file)) continue;

    const policyName = isPhaseOne
      ? `Phase 1 permits implementation files only inside "${phaseOneImplementationRoot}/"`
      : `Phase 0 placeholder directory "${placeholderRoot}/" may only contain README.md files`;
    fail(`${policyName}; found unauthorized file: ${file}`);
  }
}

const configPackageJsonPath = "packages/config/package.json";
if (exists(configPackageJsonPath)) {
  try {
    const configPackageJson = JSON.parse(read(configPackageJsonPath));
    const dependencyFields = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
    for (const dependencyField of dependencyFields) {
      const dependencies = configPackageJson[dependencyField] ?? {};
      for (const [dependencyName, dependencyVersion] of Object.entries(dependencies)) {
        const dependencyReference = `${dependencyName} ${dependencyVersion}`;
        if (prohibitedConfigDependencyPatterns.some((pattern) => pattern.test(dependencyReference))) {
          fail(`packages/config must not depend on apps, APIs, connectors, AI workflows, database, domain, intelligence, or business packages; found ${dependencyField}.${dependencyName}`);
        }
      }
    }
  } catch (error) {
    fail(`${configPackageJsonPath} must be valid JSON: ${error.message}`);
  }
}

const envExampleVariables = parseEnvExampleVariables(".env.example");
const schemaRequiredVariables = parseExportedConstArray("packages/config/src/schema.ts", "REQUIRED_ENVIRONMENT_VARIABLES");
const schemaOptionalVariables = parseExportedConstArray("packages/config/src/schema.ts", "OPTIONAL_ENVIRONMENT_VARIABLES");
const schemaVariables = [...schemaRequiredVariables, ...schemaOptionalVariables];
const engineeringKitEnvironmentVariables = [
  ...engineeringKitRequiredEnvironmentVariables,
  ...engineeringKitOptionalEnvironmentVariables
];

assertNoDuplicateVariables(".env.example", envExampleVariables);
assertNoDuplicateVariables("packages/config schema required variables", schemaRequiredVariables);
assertNoDuplicateVariables("packages/config schema optional variables", schemaOptionalVariables);
assertSameVariableSet(".env.example", engineeringKitEnvironmentVariables, envExampleVariables);
assertSameVariableSet("packages/config required environment schema", engineeringKitRequiredEnvironmentVariables, schemaRequiredVariables);
assertSameVariableSet("packages/config optional environment schema", engineeringKitOptionalEnvironmentVariables, schemaOptionalVariables);
assertSameVariableSet("packages/config schema and .env.example", envExampleVariables, schemaVariables);

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

console.log(`Repository verification passed (${phase}).`);
