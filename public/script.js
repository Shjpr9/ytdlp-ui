const baseUrl = "http://localhost:3000";
const socket = io(baseUrl, {
    withCredentials: true,
    transports: ['websocket', 'polling']
});

const logArea = document.getElementById("log");
const statusEl = document.getElementById("status");
const fileInput = document.getElementById("cookies");
const fileLabel = document.getElementById("file-label");
const fileName = document.getElementById("file-name");

// Show selected filename
fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        fileName.textContent = fileInput.files[0].name;
    } else {
        fileName.textContent = "";
    }
});

socket.on("connect", () => {
    logArea.value += "✅ Connected to server\n";
    logArea.scrollTop = logArea.scrollHeight;
});

socket.on("disconnect", () => {
    logArea.value += "❌ Disconnected from server\n";
    logArea.scrollTop = logArea.scrollHeight;
});

socket.on("log", msg => {
    logArea.value += msg + "\n";
    logArea.scrollTop = logArea.scrollHeight; // auto-scroll
});

function updateStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.className = isError ? "status-error" : "status-success";
}

async function testBackend() {
    try {
        updateStatus("Testing connection...");
        const res = await fetch(baseUrl + "/api/test", {
            credentials: 'include'
        });
        const data = await res.text();
        updateStatus(data);
    } catch (error) {
        updateStatus("Error: " + error.message, true);
    }
}

async function fetchFormats() {
    const url = document.getElementById("url").value;
    const proxy = document.getElementById("proxy").value;
    const cookiesFile = fileInput.files[0];

    if (!url) {
        updateStatus("Please enter a YouTube URL", true);
        return;
    }

    if (!cookiesFile) {
        updateStatus("Please select a cookies file", true);
        return;
    }

    try {
        updateStatus("Fetching available formats...");

        const formData = new FormData();
        formData.append("url", url);
        formData.append("proxy", proxy);
        formData.append("cookies", cookiesFile);

        const res = await fetch(baseUrl + "/api/formats", {
            method: "POST",
            body: formData,
            credentials: 'include'
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText);
        }

        const formats = await res.json();

        const select = document.getElementById("quality");
        select.innerHTML = "";

        formats.forEach(fmt => {
            const option = document.createElement("option");
            option.value = fmt.format_id;
            option.textContent = `${fmt.format_id} - ${fmt.ext} - ${fmt.resolution}`;
            select.appendChild(option);
        });

        updateStatus(`Found ${formats.length} formats`);
    } catch (error) {
        updateStatus("Error: " + error.message, true);
    }
}

async function downloadVideo() {
    const url = document.getElementById("url").value;
    const proxy = document.getElementById("proxy").value;
    const format = document.getElementById("quality").value;
    const cookiesFile = fileInput.files[0];

    if (!url) {
        updateStatus("Please enter a YouTube URL", true);
        return;
    }

    if (!format) {
        updateStatus("Please select a format", true);
        return;
    }

    if (!cookiesFile) {
        updateStatus("Please select a cookies file", true);
        return;
    }

    try {
        updateStatus("Starting download...");

        const formData = new FormData();
        formData.append("url", url);
        formData.append("proxy", proxy);
        formData.append("format", format);
        formData.append("cookies", cookiesFile);

        const res = await fetch(baseUrl + "/api/download", {
            method: "POST",
            body: formData,
            credentials: 'include'
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText);
        }

        const data = await res.json();
        updateStatus(data.status);

        // Clear log area before new download
        logArea.value = "🚀 Starting download...\n";
    } catch (error) {
        updateStatus("Error: " + error.message, true);
    }
}