-- Create a table for storing video processing history
CREATE TABLE public.video_processing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  original_filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  upload_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  result_data JSONB,
  audio_guidance_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.video_processing ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own video processing records" 
ON public.video_processing 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own video processing records" 
ON public.video_processing 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video processing records" 
ON public.video_processing 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own video processing records" 
ON public.video_processing 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_video_processing_updated_at
BEFORE UPDATE ON public.video_processing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();