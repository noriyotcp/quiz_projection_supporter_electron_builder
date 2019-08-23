"use strict";

import electron from "electron";
import FsExtra from "fs-extra";
import path from "path";

export default class JsonFileUtil {
  static saveFile(fileName, data) {
    const userDataPath = (electron.app || electron.remote.app).getPath(
      "userData"
    );
    const filePath = path.join(userDataPath, `${fileName}.json`);
    return FsExtra.outputJSON(filePath, data, { spaces: 2 });
  }

  static loadFile(fileName) {
    const userDataPath = (electron.app || electron.remote.app).getPath(
      "userData"
    );
    const filePath = path.join(userDataPath, `${fileName}.json`);
    return FsExtra.readJSON(filePath, { throws: false });
  }
}
