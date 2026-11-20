// Regles de mot de passe partagees entre l'inscription et les changements de mot de passe.
// La meme regle est verifiee cote backend (App\Security\PasswordPolicy).
export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_HINT =
  "At least 8 characters, including a letter and a number";

export function validatePassword(password) {
  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  if (!/[A-Za-z]/.test(password)) {
    return "Password must contain a letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain a number";
  }
  return null;
}
