# Home Network Assistant System (HNAS)

HNAS is a desktop application built with Electron and React designed to help users easily manage, scan, and troubleshoot their local home network. It natively interacts with the Windows operating system to provide real-time network insights without relying on cloud services.

## Features

* **Smart Router Access:** Automatically detects your active default gateway and provides one-click access to your router's web interface.
* **Deep Network Scanner:** Uses rapid UDP ping sweeps combined with the Windows ARP table to discover all connected devices on the local subnet.
* **Offline MAC Resolution:** Identifies device manufacturers instantly using a locally compiled IEEE OUI database, ensuring fast and private device naming without API rate limits.
* **Credential Recovery:** * Securely retrieves the active Wi-Fi password directly from Windows.
    * Detects the router manufacturer and provides standard default login credentials or instructions for modern sticker-based gateways.
* **Security & Diagnostics:** Checks active Wi-Fi encryption protocols (WPA2/WPA3) and provides a customized security checklist and automated troubleshooting tools.

## Tech Stack

* **Frontend:** React, React Router, CSS, Lucide React (Icons)
* **Backend:** Electron, Node.js
* **Native Integrations:** Uses child processes to execute native Windows network commands (`netsh`, `route print`, `arp`) and `dgram` for UDP broadcasting.

## Prerequisites

* Node.js (v18 or higher recommended)
* Windows OS (Currently, the network discovery commands are optimized for Windows)

## Installation & Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Build the offline Device Database:**
    Before scanning the network, you need to download and compile the official IEEE MAC address dictionary. Run the included build script:
    ```bash
    cd electron
    node build-db.js
    cd ..
    ```
    *This will fetch the latest CSV from the IEEE and generate a `mac-vendors.json` file.*

3.  **Start the application:**
    ```bash
    npm run dev
    ```

## Project Structure

* `/src`: Contains the React frontend UI, pages (Dashboard, Devices, Credentials, etc.), and CSS styles.
* `/electron`: Contains the Electron main process files (`main.js`, `preload.js`, and `ipc.js`) handling all OS-level networking tasks.

## Security Note

This application requires permission to read local network configurations. All network scanning and credential retrieval is performed locally on the host machine. No network data, MAC addresses, or passwords are sent to any external servers.
