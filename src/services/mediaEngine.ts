/**
 * Mehzan Digital Tools Hub - Media Processing Engine
 * High-performance, 100% browser-side processing for Audio, Video, GIF and Media Tools.
 * Uses Web Audio API, OfflineAudioContext, HTML5 Canvas, MediaRecorder & Blob utilities.
 */

// Format Helper
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs.toString().padStart(2, "0")}:${remMins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}

// ==========================================
// 1. AUDIO PROCESSING ENGINE
// ==========================================

let sharedAudioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!sharedAudioContext || sharedAudioContext.state === "closed") {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === "suspended") {
    sharedAudioContext.resume();
  }
  return sharedAudioContext;
}

/**
 * Decode any uploaded audio file into an AudioBuffer using browser Web Audio API
 */
export async function decodeAudioFile(file: File): Promise<AudioBuffer> {
  const arrayBuffer = await file.arrayBuffer();
  const ctx = getAudioContext();
  // Duplicate arrayBuffer as decodeAudioData detaches the buffer
  return await ctx.decodeAudioData(arrayBuffer.slice(0));
}

/**
 * Convert AudioBuffer into a pristine 16-bit or 32-bit Float PCM WAV Blob
 */
export function encodeAudioBufferToWav(audioBuffer: AudioBuffer, bitDepth: 16 | 32 = 16): Blob {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = length * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  /* RIFF chunk descriptor */
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");

  /* fmt sub-chunk */
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // SubChunk1Size (16 for PCM)
  view.setUint16(20, bitDepth === 32 ? 3 : 1, true); // AudioFormat (1 = PCM, 3 = IEEE Float)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  /* data sub-chunk */
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // Write PCM audio samples
  let offset = 44;
  if (bitDepth === 16) {
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
        const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(offset, int16, true);
        offset += 2;
      }
    }
  } else {
    // 32-bit float
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = audioBuffer.getChannelData(channel)[i];
        view.setFloat32(offset, sample, true);
        offset += 4;
      }
    }
  }

  return new Blob([buffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Trim AudioBuffer from startSec to endSec
 */
export function trimAudioBuffer(buffer: AudioBuffer, startSec: number, endSec: number): AudioBuffer {
  const ctx = getAudioContext();
  const sampleRate = buffer.sampleRate;
  const startFrame = Math.max(0, Math.floor(startSec * sampleRate));
  const endFrame = Math.min(buffer.length, Math.floor(endSec * sampleRate));
  const frameCount = Math.max(1, endFrame - startFrame);

  const trimmed = ctx.createBuffer(buffer.numberOfChannels, frameCount, sampleRate);
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    const trimmedData = trimmed.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      trimmedData[i] = channelData[startFrame + i];
    }
  }
  return trimmed;
}

/**
 * Merge multiple AudioBuffers sequentially
 */
export function mergeAudioBuffers(buffers: AudioBuffer[]): AudioBuffer {
  if (buffers.length === 0) throw new Error("No audio buffers to merge.");
  if (buffers.length === 1) return buffers[0];

  const ctx = getAudioContext();
  const sampleRate = buffers[0].sampleRate;
  const numChannels = Math.max(...buffers.map((b) => b.numberOfChannels));
  const totalLength = buffers.reduce((acc, b) => acc + b.length, 0);

  const merged = ctx.createBuffer(numChannels, totalLength, sampleRate);

  let currentOffset = 0;
  for (const buf of buffers) {
    for (let channel = 0; channel < numChannels; channel++) {
      const targetChannel = merged.getChannelData(channel);
      const sourceChannel = buf.getChannelData(channel % buf.numberOfChannels);
      targetChannel.set(sourceChannel, currentOffset);
    }
    currentOffset += buf.length;
  }

  return merged;
}

/**
 * Apply gain factor to AudioBuffer
 */
export function changeAudioVolume(buffer: AudioBuffer, gainFactor: number): AudioBuffer {
  const ctx = getAudioContext();
  const adjusted = ctx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);

  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const src = buffer.getChannelData(channel);
    const dst = adjusted.getChannelData(channel);
    for (let i = 0; i < buffer.length; i++) {
      dst[i] = Math.max(-1, Math.min(1, src[i] * gainFactor));
    }
  }
  return adjusted;
}

