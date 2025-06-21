const express = require("express");
const multer = require("multer");
const { execFile, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");
const http = require("http");

// Configuration
const PORT = process.env.PORT || 3000;
const SOCKET_TIMEOUT = process.env.SOCKET_TIMEOUT || 20;
const DOWNLOAD_DIR = path.join(__dirname, "downloads");
const UPLOAD_DIR = path.join(__dirname, "uploads");

// Ensure directories exist
[DOWNLOAD_DIR, UPLOAD_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize Express and Socket.io
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Routes
app.get("/api/test", (req, res) => {
    res.send("✅ Backend is working!");
});

app.post("/api/formats", upload.single("cookies"), async (req, res) => {
    try {
        const { url, proxy } = req.body;
        const cookiePath = req.file?.path;

        if (!url) {
            return res.status(400).json({ error: "Missing URL" });
        }

        if (!cookiePath) {
            return res.status(400).json({ error: "Missing cookies file" });
        }

        const args = ["-F", url, "--cookies", cookiePath];

        if (proxy) {
            args.push("--proxy", proxy);
            args.push("--socket-timeout", SOCKET_TIMEOUT);
        }

        const formats = await getVideoFormats(args, cookiePath);
        res.json(formats);
    } catch (error) {
        console.error("Error fetching formats:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/download", upload.single("cookies"), (req, res) => {
    try {
        const { url, proxy, format } = req.body;
        const cookiePath = req.file?.path;

        if (!url) {
            return res.status(400).json({ error: "Missing URL" });
        }

        if (!cookiePath) {
            return res.status(400).json({ error: "Missing cookies file" });
        }

        const args = [
            url,
            "--cookies", cookiePath,
            "--merge-output-format", "mp4",
            "--output", path.join(DOWNLOAD_DIR, "%(title)s.%(ext)s"),
            "--embed-metadata",
            "--continue",
            "--no-overwrites",
            "--newline",
            "--no-playlist"
        ];
        
        // Only embed thumbnail for video formats, not audio-only formats
        if (!format || !format.includes('audio')) {
            args.push("--embed-thumbnail");
        }

        if (format) {
            if (format == "best") {
                args.push("-f", "bestvideo*+bestaudio/best");
            } else {
                args.push("-f", `${format}+bestaudio/best`);
            }
        }

        if (proxy) {
            args.push("--proxy", proxy);
            args.push("--socket-timeout", SOCKET_TIMEOUT);
        }

        const ytdlp = spawn("yt-dlp", args);
        let downloadError = null;

        ytdlp.stdout.on("data", (data) => {
            const message = data.toString();
            io.emit("log", message);
        });

        ytdlp.stderr.on("data", (data) => {
            const message = data.toString();
            downloadError = message;
            io.emit("log", `⚠️ ${message}`);
        });

        ytdlp.on("close", (code) => {
            try {
                if (fs.existsSync(cookiePath)) {
                    fs.unlinkSync(cookiePath);
                }
            } catch (err) {
                console.error("Error deleting cookie file:", err);
            }

            if (code === 0) {
                io.emit("log", `✅ Download finished successfully`);
            } else {
                io.emit("log", `❌ Download failed with exit code ${code}`);
            }
        });

        res.json({ status: "Download started" });
    } catch (error) {
        console.error("Error starting download:", error);
        res.status(500).json({ error: error.message });
    }
});

// Helper function to get video formats
function getVideoFormats(args, cookiePath) {
    return new Promise((resolve, reject) => {
        execFile("yt-dlp", args, (err, stdout, stderr) => {
            // Clean up cookie file
            try {
                if (cookiePath && fs.existsSync(cookiePath)) {
                    fs.unlinkSync(cookiePath);
                }
            } catch (cleanupErr) {
                console.error("Error cleaning up cookie file:", cleanupErr);
            }

            if (err) {
                return reject(new Error(stderr || "Failed to get video formats"));
            }

            const lines = stdout.split("\n");
            const formats = [];

            let startParsing = false;
            for (const line of lines) {
                if (line.trim().startsWith("ID") && line.includes("EXT") && line.includes("RESOLUTION")) {
                    startParsing = true;
                    continue;
                }

                if (!startParsing || line.trim() === "" || line.startsWith("-")) continue;

                // Match format ID, EXT, RESOLUTION (first 3 fields) and rest of line as "info"
                const match = line.match(/^(\S+)\s+(\S+)\s+(\S+)\s+.*?\|\s+.*?\|\s+(.*)$/);
                if (match) {
                    const [, format_id, ext, resolution, moreInfo] = match;
                    formats.push({ format_id, ext, resolution, info: moreInfo.trim() });
                }
            }

            resolve(formats);
        });
    });
}

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});