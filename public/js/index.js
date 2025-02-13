console.log("Hello from Thanh Binh, have a nice day");
//upload image
const firebaseConfig = {
    apiKey: "AIzaSyBeoisetFX0ErLdpHElPnOUQWt5Pw4JqOk",
    authDomain: "phone-c4bc5.firebaseapp.com",
    projectId: "phone-c4bc5",
    storageBucket: "phone-c4bc5.appspot.com",
    messagingSenderId: "721291558303",
    appId: "1:721291558303:web:bcffa59a6060fd564f11aa",
};
firebase.initializeApp(firebaseConfig);
const uploadImage = async (file, folder) => {
    const ref = firebase.storage().ref();
    const name = +new Date() + "-" + file.name;
    const metadata = {
        contentType: file.type,
    };

    try {
        const snapshot = await ref
            .child(folder)
            .child(name)
            .put(file, metadata);
        const url = await snapshot.ref.getDownloadURL();
        return url;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const originalSetItem = localStorage.setItem;

localStorage.setItem = function (key, value) {
    const event = new Event("itemInserted");

    event.value = value; // Optional..
    event.key = key; // Optional..

    document.dispatchEvent(event);

    originalSetItem.apply(this, arguments);
};

import fs from "fs";
import { google } from "googleapis";
import path from "path";
import mime from "mime-types";

// Cấu hình OAuth2 client
const CLIENT_ID =
    "688005669078-721lg7rc5u6rj5ita5b0fnvt4n7bi0ne.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
    "1//04qVbT1b-5KUnCgYIARAAGAQSNwF-L9IreJraFMJN4SE5-TULJTseax7jJgh-OKo9P1XQ2p0y0txty3h0iezvb2NKTwZyJAM3mfU";

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
});

async function uploadFile(filePath) {
    try {
        const fileName = path.basename(filePath);
        const mimeType = mime.lookup(filePath) || "application/octet-stream";

        // Upload file lên Google Drive
        const fileResponse = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: mimeType,
            },
            media: {
                mimeType: mimeType,
                body: fs.createReadStream(filePath),
            },
        });

        const fileId = fileResponse.data.id;

        // Thiết lập quyền chia sẻ công khai cho file
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        // Lấy đường dẫn chia sẻ công khai
        const fileLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

        console.log("File uploaded successfully. Link:", fileLink);
        return fileLink; // Return đường link để lưu vào DB
    } catch (error) {
        console.error("Error uploading file:", error.message);
        return null;
    }
}
