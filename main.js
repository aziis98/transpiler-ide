const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

electron.crashReporter.start();

var mainWindow = null;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({width: 1400, height: 900});

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
