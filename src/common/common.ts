import handlebars from "handlebars";
import * as path from "path";
import * as fs from "fs";
import { Readable } from "stream";
import puppeteer from "puppeteer-core";
const chromium = require("@sparticuz/chromium");

export function extractUsername(email: string) {
  const parts = email.split("@");
  return parts[0];
}

export function extractTaggedUsers(tweetContent: string) {
  const regex = /@(\w+)/g;
  return (tweetContent.match(regex) || []).map((match: any) => match.slice(1));
}

export function validateEmail(email: string) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export function validatePhoneNumber(phoneNumber: string) {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phoneNumber);
}

export async function generateHTMLFromTemplate(
  data: any,
  template: any,
  type?: any
) {
  try {
    const filePath = "src/hbs-templates";
    let htmlTemplate: any;
    htmlTemplate = fs.readFileSync(
      path.resolve(filePath, `${template}.hbs`),
      "utf8"
    );
    const compiledTemplate = handlebars.compile(htmlTemplate);
    return compiledTemplate(data);
  } catch (error) {
    console.log({ error });
  }
}

export async function generatePdfFromTemplate(
  data: any,
  template: string,
  type?: string
): Promise<Readable> {
  let browser: any = null;
  try {
    const filePath = "src/hbs-templates";
    const templatePath = path.resolve(filePath, `${template}.hbs`);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }
    const htmlTemplate = fs.readFileSync(templatePath, "utf8");
    const compiledTemplate = await handlebars.compile(htmlTemplate);
    const html = await compiledTemplate(data);

    browser = await puppeteer.launch({
      args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      executablePath:
        process.env.CHROME_PATH ||
        (await chromium.executablePath()) ||
        "/usr/bin/google-chrome-stable",
      headless: true,
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);

    // Enable request interception to handle local resources
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      // Allow all requests
      request.continue();
    });

    await page.setContent(html, {
      waitUntil: "networkidle0", // Wait for all network requests to finish
      timeout: 60000,
    });

    // Optional: Wait for any lazy-loaded images
    await page.evaluate(async () => {
      const selectors = Array.from(document.querySelectorAll("img"));
      await Promise.all(
        selectors.map((img) => {
          if (img.complete) return;
          return new Promise((resolve, reject) => {
            img.addEventListener("load", resolve);
            img.addEventListener("error", reject);
          });
        })
      );
    });

    const pdfBuffer: Buffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "20mm",
        right: "20mm",
      },
      preferCSSPageSize: true,
    });

    const bufferToStream = new Readable();
    bufferToStream.push(pdfBuffer);
    bufferToStream.push(null);
    return bufferToStream;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
