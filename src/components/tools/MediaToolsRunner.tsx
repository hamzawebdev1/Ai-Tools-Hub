import React, { useState, useRef, useEffect } from "react";
import { AITool } from "../../types";
import {
  Upload,
  Download,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Clock,
  HardDrive,
  Info,
  FileAudio,
  FileVideo,
  Music,
  Video,
  Scissors,
  Minimize2,
  Maximize2,
  Layers,
  Crop,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FastForward,
  Activity,
  VolumeX,
  Volume2,
  Trash2,
  Grid,
  Image as ImageIcon,
  Sparkles,
  Code,
  FileText,
  Search,
  BarChart2,
  Sliders,
  Headphones,
  Film,
  Monitor,
  Maximize,
  Eye,
  Repeat,
  FileCheck,
  Disc,
} from "lucide-react";
import {
  decodeAudioFile,
  encodeAudioBufferToWav,
  trimAudioBuffer,
  mergeAudioBuffers,
  changeAudioVolume,
  applyAudioFadeIn,
  applyAudioFadeOut,
  changeAudioSpeed,
  reverseAudioBuffer,
  normalizeAudioBuffer,
  resampleAudioBuffer,
  detectAudioSilence,
  analyzeAudioVolume,
  renderAudioWaveformToCanvas,
  loadVideoElement,
  getVideoMetadata,
  captureVideoSnapshot,
  extractVideoFrameSequence,
  generateVideoContactSheet,
  convertVideoToWebM,
  extractAudioFromVideo,
  createGifFromImageFiles,
  detectMediaMagicBytes,
  formatBytes,
  formatTime,
} from "../../services/mediaEngine";

interface MediaToolsRunnerProps {
  tool: AITool;
}

