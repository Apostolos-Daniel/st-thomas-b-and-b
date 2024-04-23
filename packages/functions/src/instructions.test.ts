import { main } from "../src/instructions";
import { describe, it, expect, vi}  from "vitest";
const mockedEvent = require('./mocks/api-gateway-v2.json'); // Assuming your mock event is saved in this file
import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { Config } from "sst/node/config";


describe("instructions authorization", () => {
it("returns 401 Unauthorized if Authorization header is missing", async () => {

    const result = await main(mockedEvent) as APIGatewayProxyStructuredResultV2;

    expect(result.statusCode).toBe(401);
    expect(result.headers).toEqual({ "WWW-Authenticate": "Basic" });
    expect(result.body).toBe("Unauthorized");
});

  it("returns 401 Unauthorized if Authorization header is incorrect", async () => {
    mockedEvent.headers.Authorization = "Bearer invalidToken"; // Replace with an invalid token
    const result = await main(mockedEvent) as APIGatewayProxyStructuredResultV2;

    expect(result.statusCode).toBe(401);
    expect(result.headers).toEqual({ "WWW-Authenticate": "Basic" });
    expect(result.body).toBe("Unauthorized");
  });

  // it("returns 200 if Authorization header is correct", async () => {
  //   Config.ST_THOMAS_B_AND_B_INSTRUCTIONS_SECRET_BASE64 = "base64EncodedCredentials"; // Replace with the correct credentials
  //   mockedEvent.headers.Authorization = "Bearer base64EncodedCredentials"; // Replace with an invalid token
  //   // Mock the S3 client and its responses
  //   const s3ClientMock = {
  //       send: vi.fn().mockResolvedValueOnce({ Body: "originalHtmlContent" }),
  //   };
  //   const getSignedUrlMock = vi.fn().mockResolvedValueOnce("signedUrlCss");

  //   // Replace the original functions with the mocks
  //   vi.mock("aws-sdk/clients/s3", () => ({
  //     S3: vi.fn().mockImplementation(() => s3ClientMock),
  //   }));
  //   vi.mock("../src/utils", () => ({
  //     getSignedUrl: getSignedUrlMock,
  //   }));

  //   const result = await main(mockedEvent) as APIGatewayProxyStructuredResultV2;

  //   expect(result.statusCode).toBe(200);
  //   expect(result.headers).toEqual({ "Content-Type": "text/html" });
  //   // expect(result.body).toBe("modifiedHtmlContent");
  //   // expect(getSignedUrlMock).toHaveBeenCalledTimes(2);
  //   // expect(getSignedUrlMock).toHaveBeenCalledWith(s3ClientMock, expect.any(Object), { expiresIn: 3600 });
  //   // expect(s3ClientMock.send).toHaveBeenCalledTimes(1);
  //   // expect(s3ClientMock.send).toHaveBeenCalledWith(expect.any(Object));
  // });
});