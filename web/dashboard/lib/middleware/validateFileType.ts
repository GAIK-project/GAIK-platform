export const acceptedTypes = {
  pdf: ["application/pdf"],
  images: ["image/jpeg", "image/png", "image/gif"],
  excel: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  document: [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  text: ["text/plain"],
};

export const getFileCategory = (
  mime: string,
): keyof typeof acceptedTypes | null => {
  for (const [key, types] of Object.entries(acceptedTypes)) {
    if (types.includes(mime)) return key as keyof typeof acceptedTypes;
  }
  return null;
};
