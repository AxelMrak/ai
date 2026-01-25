# REMOTION-BEST-PRACTICES - TRANSCRIBE
> Generated: 2026-01-25
> Rules: 1


### RULE: transcribe-captions
(File: transcribe-captions.md)

# Transcribing audio

Remotion provides several built-in options for transcribing audio to generate captions:

- `@remotion/install-whisper-cpp` - Transcribe locally on a server using Whisper.cpp. Fast and free, but requires server infrastructure.
  https://remotion.dev/docs/install-whisper-cpp

- `@remotion/whisper-web` - Transcribe in the browser using WebAssembly. No server needed and free, but slower due to WASM overhead.
  https://remotion.dev/docs/whisper-web

- `@remotion/openai-whisper` - Use OpenAI Whisper API for cloud-based transcription. Fast and no server needed, but requires payment.
  https://remotion.dev/docs/openai-whisper/openai-whisper-api-to-captions
