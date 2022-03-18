const {
    app,
    BrowserWindow
} = require('electron');
//const electronLocalshortcut = require('electron-localshortcut'); // For shortcuts

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,

        minWidth: 745,
        minHeight: 550,

        icon: 'public/images/icon.ico',

        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
        show: false
    })

    win.once('ready-to-show', () => {
        win.show()
    })


    win.loadFile('index.html')
    win.removeMenu()

    win.webContents.openDevTools() //gömmer så att devtools inte kommer upp
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})