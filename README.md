# downloader.js

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/salarizadi/downloader.js/blob/main/LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/salarizadi/downloader.js)

A lightweight, powerful JavaScript library for handling file downloads with progress tracking, pause/stop functionality, and proper resource management. This library provides a clean API for downloading files with progress monitoring, custom headers support, and automatic cleanup of resources.

## Live Demo

Check out the live demo on CodePen: [Downloader.js Demo](https://codepen.io/salariz/pen/emYrJvR)

## Features

- 🚀 Progress tracking with percentage updates
- ⏸️ Download control (stop/cleanup)
- 🔄 Automatic resource cleanup
- 📑 Custom headers support
- 🎯 Event-based callbacks
- 💾 Blob URL management
- 🧩 String prototype extension for convenient usage
- ⚡ Promise-based async/await support

## Installation
```html
<script src="downloader.js"></script>
```

## Usage

### Method 1: Using the Downloader Class

```javascript
// Example usage with custom headers
const headers = {
    "Authorization": "Bearer token123",
    "Custom-Header": "value"
};

const downloader = new Downloader();
downloader.download(url, {
    headers: headers,
    started: function () {
        console.log('Download started', this);
    },
    progress: function (percent) {
        console.log(`Progress: ${percent}%`);
        // Uncomment to stop download at specific progress
        // if (percent >= 30 && percent < 90)
        //   this.stop();
    },
    success: function (blobUrl, contentType) {
        console.log('Download completed:', blobUrl);
    },
    failed: function (type, message) {
        console.error('Download failed:', type, message);
    }
});
```

### Method 2: Using String Extension (Recommended)

```javascript
// Example usage with string extension
const headers = {
    "Authorization": "Bearer token123",
    "Custom-Header": "value"
};

const file = 'https://example.com/file.pdf'.download({
    headers: headers,
    started: function () {
        console.log('Download started', this);
    },
    progress: function (percent) {
        console.log(`Progress: ${percent}%`);
    },
    success: function (blobUrl, contentType) {
        console.log('Download completed:', blobUrl);
    },
    failed: function (type, message) {
        console.error('Download failed:', type, message);
    }
});

// Stop download if needed
// file.stop();
```

## API Reference

### Downloader Class

#### Constructor
```javascript
const downloader = new Downloader();
```

#### Methods

##### `download(url, options)`
Initiates a file download with progress tracking.

Parameters:
- `url` (string): The URL to download from
- `options` (Object):
  - `headers` (Object): Custom request headers
  - `started` (Function): Callback when download starts
  - `progress` (Function): Callback for download progress
  - `success` (Function): Callback on successful download
  - `failed` (Function): Callback on download failure

Returns: Promise<string> (blob URL)

##### `stop()`
Stops the current download and cleans up resources.

##### `cleanup()`
Performs complete cleanup of resources.

### String Prototype Extension

The library extends the String prototype to add download functionality:

```javascript
"http://example.com/file".download(options)
```

## Callback Events

### started
Called when the download begins
```javascript
started: function () {
    console.log('Download started');
}
```

### progress
Called during download with percentage
```javascript
progress: function (percent) {
    console.log(`Progress: ${percent}%`);
}
```

### success
Called when download completes successfully
```javascript
success: function (blobUrl, contentType) {
    console.log('Download completed:', blobUrl);
}
```

### failed
Called when download fails
```javascript
failed: function (type, message) {
    console.error('Download failed:', type, message);
}
```

## License

MIT © [Salar Izadi](https://salarizadi.ir)

## Author

- Website: [https://salarizadi.ir](https://salarizadi.ir)
- GitHub: [@salarizadi](https://github.com/salarizadi)

## Support

If you find this project useful, please consider giving it a ⭐️ on GitHub!
