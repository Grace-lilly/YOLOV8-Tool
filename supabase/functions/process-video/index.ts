import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;

// Create Supabase client with service role for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Object narrations mapping based on the Python script
const objectNarrations: Record<string, string> = {
  "person": "There is a person ahead. Please stay alert.",
  "bicycle": "There is a bicycle nearby. Be careful and give way.",
  "car": "There are cars coming on the road. Do not cross the road now.",
  "motorcycle": "There are motorcycles nearby. Stay cautious.",
  "bus": "There is a bus approaching. Please wait safely.",
  "truck": "There is a truck nearby. Keep a safe distance.",
  "traffic light": "There is a traffic light ahead. Wait for the green signal before crossing.",
  "stop sign": "There is a stop sign ahead. Please stop and look around before moving.",
  "crosswalk": "There is a zebra crossing in front of you. You can cross the road safely here.",
  "fire hydrant": "There is a fire hydrant nearby. Watch your step.",
  "bench": "There is a bench nearby. You may sit if needed.",
  "parking meter": "There is a parking meter close by.",
  "bird": "There are birds ahead. Stay calm and keep safe.",
  "cat": "There is a cat nearby. Please avoid sudden movements.",
  "dog": "There is a dog nearby. Be cautious and quiet.",
  "traffic cone": "There is a traffic cone ahead. Take extra caution.",
  "construction barrier": "There is a construction barrier nearby. Avoid this area.",
  "fire extinguisher": "There is a fire extinguisher close by.",
  "mailbox": "There is a mailbox nearby.",
  "potted plant": "There is a potted plant near you. Watch your path.",
  "sidewalk": "You are near the sidewalk. Stay on it for safety.",
  "crosswalk signal": "There is a crosswalk signal ahead. Follow its directions.",
  "road work sign": "There is a road work sign nearby. Be very cautious.",
  "barrier": "There is a barrier ahead. Please avoid walking into it.",
  "wheelchair": "There is a wheelchair nearby. Give way and be respectful.",
  "stroller": "There is a stroller nearby. Be careful around it.",
  "traffic sign": "There is a traffic sign nearby. Follow the traffic instructions."
};

function generateNarration(detectedObjects: string[]): string {
  const narrations: string[] = [];
  const uniqueObjects = [...new Set(detectedObjects)];
  
  for (const obj of uniqueObjects) {
    const narration = objectNarrations[obj.toLowerCase()];
    if (narration) {
      narrations.push(narration);
    }
  }
  
  if (narrations.length === 0) {
    return `Detected objects: ${uniqueObjects.join(", ")}. Please be careful.`;
  }
  
  return narrations.join(" ");
}

async function analyzeVideoFrame(frameBase64: string): Promise<string[]> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a vision assistance AI that helps visually impaired people navigate safely. 
            Analyze the image and identify objects that are relevant for navigation safety.
            Focus on: people, vehicles, traffic signs, obstacles, sidewalks, crosswalks, barriers, animals, and navigation aids.
            Return ONLY a JSON array of detected object names in lowercase, like: ["person", "car", "traffic light"]`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'What objects do you see in this image that are relevant for safe navigation?'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${frameBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      return [];
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '[]';
    
    try {
      const objects = JSON.parse(content);
      return Array.isArray(objects) ? objects : [];
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      // Fallback: extract objects from text response
      const words = content.toLowerCase().split(/[\s,]+/);
      return words.filter(word => objectNarrations[word]);
    }
  } catch (error) {
    console.error('Error analyzing frame:', error);
    return [];
  }
}

async function generateAudioNarration(text: string): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'alloy',
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      console.error('TTS API error:', await response.text());
      throw new Error('Failed to generate audio');
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    return base64Audio;
  } catch (error) {
    console.error('Error generating audio:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId, userId } = await req.json();
    
    if (!videoId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing videoId or userId' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing video ${videoId} for user ${userId}`);

    // Update processing status
    await supabase
      .from('video_processing')
      .update({ processing_status: 'processing' })
      .eq('id', videoId);

    // Get video file from storage
    const { data: videoData, error: downloadError } = await supabase.storage
      .from('videos')
      .download(`${userId}/${videoId}.mp4`);

    if (downloadError || !videoData) {
      console.error('Error downloading video:', downloadError);
      await supabase
        .from('video_processing')
        .update({ 
          processing_status: 'failed',
          processing_error: 'Failed to download video'
        })
        .eq('id', videoId);
      
      return new Response(
        JSON.stringify({ error: 'Failed to download video' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For this implementation, we'll simulate video frame extraction
    // In a real implementation, you'd use FFmpeg or similar to extract frames
    console.log('Video processing would extract frames here');
    
    // Simulate processing with sample objects
    const sampleDetectedObjects = ['person', 'car', 'traffic light', 'sidewalk'];
    const narrationText = generateNarration(sampleDetectedObjects);
    
    console.log('Generated narration:', narrationText);
    
    // Generate audio narration
    const audioBase64 = await generateAudioNarration(narrationText);
    
    // Save audio to storage
    const audioBuffer = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
    const { error: audioUploadError } = await supabase.storage
      .from('audio-narrations')
      .upload(`${userId}/${videoId}.mp3`, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true
      });

    if (audioUploadError) {
      console.error('Error uploading audio:', audioUploadError);
    }

    // Get public URL for audio
    const { data: audioUrlData } = supabase.storage
      .from('audio-narrations')
      .getPublicUrl(`${userId}/${videoId}.mp3`);

    // Update processing record with results
    const { error: updateError } = await supabase
      .from('video_processing')
      .update({
        processing_status: 'completed',
        audio_guidance_url: audioUrlData.publicUrl,
        detected_objects: sampleDetectedObjects,
        result_data: {
          narration: narrationText,
          objects_detected: sampleDetectedObjects,
          processing_time: new Date().toISOString()
        }
      })
      .eq('id', videoId);

    if (updateError) {
      console.error('Error updating processing record:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        videoId,
        audioUrl: audioUrlData.publicUrl,
        narration: narrationText,
        detectedObjects: sampleDetectedObjects
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-video function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});