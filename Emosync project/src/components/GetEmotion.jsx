import { useState, useEffect, useRef } from "react";
import axios from "axios";
import MusicPlayer from "./MusicPlayer";

function GetEmotion() {
  const [emotion, setEmotion] = useState("Happy"); // Default emotion
  const videoRef = useRef(null);

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;

    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg");
    }
    return null;
  };

  const detectEmotion = async () => {
    const imageBase64 = captureImage();
    if (!imageBase64) {
      console.error("Failed to capture image.");
      return;
    }

    try {
      const blob = await fetch(imageBase64).then(res => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "captured_image.jpg");

      const response = await axios.post("https://python-ai-model-service.onrender.com/predict", formData);
      const detectedEmotion = response.data.emotion;
      setEmotion(detectedEmotion);
      console.log(`Detected Emotion: ${detectedEmotion}`);
    } catch (error) {
      console.error("Error detecting emotion:", error);
    }
  };

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startVideo();
  }, []);

  return (
    <div>
      <h1>Scanning Your Face...</h1>
      <video ref={videoRef} autoPlay style={{ width: "20%", height: "auto" }}></video>
      <button onClick={detectEmotion}>Detect Emotion</button>
      <p>Detected Emotion: {emotion}</p>
      <MusicPlayer emotion={emotion} />
    </div>
  );
}

export default GetEmotion;
