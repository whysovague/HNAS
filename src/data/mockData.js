// Mock data — replace with real Electron IPC calls later

export const networkStatus = {
  ssid: 'HomeNetwork_5G',
  status: 'connected', // 'connected' | 'limited' | 'disconnected'
  gatewayIP: '192.168.1.1',
  localIP: '192.168.1.104',
  signalStrength: 78, // percent
  encryptionType: 'WPA3',
}

export const connectedDevices = [
  { id: 1, name: 'MacBook Pro', ip: '192.168.1.101', mac: 'A4:83:E7:2B:11:CC' },
  { id: 2, name: 'iPhone 15', ip: '192.168.1.102', mac: 'F8:0D:43:9A:22:EE' },
  { id: 3, name: 'Smart TV', ip: '192.168.1.103', mac: '00:1A:2B:3C:4D:5E' },
  { id: 4, name: 'Unknown Device', ip: '192.168.1.105', mac: 'DC:A6:32:FF:00:11' },
  { id: 5, name: 'Raspberry Pi', ip: '192.168.1.106', mac: 'B8:27:EB:11:22:33' },
  { id: 6, name: 'DESKTOP-XR2', ip: '192.168.1.108', mac: '3C:22:FB:09:AA:77' },
]

export const defaultCredentialDB = {
  // MAC prefix (first 3 octets = OUI) → vendor defaults
  'A4:83:E7': { vendor: 'TP-Link', username: 'admin', password: 'admin' },
  'F8:0D:43': { vendor: 'ASUS', username: 'admin', password: 'admin' },
  '00:1A:2B': { vendor: 'Netgear', username: 'admin', password: 'password' },
  'DC:A6:32': { vendor: 'Raspberry Pi Foundation', username: 'pi', password: 'raspberry' },
}

export const securityChecklist = [
  { id: 'password', label: 'Wi-Fi password changed from default', checked: true },
  { id: 'firmware', label: 'Router firmware up to date', checked: false },
  { id: 'devices', label: 'Connected devices reviewed', checked: false },
  { id: 'encryption', label: 'WPA2 or WPA3 encryption enabled', checked: true },
  { id: 'remote', label: 'Remote admin access disabled', checked: false },
]
