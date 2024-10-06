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