import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useClerkAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VideoRecorder from '@/components/VideoRecorder';
import { 
  Upload, 
  FileVideo, 
  CheckCircle, 
  AlertCircle, 
  X,
  Play,
  Download,
  Lightbulb
} from 'lucide-react';

interface VideoFile {
  file: File;
  id: string;
  preview: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: {
    objects: string[];
    guidance: string;
    audioUrl?: string;
    processedVideoUrl?: string;
  };
}

const VideoUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/mkv'];
  const maxFileSize = 1024 * 1024 * 1024; // 1GB

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return 'Please upload a valid video file (MP4, AVI, MOV, WMV, or MKV)';
    }
    if (file.size > maxFileSize) {
      return 'File size must be less than 1GB';
    }
    return null;
  };

  const createVideoFile = (file: File): VideoFile => {
    const preview = URL.createObjectURL(file);
    return {
      file,
      id: `${Date.now()}-${Math.random()}`,
      preview,
      status: 'pending',
    };
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newVideoFiles: VideoFile[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        newVideoFiles.push(createVideoFile(file));
      }
    });

    if (errors.length > 0) {
      toast({
        title: "Upload Error",
        description: errors.join('\n'),
        variant: "destructive",
      });
    }

    if (newVideoFiles.length > 0) {
      setVideoFiles(prev => [...prev, ...newVideoFiles]);
      toast({
        title: "Files Added",
        description: `${newVideoFiles.length} video(s) ready for processing`,
      });
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFiles]);

  const removeFile = (id: string) => {
    setVideoFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const processVideo = async (videoFile: VideoFile) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to process videos.",
        variant: "destructive",
      });
      return;
    }

    setVideoFiles(prev =>
      prev.map(f => f.id === videoFile.id ? { ...f, status: 'processing' } : f)
    );

    try {
      const formData = new FormData();
      formData.append("video", videoFile.file);

      const response = await fetch("http://localhost:5000/process-video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Processing failed");

      const data = await response.json();

      setVideoFiles(prev =>
        prev.map(f =>
          f.id === videoFile.id
            ? { ...f, status: "completed", result: { ...f.result, processedVideoUrl: data.processedVideoUrl } }
            : f
        )
      );

      toast({
        title: "Processing Complete",
        description: "Your video has been processed successfully.",
      });
    } catch (error) {
      setVideoFiles(prev =>
        prev.map(f => f.id === videoFile.id ? { ...f, status: "error" } : f)
      );
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Error processing video.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: VideoFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-guide-success" aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" aria-hidden="true" />;
      default:
        return <FileVideo className="h-5 w-5 text-muted-foreground" aria-hidden="true" />;
    }
  };

  const getStatusBadge = (status: VideoFile['status']) => {
    const variants = {
      pending: { variant: 'secondary' as const, text: 'Ready to Process' },
      processing: { variant: 'default' as const, text: 'Processing...' },
      completed: { variant: 'default' as const, text: 'Completed' },
      error: { variant: 'destructive' as const, text: 'Error' },
    };
    const { variant, text } = variants[status];
    return <Badge variant={variant}>{text}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">

          <section className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Upload Video for Analysis
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a video of your environment to receive AI-powered navigation guidance and obstacle detection.
            </p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gradient-card border-border/50 card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" aria-hidden="true" />
                  <span>Upload Videos</span>
                </CardTitle>
                <CardDescription>
                  Drag and drop video files or click to browse. Supported formats: MP4, AVI, MOV, WMV, MKV (max 1GB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                    isDragOver
                      ? 'border-primary bg-primary/5 scale-105'
                      : 'border-border hover:border-primary/50 hover:bg-accent/20'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  role="button"
                  aria-label="Upload video files"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse-soft">
                      <Upload className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-foreground">
                        Drop videos here, or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Upload clear videos of your environment for the best results
                      </p>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-accessible"
                      aria-describedby="file-input-help"
                    >
                      Select Videos
                    </Button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={acceptedFormats.join(',')}
                  onChange={handleFileSelect}
                  className="sr-only"
                  aria-describedby="file-input-help"
                />
                <p id="file-input-help" className="sr-only">
                  Select video files to upload for AI analysis
                </p>
              </CardContent>
            </Card>

            <VideoRecorder onVideoRecorded={(file) => {
              const videoFile = createVideoFile(file);
              setVideoFiles(prev => [...prev, videoFile]);
              toast({
                title: "Video Recorded",
                description: "Your recorded video is ready for processing",
              });
            }} />
          </div>

          {videoFiles.length > 0 && (
            <section aria-labelledby="uploaded-videos-heading">
              <h2 id="uploaded-videos-heading" className="text-2xl font-bold text-foreground mb-6">
                Uploaded Videos ({videoFiles.length})
              </h2>
              <div className="space-y-4">
                {videoFiles.map((videoFile) => (
                  <Card key={videoFile.id} className="bg-gradient-card border-border/50 card-hover">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-80 flex-shrink-0">
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                            <video
                              src={videoFile.preview}
                              className="w-full h-full object-cover"
                              controls={videoFile.status !== 'processing'}
                              aria-label={`Preview of ${videoFile.file.name}`}
                            />
                          </div>
                        </div>
                        <div className="flex-grow space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(videoFile.status)}
                                <h3 className="font-semibold text-foreground truncate">
                                  {videoFile.file.name}
                                </h3>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>{(videoFile.file.size / 1024 / 1024).toFixed(1)} MB</span>
                                {getStatusBadge(videoFile.status)}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(videoFile.id)}
                              aria-label={`Remove ${videoFile.file.name}`}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </div>

                          {videoFile.status === 'processing' && (
                            <div className="flex items-center space-x-2">
                              <svg
                                className="animate-spin h-5 w-5 text-primary"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                aria-label="Loading"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                              </svg>
                              <span className="text-sm text-muted-foreground">Processing...</span>
                            </div>
                          )}

                          {videoFile.status === 'completed' && videoFile.result && (
                            <div className="space-y-4 p-4 bg-accent/20 rounded-lg">
                              <h4 className="font-semibold text-foreground">Analysis Results</h4>
                              {videoFile.result.processedVideoUrl ? (
                                <div className="space-y-2">
                                  <h5 className="text-sm font-medium text-foreground">Processed Video:</h5>
                                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                                    <video
                                      src={videoFile.result.processedVideoUrl}
                                      className="w-full h-full object-cover"
                                      controls
                                      aria-label={`Processed version of ${videoFile.file.name}`}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <p>Processed video not available yet.</p>
                              )}
                              <div className="space-y-3"></div>

                              {videoFile.result.processedVideoUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex items-center space-x-2"
                                  onClick={async () => {
                                    try {
                                      const urlStr = videoFile.result?.processedVideoUrl;
                                      if (!urlStr) return;
                                      const response = await fetch(urlStr);
                                      if (!response.ok) throw new Error('Failed to fetch processed video for download');
                                      const blob = await response.blob();
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = `processed-${videoFile.file.name}`;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                      URL.revokeObjectURL(url);
                                    } catch (error) {
                                      toast({
                                        title: "Download Error",
                                        description: error instanceof Error ? error.message : "Error downloading video",
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                >
                                  <Download className="h-4 w-4" aria-hidden="true" />
                                  <span>Download Processed Video</span>
                                </Button>
                              )}
                            </div>
                          )}

                          {videoFile.status === 'pending' && (
                            <Button
                              onClick={() => processVideo(videoFile)}
                              className="btn-accessible bg-primary hover:bg-primary-hover text-primary-foreground"
                              aria-describedby={`process-${videoFile.id}-desc`}
                            >
                              <Play className="h-4 w-4 mr-2" aria-hidden="true" />
                              Process Video
                            </Button>
                          )}

                          {videoFile.status === 'error' && (
                            <Button
                              onClick={() => processVideo(videoFile)}
                              variant="outline"
                              className="btn-accessible"
                            >
                              Try Again
                            </Button>
                          )}

                          <p id={`process-${videoFile.id}-desc`} className="sr-only">
                            Process {videoFile.file.name} for AI analysis and navigation guidance
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <Card className="bg-gradient-card border-border/50 card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-guide-accent" aria-hidden="true" />
                <span>Tips for Best Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Recording Quality</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Use good lighting for clear visibility</li>
                    <li>Hold device steady while recording</li>
                    <li>Record at eye level for accurate perspective</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Content Guidelines</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Include potential obstacles and hazards</li>
                    <li>Show clear pathways and exits</li>
                    <li>Record for 10-30 seconds for best analysis</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
