import { z } from "zod";

// Validointiskeema tiedostolle
export const FileValidationSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Tiedoston koko tulee olla alle 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "Vain JPEG, PNG ja WebP kuvat ovat sallittuja",
      },
    ),
});
