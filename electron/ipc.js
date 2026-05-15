const { ipcMain, shell } = require('electron')
const { exec } = require('child_process')
const os = require('os')

const defaultCredentialDB = {
  'A4:83:E7': { vendor: 'TP-Link', username: 'admin', password: 'admin' },
  'F8:0D:43': { vendor: 'ASUS', username: 'admin', password: 'admin' },
  '00:1A:2B': { vendor: 'Netgear', username: 'admin', password: 'password' },
  'DC:A6:32': { vendor: 'Raspberry Pi Foundation', username: 'pi', password: 'raspberry' }
}

function registerHandlers() {
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

// Get Wi-Fi Password via netsh
  ipcMain.handle('network:getWifiPassword', async (event, ssid) => {
    if (!ssid || ssid === 'Wired / Unknown' || ssid === 'Detecting...') return null

    return new Promise((resolve) => {
      // Windows command to reveal the saved Wi-Fi key
      exec(`netsh wlan show profile name="${ssid}" key=clear`, (error, stdout) => {
        if (error) {
          console.error('Failed to get Wi-Fi password:', error)
          return resolve(null)
        }

        // Parse the "Key Content" line from the Windows output
        const match = stdout.match(/^\s*Key Content\s*:\s*(.+)$/m)
        resolve(match && match[1] ? match[1].trim() : null)
      })
    })
  })

    const gatewayIP = await new Promise((resolve) => {
      exec('route print 0.0.0.0', (error, stdout) => {
        if (error) return resolve('192.168.1.1') 
        
        const lines = stdout.split('\n')
        for (const line of lines) {
          const cleanLine = line.trim().replace(/\s+/g, ' ')
          if (cleanLine.startsWith('0.0.0.0 0.0.0.0')) {
            const parts = cleanLine.split(' ')
            if (parts.length >= 3) {
              return resolve(parts[2]) 
            }
          }
        }
        resolve('192.168.1.1') 
      })
    })

    // Get Real Wi-Fi SSID AND Encryption (Authentication) via netsh
    const wlanInfo = await new Promise((resolve) => {
      exec('netsh wlan show interfaces', (error, stdout) => {
        if (error) return resolve({ ssid: 'Wired / Unknown', auth: 'Unknown' })
        
        const ssidMatch = stdout.match(/^\s*SSID\s*:\s*(.+)$/m)
        const authMatch = stdout.match(/^\s*Authentication\s*:\s*(.+)$/m)
        
        resolve({
          ssid: ssidMatch && ssidMatch[1] ? ssidMatch[1].trim() : 'Wired / Unknown',
          auth: authMatch && authMatch[1] ? authMatch[1].trim() : 'Unknown'
        })
      })
    })

    return {
      ssid: wlanInfo.ssid,
      status: 'connected',
      gatewayIP,
      localIP,
      signalStrength: 100, 
      encryptionType: wlanInfo.auth // Now returns real data like 'WPA2-Personal'
    }
  })

  ipcMain.on('system:openRouter', (event, ip) => {
    if (ip) {
      shell.openExternal(`http://${ip}`)
    }
  })

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

  ipcMain.handle('db:getDefaultCredentials', (event, mac) => {
    if (!mac) return null
    const oui = mac.substring(0, 8).toUpperCase()
    return defaultCredentialDB[oui] || null
  })
}

module.exports = { registerHandlers }