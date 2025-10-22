import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a string into title case.
 * Each segment split by " - " is separately title-cased.
 *
 * @param str - The input string to be converted.
 * @returns The title-cased string with proper formatting.
 */
export function toTitleCase(str?: string): string {
  if (!str) return '';

  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formats a date string or number into a localized date string.
 *
 * @param date - The date to format. This can be a Date object, a string representation of a date, or a number representing a timestamp.
 * @param opts - Optional Intl.DateTimeFormatOptions to customize the formatting.
 * @returns A formatted date string, or an empty string if the input is invalid.
 */
export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {},
) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts,
    }).format(new Date(date));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    return '';
  }
}
