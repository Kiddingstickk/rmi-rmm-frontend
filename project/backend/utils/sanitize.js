import sanitizeHtml from 'sanitize-html';
import Filter from 'bad-words';

const filter = new Filter();

export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';

  // Step 1: Strip HTML
  const cleanHtml = sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
    transformTags: {
      'script': () => ({ tagName: 'noscript' }),
    },
    textFilter: (input) => input.trim(),
  });

  // Step 2: Filter profanity
  const cleanText = filter.clean(cleanHtml);

  return cleanText;
};