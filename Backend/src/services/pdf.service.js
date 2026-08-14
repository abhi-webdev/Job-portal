import fs from "fs";
import { PDFParse } from "pdf-parse";

const extractTextFromPdf = async (filePath) => {

    const buffer = fs.readFileSync(filePath);

    const parser = new PDFParse({
        data: buffer
    });

    const result = await parser.getText();

    await parser.destroy();

    return result.text;
};

export default extractTextFromPdf;