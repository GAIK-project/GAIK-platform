import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/utils/functions";
import { AlertCircle, FileIcon, LoaderIcon, TrashIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { useOnClickOutside } from "usehooks-ts";

interface FileData {
  pathname: string;
  url: string;
}

interface RAGFilesProps {
  isVisible: boolean;
  onClose: () => void;
}

export function RAGFiles({ isVisible, onClose }: RAGFilesProps) {
  // Ref tiedostojen input-elementille
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Ref modaalin ulkopuolelle klikkauksen tunnistamiseen
  const drawerRef = useRef<HTMLDivElement | null>(
    null,
  ) as React.RefObject<HTMLDivElement>;

  // Tilanhallinnat tiedostojen lataus- ja poistoprosesseille
  const [uploadQueue, setUploadQueue] = useState<string[]>([]); // Latausjonossa olevat tiedostot
  const [deleteQueue, setDeleteQueue] = useState<string[]>([]); // Poistoprosessissa olevat tiedostot

  // SWR hook hakee ja ylläpitää tiedostolistaa automaattisesti
  const {
    data: files, // Nykyinen tiedostolista
    mutate, // Funktio listan manuaaliseen päivittämiseen
    isLoading, // Lataustilamuuttuja
    error, // Mahdollinen virhetilanne
  } = useSWR<FileData[]>("/api/files/list/", fetcher, {
    fallbackData: [], // Oletusarvo ennen ensimmäistä latausta
    refreshInterval: 30000, // Päivitä lista 30s välein
    revalidateOnFocus: true, // Päivitä kun välilehti saa fokuksen
  });

  // Sulkee modaalin kun klikataan sen ulkopuolelta
  useOnClickOutside(drawerRef, onClose);

  /**
   * Käsittelee tiedoston latauksen
   * - Tarkistaa tiedostotyypin (vain PDF)
   * - Lisää tiedoston latausjonoon
   * - Lähettää tiedoston palvelimelle
   * - Päivittää tiedostolistan onnistuneen latauksen jälkeen
   * - Näyttää ilmoitukset onnistumisesta/virheistä
   */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Tarkista että tiedosto on PDF
    if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Virheellinen tiedostotyyppi. Lataa PDF-tiedosto.");
      return;
    }

    try {
      // Lisää tiedosto latausjonoon UI:ta varten
      setUploadQueue((prev) => [...prev, file.name]);

      // Lähetä tiedosto palvelimelle
      const response = await fetch(`/api/files/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      if (!response.ok) {
        throw new Error(`Lataus epäonnistui: ${response.statusText}`);
      }

      // Päivitä tiedostolista ja näytä onnistumisilmoitus
      await mutate();
      toast.success(`${file.name} ladattu onnistuneesti`);
    } catch (error) {
      console.error("Virhe tiedoston latauksessa:", error);
      toast.error(`Virhe ladattaessa tiedostoa ${file.name}`);
    } finally {
      // Siivoa UI latauksen jälkeen
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setUploadQueue((prev) => prev.filter((name) => name !== file.name));
    }
  };

  /**
   * Käsittelee tiedoston poiston
   * - Lisää tiedoston poistojonoon
   * - Lähettää poistopyynnön palvelimelle
   * - Päivittää tiedostolistan optimistisesti
   * - Näyttää ilmoitukset onnistumisesta/virheistä
   */
  const handleFileDelete = async (fileName: string, fileUrl: string) => {
    try {
      // Lisää tiedosto poistojonoon UI:ta varten
      setDeleteQueue((prev) => [...prev, fileName]);

      // Lähetä poistopyyntö palvelimelle
      const response = await fetch(`/api/files/delete?fileurl=${fileUrl}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Poisto epäonnistui: ${response.statusText}`);
      }

      // Optimistinen UI päivitys - päivitä UI ennen serverin vahvistusta
      mutate(
        files?.filter((f) => f.pathname !== fileName),
        false,
      );
      toast.success(`${fileName} poistettu onnistuneesti`);
    } catch (error) {
      console.error("Virhe tiedoston poistossa:", error);
      toast.error(`Virhe poistettaessa tiedostoa ${fileName}`);
      await mutate(); // Virhetilanteessa hae päivitetty lista serveriltä
    } finally {
      // Poista tiedosto poistojonosta
      setDeleteQueue((prev) => prev.filter((name) => name !== fileName));
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bg-zinc-900/30 h-dvh w-dvw top-0 left-0 z-40 flex flex-row justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={drawerRef}
            className="w-[600px] h-96 rounded-lg p-4 flex flex-col gap-4 bg-white dark:bg-zinc-800 z-30"
            initial={{ y: "100%", scale: 0.9, opacity: 0 }}
            animate={{ y: "0%", scale: 1, opacity: 1 }}
            exit={{ y: "100%", scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          >
            <div className="flex flex-row justify-between items-center">
              <div className="text-sm">
                <div className="text-zinc-900 dark:text-zinc-300">
                  Hallinnoi tiedostoja
                  <span className="text-xs text-zinc-500 block mt-1">
                    Vain PDF-tiedostot
                  </span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                multiple={false}
                className="hidden"
                onChange={handleFileUpload}
              />

              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
                disabled={isLoading || uploadQueue.length > 0}
              >
                <FileIcon className="h-4 w-4" />
                Lisää tiedosto
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto border rounded-md">
              {isLoading && (
                <div className="flex items-center justify-center h-full">
                  <LoaderIcon className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center justify-center h-full text-sm text-red-500">
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <p>Virhe ladattaessa tiedostoja</p>
                </div>
              )}

              {!isLoading &&
                !error &&
                files?.length === 0 &&
                uploadQueue.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-sm text-zinc-500">
                    <FileIcon className="h-8 w-8 mb-2" />
                    <p>Ei ladattuja tiedostoja</p>
                  </div>
                )}

              {!isLoading &&
                !error &&
                files?.map((file) => (
                  <div
                    key={file.pathname}
                    className="flex items-center justify-between p-2 border-b dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                  >
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {file.pathname}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFileDelete(file.pathname, file.url)}
                      disabled={deleteQueue.includes(file.pathname)}
                    >
                      {deleteQueue.includes(file.pathname) ? (
                        <LoaderIcon className="h-4 w-4 animate-spin" />
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}

              {uploadQueue.map((fileName) => (
                <div
                  key={fileName}
                  className="flex items-center gap-2 p-2 border-b dark:border-zinc-700 bg-blue-50 dark:bg-blue-900/20"
                >
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Ladataan: {fileName}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm text-zinc-500">
              <span>{files?.length || 0} tiedostoa</span>
              {(uploadQueue.length > 0 || deleteQueue.length > 0) && (
                <span className="animate-pulse">Käsitellään...</span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
