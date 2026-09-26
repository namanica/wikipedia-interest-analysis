import { access, constants, mkdir } from "node:fs/promises";
import { homedir, platform, tmpdir } from "node:os";
import { join } from "node:path";
import packageJson from "#package.json" with { type: "json" };
import { CACHE_DIR_ENV } from "../constants/index.js";

const PLATFORM = { MAC: "darwin", WINDOWS: "win32" };

const getSystemCacheRoot = () => {
  const home = homedir();
  const { LOCALAPPDATA, XDG_CACHE_HOME } = process.env;

  if (platform() === PLATFORM.MAC) {
    return join(home, "Library", "Caches");
  }

  if (platform() === PLATFORM.WINDOWS) {
    return LOCALAPPDATA || join(home, "AppData", "Local");
  }

  return XDG_CACHE_HOME || join(home, ".cache");
};

const isWritableDir = async (dir) => {
  try {
    await mkdir(dir, { recursive: true });
    await access(dir, constants.W_OK);

    return true;
  } catch {
    return false;
  }
};

export const resolveCacheDir = async () => {
  const systemRoot = getSystemCacheRoot();
  const preferredDir =
    process.env[CACHE_DIR_ENV] || join(systemRoot, packageJson.name);
  const isPreferredWritable = await isWritableDir(preferredDir);

  if (isPreferredWritable) {
    return preferredDir;
  }

  const fallbackDir = join(tmpdir(), packageJson.name);

  await mkdir(fallbackDir, { recursive: true });

  return fallbackDir;
};