/**
 * Apply Fade-In envelope
 */
export function applyAudioFadeIn(buffer: AudioBuffer, fadeSec: number): AudioBuffer {
  const ctx = getAudioContext();
  const result = ctx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  const fadeFrames = Math.min(buffer.length, Math.floor(fadeSec * buffer.sampleRate));

  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const src = buffer.getChannelData(channel);
    const dst = result.getChannelData(channel);
    for (let i = 0; i < buffer.length; i++) {
      if (i < fadeFrames) {
        const factor = Math.pow(i / fadeFrames, 2); // Exponential fade-in
        dst[i] = src[i] * factor;
      } else {
        dst[i] = src[i];
      }
    }
  }
  return result;
}

/**
 * Apply Fade-Out envelope
 */
export function applyAudioFadeOut(buffer: AudioBuffer, fadeSec: number): AudioBuffer {
  const ctx = getAudioContext();
  const result = ctx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  const totalFrames = buffer.length;
  const fadeFrames = Math.min(totalFrames, Math.floor(fadeSec * buffer.sampleRate));
  const startFadeFrame = totalFrames - fadeFrames;

  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const src = buffer.getChannelData(channel);
    const dst = result.getChannelData(channel);
    for (let i = 0; i < totalFrames; i++) {
      if (i >= startFadeFrame) {
        const progress = (totalFrames - i) / fadeFrames;
        const factor = Math.pow(progress, 2);
        dst[i] = src[i] * factor;
      } else {
        dst[i] = src[i];
      }
    }
  }
  return result;
}

/**
 * Change Audio Playback Speed / Tempo using OfflineAudioContext
 */
export async function changeAudioSpeed(buffer: AudioBuffer, speedRatio: number): Promise<AudioBuffer> {
  const newLength = Math.floor(buffer.length / speedRatio);
  const offlineCtx = new OfflineAudioContext(buffer.numberOfChannels, newLength, buffer.sampleRate);

  const source = offlineCtx.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = speedRatio;
  source.connect(offlineCtx.destination);
  source.start(0);

  return await offlineCtx.startRendering();
}

/**
 * Reverse AudioBuffer
 */
export function reverseAudioBuffer(buffer: AudioBuffer): AudioBuffer {
  const ctx = getAudioContext();
  const reversed = ctx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);

  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const src = buffer.getChannelData(channel);
    const dst = reversed.getChannelData(channel);
    const len = buffer.length;
    for (let i = 0; i < len; i++) {
      dst[i] = src[len - 1 - i];
    }
  }
  return reversed;
}

/**
 * Peak Normalization (0 dBFS max headroom)
 */
export function normalizeAudioBuffer(buffer: AudioBuffer): AudioBuffer {
  let maxPeak = 0;
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const channel = buffer.getChannelData(c);
    for (let i = 0; i < channel.length; i++) {
      const abs = Math.abs(channel[i]);
      if (abs > maxPeak) maxPeak = abs;
    }
  }

  if (maxPeak === 0 || maxPeak === 1) return buffer;
  const gain = 1.0 / maxPeak;
  return changeAudioVolume(buffer, gain);
}

/**
 * Resample / Compress AudioBuffer
 */
export async function resampleAudioBuffer(
  buffer: AudioBuffer,
  targetSampleRate: number,
  targetChannels: number = 1
): Promise<AudioBuffer> {
  const duration = buffer.duration;
  const newLength = Math.floor(duration * targetSampleRate);
  const offlineCtx = new OfflineAudioContext(targetChannels, newLength, targetSampleRate);

  const source = offlineCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(offlineCtx.destination);
  source.start(0);

  return await offlineCtx.startRendering();
}

/**
 * Silence Detection in AudioBuffer
 */
