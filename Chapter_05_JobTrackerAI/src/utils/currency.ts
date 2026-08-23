export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  placeholder: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  {
    code: 'INR',
    symbol: '₹',
    name: 'Rupees (₹)',
    placeholder: 'e.g. ₹15 LPA or ₹12,00,000 - ₹18,00,000',
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar ($)',
    placeholder: 'e.g. $140,000 - $165,000',
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (€)',
    placeholder: 'e.g. €75,000 - €95,000',
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound (£)',
    placeholder: 'e.g. £65,000 - £85,000',
  },
  {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar (C$)',
    placeholder: 'e.g. C$120,000 - C$145,000',
  },
  {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar (S$)',
    placeholder: 'e.g. S$110,000 - S$130,000',
  },
  {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham (AED)',
    placeholder: 'e.g. AED 25,000/mo',
  },
];

/**
 * Returns the detected or chosen currency symbol for display.
 * Default is '₹' if unspecified or INR.
 */
export const getCurrencySymbol = (currencyCode?: string, salaryText?: string): string => {
  if (currencyCode === 'USD') return '$';
  if (currencyCode === 'EUR') return '€';
  if (currencyCode === 'GBP') return '£';
  if (currencyCode === 'CAD') return 'C$';
  if (currencyCode === 'SGD') return 'S$';
  if (currencyCode === 'AED') return 'AED';
  if (currencyCode === 'INR') return '₹';

  // Fallback checks on salary string
  if (salaryText) {
    if (salaryText.includes('$')) return '$';
    if (salaryText.includes('€')) return '€';
    if (salaryText.includes('£')) return '£';
    if (salaryText.includes('C$')) return 'C$';
    if (salaryText.includes('S$')) return 'S$';
    if (salaryText.includes('AED')) return 'AED';
    if (salaryText.includes('₹') || salaryText.toLowerCase().includes('lpa') || salaryText.toLowerCase().includes('lakh')) return '₹';
  }

  return '₹'; // Default to Indian Rupee (₹)
};

/**
 * Formats a salary string with the correct currency prefix for display across cards, tables, and drawers.
 */
export const formatDisplaySalary = (salary?: string, currencyCode?: string): string => {
  if (!salary || !salary.trim()) return '';
  const trimmed = salary.trim();

  // If already starts with a symbol, respect it
  if (
    trimmed.startsWith('₹') ||
    trimmed.startsWith('$') ||
    trimmed.startsWith('€') ||
    trimmed.startsWith('£') ||
    trimmed.startsWith('C$') ||
    trimmed.startsWith('S$') ||
    trimmed.startsWith('AED')
  ) {
    return trimmed;
  }

  const symbol = getCurrencySymbol(currencyCode, trimmed);
  return `${symbol} ${trimmed}`;
};
