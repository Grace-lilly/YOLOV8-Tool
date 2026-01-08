import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Video, 
  Square, 
  Play, 
  Pause, 
  Download,
  Camera,
  AlertCircle
} from 'lucide-react';

interface VideoRecorderProps {
  onVideoRecorded: (file: File) => void;
}

const VideoRecorder = ({ onVideoRecorded }: VideoRecorderProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCamera(true);
    } catch (error) {
      console.error('Camera access error:', error);
      setHasCamera(false);
      toast({
        title: "Camera Access Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (!streamRef.current) {
      await startCamera();
      if (!streamRef.current) return;
    }

    try {
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        
        // Create File object
        const file = new File([blob], `recorded-video-${Date.now()}.webm`, {
          type: 'video/webm'
        });
        onVideoRecorded(file);

        toast({
          title: "Recording Complete",
          description: "Your video has been recorded successfully!",
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Recording your video...",
      });

    } catch (error) {
      console.error('Recording error:', error);
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please try again.",
        variant: "destructive",
      });
    }
  }, [startCamera, onVideoRecorded, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopCamera();
    }
  }, [isRecording, stopCamera]);

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const downloadVideo = () => {
    if (recordedVideoUrl) {
      const a = document.createElement('a');
      a.href = recordedVideoUrl;
      a.download = `recorded-video-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50 card-hover">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Camera className="h-5 w-5" aria-hidden="true" />
          <span>Record Live Video</span>
        </CardTitle>
        <CardDescription>
          Record video directly from your camera for analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasCamera ? (
          <div className="text-center py-8 space-y-4">
            <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto">
              <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Camera Not Available</h3>
              <p className="text-muted-foreground">
                Please check camera permissions and try again
              </p>
            </div>
            <Button onClick={startCamera} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Video Preview/Playback */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay={!recordedVideoUrl}
                muted={isRecording}
                playsInline
                onLoadedMetadata={() => {
                  if (!recordedVideoUrl && !isRecording) {
                    startCamera();
                  }
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 justify-center">
              {!recordedVideoUrl ? (
                <>
                  {!isRecording ? (
                    <Button 
                      onClick={startRecording}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopRecording}
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button onClick={togglePlayback} variant="outline">
                    {isPlaying ? (
                      <Pause className="h-4 w-4 mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  
                  <Button onClick={downloadVideo} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setRecordedVideoUrl(null);
                      setIsPlaying(false);
                      startCamera();
                    }}
                    variant="outline"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Record New
                  </Button>
                </>
              )}
            </div>

            {isRecording && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-destructive">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Recording...</span>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoRecorder;