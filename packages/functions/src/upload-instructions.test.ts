import { main } from "./upload-instructions";
import { it, expect } from "vitest";

it("html file uploaded successfully", async () => {
  const event = {
    "id": "1234",
    "detail-type": "ManualUpload",
    "source": "aws.s3",
    "account": "123456789012",
    "time": "2022-01-01T12:00:00Z",
    "region": "us-east-1",
    "resources": [],
    "detail": {
      "bucket": "manual-uploads-bucket",
      "key": "original/test.html"
    }
  };
  const response = await main(event);
  expect(response.statusCode).toBe(200);
  expect(response.body).toContain("File uploaded successfully");
} );