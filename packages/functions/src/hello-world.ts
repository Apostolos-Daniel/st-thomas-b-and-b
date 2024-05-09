import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
export const main = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//export async function main(event: APIGatewayProxyEvent) {
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


type Person = {
  name: string;
  age: number;
}

const personF = (person: Person) => {
  return person;
};

personF({ name: "John", age: 30 });

const person = {
  name: "John",
  age: 30
} as Person;