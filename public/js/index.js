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
