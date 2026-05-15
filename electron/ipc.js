const { ipcMain, shell } = require('electron')
const { exec } = require('child_process')
const os = require('os')

// Mock database for credentials
const defaultCredentialDB = {
  'A4:83:E7': { vendor: 'TP-Link', username: 'admin', password: 'admin' },
  'F8:0D:43': { vendor: 'ASUS', username: 'admin', password: 'admin' },
  '00:1A:2B': { vendor: 'Netgear', username: 'admin', password: 'password' },
  'DC:A6:32': { vendor: 'Raspberry Pi Foundation', username: 'pi', password: 'raspberry' }
}

function registerHandlers() {
  // 1. Network Status (with robust Windows route parsing)
  ipcMain.handle('network:getStatus', async () => {
    let localIP = 'Unknown'
    const interfaces = os.networkInterfaces()
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          localIP = iface.address
          break
        }
      }
    }

    const gatewayIP = await new Promise((resolve) => {
      exec('route print 0.0.0.0', (error, stdout) => {
        if (error) return resolve('192.168.1.1') // Fallback
        
        const lines = stdout.split('\n')
        for (const line of lines) {
          // Normalize all weird spacing (including non-breaking spaces) to single standard spaces
          const cleanLine = line.trim().replace(/\s+/g, ' ')
          
          // Match the active IPv4 default route row
          if (cleanLine.startsWith('0.0.0.0 0.0.0.0')) {
            const parts = cleanLine.split(' ')
            if (parts.length >= 3) {
              return resolve(parts[2]) // The 3rd column is the Gateway IP
            }
          }
        }
        resolve('192.168.1.1') // Fallback if no match
      })
    })

    return {
      ssid: 'Connected Network', 
      status: 'connected',
      gatewayIP,
      localIP,
      signalStrength: 100,
      encryptionType: 'Unknown'
    }
  })

  // 2. Open Router Access Page in Default Browser
  ipcMain.on('system:openRouter', (event, ip) => {
    if (ip) {
      shell.openExternal(`http://${ip}`)
    }
  })

  // 3. Windows ARP Scanner
  ipcMain.handle('network:scanDevices', async () => {
    return new Promise((resolve) => {
      exec('arp -a', (error, stdout) => {
        if (error) {
          console.error('ARP scan failed:', error)
          return resolve([])
        }

        const devices = []
        const lines = stdout.split('\n')

        lines.forEach(line => {
          const match = line.match(/^\s*([0-9\.]+)\s+([0-9a-f\-]{17})\s+(dynamic|static)/i)
          
          if (match) {
            const ip = match[1]
            const mac = match[2].replace(/-/g, ':').toUpperCase() 
            
            if (!ip.startsWith('224.') && !ip.startsWith('239.') && !ip.endsWith('.255')) {
               devices.push({
                 id: mac,
                 ip: ip,
                 mac: mac,
                 name: 'Unknown Device' 
               })
            }
          }
        })

        resolve(devices)
      })
    })
  })

  // 4. Retrieve Credentials by MAC OUI
  ipcMain.handle('db:getDefaultCredentials', (event, mac) => {
    if (!mac) return null
    const oui = mac.substring(0, 8).toUpperCase()
    return defaultCredentialDB[oui] || null
  })
}

module.exports = { registerHandlers }