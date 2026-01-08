-- Create storage buckets for video uploads and processed files
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('videos', 'videos', false),
  ('processed-videos', 'processed-videos', false),
  ('audio-narrations', 'audio-narrations', false);

-- Create policies for video uploads bucket
CREATE POLICY "Users can upload their own videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for processed videos bucket
CREATE POLICY "Users can view their own processed videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'processed-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Service can insert processed videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'processed-videos');

-- Create policies for audio narrations bucket
CREATE POLICY "Users can view their own audio narrations" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'audio-narrations' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Service can insert audio narrations" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'audio-narrations');

-- Update video_processing table to include more fields for the new workflow
ALTER TABLE video_processing 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS processed_video_url TEXT,
ADD COLUMN IF NOT EXISTS detected_objects JSONB,
ADD COLUMN IF NOT EXISTS processing_error TEXT;

-- Update the processing status enum to include more states
ALTER TABLE video_processing 
ALTER COLUMN processing_status TYPE TEXT;

-- Add a check constraint for valid processing statuses
ALTER TABLE video_processing 
ADD CONSTRAINT valid_processing_status 
CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed', 'uploading'));