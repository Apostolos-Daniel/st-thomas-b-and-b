import { main } from "./hello-world";
import { describe, it, expect } from "vitest";
import { eventJSON, event } from "./mocks/event-data";

describe("when hello-world function is called, then log X is logged", () => {
  it("returns a 200 status code and the correct HTML content", async () => {

    const result = await main(eventJSON);

    expect(result.statusCode).toBe(200);
    expect(result.headers).toEqual({ "Content-Type": "text/html" });
    expect(result.body).toContain("<h3>Hello, World!</h3>");
  });
});


describe("hello-world", () => {
    it("returns a 200 status code and the correct HTML content", async () => {
      const result = await main(event);
  
      expect(result.statusCode).toBe(200);
      expect(result.headers).toEqual({ "Content-Type": "text/html" });
      expect(result.body).toContain("<h3>Hello, World!</h3>");
    });
  });