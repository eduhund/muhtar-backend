import fs from "fs";
import path from "path";

const projectPath = process.cwd();

function createPath(filePath: string) {
  fs.mkdirSync(filePath, { recursive: true });
}

export function readFile(filePath: string, name: string) {
  try {
    const fullPath = path.join(projectPath, filePath);
    if (!fs.existsSync(fullPath)) {
      createPath(fullPath);
    }
    const fileFullPath = fullPath + name;
    if (!fs.existsSync(fileFullPath)) {
      fs.writeFileSync(fileFullPath, JSON.stringify({}));
      return {};
    }
    return JSON.parse(fs.readFileSync(fileFullPath, "utf-8"));
  } catch {
    throw new Error("Dump file is not readed");
  }
}

export function writeFile(filePath: string, name: string, data: any) {
  try {
    const fullPath = path.join(projectPath, filePath);
    if (!fs.existsSync(fullPath)) {
      createPath(fullPath);
    }

    fs.writeFileSync(fullPath + name, JSON.stringify(data));
  } catch {
    throw new Error("Dump file is not wroted");
  }
}
