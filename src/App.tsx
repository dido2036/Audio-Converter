import { useState } from 'react';
import { Upload, Settings, Music2, HelpCircle, Volume2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { DownloadButton } from "@/components/DownloadButton";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(192);
  const [format, setFormat] = useState("mp3");
  const [isConverting, setIsConverting] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('audio/')) {
        setFile(selectedFile);
        setIsConverted(false);
        toast({
          title: "File selected",
          description: `${selectedFile.name} has been selected for conversion.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an audio file.",
        });
      }
    }
  };

  const handleConvert = () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select an audio file to convert.",
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setIsConverted(false);

    // Simulate conversion process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsConverting(false);
          setIsConverted(true);
          toast({
            title: "Conversion complete",
            description: "Your file has been converted successfully!",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted text-foreground p-4 md:p-8">
      <ThemeSwitcher />
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Volume2 className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">Audio Converter</h1>
          </div>
          <p className="text-muted-foreground">Convert your audio files to any format with professional quality</p>
        </div>

        {/* Main Content */}
        <Card className="p-6 border-border bg-card/50">
          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList className="grid grid-cols-3 gap-4">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="help" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Help
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              {/* File Upload */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="audio-upload"
                />
                <label
                  htmlFor="audio-upload"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <Music2 className="h-12 w-12 text-primary" />
                  <div>
                    <p className="text-lg font-semibold">Drop your audio file here</p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                  </div>
                </label>
                {file && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    Selected: {file.name}
                  </div>
                )}
              </div>

              {/* Format Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp3">MP3</SelectItem>
                      <SelectItem value="wav">WAV</SelectItem>
                      <SelectItem value="m4a">M4A</SelectItem>
                      <SelectItem value="flac">FLAC</SelectItem>
                      <SelectItem value="ogg">OGG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quality ({quality} kbps)</Label>
                  <Slider
                    value={[quality]}
                    onValueChange={(value) => setQuality(value[0])}
                    min={64}
                    max={320}
                    step={64}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Convert and Download Buttons */}
              <div className="space-y-4">
                {isConverting ? (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-center text-sm text-muted-foreground">Converting... {progress}%</p>
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={handleConvert}
                      className="w-full"
                      size="lg"
                      disabled={!file || isConverted}
                    >
                      Convert Now
                    </Button>
                    {isConverted && file && (
                      <DownloadButton fileName={file.name} format={format} />
                    )}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <Label>Variable Bitrate</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Stereo Output</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Fade Effects</Label>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label>Sample Rate</Label>
                  <Select defaultValue="44100">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="44100">44.1 kHz</SelectItem>
                      <SelectItem value="48000">48 kHz</SelectItem>
                      <SelectItem value="96000">96 kHz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="help" className="space-y-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold">How to Convert Audio Files</h3>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>Click the upload button or drag and drop your audio file</li>
                  <li>Select your desired output format</li>
                  <li>Adjust quality settings if needed</li>
                  <li>Click "Convert Now" to start the conversion</li>
                  <li>Download your converted file when ready</li>
                </ol>
                <h3 className="text-xl font-semibold mt-6">Supported Formats</h3>
                <p className="text-muted-foreground">
                  We support conversion between MP3, WAV, M4A, FLAC, and OGG formats.
                  For best quality, we recommend using lossless formats like WAV or
                  FLAC for input files.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground">
          <p>© 2024 Audio Converter. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}