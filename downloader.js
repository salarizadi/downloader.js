/**
 *  Copyright (c) 2025
 *  @Version : 1.0.0
 *  @Author  : https://salarizadi.ir
 *  @Repository : https://github.com/salarizadi/downloader.js
 *  @Description: A class that handles file downloading with progress tracking and blob management
 *  Supports download progress, pause/stop functionality, and proper cleanup of resources
 */

(() => {

    class Downloader {

        /**
         * Initialize a new Downloader instance
         * Sets up abort controller and blob URL tracking
         */
        constructor () {
            this.controller = null;      // AbortController for cancelling downloads
            this.isPaused = false;       // Track pause state
            this.blobUrl = null;         // Store the blob URL for cleanup
        }

        /**
         * Download a file from the specified URL
         * @param {string} url - The URL to download from
         * @param {Object} options - Configuration options
         * @param {Function} [options.started] - Callback when download starts
         * @param {Function} [options.progress] - Callback for download progress
         * @param {Function} [options.success] - Callback on successful download
         * @param {Function} [options.failed] - Callback on download failure
         * @param {Object} [options.headers] - Custom headers for the request
         * @returns {Promise<string>} The blob URL of the downloaded file
         */
        async download (url, options = {}) {
            this.controller = new AbortController();
            const signal = this.controller.signal;

            try {
                // Set up request headers
                const headers = {
                    ...options.headers
                };

                // Call the started callback if provided
                if (options.started && typeof options.started === 'function') {
                    options.started.call(this);
                }

                // Initiate the download
                const response = await fetch(url, {
                    headers,
                    signal
                });

                // Check if the request was successful
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Get file metadata
                const contentType = response.headers.get('content-type');
                const reader = response.body.getReader();
                const contentLength = +response.headers.get('Content-Length');
                let receivedLength = 0;
                const chunks = [];

                // Read the response stream
                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        break;
                    }

                    // Store chunks and update progress
                    chunks.push(value);
                    receivedLength += value.length;

                    // Calculate and report download progress
                    if (contentLength) {
                        const percent = Math.round((receivedLength / contentLength) * 100);
                        if (options.progress && typeof options.progress === 'function') {
                            options.progress.call(this, percent);
                        }
                    }
                }

                // Clean up any existing blob URL
                if (this.blobUrl) {
                    URL.revokeObjectURL(this.blobUrl);
                }

                // Combine all chunks into a single Uint8Array
                const allChunks = new Uint8Array(receivedLength);
                let position = 0;
                for (const chunk of chunks) {
                    allChunks.set(chunk, position);
                    position += chunk.length;
                }

                // Free up memory by clearing the chunks array
                chunks.length = 0;

                // Create blob and URL
                const blob = new Blob([allChunks], { type: contentType });
                this.blobUrl = URL.createObjectURL(blob);

                // Call success callback if provided
                if (options.success && typeof options.success === 'function') {
                    options.success.call(this, this.blobUrl, contentType);
                }

                return this.blobUrl;

            } catch (error) {
                // Handle download errors
                if (options.failed && typeof options.failed === 'function') {
                    if (error.name === 'AbortError') {
                        options.failed.call(this, 'ABORTED', 'Download was stopped');
                    } else {
                        options.failed.call(this, 'ERROR', error.message);
                    }
                }
                throw error;
            }
        }

        /**
         * Stop the current download and cleanup resources
         */
        stop () {
            if (this.controller) {
                this.controller.abort();
                this.controller = null;
            }
            // Clean up blob URL
            if (this.blobUrl) {
                URL.revokeObjectURL(this.blobUrl);
                this.blobUrl = null;
            }
        }

        /**
         * Perform complete cleanup of resources
         */
        cleanup () {
            this.stop();
            if (this.blobUrl) {
                URL.revokeObjectURL(this.blobUrl);
                this.blobUrl = null;
            }
        }

    }

    /**
     * Extends String prototype to add download functionality
     * Allows for convenient string URL downloading: "http://example.com/file".download(options)
     * @param {Object} options - Download configuration options
     * @returns {Downloader} Instance of Downloader
     */
    String.prototype.download = function (options) {
        const downloader = new Downloader();
        downloader.download(this.toString(), options)
            .catch(error => {
                console.debug('Download error:', error);
                downloader.cleanup();
            });
        return downloader;
    };

    // Make Downloader class available globally
    window.Downloader = Downloader;

})();
