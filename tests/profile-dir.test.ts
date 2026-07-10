import { describe, it, expect, afterEach } from "vitest";
import {
  DEFAULT_PROFILE_DIR_NAME,
  PROFILE_DIR_ENV,
  getDefaultProfileDir,
  resolveProfileDir,
} from "../src/profile-dir.js";
import { homedir } from "node:os";
import { resolve } from "node:path";

describe("profile-dir", () => {
  const originalEnv = process.env[PROFILE_DIR_ENV];

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env[PROFILE_DIR_ENV];
    } else {
      process.env[PROFILE_DIR_ENV] = originalEnv;
    }
  });

  it("getDefaultProfileDir returns ~/.mcp-me", () => {
    expect(getDefaultProfileDir()).toBe(resolve(homedir(), DEFAULT_PROFILE_DIR_NAME));
  });

  it("resolveProfileDir prefers CLI argument", () => {
    process.env[PROFILE_DIR_ENV] = "/env/profile";
    expect(resolveProfileDir("./my-profile")).toBe(resolve("./my-profile"));
  });

  it("resolveProfileDir uses MCP_ME_PROFILE_DIR when no CLI arg", () => {
    process.env[PROFILE_DIR_ENV] = "/custom/profile";
    expect(resolveProfileDir()).toBe(resolve("/custom/profile"));
  });

  it("resolveProfileDir falls back to default when no CLI arg or env", () => {
    delete process.env[PROFILE_DIR_ENV];
    expect(resolveProfileDir()).toBe(getDefaultProfileDir());
  });
});
