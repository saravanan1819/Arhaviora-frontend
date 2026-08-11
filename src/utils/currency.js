export const formatINR = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`;

export const formatItemPrice = (value) => `₹${Number(value || 0)}`;

/** Two-line cart title: line1 + line2 (API can send title with `\n`). */
export const formatCartTitle = (title = '') => {
  if (!title) return '';
  if (title.includes('\n')) return title.replace(/\n+/g, '\n').trim();
  // "… Baby Blanket" → "… Baby\nBlanket"
  return title.replace(/^(.*\bBaby)\s+(Blanket\b.*)$/i, '$1\n$2');
};

export const flatTitle = (title = '') => title.replace(/\n/g, ' ').trim();
