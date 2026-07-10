import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

export function findPackageRoot(startDir: string): string {
  let current = startDir;
  for (;;) {
    if (existsSync(join(current, "package.json"))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) {
      throw new Error(`Could not locate package.json above ${startDir}`);
    }
    current = parent;
  }
}