export function detectAudioSilence(
  buffer: AudioBuffer,
  thresholdDb: number = -45
): { start: number; end: number }[] {
  const thresholdLinear = Math.pow(10, thresholdDb / 20);
  const sampleRate = buffer.sampleRate;
  const channelData = buffer.getChannelData(0);
  const windowSize = Math.floor(sampleRate * 0.1); // 100ms window
  const silenceSegments: { start: number; end: number }[] = [];

  let inSilence = false;
  let silenceStart = 0;

  for (let i = 0; i < channelData.length; i += windowSize) {
    let sumSq = 0;
    const count = Math.min(windowSize, channelData.length - i);
    for (let j = 0; j < count; j++) {
      sumSq += channelData[i + j] * channelData[i + j];
    }
    const rms = Math.sqrt(sumSq / count);

    if (rms < thresholdLinear) {
      if (!inSilence) {
        inSilence = true;
        silenceStart = i / sampleRate;
      }
    } else {
      if (inSilence) {
        inSilence = false;
        const silenceEnd = i / sampleRate;
        if (silenceEnd - silenceStart >= 0.3) {
          silenceSegments.push({ start: silenceStart, end: silenceEnd });
        }
      }
    }
  }

  if (inSilence) {
    const silenceEnd = channelData.length / sampleRate;
    if (silenceEnd - silenceStart >= 0.3) {
      silenceSegments.push({ start: silenceStart, end: silenceEnd });
    }
  }

  return silenceSegments;
}

/**
 * Volume Analyzer (Peak dB, RMS dB, Dynamic Range)
 */
export function analyzeAudioVolume(buffer: AudioBuffer): {
  peakDb: number;
  rmsDb: number;
  dynamicRangeDb: number;
} {
  let maxPeak = 0;
  let totalSumSq = 0;
  let totalSamples = 0;

  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const channel = buffer.getChannelData(c);
    totalSamples += channel.length;
    for (let i = 0; i < channel.length; i++) {
      const val = Math.abs(channel[i]);
      if (val > maxPeak) maxPeak = val;
      totalSumSq += val * val;
    }
  }

  const rms = Math.sqrt(totalSumSq / (totalSamples || 1));
  const peakDb = maxPeak > 0 ? 20 * Math.log10(maxPeak) : -100;
  const rmsDb = rms > 0 ? 20 * Math.log10(rms) : -100;

  return {
    peakDb: parseFloat(peakDb.toFixed(2)),
    rmsDb: parseFloat(rmsDb.toFixed(2)),
    dynamicRangeDb: parseFloat((peakDb - rmsDb).toFixed(2)),
  };
}

/**
 * Render Audio Waveform to Canvas
 */
export function renderAudioWaveformToCanvas(
  buffer: AudioBuffer,
  canvas: HTMLCanvasElement,
  theme: string = "Indigo Gradient"
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  // Background
  ctx.fillStyle = "#0f172a"; // dark slate
  ctx.fillRect(0, 0, width, height);

  const channelData = buffer.getChannelData(0);
  const step = Math.ceil(channelData.length / width);
  const amp = height / 2;

  // Color theme gradient
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  if (theme.includes("Emerald")) {
    gradient.addColorStop(0, "#10b981");
    gradient.addColorStop(1, "#06b6d4");
  } else if (theme.includes("Cyberpunk")) {
    gradient.addColorStop(0, "#ec4899");
    gradient.addColorStop(1, "#8b5cf6");
  } else if (theme.includes("Monochrome")) {
    gradient.addColorStop(0, "#e2e8f0");
    gradient.addColorStop(1, "#94a3b8");
  } else {
    gradient.addColorStop(0, "#6366f1");
    gradient.addColorStop(1, "#a855f7");
  }

  ctx.fillStyle = gradient;

  for (let i = 0; i < width; i++) {
    let min = 1.0;
    let max = -1.0;
    for (let j = 0; j < step; j++) {
      const datum = channelData[i * step + j];
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }
    const barHeight = Math.max(2, (max - min) * amp);
    ctx.fillRect(i, amp - barHeight / 2, 2, barHeight);
  }
}

// ==========================================
// 2. VIDEO PROCESSING ENGINE
// ==========================================

export function loadVideoElement(file: File | Blob): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.autoplay = false;
    video.muted = true;
    video.playsInline = true;

    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      resolve(video);
    };
    video.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video file. Codec or container unsupported by browser."));
    };
  });
}

export async function getVideoMetadata(file: File): Promise<{
  width: number;
  height: number;
  duration: number;
  mimeType: string;
  sizeFormatted: string;
  aspectRatio: string;
}> {
  const video = await loadVideoElement(file);
  const w = video.videoWidth;
  const h = video.videoHeight;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const common = gcd(w, h);
  const ratioStr = common > 0 ? `${w / common}:${h / common}` : "16:9";

  return {
    width: w,
    height: h,
    duration: video.duration,
    mimeType: file.type || "video/mp4",
    sizeFormatted: formatBytes(file.size),
    aspectRatio: ratioStr,
  };
}

