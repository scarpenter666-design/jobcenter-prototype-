import { describe, expect, test } from "vitest";
import { getPublicAssetUrl } from "./assets";

describe("getPublicAssetUrl", () => {
  test("prefixes public assets with the configured Vite base path", () => {
    expect(getPublicAssetUrl("jobcenter-harburg-logo.png", "/jobcenter-app-prototype-claude/")).toBe(
      "/jobcenter-app-prototype-claude/jobcenter-harburg-logo.png"
    );
  });

  test("keeps local root base paths readable", () => {
    expect(getPublicAssetUrl("jobcenter-harburg-logo.png", "/")).toBe("/jobcenter-harburg-logo.png");
  });
});
