import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Type, Image as ImageIcon, Upload, FileText, AlertCircle, Mic, Video, Music, Square, AudioLines, FileVideo, FileAudio, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { DynamicBackground } from './backgrounds/DynamicBackground';

export type InputMode = 'text' | 'image' | 'speech' | 'video' | 'audio';

interface InputSectionProps {
  onSubmitText: (text: string) => void;
  onSubmitImage: (file: File) => void;
  isLoading?: boolean;
}

const MODES = [
  { id: 'text', icon: Type, label: 'Text', color: 'text-teal-400', bg: 'bg-teal-500/20', border: 'border-teal-500/30' },
  { id: 'image', icon: ImageIcon, label: 'Image', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
  { id: 'speech', icon: Mic, label: 'Speech', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
  { id: 'video', icon: Video, label: 'Video', color: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/30' },
  { id: 'audio', icon: Music, label: 'Audio', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' }
] as const;

export function InputSection({ onSubmitText, onSubmitImage, isLoading }: InputSectionProps) {
  const [mode, setMode] = useState<InputMode>('text');
  
  // States
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New Modes States
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => setRecordTime(t => t + 1), 1000);
    } else {
      setRecordTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const onDropImage = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) return setError('Image size safely limited to 10MB');
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const onDropVideo = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 50 * 1024 * 1024) return setError('Video size safely limited to 50MB');
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  }, []);

  const onDropAudio = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 20 * 1024 * 1024) return setError('Audio size safely limited to 20MB');
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps: getImageProps, getInputProps: getImageInputProps, isDragActive: isImageDrag } = useDropzone({
    onDrop: onDropImage, accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] }, maxFiles: 1
  });

  const { getRootProps: getVideoProps, getInputProps: getVideoInputProps, isDragActive: isVideoDrag } = useDropzone({
    onDrop: onDropVideo, accept: { 'video/mp4': [], 'video/webm': [], 'video/ogg': [] }, maxFiles: 1
  });

  const { getRootProps: getAudioProps, getInputProps: getAudioInputProps, isDragActive: isAudioDrag } = useDropzone({
    onDrop: onDropAudio, accept: { 'audio/mpeg': [], 'audio/wav': [], 'audio/ogg': [] }, maxFiles: 1
  });

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (mode === 'text') {
      if (!text.trim()) return setError("Please enter content to analyze");
      if (text.length < 10) return setError("Please enter at least 10 characters for a meaningful analysis.");
      onSubmitText(text);
    } else if (mode === 'image') {
      if (!imageFile) return setError("Please upload an image to analyze");
      onSubmitImage(imageFile);
    } else if (mode === 'speech') {
      if (!isRecording && recordTime === 0) return setError("Please record speech to analyze");
      setIsRecording(false);
      onSubmitText(`[Simulated Speech Transcript after ${recordTime}s of recording]`);
    } else if (mode === 'video') {
      if (!videoFile) return setError("Please upload a video to analyze");
      onSubmitImage(videoFile); // processing as file
    } else if (mode === 'audio') {
      if (!audioFile) return setError("Please upload audio to analyze");
      onSubmitImage(audioFile); // processing as file
    }
  };

  const handleModeChange = (newMode: InputMode) => {
    setMode(newMode);
    setError(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-6 relative"
    >
      <DynamicBackground mode={mode} />
      
      {/* Background Mode Glow */}
      <div className={cn(
          "absolute -inset-10 blur-3xl opacity-20 transition-colors duration-1000 -z-10",
          MODES.find(m => m.id === mode)?.bg
      )} />

      <div className="relative group/container">
        <div className="glass-panel p-6 md:p-8 relative overflow-hidden bg-background/80 backdrop-blur-xl border-white/10 transition-colors shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Header & Mode selection */}
          <div className="flex flex-col items-center justify-center mb-8">
            <h2 className="text-3xl font-bold tracking-widest text-zinc-100 mb-6 font-doto uppercase">Content Risk Assessment</h2>
            
            <div className="flex flex-wrap justify-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10 mx-auto overflow-hidden shadow-inner w-full md:w-auto">
              {MODES.map((m) => {
                const isActive = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleModeChange(m.id as InputMode)}
                    type="button"
                    className={cn(
                      "relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-doto font-medium transition-all duration-300 z-10 flex-1 md:flex-none uppercase tracking-wider",
                      isActive ? `${m.color} shadow-sm` : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-tab"
                        className={cn("absolute inset-0 rounded-lg border", m.bg, m.border)}
                        initial={false}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <m.icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10 hidden sm:inline">{m.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* TEXT MODE */}
            {mode === 'text' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-2"
              >
                <div className="relative group/textarea">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover/textarea:opacity-100 transition duration-500" />
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to analyze... (e.g. news article, social media post, transcript)"
                    className="relative w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all font-roboto resize-none"
                    disabled={isLoading}
                  />
                  <div className="absolute right-4 bottom-4 text-xs font-doto text-zinc-500">
                    {text.length} chars
                  </div>
                </div>
              </motion.div>
            )}

            {/* IMAGE MODE */}
            {mode === 'image' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {!previewUrl ? (
                  <div 
                    {...getImageProps()} 
                    className={cn(
                      "relative h-48 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 font-roboto",
                      isImageDrag 
                        ? "border-amber-500 bg-amber-500/10 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]" 
                        : "border-white/10 bg-black/40 text-zinc-500 hover:bg-white/5 hover:border-amber-500/50 hover:text-amber-400 group/dropzone"
                    )}
                  >
                    <input {...getImageInputProps()} disabled={isLoading} />
                    <motion.div whileHover={{ scale: 1.1 }} className="p-4 rounded-full bg-white/5 mb-4 group-hover/dropzone:bg-amber-500/20 transition-colors">
                      <Upload className="w-8 h-8" />
                    </motion.div>
                    <p className="text-sm font-medium mb-1 font-doto uppercase">Drag and drop your image here</p>
                    <p className="text-xs opacity-60">or click to browse from your computer</p>
                    <p className="text-xs opacity-40 mt-4 font-doto">JPEG, PNG, WebP up to 10MB</p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 group/preview h-64 flex items-center justify-center">
                    <img src={previewUrl} alt="Preview" className="max-h-full object-contain" />
                    {!isLoading && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setImageFile(null); setPreviewUrl(null); }}
                          className="p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all font-doto uppercase text-sm tracking-wider flex items-center gap-2"
                        >
                          <X className="w-4 h-4" /> Remove Image
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* SPEECH MODE */}
            {mode === 'speech' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-48 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-6 bg-black/40"
              >
                <div className="relative">
                  {isRecording && <div className="absolute -inset-6 bg-rose-500/30 blur-2xl rounded-full animate-pulse z-0" />}
                  <motion.button
                     type="button"
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setIsRecording(!isRecording)}
                     disabled={isLoading}
                     className={cn("relative p-6 rounded-full border-2 transition-all z-10", isRecording ? "border-rose-500 bg-rose-500/20 text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.4)]" : "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20")}
                  >
                     {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </motion.button>
                </div>
                <div className="mt-6 font-doto text-3xl text-zinc-200 tracking-[0.2em]">
                   00:{recordTime.toString().padStart(2, '0')}
                </div>
                <p className="font-doto text-xs mt-2 text-zinc-500 uppercase tracking-widest">
                   {isRecording ? "Recording in Progress..." : "Click to Record"}
                </p>
              </motion.div>
            )}

            {/* VIDEO MODE */}
            {mode === 'video' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {!videoUrl ? (
                  <div 
                    {...getVideoProps()} 
                    className={cn(
                      "relative h-48 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 font-roboto",
                      isVideoDrag 
                        ? "border-rose-500 bg-rose-500/10 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]" 
                        : "border-white/10 bg-black/40 text-zinc-500 hover:bg-white/5 hover:border-rose-500/50 hover:text-rose-400 group/dropzone"
                    )}
                  >
                    <input {...getVideoInputProps()} disabled={isLoading} />
                    <motion.div whileHover={{ scale: 1.1 }} className="p-4 rounded-full bg-white/5 mb-4 group-hover/dropzone:bg-rose-500/20 transition-colors">
                      <FileVideo className="w-8 h-8" />
                    </motion.div>
                    <p className="text-sm font-medium mb-1 font-doto uppercase">Drag and drop your video here</p>
                    <p className="text-xs opacity-60">or click to browse from your computer</p>
                    <p className="text-xs opacity-40 mt-4 font-doto">MP4, WebM up to 50MB</p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 group/preview h-64 flex items-center justify-center">
                    <video controls src={videoUrl} className="w-full h-full object-contain bg-black" />
                    {!isLoading && (
                      <div className="absolute top-4 right-4 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-opacity backdrop-blur-sm rounded-xl">
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setVideoFile(null); setVideoUrl(null); }}
                          className="p-2 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all font-doto uppercase text-xs"
                        >
                           Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* AUDIO MODE */}
            {mode === 'audio' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {!audioUrl ? (
                  <div 
                    {...getAudioProps()} 
                    className={cn(
                      "relative h-48 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 font-roboto",
                      isAudioDrag 
                        ? "border-purple-500 bg-purple-500/10 text-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]" 
                        : "border-white/10 bg-black/40 text-zinc-500 hover:bg-white/5 hover:border-purple-500/50 hover:text-purple-400 group/dropzone"
                    )}
                  >
                    <input {...getAudioInputProps()} disabled={isLoading} />
                    <motion.div whileHover={{ scale: 1.1 }} className="p-4 rounded-full bg-white/5 mb-4 group-hover/dropzone:bg-purple-500/20 transition-colors">
                      <FileAudio className="w-8 h-8" />
                    </motion.div>
                    <p className="text-sm font-medium mb-1 font-doto uppercase">Drag and drop your audio here</p>
                    <p className="text-xs opacity-60">or click to browse from your computer</p>
                    <p className="text-xs opacity-40 mt-4 font-doto">MP3, WAV up to 20MB</p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 group/preview h-48 flex flex-col items-center justify-center p-6">
                    <AudioLines className="w-16 h-16 text-purple-400 mb-6 animate-pulse" />
                    <audio controls src={audioUrl} className="w-full max-w-md" />
                    {!isLoading && (
                      <div className="absolute top-4 right-4 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-opacity backdrop-blur-sm rounded-xl">
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setAudioFile(null); setAudioUrl(null); }}
                          className="p-2 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all font-doto uppercase text-xs"
                        >
                           Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-lg font-doto uppercase tracking-wider"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="pt-4">
              <motion.button
                whileHover={!isLoading && !isRecording ? { scale: 1.02 } : {}}
                whileTap={!isLoading && !isRecording ? { scale: 0.98 } : {}}
                type="submit"
                disabled={isLoading || isRecording}
                className={cn(
                  "w-full py-4 rounded-xl font-bold transition-all duration-300 font-doto tracking-widest uppercase relative border shadow-[0_0_20px_rgba(255,255,255,0.05)]",
                  isLoading || isRecording
                    ? "bg-white/5 text-white/50 cursor-not-allowed border-white/10" 
                    : "bg-blue-600 hover:bg-blue-500 text-white border-blue-500/30"
                )}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="opacity-80">INITIALIZING ANALYSIS...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>RUN ANALYSIS PROTOCOL</span>
                  </div>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
