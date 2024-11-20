import handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';

export function extractUsername(email: string) {
  const parts = email.split('@');
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

export async function generatePdfFromTemplate(
  data: any,
  template: any,
  type?: any,
) {
  try {
    const filePath = 'src/hbs-templates';
    let htmlTemplate: any;
    htmlTemplate = fs.readFileSync(
      path.resolve(filePath, `${template}.hbs`),
      'utf8',
    );
    const compiledTemplate = handlebars.compile(htmlTemplate);
    return compiledTemplate(data);
  } catch (error) {
    console.log({ error })
  }
}