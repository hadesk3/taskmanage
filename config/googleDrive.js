import fs from "fs";
import path from "path";
import { google } from "googleapis";
import mime from "mime-types";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

export async function uploadFile(filePath) {
    try {
        const fileName = path.basename(filePath);
        const mimeType = mime.lookup(filePath) || "application/octet-stream";

        const fileResponse = await drive.files.create({
            requestBody: { name: fileName, mimeType: mimeType },
            media: { mimeType: mimeType, body: fs.createReadStream(filePath) },
        });

        const fileId = fileResponse.data.id;

        await drive.permissions.create({
            fileId: fileId,
            requestBody: { role: "reader", type: "anyone" },
        });

        const fileLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
        console.log("File uploaded successfully:", fileLink);
        return fileLink;
    } catch (error) {
        console.error("Upload error:", error);
        return null;
    }
}
