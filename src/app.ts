import { app, BrowserWindow } from 'electron';
import { format } from 'url';
import { join } from 'path';

const windows = new Set<Electron.BrowserWindow>();

function createWindow() {
    let win = new BrowserWindow({ width: 800, height: 600 });
    
    windows.add(win);
    
    win.loadURL(format({
        pathname: join(__dirname, './index.html'),
        protocol: 'file:',
        slashes: true
    }));
    
    win.on('closed', () => {
        windows.delete(win);
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if(0 === windows.size) {
        createWindow();
    }
});
