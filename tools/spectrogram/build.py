"""Build src/data/trace-spectrogram.json: the spectrogram of the Trace example sentence (02 §8c).

The sentence comes from the first trace step in src/content/projects/voice-agent.md. Windows
text-to-speech (System.Speech, voice "Microsoft Zira Desktop") synthesizes it to a WAV file;
numpy computes an STFT (Hann window 1024, hop 256) whose log magnitude is normalized to 0..1,
stored as integers 0..99, and averaged down to 48 frequency rows x 96 time columns.

Run from the repo root on Windows, in a virtual environment with numpy and pyyaml:
    python -I tools/spectrogram/build.py
"""
import json
import pathlib
import re
import subprocess
import tempfile
import wave

import numpy as np
import yaml

VOICE = "Microsoft Zira Desktop"
ROWS, COLS = 48, 96
WINDOW, HOP = 1024, 256
MAX_HZ = 8000  # speech energy sits below this
ROOT = pathlib.Path.cwd()
OUT = ROOT / "src" / "data" / "trace-spectrogram.json"


def sentence() -> str:
    text = (ROOT / "src" / "content" / "projects" / "voice-agent.md").read_text(encoding="utf-8")
    front = yaml.safe_load(re.match(r"^---\n(.*?)\n---", text, re.S).group(1))
    return front["trace"][0]["output"]


def synthesize(text: str, path: pathlib.Path) -> None:
    script = (
        "Add-Type -AssemblyName System.Speech;"
        "$s = New-Object System.Speech.Synthesis.SpeechSynthesizer;"
        f"$s.SelectVoice('{VOICE}');"
        f"$s.SetOutputToWaveFile('{path}');"
        "$s.Speak($env:TRACE_SENTENCE);"
        "$s.Dispose()"
    )
    env = {**__import__("os").environ, "TRACE_SENTENCE": text}
    subprocess.run(["powershell", "-NoProfile", "-Command", script], check=True, env=env)


def read_wav(path: pathlib.Path) -> tuple[np.ndarray, int]:
    with wave.open(str(path), "rb") as wav:
        rate = wav.getframerate()
        frames = wav.readframes(wav.getnframes())
        width = wav.getsampwidth()
        channels = wav.getnchannels()
    dtype = {1: np.uint8, 2: np.int16, 4: np.int32}[width]
    samples = np.frombuffer(frames, dtype=dtype).astype(np.float64)
    if channels > 1:
        samples = samples.reshape(-1, channels).mean(axis=1)
    return samples / np.max(np.abs(samples)), rate


def spectrogram(samples: np.ndarray, rate: int) -> np.ndarray:
    window = np.hanning(WINDOW)
    frames = [samples[i : i + WINDOW] * window for i in range(0, len(samples) - WINDOW, HOP)]
    magnitude = np.abs(np.fft.rfft(np.array(frames), axis=1)).T  # (freq, time)
    freqs = np.fft.rfftfreq(WINDOW, 1 / rate)
    magnitude = magnitude[freqs <= MAX_HZ]
    level = np.log1p(magnitude * 50)
    # Drop the silent lead-in and tail so the speech fills the time axis.
    energy = level.mean(axis=0)
    voiced = np.where(energy > energy.max() * 0.15)[0]
    level = level[:, voiced.min() : voiced.max() + 1]
    # Average down to ROWS x COLS (frequency rows, low frequencies first).
    rows = np.array_split(level, ROWS, axis=0)
    level = np.array([r.mean(axis=0) for r in rows])
    cols = np.array_split(level, COLS, axis=1)
    level = np.array([c.mean(axis=1) for c in cols]).T
    lo, hi = np.percentile(level, [5, 99.5])
    return np.clip((level - lo) / (hi - lo), 0, 1)


def main() -> None:
    text = sentence()
    with tempfile.TemporaryDirectory() as tmp:
        wav_path = pathlib.Path(tmp) / "sentence.wav"
        synthesize(text, wav_path)
        samples, rate = read_wav(wav_path)
    grid = spectrogram(samples, rate)
    OUT.write_text(
        json.dumps(
            {
                "sentence": text,
                "voice": VOICE,
                "rows": ROWS,
                "cols": COLS,
                # Integers 0..scale keep the lazy chunk small; divide by scale for 0..1.
                "scale": 99,
                "values": [int(round(float(v) * 99)) for v in grid.flatten()],
            }
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"{ROWS}x{COLS} spectrogram of {len(samples) / rate:.2f}s of speech -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
