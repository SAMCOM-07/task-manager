import sanitizeHtml from "sanitize-html";

// Decode HTML entities
const decodeHtmlEntities = (text: string): string => {
  const entities: { [key: string]: string } = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
  };
  
  return text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (match) => entities[match] || match);
};

export const sanitizer = (parsedData: any) => {
  for (const [key, value] of Object.entries(parsedData)) {
    if (typeof value === "string") {
      const sanitized = sanitizeHtml(value, {
        allowedTags: ["b"], // No HTML tags allowed
        allowedAttributes: {}, // No attributes allowed
      });
      // Decode HTML entities after sanitization
      parsedData[key] = decodeHtmlEntities(sanitized);
    } else {
      parsedData[key] = value;
    }
  }
  return parsedData;
};
