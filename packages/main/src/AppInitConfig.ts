export interface AppInitConfig {
  preload: {
    path: string;
    protocol: string;
  };

  renderer:
    | {
        path: string;
      }
    | URL;
}
