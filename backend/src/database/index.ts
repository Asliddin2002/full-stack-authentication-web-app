import fs from "fs";
import path from "path";

export class JSONDatabase<T> {
  private filePath: string;

  constructor(fileName: string) {
    this.filePath = path.join(__dirname, "data", fileName);

    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), "utf8");
    }
  }

  private readFile() {
    const data = fs.readFileSync(this.filePath, "utf8");

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("JSON parse error:", error);

      return [];
    }
  }

  private writeFile(data: T[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  getAll() {
    return this.readFile();
  }

  addData(item: T) {
    const data = this.readFile();
    data.push(item);
    this.writeFile(data);

    return item;
  }
}
