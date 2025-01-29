/* eslint-disable @typescript-eslint/no-unused-vars */
import "server-only";

interface FileChunk {
  id: string;
  filePath: string;
  content: string;
  embedding: number[];
}

// Mock data for development
const MOCK_FILES = [
  {
    pathname: "example1.pdf",
    url: "mock-url-1",
    uploadedAt: new Date().toISOString(),
  },
  {
    pathname: "example2.pdf",
    url: "mock-url-2",
    uploadedAt: new Date().toISOString(),
  },
];

export async function insertChunks({ chunks }: { chunks: FileChunk[] }) {
  // Mock-versio joka vain logaa
  console.log("Inserting chunks:", chunks);
  return { success: true };

  /* Oikea toteutus kommentoituna:
  try {
    const { data, error } = await supabase
      .from('file_chunks')
      .insert(chunks);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error inserting chunks:', error);
    throw error;
  }
  */
}

// Tiedostojen listaus
export async function listFiles({ userEmail }: { userEmail: string }) {
  // Mock-versio development-käyttöön
  return MOCK_FILES;

  /* Oikea toteutus kommentoituna:
  try {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_email', userEmail);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
  */
}

// Tiedoston poisto
export async function deleteFile({ filePath }: { filePath: string }) {
  // Mock-versio
  console.log("Deleting file:", filePath);
  return { success: true };

  /* Oikea toteutus kommentoituna:
  try {
    // Poista ensin chunkit
    const { error: chunksError } = await supabase
      .from('file_chunks')
      .delete()
      .eq('file_path', filePath);

    if (chunksError) throw chunksError;

    // Poista sitten tiedoston metadata
    const { error: fileError } = await supabase
      .from('files')
      .delete()
      .eq('path', filePath);

    if (fileError) throw fileError;

    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
  */
}
