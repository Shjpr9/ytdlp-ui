<div align="center">

# YTDLP-UI

_Download Your Media, Effortlessly and Instantly_

![last-commit](https://img.shields.io/github/last-commit/Shjpr9/ytdlp-ui?style=flat&logo=git&logoColor=white&color=0080ff)
![repo-top-language](https://img.shields.io/github/languages/top/Shjpr9/ytdlp-ui?style=flat&color=0080ff)
![repo-language-count](https://img.shields.io/github/languages/count/Shjpr9/ytdlp-ui?style=flat&color=0080ff)

_Built with the tools and technologies:_  
![Express](https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white)
![JSON](https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white)
![Markdown](https://img.shields.io/badge/Markdown-000000.svg?style=flat&logo=Markdown&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101.svg?style=flat&logo=socketdotio&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black)
![Socket](https://img.shields.io/badge/Socket-C93CD7.svg?style=flat&logo=Socket&logoColor=white)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Exporting YouTube Cookies](#exporting-youtube-cookies)

---

## Overview

**ytdlp-ui** is a powerful graphical interface designed to simplify the video downloading process from YouTube and other platforms. This project enhances the capabilities of the `yt-dlp` command-line tool, making it accessible for users who prefer a more intuitive experience.

**Why ytdlp-ui?**  
This project streamlines media downloads while providing a seamless user experience. The core features include:

- 🎥 **User-Friendly Interface:** Simplifies video downloading for users who prefer GUIs over terminal commands.
- ⚡ **Real-Time Communication:** Instant feedback and logging during downloads enhance user interaction.
- 🚀 **Efficient Backend Service:** Built with Express, it manages requests and file uploads seamlessly.
- 🎶 **Format Retrieval:** Easily select from multiple video/audio formats for your downloads.
- 🌐 **CORS Support:** Flexible integration with various platforms and services for enhanced functionality.

---

## Getting Started

### Prerequisites

This project requires the following dependencies:

- **Python 3.9+ (required by yt-dlp):** [Download](https://www.python.org/downloads/)
- **Package Manager:** [Npm](https://nodejs.org/en/download/)
- **FFMPEG:** [Download](https://ffmpeg.org/download.html)
- **YT-DLP:** [Download](https://github.com/yt-dlp/yt-dlp/releases/latest/)

### Installation

Build ytdlp-ui from the source and install dependencies:

1. **Clone the repository:**

   ```sh
   ❯ git clone https://github.com/Shjpr9/ytdlp-ui
   ```

2. **Navigate to the project directory:**

   ```sh
   ❯ cd ytdlp-ui
   ```

3. **Install the dependencies:**

   **Using [npm](https://www.npmjs.com/):**

   ```sh
   ❯ npm install
   ```

4. **Move the binary files:**

   **FFMPEG and YT-dlp:**

   make sure to move the downloaded required binaries to the project's folder!
   the final structure should look something like this (for windows):

   ```
    -- server.js
    -- yt-dlp.exe
    -- ffmpeg.exe
    ...
   ```

### Usage

Run the project with:

**Using [npm](https://www.npmjs.com/):**

```sh
npm start
```

### Exporting YouTube Cookies

To download from youtube it is required to pass in your cookies. Here's how you can do it:

#### Step-by-step:

1. **Install Cookie-Editor Extension:**

   - [Chrome Web Store](https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm)
   - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/)

2. Open [YouTube.com](https://www.youtube.com) and log into your account.

3. Click the **Cookie-Editor** extension icon in your browser toolbar.

4. Navigate to the **"Export"** tab.

5. Choose the **"Netscape"** format from the dropdown.

6. Save the copied cookies to a `.jar` file.

7. Now use the file you created to download videos.

> ⚠️ **Important:** The cookie file gives access to your YouTube account. Do **not** share it or store it insecurely.

[⬆ Return](#top)

---
