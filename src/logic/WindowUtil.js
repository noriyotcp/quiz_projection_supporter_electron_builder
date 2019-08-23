"use strict";

const BrowserWindow = require("electron").remote.BrowserWindow;

export default class WindowUtil {
  static getBaseUrl(targetPath) {
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? `http://localhost:8080`
        : `file://${__dirname}/index.html`;
    return baseUrl + targetPath;
  }

  static openWindow(targetPath, windowOption) {
    const url = this.getBaseUrl(targetPath);
    let winOpt = {
      webPreferences: {
        nodeIntegration: true
      }
    };
    if (windowOption != null) {
      winOpt = Object.assign(windowOption, winOpt);
    } else {
      winOpt = Object.assign(
        {
          width: 800,
          height: 600
        },
        winOpt
      );
    }

    const window = new BrowserWindow(Object.assign(winOpt));
    window.loadURL(url);
    return window;
  }
}