/**
 * Capture High-Res Snapshot Frame at specified timestamp
 */
export function captureVideoSnapshot(
  video: HTMLVideoElement,
  timestampSec: number,
  targetWidth?: number,
  targetHeight?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    video.currentTime = Math.min(timestampSec, video.duration - 0.1);

    video.onseeked = () => {
      const w = targetWidth || video.videoWidth;
      const h = targetHeight || video.videoHeight;
      canvas.width = w;
      canvas.height = h;

      if (ctx) {
        ctx.drawImage(video, 0, 0, w, h);
      }

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to render video snapshot."));
      }, "image/png");
    };
  });
}

/**
 * Extract sequence of snapshot frames across video duration
 */
export async function extractVideoFrameSequence(
  video: HTMLVideoElement,
  intervalSec: number = 1.0,
  maxFrames: number = 12
): Promise<Blob[]> {
  const totalSec = video.duration;
  const blobs: Blob[] = [];

  for (let t = 0; t < totalSec && blobs.length < maxFrames; t += intervalSec) {
    try {
      const blob = await captureVideoSnapshot(video, t);
      blobs.push(blob);
    } catch (e) {
      // skip frame on seek error
    }
  }
  return blobs;
}

/**
 * Generate Video Contact Sheet Storyboard Grid
 */
export async function generateVideoContactSheet(
  video: HTMLVideoElement,
  cols: number = 3,
  rows: number = 3
): Promise<Blob> {
  const totalFrames = cols * rows;
  const stepSec = video.duration / (totalFrames + 1);

  const tileW = 320;
  const tileH = Math.round((video.videoHeight / (video.videoWidth || 1)) * tileW);
  const headerH = 60;

  const canvas = document.createElement("canvas");
  canvas.width = tileW * cols;
  canvas.height = tileH * rows + headerH;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context uninitialized.");

  // Dark background
  ctx.fillStyle = "#090d16";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Header Title
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText(`Video Storyboard - Duration: ${formatTime(video.duration)} | Resolution: ${video.videoWidth}x${video.videoHeight}`, 20, 36);

  let frameIdx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      frameIdx++;
      const timeStamp = frameIdx * stepSec;

      await new Promise<void>((resolve) => {
        video.currentTime = Math.min(timeStamp, video.duration - 0.1);
        video.onseeked = () => {
          const x = c * tileW;
          const y = headerH + r * tileH;

          // Draw video tile
          ctx.drawImage(video, x, y, tileW, tileH);

          // Tile Border
          ctx.strokeStyle = "#1e293b";
          ctx.strokeRect(x, y, tileW, tileH);

          // Timestamp overlay box
          ctx.fillStyle = "rgba(0,0,0,0.7)";
          ctx.fillRect(x + 8, y + tileH - 28, 70, 20);

          ctx.fillStyle = "#38bdf8";
          ctx.font = "bold 11px monospace";
          ctx.fillText(formatTime(timeStamp), x + 14, y + tileH - 14);

          resolve();
        };
      });
    }
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

/**
 * Convert or Resize Video to WebM / GIF using Canvas Stream Recording
 */
