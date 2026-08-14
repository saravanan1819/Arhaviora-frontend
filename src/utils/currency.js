export const formatINR = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`;

export const formatItemPrice = (value) => `₹${Number(value || 0)}`;

export const formatCartTitle = (title = '') => {
  if (!title) return '';
  if (title.includes('\n')) return title.replace(/\n+/g, '\n').trim();
  return title.replace(/^(.*\bBaby)\s+(Blanket\b.*)$/i, '$1\n$2');
};

export const flatTitle = (title = '') => title.replace(/\n/g, ' ').trim();
