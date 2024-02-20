import replaceContent from "./replace-content";
import { it, expect } from "vitest";

it("replaces the content correctly", () => {
  const originalHtmlContent = "This is the original-content";
  const expectedHtmlContent = "This is the new-content";
  
  const result = replaceContent(originalHtmlContent);
  
  expect(result).toEqual(expectedHtmlContent);
});

it("does not modify the content if the original content is not found", () => {
  const originalHtmlContent = "This is some other content";
  
  const result = replaceContent(originalHtmlContent);
  
  expect(result).toEqual(originalHtmlContent);
});