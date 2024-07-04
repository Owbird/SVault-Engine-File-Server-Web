interface SVFile {
  name: string;
  is_dir: boolean;
  size: number;
}

interface Config {
  server: {
    name: string;
    allow_uploads: boolean
  };
}
