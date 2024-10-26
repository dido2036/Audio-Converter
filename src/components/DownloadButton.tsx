import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  fileName: string;
  format: string;
}

export function DownloadButton({ fileName, format }: DownloadButtonProps) {
  const handleDownload = () => {
    // In a real app, this would be a URL to the converted file
    const dummyBlob = new Blob([''], { type: `audio/${format}` });
    const url = URL.createObjectURL(dummyBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-${fileName}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleDownload}
      className="w-full bg-green-600 hover:bg-green-700"
      size="lg"
    >
      <Download className="mr-2 h-4 w-4" />
      Download Converted File
    </Button>
  );
}