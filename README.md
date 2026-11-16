# printit-desktop

The Windows app that print shops ran for Printit. It received orders from students, downloaded their files, printed them, and reported each job's progress back as it happened.

Printit let students send documents to a print shop from their phone. They opened a web app, picked a shop by scanning the QR code on its counter or from a list of nearby shops, uploaded PDFs and chose color and copies for each page. The shop's Windows PC printed the order and reported progress back to the student's phone.

Printit is shelved. I built it between August 2025 and July 2026 and I'm not maintaining it any more.

## How it fits with the rest of Printit

| Repository | Part |
| --- | --- |
| [printit-cloud](https://github.com/VanshajSaxena/printit-cloud) | The API: shops, orders, file storage, live notifications |
| [printit-pwa](https://github.com/VanshajSaxena/printit-pwa) | The web app students used on their phones |
| printit-desktop (this one) | The Electron app shops ran on their Windows PC |
| [win-print-service](https://github.com/VanshajSaxena/win-print-service) | The Windows print service this app talks to |

The app signs the shop in to printit-cloud and keeps a Socket.IO connection open, so new orders show up straight away and the shop appears online to students. It downloads an order's files from Cloudflare R2 using signed URLs from the API. It starts win-print-service (bundled as `PrintService.exe`) when it launches and talks to it over HTTP on `localhost:5000` to list printers, spool jobs and poll the Windows print queue. Job status goes back to the API, which passes it on to the student.

It can also generate an A4 PDF with the shop's QR code to put up on the counter, and it has a small dashboard with numbers from the API.

I wrote about the project at [vanshajsaxena.com/projects/printit](https://vanshajsaxena.com/projects/printit/). Two posts cover this app and the service behind it: [A pure state machine in an Electron renderer](https://vanshajsaxena.com/posts/electron-state-machine/) and [the Windows print spooler](https://vanshajsaxena.com/posts/windows-print-spooler/).

## How it's built

Order handling in the renderer is a pure reducer. Events go in (a new order, a download finishing, a print queue poll result), and the reducer returns the new state plus a list of operations. An executor built on RxJS runs those operations (downloads, spooling, polling, reporting to the API) and turns their results into new events. The Electron post explains why, and how it decides whether a page actually came out of the printer.

The repository is a Yarn workspace with four packages:

- `packages/main`: the Electron main process. It starts the print service, holds the Socket.IO connection, stores credentials in the system keychain with keytar, and registers the `printit://` protocol.
- `packages/preload`: the bridge between the main process and the renderer.
- `packages/renderer`: the React UI.
- `packages/common`: typed clients for the print service and the notifications socket.

Stack: Electron 39, React 19, TypeScript, Vite, Tailwind CSS 4 with shadcn/ui and Radix, Zustand, TanStack Query with openapi-fetch, RxJS, pdf-lib and electron-builder. The API types are generated from printit-cloud's OpenAPI spec and win-print-service's Swagger document.

The project started from Alex Kozack's [vite-electron-builder](https://github.com/cawa-93/vite-electron-builder) template, which is MIT licensed. Its copyright notice is kept in [LICENSE](LICENSE).

## Releases and updates

`.github/workflows/build-and-publish.yml` built the app on a Windows runner whenever the `stable` or `unstable` branch was pushed. It downloaded a packed build of win-print-service from a private R2 bucket, built NSIS installers for x64 and ia32, and uploaded them with the update metadata to R2, served at `updates.printit.ink`. The two channels installed as separate apps, "Printit" and "Printit Unstable".

The app used to check that address for updates on every start. That code is gone: updates.printit.ink won't stay registered, and update signature verification was off, so whoever took the domain over could have pushed code to every shop that still had the app installed. The app no longer looks for updates, and the build config on `master` has no update feed.

## Screenshots

I don't have screenshots of this app. It ran on Windows PCs at the print shops that used Printit.

## Building

You need Node.js and Yarn 4 (through Corepack).

```sh
corepack enable
yarn install
yarn typecheck
yarn build
```

`yarn build` runs the Electron binary to read its Chrome and Node versions, so the downloaded Electron has to be able to run on your machine.

The API addresses are baked in at build time from `VITE_API_BASE_URL` (the API's host name, used over HTTPS) and `VITE_APP_BASE_URL` (the web app's host, used in the QR code). `VITE_DISTRIBUTION_CHANNEL` picks `stable` or `unstable`.

Packaging the installer (`yarn compile`) only ever ran on Windows in CI. It needs `buildResources/PrintService.exe`, which you build from [win-print-service](https://github.com/VanshajSaxena/win-print-service).

## License

MIT, see [LICENSE](LICENSE).
