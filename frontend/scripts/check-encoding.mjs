import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targets = ['src', 'index.html', '.env.example'];
const ignoredDirectories = new Set(['dist', 'node_modules']);
const checkedExtensions = new Set(['.css', '.html', '.js', '.json', '.md', '.txt']);
const checkedFilenames = new Set(['.env.example']);

const suspiciousSequences = [
  fromCodes(0x00c3, 0x00a1),
  fromCodes(0x00c3, 0x00a9),
  fromCodes(0x00c3, 0x00ad),
  fromCodes(0x00c3, 0x00b3),
  fromCodes(0x00c3, 0x00ba),
  fromCodes(0x00c3, 0x00b1),
  fromCodes(0x00c3, 0x00a7),
  fromCodes(0x00c2, 0x00bf),
  fromCodes(0x00c2, 0x00b7),
  String.fromCharCode(0xfffd)
];

const findings = [];

for (const target of targets) {
  await scanPath(path.join(rootDir, target));
}

if (findings.length) {
  console.error('Found text that looks like mojibake. Save files as UTF-8 and fix these lines:');
  findings.forEach(function (finding) {
    console.error(`${finding.relativePath}:${finding.lineNumber} ${finding.line}`);
  });
  process.exitCode = 1;
} else {
  console.log('Encoding check passed: no mojibake patterns found.');
}

async function scanPath(targetPath) {
  const fileStat = await getStat(targetPath);

  if (!fileStat) {
    return;
  }

  if (fileStat.isDirectory()) {
    await scanDirectory(targetPath);
    return;
  }

  if (shouldCheckFile(targetPath)) {
    await scanFile(targetPath);
  }
}

async function scanDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    await scanPath(path.join(directory, entry.name));
  }
}

async function scanFile(filePath) {
  const text = await readFile(filePath, 'utf8');
  const lines = text.split(/\r?\n/);

  lines.forEach(function (line, index) {
    if (suspiciousSequences.some(function (sequence) {
      return line.includes(sequence);
    })) {
      findings.push({
        relativePath: path.relative(rootDir, filePath).replaceAll(path.sep, '/'),
        lineNumber: index + 1,
        line
      });
    }
  });
}

function shouldCheckFile(filePath) {
  return checkedExtensions.has(path.extname(filePath)) || checkedFilenames.has(path.basename(filePath));
}

async function getStat(targetPath) {
  try {
    return await stat(targetPath);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

function fromCodes(...codes) {
  return String.fromCharCode(...codes);
}
