const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[1-9]\d{9,14}$/;
const namePattern = /^[A-Za-z][A-Za-z\s'-]*[A-Za-z]$|^[A-Za-z]$/;

export function normalizePhone(value: string) {
  return value.trim().replace(/[\s()-]/g, "");
}

export function validateRequiredText(value: string, label: string, minLength = 2, maxLength = 80) {
  const trimmed = value.trim();

  if (!trimmed) {
    return `${label} is required.`;
  }

  if (trimmed.length < minLength) {
    return `${label} must be at least ${minLength} characters.`;
  }

  if (trimmed.length > maxLength) {
    return `${label} must be ${maxLength} characters or fewer.`;
  }

  return "";
}

export function validatePersonName(value: string, label: string) {
  const trimmed = value.trim();

  const requiredMessage = validateRequiredText(trimmed, label);
  if (requiredMessage) {
    return requiredMessage;
  }

  return namePattern.test(trimmed) ? "" : `${label} can only contain letters, spaces, apostrophes, and hyphens.`;
}

export function validateEmail(value: string, { required = false } = {}) {
  const trimmed = value.trim();

  if (!trimmed) {
    return required ? "Email is required." : "";
  }

  return emailPattern.test(trimmed) ? "" : "Enter a valid email address.";
}

export function validatePhone(value: string) {
  const normalized = normalizePhone(value);

  if (!normalized) {
    return "Phone number is required.";
  }

  return phonePattern.test(normalized) ? "" : "Enter a valid phone number with 10 to 15 digits.";
}

export function validateNumber(
  value: string,
  label: string,
  {
    min = 0,
    integer = false,
    required = true,
  }: {
    min?: number;
    integer?: boolean;
    required?: boolean;
  } = {},
) {
  const trimmed = value.trim();

  if (!trimmed) {
    return required ? `${label} is required.` : "";
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    return `${label} must be a valid number.`;
  }

  if (parsed < min) {
    return `${label} must be at least ${min}.`;
  }

  if (integer && !Number.isInteger(parsed)) {
    return `${label} must be a whole number.`;
  }

  return "";
}

export function validateUrl(value: string, label: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return `${label} is required.`;
  }

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:" ? "" : `${label} must use http or https.`;
  } catch {
    return `Enter a valid ${label.toLowerCase()}.`;
  }
}
