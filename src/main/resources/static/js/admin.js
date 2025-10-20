// Admin Dashboard JavaScript

// Global variables
let allBookings = [];
let allServices = [];
let allTimeSlots = [];
let allUsers = [];

// Khởi tạo dashboard khi trang được tải xong
document.addEventListener('DOMContentLoaded', function() {
    // [GHI CHÚ] Không cần kiểm tra đăng nhập ở đây nữa.
    // Nếu người dùng vào được trang này, họ chắc chắn đã được xác thực bởi Spring Security.

    // Tải dữ liệu ban đầu cho các tab
    loadAllBookings();
    loadAllServices();
    loadAllTimeSlots();
    loadAllUsers();

    // Gắn sự kiện cho các tab điều hướng
    setupAdminEventListeners();

    // Hiển thị tab tổng quan đầu tiên
    switchAdminTab('dashboardTab');
});

// Gắn các sự kiện
function setupAdminEventListeners() {
    document.querySelectorAll('.admin-nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            switchAdminTab(e.currentTarget.dataset.tab);
        });
    });
}

// Chuyển đổi giữa các tab
function switchAdminTab(tabId) {
    document.querySelectorAll('.admin-tab-content').forEach(content => content.style.display = 'none');
    document.querySelectorAll('.admin-nav-tab').forEach(tab => tab.classList.remove('active'));

    const selectedTabContent = document.getElementById(tabId);
    if(selectedTabContent) {
        selectedTabContent.style.display = 'block';
    }

    const selectedTab = document.querySelector(`.admin-nav-tab[data-tab="${tabId}"]`);
    if(selectedTab) {
        selectedTab.classList.add('active');
    }

    // Tải lại dữ liệu cho tab tổng quan nếu cần
    if (tabId === 'dashboardTab') {
        loadDashboardStats();
    }
}

// [SỬA] Cập nhật hàm logout để sử dụng Spring Security
function logoutAdmin() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        // Chuyển hướng đến URL logout của Spring Security
        window.location.href = '/logout';
    }
}

// --- CÁC HÀM TẢI DỮ LIỆU TỪ API ---

async function loadAllBookings() {
    try {
        const response = await fetch('/api/admin/bookings'); // [SỬA] Đường dẫn API mới
        if (!response.ok) throw new Error('Không thể tải danh sách đặt lịch');
        allBookings = await response.json();
        displayAllBookings(allBookings);
    } catch (error) {
        showAlert('Lỗi tải đặt lịch: ' + error.message, 'danger');
    }
}

async function loadAllServices() {
    try {
        const response = await fetch('/api/admin/services'); // [SỬA] Đường dẫn API mới
        if (!response.ok) throw new Error('Không thể tải danh sách dịch vụ');
        allServices = await response.json();
        displayAllServices(allServices);
    } catch (error) {
        showAlert('Lỗi tải dịch vụ: ' + error.message, 'danger');
    }
}

async function loadAllTimeSlots() {
    try {
        const response = await fetch('/api/admin/timeslots'); // [SỬA] Đường dẫn API mới
        if (!response.ok) throw new Error('Không thể tải khung giờ');
        allTimeSlots = await response.json();
        displayAllTimeSlots(allTimeSlots);
    } catch (error) {
        showAlert('Lỗi tải khung giờ: ' + error.message, 'danger');
    }
}

async function loadAllUsers() {
    try {
        const response = await fetch('/api/admin/users'); // [SỬA] Đường dẫn API mới
        if (!response.ok) throw new Error('Không thể tải danh sách người dùng');
        allUsers = await response.json();
        displayAllUsers(allUsers);
    } catch (error) {
        showAlert('Lỗi tải người dùng: ' + error.message, 'danger');
    }
}

// --- CÁC HÀM HIỂN THỊ DỮ LIỆU ---

function displayAllBookings(bookings) {
    const container = document.getElementById('allBookings');
    if (!container) return;
    container.innerHTML = bookings.length === 0 ? '<p class="text-center">Không có lịch hẹn nào.</p>' : bookings.map(booking => `
        <div class="card mb-3">
            <div class="card-header d-flex justify-content-between">
                <strong>#${booking.id} - ${booking.serviceName}</strong>
                <span class="badge ${getStatusClass(booking.status)}">${booking.statusDisplayName}</span>
            </div>
            <div class="card-body">
                <p><strong>Khách hàng:</strong> ${booking.userFullName} (${booking.userEmail})</p>
                <p><strong>Ngày:</strong> ${formatDisplayDate(booking.date)} | <strong>Giờ:</strong> ${formatTime(booking.startTime)}</p>
                <div class="admin-actions mt-2">${getStatusActions(booking)}</div>
            </div>
        </div>
    `).join('');
}

