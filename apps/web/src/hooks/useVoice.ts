'use client';

import { useState, useRef, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { ApiResponse } from '@nexus/types';

type RecordingState = 'idle' | 'recording' | 'processing' | 'error';

interface TranscriptionResult {
  text:       string;
  durationMs: number;
  language:   string;
}

export function useVoice() {
  const [state,      setState]      = useState<RecordingState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [error,      setError]      = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef        = useRef<Blob[]>([]);
  const startTimeRef     = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder  = new MediaRecorder(stream, { mimeType });
      chunksRef.current    = [];
      startTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setState('processing');
        stream.getTracks().forEach((t) => t.stop());

        const blob       = new Blob(chunksRef.current, { type: mimeType });
        const durationMs = Date.now() - startTimeRef.current;

        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          if (!base64) { setState('error'); return; }

          try {
            const { data } = await apiClient.post<ApiResponse<TranscriptionResult>>(
              ENDPOINTS.buddy.transcribe,
              { audioBlob: base64, mimeType, durationMs },
            );
            setTranscript(data.data.text);
            setState('idle');
          } catch {
            setError('Transcription failed — please try again.');
            setState('error');
          }
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // collect chunks every 100 ms
      setState('recording');
    } catch {
      setError('Microphone access denied. Allow mic access and try again.');
      setState('error');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
    setState('idle');
  }, []);

  return {
    state,
    transcript,
    error,
    isRecording:  state === 'recording',
    isProcessing: state === 'processing',
    startRecording,
    stopRecording,
    clearTranscript,
  };
}