export async function convertVideoToWebM(
  videoFile: File,
  options: {
    startTime?: number;
    endTime?: number;
    width?: number;
    height?: number;
    speed?: number;
    rotateDeg?: number;
    flipH?: boolean;
    flipV?: boolean;
    quality?: string;
  } = {}
): Promise<Blob> {
  const video = await loadVideoElement(videoFile);
  const startTime = options.startTime || 0;
  const endTime = options.endTime || video.duration;
  const speed = options.speed || 1.0;

  const targetW = options.width || video.videoWidth;
  const targetH = options.height || video.videoHeight;

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context error.");

  const stream = canvas.captureStream(30);

  // Check supported mime types
  let mimeType = "video/webm;codecs=vp8";
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = "video/webm";
  }

  const mediaRecorder = new MediaRecorder(stream, { mimeType });
  const chunks: Blob[] = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  video.currentTime = startTime;
  video.playbackRate = speed;

  return new Promise((resolve, reject) => {
    mediaRecorder.onstop = () => {
      const recordedBlob = new Blob(chunks, { type: mimeType });
      resolve(recordedBlob);
    };

    video.onseeked = () => {
      mediaRecorder.start();
      video.play();

      function drawFrame() {
        if (video.paused || video.ended || video.currentTime >= endTime) {
          video.pause();
          if (mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
          }
          return;
        }

        ctx!.save();
        ctx!.clearRect(0, 0, targetW, targetH);

        // Apply Transforms (Rotation / Flipper)
        if (options.rotateDeg || options.flipH || options.flipV) {
          ctx!.translate(targetW / 2, targetH / 2);
          if (options.rotateDeg) {
            ctx!.rotate((options.rotateDeg * Math.PI) / 180);
          }
          ctx!.scale(options.flipH ? -1 : 1, options.flipV ? -1 : 1);
          ctx!.drawImage(video, -targetW / 2, -targetH / 2, targetW, targetH);
        } else {
          ctx!.drawImage(video, 0, 0, targetW, targetH);
        }

        ctx!.restore();
        requestAnimationFrame(drawFrame);
      }

      drawFrame();
    };
  });
}

/**
 * Extract Audio Track from Video File as WAV Blob
 */
export async function extractAudioFromVideo(videoFile: File): Promise<Blob> {
  const arrayBuf = await videoFile.arrayBuffer();
  const audioCtx = getAudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuf.slice(0));
  return encodeAudioBufferToWav(audioBuffer, 16);
}

// ==========================================
// 3. GIF PROCESSING ENGINE
// ==========================================

export async function createGifFromImageFiles(files: File[], frameDelayMs: number = 500): Promise<Blob> {
  if (files.length === 0) throw new Error("Please select images for the GIF sequence.");

  const images: HTMLImageElement[] = await Promise.all(
    files.map(
      (file) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load image ${file.name}`));
          img.src = URL.createObjectURL(file);
        })
    )
  );

  const maxW = Math.max(...images.map((img) => img.naturalWidth || 600));
  const maxH = Math.max(...images.map((img) => img.naturalHeight || 400));

  const canvas = document.createElement("canvas");
  canvas.width = maxW;
  canvas.height = maxH;
  const ctx = canvas.getContext("2d");

  const stream = canvas.captureStream(1000 / frameDelayMs);

  let mimeType = "video/webm;codecs=vp8";
  if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = "video/webm";

  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  return new Promise((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: mimeType }));
    };

    recorder.start();
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx >= images.length) {
        clearInterval(interval);
        recorder.stop();
        return;
      }

      const img = images[currentIdx];
      ctx!.clearRect(0, 0, maxW, maxH);
      ctx!.drawImage(img, 0, 0, maxW, maxH);
      currentIdx++;
    }, frameDelayMs);
  });
}

/**
 * Detect Media Magic Byte Signature
 */
export async function detectMediaMagicBytes(file: File): Promise<{
  magicHex: string;
  formatName: string;
  mime: string;
}> {
  const buf = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buf);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join(" ");

  let formatName = "Unknown Binary Media";
  let mime = file.type || "application/octet-stream";

  if (hex.startsWith("52 49 46 46")) {
    formatName = "RIFF Container (WAV Audio / AVI)";
    mime = "audio/wav";
  } else if (hex.startsWith("49 44 33")) {
    formatName = "MP3 Audio (ID3v2 Header)";
    mime = "audio/mpeg";
  } else if (hex.startsWith("66 4C 61 43")) {
    formatName = "FLAC Lossless Audio";
    mime = "audio/flac";
  } else if (hex.startsWith("4F 67 67 53")) {
    formatName = "Ogg Container (OGG Vorbis/Opus)";
    mime = "audio/ogg";
  } else if (hex.includes("66 74 79 70")) {
    formatName = "MPEG-4 Container (MP4 / M4A / MOV)";
    mime = "video/mp4";
  } else if (hex.startsWith("1A 45 DF A3")) {
    formatName = "Matroska / WebM Container";
    mime = "video/webm";
  } else if (hex.startsWith("47 49 46 38")) {
    formatName = "GIF Graphic Interchange Format";
    mime = "image/gif";
  }

  return { magicHex: hex, formatName, mime };
}
