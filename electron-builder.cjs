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

const channel = process.env.VITE_DISTRIBUTION_CHANNEL ?? "unstable";
const isStable = channel === "stable";

const appId = isStable ? "ink.printit.desktop" : "ink.printit.desktop.unstable";

const productName = isStable ? "Printit" : "Printit Unstable";

const executableName = isStable ? "Printit" : "PrintitUnstable";
const artifactName = isStable
  ? "Printit-latest-${os}-${arch}.${ext}"
  : "Printit-${version}-${os}-${arch}.${ext}";
const shortcutName = isStable
  ? "Printit Desktop"
  : "Printit Desktop (Unstable)";
/** @type import('electron-builder').Configuration */
const config = {
  artifactName,
  productName,
  appId,
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
    oneClick: isStable,
    perMachine: false,
    allowToChangeInstallationDirectory: false,
    deleteAppDataOnUninstall: false,
    createDesktopShortcut: true,
    buildUniversalInstaller: false,
    shortcutName,
  },
  win: {
    executableName,
    verifyUpdateCodeSignature: false,
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
  files: [
    pkg.main,
    "!node_modules/@app/**",
    ...getListOfFilesFromEachWorkspace(),
  ],
  extraResources: [
    { from: "buildResources/PrintService.exe", to: "PrintService.exe" },
    { from: "buildResources/scan-to-print.png", to: "scan-to-print.png" },
  ],
};

module.exports = config;
