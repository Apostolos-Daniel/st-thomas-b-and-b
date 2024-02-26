import { APIGatewayProxyEvent } from "aws-lambda";

export async function main(event: APIGatewayProxyEvent) {
  const htmlContent = `
    <html>
      <head><title>Page Title</title></head>
      <body>
        <h3>Hello, World!</h3>
      </body>
    </html>
  `;

  console.log(`hello world: ${event.headers}`);
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: htmlContent,
  };
}
