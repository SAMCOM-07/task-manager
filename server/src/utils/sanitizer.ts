import sanitizeHtml from "sanitize-html";

export const sanitizer = (parsedData: any) => {
  for (const [key, value] of Object.entries(parsedData)) {
    if (typeof value === "string") {
      parsedData[key] = sanitizeHtml(value, {
        allowedTags: ["b"], // No HTML tags allowed
        allowedAttributes: {}, // No attributes allowed
      });
    } else {
      parsedData[key] = value;
    }
  }
  return parsedData;
};
