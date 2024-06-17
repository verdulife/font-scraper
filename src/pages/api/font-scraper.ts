import type { APIRoute } from 'astro';
import playwright from "playwright";

export const POST: APIRoute = async ({ request }) => {
  const json = await request.json();
  const url = json.url;
  const browser = await playwright["chromium"].launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url);

  const fonts: string[] = [];

  page.on("request", request => {
    if (request.resourceType() === "font") {
      fonts.push(request.url());
    }
  });

  await page.goto(url);
  await page.waitForSelector("body");
  await browser.close();

  return new Response(
    JSON.stringify({ fonts })
  );
};