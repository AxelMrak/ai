# REMOTION-BEST-PRACTICES - GET
> Generated: 2026-01-25
> Rules: 3


### RULE: get-audio-duration
(File: get-audio-duration.md)

# Getting audio duration with Mediabunny

Mediabunny can extract the duration of an audio file. It works in browser, Node.js, and Bun environments.

## Getting audio duration

```tsx
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";

export const getAudioDuration = async (src: string) => {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(src, {
      getRetryDelay: () => null,
    }),
  });

  const durationInSeconds = await input.computeDuration();
  return durationInSeconds;
};
```

## Usage

```tsx
const duration = await getAudioDuration("https://remotion.media/audio.mp3");
console.log(duration); // e.g. 180.5 (seconds)
```

## Using with local files

For local files, use `FileSource` instead of `UrlSource`:

```tsx
import { Input, ALL_FORMATS, FileSource } from "mediabunny";

const input = new Input({
  formats: ALL_FORMATS,
  source: new FileSource(file), // File object from input or drag-drop
});

const durationInSeconds = await input.computeDuration();
```

## Using with staticFile in Remotion

```tsx
import { staticFile } from "remotion";

const duration = await getAudioDuration(staticFile("audio.mp3"));
```

### RULE: get-video-dimensions
(File: get-video-dimensions.md)

# Getting video dimensions with Mediabunny

Mediabunny can extract the width and height of a video file. It works in browser, Node.js, and Bun environments.

## Getting video dimensions

```tsx
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";

export const getVideoDimensions = async (src: string) => {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(src, {
      getRetryDelay: () => null,
    }),
  });

  const videoTrack = await input.getPrimaryVideoTrack();
  if (!videoTrack) {
    throw new Error("No video track found");
  }

  return {
    width: videoTrack.displayWidth,
    height: videoTrack.displayHeight,
  };
};
```

## Usage

```tsx
const dimensions = await getVideoDimensions("https://remotion.media/video.mp4");
console.log(dimensions.width);  // e.g. 1920
console.log(dimensions.height); // e.g. 1080
```

## Using with local files

For local files, use `FileSource` instead of `UrlSource`:

```tsx
import { Input, ALL_FORMATS, FileSource } from "mediabunny";

const input = new Input({
  formats: ALL_FORMATS,
  source: new FileSource(file), // File object from input or drag-drop
});

const videoTrack = await input.getPrimaryVideoTrack();
const width = videoTrack.displayWidth;
const height = videoTrack.displayHeight;
```

## Using with staticFile in Remotion

```tsx
import { staticFile } from "remotion";

const dimensions = await getVideoDimensions(staticFile("video.mp4"));
```

### RULE: get-video-duration
(File: get-video-duration.md)

# Getting video duration with Mediabunny

Mediabunny can extract the duration of a video file. It works in browser, Node.js, and Bun environments.

## Getting video duration

```tsx
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";

export const getVideoDuration = async (src: string) => {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(src, {
      getRetryDelay: () => null,
    }),
  });

  const durationInSeconds = await input.computeDuration();
  return durationInSeconds;
};
```

## Usage

```tsx
const duration = await getVideoDuration("https://remotion.media/video.mp4");
console.log(duration); // e.g. 10.5 (seconds)
```

## Using with local files

For local files, use `FileSource` instead of `UrlSource`:

```tsx
import { Input, ALL_FORMATS, FileSource } from "mediabunny";

const input = new Input({
  formats: ALL_FORMATS,
  source: new FileSource(file), // File object from input or drag-drop
});

const durationInSeconds = await input.computeDuration();
```

## Using with staticFile in Remotion

```tsx
import { staticFile } from "remotion";

const duration = await getVideoDuration(staticFile("video.mp4"));
```
