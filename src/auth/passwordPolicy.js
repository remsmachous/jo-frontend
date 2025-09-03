export function validatePassword(pw) {
  const common = ["password", "123456", "azerty", "qwerty", "admin"];
  const errors = [];
  if (pw.length < 12) errors.push("Au moins 12 caractères.");
  if (!/[a-z]/.test(pw)) errors.push("Au moins une minuscule.");
  if (!/[A-Z]/.test(pw)) errors.push("Au moins une majuscule.");
  if (!/[0-9]/.test(pw)) errors.push("Au moins un chiffre.");
  if (!/[!@#$%^&*()\-_=+\[\]{};:'",.<>/?]/.test(pw)) errors.push("Au moins un caractère spécial.");
  if (/\s/.test(pw)) errors.push("Aucun espace.");
  if (common.some(c => pw.toLowerCase().includes(c))) errors.push("Mot de passe trop commun.");
  return { ok: errors.length === 0, errors };
}