export const acceptedTypes = {
    pdf: ['application/pdf'],
    images: ['image/jpeg', 'image/png', 'image/gif'],
    excel: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    text: ['text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  }
  
  export const getFileCategory = (mime: string): keyof typeof acceptedTypes | null => {
    for (const [key, types] of Object.entries(acceptedTypes)) {
      if (types.includes(mime)) return key as keyof typeof acceptedTypes
    }
    return null
  }
  