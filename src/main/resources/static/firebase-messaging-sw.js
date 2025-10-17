// Sử dụng `importScripts` để nạp thư viện Firebase
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js");

// --- SỬ DỤNG ĐÚNG FIREBASE CONFIG CỦA BẠN ---
const firebaseConfig = {
    apiKey: "AIzaSyBWbPhJlxfPhR99ZwOz-At-5HIDoKpBNNA",
    authDomain: "fir-ban-hang-b425f.firebaseapp.com",
    projectId: "fir-ban-hang-b425f",
    storageBucket: "fir-ban-hang-b425f.firebasestorage.app",
    messagingSenderId: "187218514521",
    appId: "1:187218514521:web:c6dfe94291e05e5a5a9748"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Lắng nghe các tin nhắn ở chế độ nền
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/images/notification-icon.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});