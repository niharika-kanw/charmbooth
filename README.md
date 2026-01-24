# SnapCute Cam

Fast, cute, shareable web camera MVP with filters, draggable stickers, and one-tap capture.

## Run locally
Camera access requires a secure context, so use localhost:

```bash
cd /Users/niharikakanwar/snap
python3 -m http.server 5173
```

Then open `http://localhost:5173` in your browser.

## Features
- Live camera preview with cute filters
- Draggable emoji stickers with resize (scroll wheel/trackpad)
- One-tap capture and download
- Mirror preview toggle and camera flip

## Resume-ready bullets
- Built a camera-first web app with live filters, draggable sticker overlays, and one-tap export using WebRTC, Canvas, and custom pointer interactions.
- Implemented client-side media rendering pipeline with filter compositing and emoji overlay rendering for fast, offline-capable capture.
- Designed polished UI with responsive layout and interactive controls optimized for quick demo and sharing.
