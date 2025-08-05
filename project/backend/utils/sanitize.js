import sanitizeHtml from 'sanitize-html';

export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';

  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
    transformTags: {
      'script': () => ({ tagName: 'noscript' }),
    },
    textFilter: (input) => input.trim(),
  });
};