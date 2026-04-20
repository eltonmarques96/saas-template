export const locales = ['pt', 'en', 'es', 'fr', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt';

export function getMessages(locale: Locale) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(`../../messages/${locale}.json`);
}
