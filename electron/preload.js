const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('hnasAPI', {
  // Network
  getNetworkStatus: () => ipcRenderer.invoke('network:getStatus'),
  scanDevices: () => ipcRenderer.invoke('network:scanDevices'),
  
  // System actions
  openRouter: (ip) => ipcRenderer.send('system:openRouter', ip),
  
  // Data
  getDefaultCredentials: (mac) => ipcRenderer.invoke('db:getDefaultCredentials', mac)
})