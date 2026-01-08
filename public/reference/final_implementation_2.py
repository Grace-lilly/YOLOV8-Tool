import cv2
import torch
import os
import numpy as np
from ultralytics import YOLO
from transformers import VitsModel, AutoTokenizer as TtsTokenizer
from pydub import AudioSegment
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeVideoClip
import tempfile

# Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load YOLOv8 models
model_official = YOLO("yolov8n.pt")
model_custom = YOLO("best.pt")

# Load TTS model & tokenizer
tts_model = VitsModel.from_pretrained("facebook/mms-tts-eng").to(device)
tts_tokenizer = TtsTokenizer.from_pretrained("facebook/mms-tts-eng")

# Narrations for objects
object_narrations = {
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
    "truck": "There is a truck approaching. Keep a safe distance.",
    "traffic cone": "There is a traffic cone ahead. Take extra caution.",
    "construction barrier": "There is a construction barrier nearby. Avoid this area.",
    "stop sign": "There is a stop sign ahead. Please stop and check before proceeding.",
    "fire extinguisher": "There is a fire extinguisher close by.",
    "mailbox": "There is a mailbox nearby.",
    "potted plant": "There is a potted plant near you. Watch your path.",
    "sidewalk": "You are near the sidewalk. Stay on it for safety.",
    "crosswalk signal": "There is a crosswalk signal ahead. Follow its directions.",
    "road work sign": "There is a road work sign nearby. Be very cautious.",
    "barrier": "There is a barrier ahead. Please avoid walking into it.",
    "wheelchair": "There is a wheelchair nearby. Give way and be respectful.",
    "stroller": "There is a stroller nearby. Be careful around it.",
    "traffic sign": "There is a traffic sign nearby. Follow the traffic instructions.",
}

def get_narration(detected_objects):
    narrations = []
    for obj in detected_objects:
        narration = object_narrations.get(obj.lower())
        if narration:
            narrations.append(narration)
    if not narrations:
        return "Detected objects: " + ", ".join(detected_objects) + ". Please be careful."
    return " ".join(narrations)

def tts_to_audiosegment(text):
    inputs = tts_tokenizer(text, return_tensors="pt").to(device)
    with torch.no_grad():
        output = tts_model(**inputs)
    wav_array = output.waveform[0].cpu().numpy()
    sampling_rate = tts_model.config.sampling_rate or 16000
    wav_int16 = (wav_array * 32767).astype(np.int16)
    audio_segment = AudioSegment(
        wav_int16.tobytes(),
        frame_rate=sampling_rate,
        sample_width=wav_int16.dtype.itemsize,
        channels=1
    )
    return audio_segment

def draw_boxes(frame, results):
    for box, cls in zip(results.boxes.xyxy.cpu().numpy(), results.boxes.cls.cpu().numpy()):
        x1, y1, x2, y2 = box.astype(int)
        label = results.names[int(cls)]
        color = (0, 255, 0)
        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
        cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
    return frame

def process_video_with_audio(input_video_path, output_video_path, frame_skip=5):
    cap = cv2.VideoCapture(input_video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    width  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    temp_video_path = "temp_video.mp4"
    out = cv2.VideoWriter(temp_video_path, fourcc, fps/frame_skip, (width, height))

    combined_audio = AudioSegment.silent(duration=0)
    last_narration = ""
    frame_id = 0
    processed_frames = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_id % frame_skip == 0:
            # Detect with both models
            results_official = model_official(frame)[0]
            results_custom = model_custom(frame)[0]

            labels_official = [results_official.names[int(c)] for c in results_official.boxes.cls.cpu().numpy().astype(int)]
            labels_custom = [results_custom.names[int(c)] for c in results_custom.boxes.cls.cpu().numpy().astype(int)]

            all_labels = list(set(labels_official + labels_custom))

            # Draw all boxes on frame for better visual feedback
            frame = draw_boxes(frame, results_official)
            frame = draw_boxes(frame, results_custom)

            if all_labels:
                narration = get_narration(all_labels)
                if narration != last_narration:
                    audio_seg = tts_to_audiosegment(narration)
                    combined_audio += audio_seg + AudioSegment.silent(duration=500)  # Half second pause between narrations
                    last_narration = narration
                processed_frames += 1
            # Write this processed frame multiple times to maintain correct FPS duration
            for _ in range(frame_skip):
                out.write(frame)
        frame_id += 1

    cap.release()
    out.release()

    # Save combined audio to temp file
    temp_audio_path = "temp_audio.wav"
    combined_audio.export(temp_audio_path, format="wav")

        # Merge audio and video with moviepy
    video_clip = VideoFileClip(temp_video_path)
    audio_clip = AudioFileClip(temp_audio_path)
    audio_clip = audio_clip.set_duration(video_clip.duration)
    final_clip = video_clip.set_audio(audio_clip)
    final_clip.write_videofile(output_video_path, codec="libx264", audio_codec="aac")

    # Close clips to release file handles
    final_clip.close()
    audio_clip.close()
    video_clip.close()

    # Cleanup temp files
    os.remove(temp_video_path)
    os.remove(temp_audio_path)


    print(f"Processed video with audio saved at: {output_video_path}")

# Usage
process_video_with_audio("trafficvideo.mp4", "output_video_with_narration.mp4", frame_skip=5)
