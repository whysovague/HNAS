const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('hnasAPI', {
  getNetworkStatus: () => ipcRenderer.invoke('network:getStatus'),
  scanDevices: () => ipcRenderer.invoke('network:scanDevices'),
  getWifiPassword: (ssid) => ipcRenderer.invoke('network:getWifiPassword', ssid),
  getGatewayCredentials: () => ipcRenderer.invoke('network:getGatewayCredentials'), // NEW
  openRouter: (ip) => ipcRenderer.send('system:openRouter', ip),
  getDefaultCredentials: (mac) => ipcRenderer.invoke('db:getDefaultCredentials', mac)
})