const { join } = require("node:path");
const { execSync } = require("node:child_process");
const pkg = require("./package.json");

/**
 * Reads the "files" property from each workspace's package.json
 * to determine which files should be included in the final build.
 */
function getListOfFilesFromEachWorkspace() {
  const workspaces = execSync("yarn workspaces list --json", {
    encoding: "utf-8",
  })
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line))
    .filter((workspace) => workspace.location !== ".");

  const allFilesToInclude = [];

  for (const { name, location } of workspaces) {
    // Construct an absolute path to require the workspace package.json
    const pkgPath = join(process.cwd(), location, "package.json");
    const workspacePkg = require(pkgPath);

    // Default to including 'dist/**' and 'package.json' if 'files' is not specified.
    let patterns = workspacePkg.files || ["dist/**", "package.json"];
    patterns = patterns.map((p) => join("node_modules", name, p));
    allFilesToInclude.push(...patterns);
  }

  return allFilesToInclude;
}

const channel = process.env.VITE_DISTRIBUTION_CHANNEL || "stable";
/** @type import('electron-builder').Configuration */
const config = {
  productName: "Printit",
  appId: "ink.printit.desktop",
  publish: {
    provider: "generic",
    url: `https://updates.printit.ink/${channel}`,
    channel,
  },
  protocols: [
    {
      name: "Printit",
      schemes: ["printit"],
    },
  ],
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
    createDesktopShortcut: true,
    shortcutName: "Printit Desktop",
    buildUniversalInstaller: false,
  },
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64", "ia32"],
      },
    ],
  },
  directories: {
    output: "dist",
    buildResources: "buildResources",
  },
  generateUpdatesFilesForAllChannels: true,
  artifactName: "${productName}-${version}-${os}-${arch}.${ext}",
  files: [
    "LICENSE*",
    pkg.main,
    "!node_modules/@app/**",
    ...getListOfFilesFromEachWorkspace(),
  ],
  extraResources: [
    { from: "buildResources/PrintService.exe", to: "PrintService.exe" },
  ],
};

module.exports = config;
