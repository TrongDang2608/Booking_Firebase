// Import các hàm cần thiết từ Firebase SDK v9
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging.js";

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
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
console.log('[v9] Firebase App Initialized and Messaging instance created.');

// Hàm xin quyền và lấy token
function requestPermissionAndSendToken() {
    console.log('Requesting notification permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            navigator.serviceWorker.ready.then(registration => {
                console.log('Service Worker is active, now getting token...');
                const vapidKey = 'BL1rdZ0fraHq5GCfcg6m0qS8ugeeK-6hAfwbJvWUgcQ8zrkmNgy93c8tpsmYPxRiEHQuo6BpH9VqpM8HgSo4lto';
                getToken(messaging, {
                    vapidKey: vapidKey,
                    serviceWorkerRegistration: registration
                }).then((currentToken) => {
                    if (currentToken) {
                        console.log('FCM Token:', currentToken);

                        // === PHẦN QUAN TRỌNG: GỬI TOKEN VỀ SERVER ===
                        const currentUser = JSON.parse(localStorage.getItem('bookingUser'));
                        if (currentUser && currentUser.id) {
                            fetch(`/api/users/${currentUser.id}/fcm-token`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ fcmToken: currentToken })
                            })
                                .then(response => {
                                    if (response.ok) {
                                        console.log('Successfully sent FCM token to server.');
                                    } else {
                                        console.error('Failed to send FCM token to server.');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error sending FCM token:', error);
                                });
                        } else {
                            console.warn('Current user not found in localStorage, cannot send token to server.');
                        }
                        // ===========================================

                    } else {
                        console.log('No registration token available.');
                    }
                }).catch((err) => {
                    console.error('An error occurred while retrieving token. ', err);
                });
            });
        } else {
            console.log('User denied notification permission.');
        }
    });
}

// Đăng ký Service Worker và gắn sự kiện click
document.addEventListener('DOMContentLoaded', function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then(function(registration) {
                console.log('Service Worker registered successfully with scope: ', registration.scope);
            }).catch(function(err) {
            console.error('Service Worker registration failed: ', err);
        });
    }
    const notificationButton = document.getElementById('enable-notifications-button');
    if (notificationButton) {
        notificationButton.addEventListener('click', function(event) {
            event.preventDefault();
            requestPermissionAndSendToken();
        });
    }
});