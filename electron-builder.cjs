const { join } = require('node:path');
const { execSync } = require('node:child_process');
const pkg = require('./package.json');

/**
 * Reads the "files" property from each workspace's package.json
 * to determine which files should be included in the final build.
 */
function getListOfFilesFromEachWorkspace() {
  const workspaces = execSync('yarn workspaces list --json', {
    encoding: 'utf-8',
  })
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line))
    .filter((workspace) => workspace.location !== '.');

  const allFilesToInclude = [];

  for (const { name, location } of workspaces) {
    // Construct an absolute path to require the workspace package.json
    const pkgPath = join(process.cwd(), location, 'package.json');
    const workspacePkg = require(pkgPath);

    // Default to including 'dist/**' and 'package.json' if 'files' is not specified.
    let patterns = workspacePkg.files || ['dist/**', 'package.json'];
    patterns = patterns.map((p) => join('node_modules', name, p));
    allFilesToInclude.push(...patterns);
  }

  return allFilesToInclude;
}

/** @type import('electron-builder').Configuration */
const config = {
  directories: {
    output: 'dist',
    buildResources: 'buildResources',
  },
  generateUpdatesFilesForAllChannels: true,
  linux: {
    target: ['deb'],
  },
  artifactName: '${productName}-${version}-${os}-${arch}.${ext}',
  files: [
    'LICENSE*',
    pkg.main,
    '!node_modules/@app/**',
    ...getListOfFilesFromEachWorkspace(),
  ],
  extraFiles: [
    { from: 'buildResources/PrintService.exe', to: 'PrintService.exe' },
  ],
};

module.exports = config;
