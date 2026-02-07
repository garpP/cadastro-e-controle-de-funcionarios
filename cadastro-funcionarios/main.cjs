const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Verifica se estamos em modo de desenvolvimento ou produção
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    // No modo dev, ele busca do servidor do Vite
    win.loadURL("http://localhost:5173");
  } else {
    // No modo produção (app fechado), ele busca o arquivo index.html da pasta dist
    // O segredo está em usar o path.join corretamente
    const indexPath = path.join(__dirname, "dist", "index.html");
    win.loadFile(indexPath).catch((err) => {
      console.error("Erro ao carregar o arquivo HTML:", err);
    });
  }

  ipcMain.on("fechar-app", () => {
    app.quit();
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
