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
      fs.writeFileSync(fullPath + name, JSON.stringify({}));
      return {};
    }
    return JSON.parse(fs.readFileSync(fullPath + name, "utf-8"));
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