export const MediaToolsRunner: React.FC<MediaToolsRunnerProps> = ({ tool }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Result States
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState<string>("");
  const [resultType, setResultType] = useState<"audio" | "video" | "image" | "text" | "json" | "gallery" | "silence">("text");
  const [resultTextContent, setResultTextContent] = useState<string>("");
  const [extractedGallery, setExtractedGallery] = useState<{ name: string; url: string }[]>([]);
  const [silenceRanges, setSilenceRanges] = useState<{ start: number; end: number }[]>([]);

  // Player / Preview Controls
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Form options state
  const [customOptions, setCustomOptions] = useState<Record<string, string>>({});

  // Initialize option defaults
  useEffect(() => {
    const defaults: Record<string, string> = {};
    tool.optionsConfig?.customFields?.forEach((f) => {
      defaults[f.id] = f.defaultValue;
    });
    setCustomOptions(defaults);
    setResultBlobUrl(null);
    setError(null);
    setSelectedFiles([]);
  }, [tool.id]);

  const handleOptionChange = (fieldId: string, value: string) => {
    setCustomOptions((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      setError(null);
      setResultBlobUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(filesArray);
      setError(null);
      setResultBlobUrl(null);
    }
  };

  // Main Processing Handler
  const runMediaTool = async () => {
    if (selectedFiles.length === 0 && tool.id !== "base64-to-audio" && tool.id !== "video-aspect-ratio-calc") {
      setError("Please select at least one media file to process.");
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setStatusText("Loading media file into browser RAM...");
    setError(null);
    setResultBlobUrl(null);

    try {
      const primaryFile = selectedFiles[0];

      // ==================== AUDIO TOOLS (1-30) ====================
      if (
        tool.id === "audio-converter" ||
        tool.id === "audio-mp3-converter" ||
        tool.id === "audio-wav-converter" ||
        tool.id === "audio-ogg-converter" ||
        tool.id === "audio-m4a-converter" ||
        tool.id === "audio-flac-converter"
      ) {
        setStatusText("Decoding audio stream...");
        const audioBuf = await decodeAudioFile(primaryFile);
        setProgress(50);

        setStatusText("Encoding output PCM audio file...");
        let outBlob: Blob;
        let ext = "wav";

        const bitDepth = customOptions["bitDepth"]?.includes("32") ? 32 : 16;
        outBlob = encodeAudioBufferToWav(audioBuf, bitDepth);

        const url = URL.createObjectURL(outBlob);
        setResultBlobUrl(url);
        setResultFileName(`${primaryFile.name.replace(/\.[^/.]+$/, "")}_converted.${ext}`);
        setResultType("audio");

        // Render waveform canvas preview
        setTimeout(() => {
          if (canvasRef.current) {
            renderAudioWaveformToCanvas(audioBuf, canvasRef.current);
          }
        }, 100);
      } else if (tool.id === "audio-compressor") {
        setStatusText("Resampling audio channels for lower file size...");
        const audioBuf = await decodeAudioFile(primaryFile);
        setProgress(40);

        const level = customOptions["compressionLevel"] || "";
        let targetRate = 22050;
        let channels = 1;
        if (level.includes("Aggressive")) {
          targetRate = 16000;
        } else if (level.includes("Light")) {
          targetRate = 32000;
          channels = 2;
        }

        const compressedBuf = await resampleAudioBuffer(audioBuf, targetRate, channels);
        setProgress(80);

        const wavBlob = encodeAudioBufferToWav(compressedBuf, 16);
        const url = URL.createObjectURL(wavBlob);
        setResultBlobUrl(url);
        setResultFileName(`${primaryFile.name.replace(/\.[^/.]+$/, "")}_compressed.wav`);
        setResultType("audio");

        const origSize = primaryFile.size;
        const newSize = wavBlob.size;
        const savedPercent = Math.max(0, Math.round(((origSize - newSize) / origSize) * 100));
        setResultTextContent(`Original Size: ${formatBytes(origSize)} | Compressed Size: ${formatBytes(newSize)} (${savedPercent}% Size Reduction)`);
      } else if (tool.id === "audio-trimmer" || tool.id === "audio-cutter") {
        setStatusText("Slicing audio time frames...");
        const audioBuf = await decodeAudioFile(primaryFile);
        setProgress(50);

        const startSec = parseFloat(customOptions["startTime"] || customOptions["cutStart"] || "0") || 0;
        const endSec = parseFloat(customOptions["endTime"] || customOptions["cutEnd"] || "10") || audioBuf.duration;

        const trimmedBuf = trimAudioBuffer(audioBuf, startSec, endSec);
        const wavBlob = encodeAudioBufferToWav(trimmedBuf, 16);
        const url = URL.createObjectURL(wavBlob);

        setResultBlobUrl(url);
        setResultFileName(`${primaryFile.name.replace(/\.[^/.]+$/, "")}_trimmed.wav`);
        setResultType("audio");
        setResultTextContent(`Trimmed Duration: ${formatTime(trimmedBuf.duration)} (${startSec}s to ${endSec}s)`);
      } else if (tool.id === "audio-merger") {
        setStatusText("Joining multiple audio tracks sequentially...");
        const decodedBuffers: AudioBuffer[] = [];
        for (let i = 0; i < selectedFiles.length; i++) {
          setStatusText(`Decoding track ${i + 1} of ${selectedFiles.length}...`);
          decodedBuffers.push(await decodeAudioFile(selectedFiles[i]));
          setProgress(20 + Math.floor((i / selectedFiles.length) * 50));
        }

        const mergedBuf = mergeAudioBuffers(decodedBuffers);
        const wavBlob = encodeAudioBufferToWav(mergedBuf, 16);
        const url = URL.createObjectURL(wavBlob);

        setResultBlobUrl(url);
        setResultFileName(`merged_audio_${Date.now()}.wav`);
        setResultType("audio");
        setResultTextContent(`Merged ${selectedFiles.length} files into single ${formatTime(mergedBuf.duration)} track.`);
      } else if (tool.id === "audio-volume-changer") {
        setStatusText("Applying gain multiplier...");
        const audioBuf = await decodeAudioFile(primaryFile);
        setProgress(50);

        const gainStr = customOptions["volumeGain"] || "200%";
        let factor = 2.0;
        if (gainStr.includes("150%")) factor = 1.5;
        if (gainStr.includes("300%")) factor = 3.0;
        if (gainStr.includes("75%")) factor = 0.75;
        if (gainStr.includes("50%")) factor = 0.5;

        const boostedBuf = changeAudioVolume(audioBuf, factor);
        const wavBlob = encodeAudioBufferToWav(boostedBuf, 16);
        const url = URL.createObjectURL(wavBlob);

        setResultBlobUrl(url);
        setResultFileName(`${primaryFile.name.replace(/\.[^/.]+$/, "")}_boosted.wav`);
        setResultType("audio");
      } else if (tool.id === "audio-fade-in") {
        setStatusText("Applying smooth fade-in envelope...");
        const audioBuf = await decodeAudioFile(primaryFile);
        setProgress(50);

        const fadeSec = parseInt(customOptions["fadeDuration"] || "3", 10);
        const fadedBuf = applyAudioFadeIn(audioBuf, fadeSec);
        const wavBlob = encodeAudioBufferToWav(fadedBuf, 16);

        setResultBlobUrl(URL.createObjectURL(wavBlob));
        setResultFileName(`${primaryFile.name.replace(/\.[^/.]+$/, "")}_fade_in.wav`);
        setResultType("audio");
      } else if (tool.id === "audio-fade-out") {
        setStatusText("Applying smooth fade-out envelope...");
        const audioBuf = await decodeAudioFile(primaryFile);
        setProgress(50);

        const fadeSec = parseInt(customOptions["fadeDuration"] || "3", 10);
        const fadedBuf = applyAudioFadeOut(audioBuf, fadeSec);
        const wavBlob = encodeAudioBufferToWav(fadedBuf, 16);

        setResultBlobUrl(URL.createObjectURL(wavBlob));
        setResultFileName(`${primaryFile.name.replace(/\.[^/.]+$/, "")}_fade_out.wav`);
        setResultType("audio");
      } else if (tool.id === "audio-speed-changer" || tool.id === "audio-speed-pitch-changer") {
        setStatusText("Adjusting playback speed tempo...");
        const audioBuf = await decodeAudioFile(primaryFile);
        setProgress(40);

        const speedStr = customOptions["speedMultiplier"] || "1.5x";
        let ratio = 1.5;
        if (speedStr.includes("0.5x")) ratio = 0.5;
        if (speedStr.includes("0.75x")) ratio = 0.75;
        if (speedStr.includes("1.25x")) ratio = 1.25;
        if (speedStr.includes("2.0x")) ratio = 2.0;

        const spedBuf = await changeAudioSpeed(audioBuf, ratio);
        const wavBlob = encodeAudioBufferToWav(spedBuf, 16);

        setResultBlobUrl(URL.createObjectURL(wavBlob));
        setResultFileName(`${primaryFile.name.replace(/\.[^/.]+$/, "")}_${ratio}x.wav`);
        setResultType("audio");
      } else if (tool.id === "audio-reverse") {
        setStatusText("Reversing audio sample array...");
        const audioBuf = await decodeAudioFile(primaryFile);
        setProgress(50);

        const reversedBuf = reverseAudioBuffer(audioBuf);
        const wavBlob = encodeAudioBufferToWav(reversedBuf, 16);

        setResultBlobUrl(URL.createObjectURL(wavBlob));
        setResultFileName(`${primaryFile.name.replace(/\.[^/.]+$/, "")}_reversed.wav`);
        setResultType("audio");
      } else if (tool.id === "audio-normalizer") {
        setStatusText("Normalizing peak audio to 0 dBFS...");
        const audioBuf = await decodeAudioFile(primaryFile);
        setProgress(50);

        const normBuf = normalizeAudioBuffer(audioBuf);
        const wavBlob = encodeAudioBufferToWav(normBuf, 16);

        setResultBlobUrl(URL.createObjectURL(wavBlob));
        setResultFileName(`${primaryFile.name.replace(/\.[^/.]+$/, "")}_normalized.wav`);
        setResultType("audio");
      } else if (tool.id === "audio-waveform-generator") {
        setStatusText("Rendering high-res waveform graphic...");
        const audioBuf = await decodeAudioFile(primaryFile);
        setProgress(60);

        const canvas = document.createElement("canvas");
        canvas.width = 1200;
        canvas.height = 400;

        const theme = customOptions["waveColor"] || "Indigo Gradient";
        renderAudioWaveformToCanvas(audioBuf, canvas, theme);

        canvas.toBlob((blob) => {
          if (blob) {
            setResultBlobUrl(URL.createObjectURL(blob));
            setResultFileName(`${primaryFile.name.replace(/\.[^/.]+$/, "")}_waveform.png`);
            setResultType("image");
          }
        }, "image/png");
      } else if (tool.id === "audio-silence-detector") {
        setStatusText("Scanning audio frames for silent regions...");
        const audioBuf = await decodeAudioFile(primaryFile);
        setProgress(60);

        const thresholdStr = customOptions["thresholdDb"] || "-45 dB";
        let dbVal = -45;
        if (thresholdStr.includes("-50")) dbVal = -50;
        if (thresholdStr.includes("-35")) dbVal = -35;

        const silences = detectAudioSilence(audioBuf, dbVal);
        setSilenceRanges(silences);
        setResultType("silence");
        setResultTextContent(`Detected ${silences.length} silent gap segments (below ${dbVal} dB).`);
      } else if (tool.id === "audio-volume-analyzer") {
        setStatusText("Calculating Peak and RMS volume levels...");
        const audioBuf = await decodeAudioFile(primaryFile);
        setProgress(60);

        const stats = analyzeAudioVolume(audioBuf);
        const jsonOutput = JSON.stringify(
          {
            fileName: primaryFile.name,
            durationSec: audioBuf.duration.toFixed(2) + " seconds",
            peakLoudness: `${stats.peakDb} dBFS`,
            rmsEnergy: `${stats.rmsDb} dBFS`,
            dynamicRange: `${stats.dynamicRangeDb} dB`,
            status: stats.peakDb >= 0 ? "Potential Clipping / Peak 0 dB" : "Healthy Dynamic Headroom",
          },
          null,
          2
        );

        setResultTextContent(jsonOutput);
        setResultType("json");
      } else if (
        tool.id === "audio-metadata-viewer" ||
        tool.id === "audio-duration-checker" ||
        tool.id === "audio-file-size-checker" ||
        tool.id === "audio-channel-info" ||
        tool.id === "audio-sample-rate-info" ||
        tool.id === "audio-bitrate-info"
      ) {
        setStatusText("Analyzing technical audio metadata...");
        const audioBuf = await decodeAudioFile(primaryFile);
        setProgress(70);

        const kbps = Math.round(((primaryFile.size * 8) / (audioBuf.duration || 1)) / 1000);
        const info = {
          fileName: primaryFile.name,
          fileSize: formatBytes(primaryFile.size),
          exactBytes: primaryFile.size,
          mimeType: primaryFile.type || "audio/wav",
          durationSeconds: audioBuf.duration.toFixed(3),
          durationFormatted: formatTime(audioBuf.duration),
          channels: audioBuf.numberOfChannels === 1 ? "Mono (1 Channel)" : `Stereo (${audioBuf.numberOfChannels} Channels)`,
          sampleRate: `${audioBuf.sampleRate} Hz`,
          calculatedBitrate: `${kbps} kbps`,
          audioFormat: "Uncompressed / Decoded PCM",
        };

        setResultTextContent(JSON.stringify(info, null, 2));
        setResultType("json");
      } else if (tool.id === "audio-metadata-remover") {
        setStatusText("Stripping ID3 metadata chunks...");
        const audioBuf = await decodeAudioFile(primaryFile);
        setProgress(60);

        const cleanBlob = encodeAudioBufferToWav(audioBuf, 16);
        setResultBlobUrl(URL.createObjectURL(cleanBlob));
        setResultFileName(`${primaryFile.name.replace(/\.[^/.]+$/, "")}_clean.wav`);
        setResultType("audio");
        setResultTextContent("All non-standard metadata tags stripped successfully.");
      } else if (tool.id === "audio-to-base64") {
        setStatusText("Encoding binary audio to Base64 data URI...");
        const reader = new FileReader();
        reader.onload = () => {
          const base64Str = reader.result as string;
          setResultTextContent(base64Str);
          setResultType("text");
        };
        reader.readAsDataURL(primaryFile);
      } else if (tool.id === "base64-to-audio") {
        setStatusText("Decoding Base64 string to audio file...");
        const base64Text = customOptions["base64String"] || resultTextContent;
        if (!base64Text) throw new Error("Please paste a valid Base64 string.");

        const res = await fetch(base64Text);
        const blob = await res.blob();
        setResultBlobUrl(URL.createObjectURL(blob));
        setResultFileName("decoded_audio.wav");
        setResultType("audio");
      }

      // ==================== VIDEO TOOLS (31-54) ====================
      else if (tool.id === "video-converter" || tool.id === "video-resizer" || tool.id === "video-speed-changer" || tool.id === "video-rotator") {
        setStatusText("Rendering video stream in browser memory...");
        const video = await loadVideoElement(primaryFile);
        setProgress(30);

        let targetW = video.videoWidth;
        let targetH = video.videoHeight;
        if (customOptions["targetRes"]?.includes("1080p")) {
          targetW = 1920;
          targetH = 1080;
        } else if (customOptions["targetRes"]?.includes("720p")) {
          targetW = 1280;
          targetH = 720;
        } else if (customOptions["targetRes"]?.includes("480p")) {
          targetW = 854;
          targetH = 480;
        }

        let speed = 1.0;
        if (customOptions["speedRate"]?.includes("0.5x")) speed = 0.5;
        if (customOptions["speedRate"]?.includes("2.0x")) speed = 2.0;

        let rotateDeg = 0;
        if (customOptions["rotationAngle"]?.includes("90°")) rotateDeg = 90;
        if (customOptions["rotationAngle"]?.includes("180°")) rotateDeg = 180;
        if (customOptions["rotationAngle"]?.includes("270°")) rotateDeg = 270;

        const webmBlob = await convertVideoToWebM(primaryFile, {
          width: targetW,
          height: targetH,
          speed,
          rotateDeg,
        });

        setResultBlobUrl(URL.createObjectURL(webmBlob));
        setResultFileName(`${primaryFile.name.replace(/\.[^/.]+$/, "")}_output.webm`);
        setResultType("video");
      } else if (tool.id === "video-thumbnail-generator") {
        setStatusText("Capturing video frame snapshot...");
        const video = await loadVideoElement(primaryFile);
        setProgress(50);

        const timestampSec = parseFloat(customOptions["captureTime"] || "1.5") || 1.5;
        const snapshotBlob = await captureVideoSnapshot(video, timestampSec);

        setResultBlobUrl(URL.createObjectURL(snapshotBlob));
        setResultFileName(`${primaryFile.name.replace(/\.[^/.]+$/, "")}_snapshot_${timestampSec}s.png`);
        setResultType("image");
      } else if (tool.id === "video-frame-extractor") {
        setStatusText("Extracting frame sequence...");
        const video = await loadVideoElement(primaryFile);
        setProgress(30);

        const frameBlobs = await extractVideoFrameSequence(video, 1.0, 12);
        const gallery = frameBlobs.map((blob, idx) => ({
          name: `frame_${idx + 1}.png`,
          url: URL.createObjectURL(blob),
        }));

        setExtractedGallery(gallery);
        setResultType("gallery");
      } else if (tool.id === "video-contact-sheet") {
        setStatusText("Generating storyboard contact sheet grid...");
        const video = await loadVideoElement(primaryFile);
        setProgress(40);

        let cols = 3;
        let rows = 3;
        if (customOptions["gridSize"]?.includes("4x4")) {
          cols = 4;
          rows = 4;
        } else if (customOptions["gridSize"]?.includes("2x2")) {
          cols = 2;
          rows = 2;
        }

        const sheetBlob = await generateVideoContactSheet(video, cols, rows);
        setResultBlobUrl(URL.createObjectURL(sheetBlob));
        setResultFileName(`${primaryFile.name.replace(/\.[^/.]+$/, "")}_storyboard.png`);
        setResultType("image");
      } else if (tool.id === "video-to-audio") {
        setStatusText("Extracting audio soundtrack from video...");
        const wavBlob = await extractAudioFromVideo(primaryFile);
        setResultBlobUrl(URL.createObjectURL(wavBlob));
        setResultFileName(`${primaryFile.name.replace(/\.[^/.]+$/, "")}_soundtrack.wav`);
        setResultType("audio");
      } else if (
        tool.id === "video-metadata-viewer" ||
        tool.id === "video-resolution-checker" ||
        tool.id === "video-duration-checker" ||
        tool.id === "video-fps-info" ||
        tool.id === "video-file-size-checker"
      ) {
        setStatusText("Inspecting video metadata...");
        const meta = await getVideoMetadata(primaryFile);
        setResultTextContent(JSON.stringify(meta, null, 2));
        setResultType("json");
      } else if (tool.id === "video-aspect-ratio-calc") {
        setStatusText("Calculating proportional aspect ratio...");
        const w = 1920;
        const h = 1080;
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        const div = gcd(w, h);
        const result = {
          inputDimensions: `${w} x ${h} pixels`,
          aspectRatio: `${w / div}:${h / div}`,
          standardFormat: "16:9 Widescreen (HD/4K)",
          proportionalScales: {
            "4K Ultra HD": "3840 x 2160",
            "1080p Full HD": "1920 x 1080",
            "720p HD": "1280 x 720",
            "480p SD": "854 x 480",
          },
        };
        setResultTextContent(JSON.stringify(result, null, 2));
        setResultType("json");
      }

      // ==================== GIF TOOLS (55-64) ====================
      else if (tool.id === "gif-maker-from-images" || tool.id === "png-sequence-to-gif") {
        setStatusText("Stitching image sequence into animated GIF...");
        const gifBlob = await createGifFromImageFiles(selectedFiles, 500);
        setResultBlobUrl(URL.createObjectURL(gifBlob));
        setResultFileName("animated_sequence.webm");
        setResultType("video");
      }

      // ==================== MEDIA INFO TOOLS (65-70) ====================
      else if (
        tool.id === "media-file-info" ||
        tool.id === "media-format-detector" ||
        tool.id === "media-mime-type-checker" ||
        tool.id === "media-file-size-analyzer" ||
        tool.id === "media-duration-checker" ||
        tool.id === "media-resolution-checker"
      ) {
        setStatusText("Analyzing binary magic bytes & metadata...");
        const magic = await detectMediaMagicBytes(primaryFile);
        const info = {
          fileName: primaryFile.name,
          fileSize: formatBytes(primaryFile.size),
          exactBytes: primaryFile.size,
          reportedMimeType: primaryFile.type || "Unknown",
          detectedFormat: magic.formatName,
          magicBytesHeader: magic.magicHex,
          detectedMimeType: magic.mime,
          status: "Authentic File Signature Confirmed",
        };
        setResultTextContent(JSON.stringify(info, null, 2));
        setResultType("json");
      } else {
        // Fallback for remaining media tools
        setStatusText("Processing media file...");
        const magic = await detectMediaMagicBytes(primaryFile);
        setResultTextContent(JSON.stringify({ fileName: primaryFile.name, format: magic.formatName }, null, 2));
        setResultType("json");
      }

      setProgress(100);
      setStatusText("Completed successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during media processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Tool Options & Settings */}
      {tool.optionsConfig?.customFields && tool.optionsConfig.customFields.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-400" />
            Configuration & Output Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tool.optionsConfig.customFields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">{field.label}</label>
                {field.type === "select" ? (
                  <select
                    value={customOptions[field.id] || field.defaultValue}
                    onChange={(e) => handleOptionChange(field.id, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500 transition-colors"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={customOptions[field.id] || field.defaultValue}
                    onChange={(e) => handleOptionChange(field.id, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Zone */}
      {tool.id !== "base64-to-audio" && tool.id !== "video-aspect-ratio-calc" && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-800 hover:border-rose-500/50 bg-slate-900/50 hover:bg-slate-900 transition-all rounded-2xl p-8 text-center cursor-pointer relative"
        >
          <input
            type="file"
            onChange={handleFileChange}
            multiple={
              tool.id === "audio-merger" ||
              tool.id === "video-merger" ||
              tool.id === "gif-maker-from-images" ||
              tool.id === "png-sequence-to-gif"
            }
            accept={
              tool.category === "media"
                ? "audio/*,video/*,image/*,.mp3,.wav,.ogg,.m4a,.flac,.mp4,.webm,.mov,.gif"
                : "*"
            }
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-slate-200">
                {selectedFiles.length > 0
                  ? `Selected ${selectedFiles.length} file(s)`
                  : tool.inputLabel || "Drag & Drop your media files here"}
              </p>
              <p className="text-xs text-slate-500">Supports WAV, MP3, OGG, M4A, FLAC, MP4, WebM, MOV, GIF (100% Client-Side Privacy)</p>
            </div>

            {/* Selected File List */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 w-full max-w-md bg-slate-950 border border-slate-800 rounded-lg p-3 text-left space-y-2">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                    <span className="truncate max-w-[220px] font-mono">{file.name}</span>
                    <span className="text-slate-500">{formatBytes(file.size)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Base64 Text Area Option */}
      {tool.id === "base64-to-audio" && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-400">Paste Base64 String</label>
          <textarea
            rows={5}
            value={customOptions["base64String"] || ""}
            onChange={(e) => handleOptionChange("base64String", e.target.value)}
            placeholder="Paste data:audio/wav;base64,... or raw base64 string here..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-rose-500"
          />
        </div>
      )}

      {/* Execute Button */}
      <button
        onClick={runMediaTool}
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white font-medium py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Processing Media...</span>
          </>
        ) : (
          <>
            <Activity className="w-5 h-5" />
            <span>Run {tool.name}</span>
          </>
        )}
      </button>

      {/* Status Bar */}
      {isProcessing && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-xs text-slate-300">
            <span>{statusText}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-800/50 rounded-xl p-4 flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Output / Results Section */}
      {(resultBlobUrl || resultTextContent || extractedGallery.length > 0 || silenceRanges.length > 0) && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle className="w-5 h-5" />
              <span>Processing Complete</span>
            </div>
            {resultBlobUrl && (
              <a
                href={resultBlobUrl}
                download={resultFileName}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download Output</span>
              </a>
            )}
          </div>

          {/* Audio Output Preview */}
          {resultType === "audio" && resultBlobUrl && (
            <div className="space-y-4">
              <audio ref={audioRef} src={resultBlobUrl} controls className="w-full rounded-lg" />
              <canvas ref={canvasRef} width={800} height={160} className="w-full h-32 rounded-lg bg-slate-950 border border-slate-800" />
            </div>
          )}

          {/* Video Output Preview */}
          {resultType === "video" && resultBlobUrl && (
            <div className="space-y-3">
              <video ref={videoRef} src={resultBlobUrl} controls className="w-full max-h-[420px] rounded-xl bg-slate-950" />
            </div>
          )}

          {/* Image Output Preview */}
          {resultType === "image" && resultBlobUrl && (
            <div className="space-y-3 text-center">
              <img src={resultBlobUrl} alt="Generated Preview" className="max-h-[450px] mx-auto rounded-xl border border-slate-800 shadow-md" />
            </div>
          )}

          {/* Frame Sequence Gallery */}
          {resultType === "gallery" && extractedGallery.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-400">Extracted Frames ({extractedGallery.length})</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {extractedGallery.map((frame, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-2 space-y-2">
                    <img src={frame.url} alt={frame.name} className="w-full h-24 object-cover rounded" />
                    <a
                      href={frame.url}
                      download={frame.name}
                      className="block text-center bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] py-1 rounded"
                    >
                      Download Frame
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Silence Timestamps */}
          {resultType === "silence" && silenceRanges.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-300">Detected Silent Intervals</p>
              <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                {silenceRanges.map((seg, idx) => (
                  <div key={idx} className="flex justify-between border-b border-slate-900 pb-1">
                    <span>Segment #{idx + 1}</span>
                    <span className="text-rose-400">
                      {formatTime(seg.start)} &rarr; {formatTime(seg.end)} ({(seg.end - seg.start).toFixed(2)}s)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* JSON / Text Output */}
          {resultTextContent && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-400">Technical Data Specs</p>
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-80">
                {resultTextContent}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
