import { File, FileText, Image, Music, Video } from "lucide-react";

export const getFileIcon = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <Image className="w-6 h-6" />;
    case "mp3":
    case "wav":
    case "ogg":
      return <Music className="w-6 h-6" />;
    case "mp4":
    case "avi":
    case "mov":
      return <Video className="w-6 h-6" />;
    case "pdf":
    case "doc":
    case "docx":
    case "txt":
      return <FileText className="w-6 h-6" />;
    default:
      return <File className="w-6 h-6" />;
  }
};
