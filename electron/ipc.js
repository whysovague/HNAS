const { ipcMain, shell } = require('electron')
const { exec } = require('child_process')
const os = require('os')
const dns = require('dns').promises
const dgram = require('dgram')

// Load the local MAC Vendor database
const macVendorDB = require('./mac-vendors.json')

const defaultCredentialDB = {
  'A4:83:E7': { type: 'standard', vendor: 'TP-Link', username: 'admin', password: 'admin' },
  'F8:0D:43': { type: 'standard', vendor: 'ASUS', username: 'admin', password: 'admin' },
  '00:1A:2B': { type: 'standard', vendor: 'Netgear', username: 'admin', password: 'password' },
  'CC:40:D0': { type: 'sticker', vendor: 'Eero', message: 'Eero devices are managed exclusively via the mobile app. There is no local web interface.' },
  '44:E1:37': { type: 'sticker', vendor: 'Comcast / Xfinity', message: 'Xfinity gateways use a unique password printed on the bottom sticker.' },
  'E0:22:02': { type: 'sticker', vendor: 'AT&T', message: 'AT&T gateways use a Device Access Code printed on the side sticker.' }
}

async function resolveDeviceName(ip, mac) {
  try {
    const hostnames = await dns.reverse(ip)
    if (hostnames && hostnames.length > 0) return hostnames[0]
  } catch (err) {}

  const oui = mac.substring(0, 8).toUpperCase()
  
  // Check gateway credential DB first
  const gatewayInfo = defaultCredentialDB[oui]
  if (gatewayInfo && gatewayInfo.vendor) return `${gatewayInfo.vendor} Device`

  // Look up in the local offline MAC JSON file
  const localVendor = macVendorDB[oui]
  if (localVendor) return `${localVendor} Device`

  return 'Unknown Device'
}

function populateArpTable(localIp) {
  return new Promise((resolve) => {
    const baseIp = localIp.substring(0, localIp.lastIndexOf('.'))
    const client = dgram.createSocket('udp4')
    const dummyBuffer = Buffer.from([0x00])
    client.on('error', () => {}) 
    for (let i = 1; i < 255; i++) {
      client.send(dummyBuffer, 0, dummyBuffer.length, 137, `${baseIp}.${i}`, () => {})
    }
    setTimeout(() => {
      client.close()
      resolve()
    }, 1500)
  })
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

    const gatewayIP = await new Promise((resolve) => {
      exec('route print 0.0.0.0', (error, stdout) => {
        if (error) return resolve('192.168.1.1') 
        const lines = stdout.split('\n')
        for (const line of lines) {
          const cleanLine = line.trim().replace(/\s+/g, ' ')
          if (cleanLine.startsWith('0.0.0.0 0.0.0.0')) {
            const parts = cleanLine.split(' ')
            if (parts.length >= 3) return resolve(parts[2]) 
          }
        }
        resolve('192.168.1.1') 
      })
    })

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
      encryptionType: wlanInfo.auth
    }
  })

  ipcMain.on('system:openRouter', (event, ip) => {
    if (ip) shell.openExternal(`http://${ip}`)
  })

  ipcMain.handle('network:getWifiPassword', async (event, ssid) => {
    if (!ssid || ssid === 'Wired / Unknown' || ssid === 'Detecting...') return null
    return new Promise((resolve) => {
      exec(`netsh wlan show profile name="${ssid}" key=clear`, (error, stdout) => {
        if (error) return resolve(null)
        const match = stdout.match(/^\s*Key Content\s*:\s*(.+)$/m)
        resolve(match && match[1] ? match[1].trim() : null)
      })
    })
  })

  ipcMain.handle('network:getGatewayCredentials', async () => {
    const gatewayIP = await new Promise((resolve) => {
      exec('route print 0.0.0.0', (error, stdout) => {
        if (error) return resolve(null)
        const lines = stdout.split('\n')
        for (const line of lines) {
          const cleanLine = line.trim().replace(/\s+/g, ' ')
          if (cleanLine.startsWith('0.0.0.0 0.0.0.0')) {
            const parts = cleanLine.split(' ')
            if (parts.length >= 3) return resolve(parts[2])
          }
        }
        resolve(null)
      })
    })

    if (!gatewayIP) return { type: 'unknown' }

    await new Promise((resolve) => exec(`ping -n 1 -w 500 ${gatewayIP}`, resolve))

    const mac = await new Promise((resolve) => {
      exec('arp -a', (error, stdout) => {
        if (error) return resolve(null)
        const escapedIp = gatewayIP.replace(/\./g, '\\.')
        const regex = new RegExp(`\\s+${escapedIp}\\s+([0-9a-f\\-]{17})`, 'i')
        const match = stdout.match(regex)
        resolve(match ? match[1].replace(/-/g, ':').toUpperCase() : null)
      })
    })

    if (!mac) return { type: 'unknown', ip: gatewayIP }

    const oui = mac.substring(0, 8).toUpperCase()
    const dbEntry = defaultCredentialDB[oui]
    if (dbEntry) return { ...dbEntry, mac, ip: gatewayIP }

    const localVendor = macVendorDB[oui]
    if (localVendor) {
      return { 
        type: 'sticker', 
        vendor: localVendor, 
        message: `Modern ${localVendor} routers typically use a unique, randomized password printed on the bottom or back label.` 
      }
    }

    return { type: 'sticker', vendor: 'Unknown Vendor', message: 'Most modern routers use a unique randomized password printed on the manufacturer sticker.' }
  })

  ipcMain.handle('network:scanDevices', async () => {
    let localIP = '192.168.1.100'
    const interfaces = os.networkInterfaces()
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          localIP = iface.address
          break
        }
      }
    }

    await populateArpTable(localIP)

    return new Promise((resolve) => {
      exec('arp -a', async (error, stdout) => {
        if (error) return resolve([])

        const rawDevices = []
        const lines = stdout.split('\n')

        lines.forEach(line => {
          const match = line.match(/^\s*([0-9\.]+)\s+([0-9a-f\-]{17})\s+(dynamic|static)/i)
          if (match) {
            const ip = match[1]
            const mac = match[2].replace(/-/g, ':').toUpperCase() 
            if (!ip.startsWith('224.') && !ip.startsWith('239.') && !ip.endsWith('.255')) {
               rawDevices.push({ id: mac, ip, mac })
            }
          }
        })

        // Because we removed the API, we can safely parallelize this again for maximum speed
        const devicesWithNames = await Promise.all(
          rawDevices.map(async (device) => {
            const name = await resolveDeviceName(device.ip, device.mac)
            return { ...device, name }
          })
        )

        resolve(devicesWithNames)
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