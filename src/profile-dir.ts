import { homedir } from "node:os";
import { resolve } from "node:path";

/** Default profile folder name under the user home directory. */
export const DEFAULT_PROFILE_DIR_NAME = ".mcp-me";

/** Environment variable override for the profile directory. */
export const PROFILE_DIR_ENV = "MCP_ME_PROFILE_DIR";

/** Default profile path: `~/.mcp-me`. */
export function getDefaultProfileDir(): string {
  return resolve(homedir(), DEFAULT_PROFILE_DIR_NAME);
}

/**
 * Resolve the profile directory.
 * Priority: CLI argument → MCP_ME_PROFILE_DIR env var → ~/.mcp-me
 */
export function resolveProfileDir(cliArg?: string): string {
  if (cliArg) {
    return resolve(cliArg);
  }
  const envDir = process.env[PROFILE_DIR_ENV];
  if (envDir) {
    return resolve(envDir);
  }
  return getDefaultProfileDir();
}
