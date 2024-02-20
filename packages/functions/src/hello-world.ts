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

  const htmlContentBB = `<html lang="en">

  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our B&B</title>
      <link rel="stylesheet" type="text/css" href="css/styles.css">
      <script src="https://kit.fontawesome.com/358bdc84bc.js" crossorigin="anonymous"></script>
  </head>
  
  <body id="page-top">
      <header class="">
          <div class="container px-4 px-lg-5 h-10">
              <div class="row gx-4 gx-lg-5 h-10 align-items-center justify-content-center text-center">
  
                  <div class="col-lg-8 align-self-end">
                      <h1 class="section-heading mt-0" style="text-align: center;">St Thomas B&B</h1>
                      <hr class="divider light">
  
              </div>
          </div>
          <section class="page-section"> 
             
              </div>
          </div></section>
      </header>
  </body>
  
  </html>`

console.log(htmlContentBB);
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: htmlContentBB,
  };
}