function displayAllServices(services) {
    const container = document.getElementById('allServices');
    if (!container) return;
    // ... (logic hiển thị dịch vụ tương tự như file gốc của bạn)
    container.innerHTML = `Implement displayAllServices here.`;
}

function displayAllTimeSlots(timeSlots) {
    const container = document.getElementById('allTimeSlots');
    if (!container) return;
    // ... (logic hiển thị khung giờ tương tự như file gốc của bạn)
    container.innerHTML = `Implement displayAllTimeSlots here.`;
}

function displayAllUsers(users) {
    const container = document.getElementById('allUsers');
    if (!container) return;
    container.innerHTML = users.length === 0 ? '<p class="text-center">Không có người dùng nào.</p>' : `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Họ và tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Quyền</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.fullName}</td>
                        <td>${user.email}</td>
                        <td>${user.phoneNumber}</td>
                        <td><span class="badge ${user.isAdmin ? 'alert-danger' : 'alert-secondary'}">${user.isAdmin ? 'Admin' : 'User'}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}


function loadDashboardStats() {
    const container = document.getElementById('dashboardStats');
    if (!container) return;

    const todayBookings = allBookings.filter(b => b.date === new Date().toISOString().split('T')[0]);
    const pendingBookings = allBookings.filter(b => b.status === 'PENDING');

    container.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="card text-center">
                    <div class="card-body">
                        <h3>${todayBookings.length}</h3>
                        <p>Lịch hẹn hôm nay</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card text-center">
                    <div class="card-body">
                        <h3>${pendingBookings.length}</h3>
                        <p>Lịch hẹn chờ xác nhận</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- CÁC HÀM HÀNH ĐỘNG ---

function getStatusActions(booking) {
    let actions = [];
    if (booking.status === 'PENDING') {
        actions.push(`<button class="btn btn-success btn-sm" onclick="updateBookingStatus(${booking.id}, 'confirm')">Xác nhận</button>`);
    }
    if (booking.status === 'PENDING' || booking.status === 'CONFIRMED') {
        actions.push(`<button class="btn btn-danger btn-sm" onclick="cancelBooking(${booking.id})">Hủy</button>`);
    }
    if (booking.status === 'CONFIRMED') {
        actions.push(`<button class="btn btn-info btn-sm" onclick="updateBookingStatus(${booking.id}, 'complete')">Hoàn thành</button>`);
    }
    return actions.join(' ');
}

async function updateBookingStatus(bookingId, action) {
    const confirmMessage = {
        'confirm': `Bạn có chắc muốn XÁC NHẬN lịch hẹn #${bookingId}?`,
        'complete': `Bạn có chắc muốn đánh dấu HOÀN THÀNH lịch hẹn #${bookingId}?`
    };
    if (!confirm(confirmMessage[action])) return;

    try {
        const response = await fetch(`/api/admin/bookings/${bookingId}/${action}`, { method: 'PUT' });
        if (response.ok) {
            showAlert(`Thao tác thành công!`, 'success');
            loadAllBookings();
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        showAlert(`Lỗi: ${error.message}`, 'danger');
    }
}

async function cancelBooking(bookingId) {
    const reason = prompt('Nhập lý do hủy (bắt buộc):');
    if (reason === null || reason.trim() === '') return;

    try {
        const response = await fetch(`/api/admin/bookings/${bookingId}/cancel?reason=${encodeURIComponent(reason)}`, { method: 'PUT' });
        if (response.ok) {
            showAlert('Hủy đặt lịch thành công!', 'success');
            loadAllBookings();
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        showAlert(`Lỗi hủy lịch: ${error.message}`, 'danger');
    }
}

// --- CÁC HÀM TIỆN ÍCH ---

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

function formatDisplayDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(timeString) {
    return timeString ? timeString.substring(0, 5) : '';
}

function formatDateTime(dateTimeString) {
    return dateTimeString ? new Date(dateTimeString).toLocaleString('vi-VN') : '';
}

function getStatusClass(status) {
    const statusMap = {
        'PENDING': 'alert-warning', 'CONFIRMED': 'alert-success',
        'CANCELLED': 'alert-danger', 'COMPLETED': 'alert-info'
    };
    return statusMap[status] || 'alert-secondary';
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `admin-alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
}