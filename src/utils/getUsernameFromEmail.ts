export function getUsernameFromEmail(email: string) {
  const [name] = email.split('@');
  return name;
}
