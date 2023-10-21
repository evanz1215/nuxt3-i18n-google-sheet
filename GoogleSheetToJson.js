import fs from "fs-extra";
import { unflatten } from "flat";
import { extractSheets } from "spreadsheet-to-json";
import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//https://docs.google.com/spreadsheets/d/AJHP6Xg2aBuV_RxvWE4Aq1r2GtoQpWVeELL8iohjXJXa/edit#gid=1694877357
const GOOGLE_SHEET_KEY = "AJHP6Xg2aBuV_RxvWE4Aq1r2GtoQpWVeELL8iohjXJXa"; //Google Sheet Key(網址)
const SHEETS_TO_EXTRACT = ["sheet1", "sheet2"]; //Google Sheet 要抓取的分頁名稱(請使用英文)
const OUTPUT_DIR = path.resolve(__dirname, "./lang"); //輸出資料夾路徑
const CREDENTIALS_PATH = "./google/my-i18n-test-402617-87a6c282a555.json"; //Google Sheet API 認證JSON檔案路徑

const result = {};

const handleError = (err) => {
    if (err) {
        console.error("An error occurred:", err);
    }
};

const extractData = (err, data) => {
    handleError(err);

    const read = SHEETS_TO_EXTRACT.map(sheetName => data[sheetName]).flat();
    const files = Object.keys(read[0]).filter(key => key !== "key");

    files.forEach((fileName) => {
        result[fileName] = {};
        read.forEach((el) => {
            result[fileName][el["key"]] = el[fileName] || "";
        });

        const filePath = path.resolve(OUTPUT_DIR, `${fileName}.json`);
        fs.ensureDirSync(path.dirname(filePath));
        fs.writeJSONSync(filePath, unflatten(result[fileName], { object: true }), { spaces: 2 });
    });
};

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));

extractSheets({
    spreadsheetKey: GOOGLE_SHEET_KEY,
    credentials,
    sheetsToExtract: SHEETS_TO_EXTRACT,
}, extractData);


//npm i spreadsheet-to-json fs-extra flat -D