import os
import re
import uuid
import traceback
import time

import cv2
import torch
import numpy as np
from ultralytics import YOLO
from transformers import VitsModel, AutoTokenizer
from pydub import AudioSegment
from moviepy.editor import VideoFileClip, AudioFileClip

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

# ---------------- APP ----------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DIRECTORIES ----------------
UPLOAD_DIR = "uploads"
PROCESSED_DIR = "processed"
TEMP_DIR = "temp"

for d in [UPLOAD_DIR, PROCESSED_DIR, TEMP_DIR]:
    os.makedirs(d, exist_ok=True)

app.mount("/processed", StaticFiles(directory=PROCESSED_DIR), name="processed")

# ---------------- MODELS ----------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model_official = YOLO("yolov8n.pt")
model_custom = YOLO("best.pt")

tts_model = VitsModel.from_pretrained("facebook/mms-tts-eng").to(device)
tts_tokenizer = AutoTokenizer.from_pretrained("facebook/mms-tts-eng")

# ---------------- HELPERS ----------------
object_real_height = {
    "person": 1.7, "car": 1.5, "bus": 3.0, "truck": 3.0,
    "bicycle": 1.0, "dog": 0.5, "cat": 0.3
}

def get_narration(objects):
    if not objects:
        return None
    return "Detected: " + ", ".join(objects)

def tts_to_audio(text):
    inputs = tts_tokenizer(text, return_tensors="pt").to(device)
    with torch.no_grad():
        output = tts_model(**inputs)
    wav = (output.waveform[0].cpu().numpy() * 32767).astype(np.int16)
    return AudioSegment(
        wav.tobytes(),
        frame_rate=tts_model.config.sampling_rate,
        sample_width=2,
        channels=1
    )

def draw_boxes(frame, results):
    for box, cls in zip(results.boxes.xyxy, results.boxes.cls):
        x1, y1, x2, y2 = map(int, box)
        label = results.names[int(cls)]
        cv2.rectangle(frame, (x1,y1), (x2,y2), (0,255,0), 2)
        cv2.putText(frame, label, (x1,y1-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,0), 2)
    return frame

def process_video(input_path, output_path):
    cap = cv2.VideoCapture(input_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    out = cv2.VideoWriter(
        output_path,
        cv2.VideoWriter_fourcc(*"mp4v"),
        fps,
        (w, h)
    )

    narration_audio = AudioSegment.silent(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        r1 = model_official(frame)[0]
        r2 = model_custom(frame)[0]

        labels = list(set(
            [r1.names[int(c)] for c in r1.boxes.cls] +
            [r2.names[int(c)] for c in r2.boxes.cls]
        ))

        frame = draw_boxes(frame, r1)
        frame = draw_boxes(frame, r2)

        narration = get_narration(labels)
        if narration:
            narration_audio += tts_to_audio(narration)

        out.write(frame)

    cap.release()
    out.release()

    audio_path = output_path.replace(".mp4", ".mp3")
    narration_audio.export(audio_path, format="mp3")

    video = VideoFileClip(output_path)
    audio = AudioFileClip(audio_path)
    final = video.set_audio(audio)

    final.write_videofile(output_path, codec="libx264", audio_codec="aac")

    video.close()
    audio.close()
    final.close()

# ---------------- API ----------------
@app.post("/process-video")
async def upload_video(video: UploadFile = File(...)):
    safe_name = re.sub(r"[^\w.-]", "_", video.filename)
    input_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{safe_name}")
    output_path = os.path.join(PROCESSED_DIR, f"processed_{safe_name}")

    with open(input_path, "wb") as f:
        f.write(await video.read())

    try:
        process_video(input_path, output_path)
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

    return JSONResponse({
        "processedVideoUrl": f"http://localhost:5000/processed/{os.path.basename(output_path)}"
    })

# ---------------- RUN ----------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
