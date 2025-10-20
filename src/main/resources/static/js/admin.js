// admin.js (Phiên bản đầy đủ chức năng CRUD và đã sửa lỗi)

// --- BIẾN TOÀN CỤC ---
let allBookings = [], allServices = [], allTimeSlots = [], allUsers = [];
let currentBookingFilter = ''; // Biến để lưu trạng thái lọc

// --- KHỞI TẠO VÀ ĐIỀU HƯỚNG ---
document.addEventListener('DOMContentLoaded', function() {
    setupAdminEventListeners();
    // Bắt đầu với tab đặt lịch để thấy giao diện mới ngay
    switchAdminTab('bookingsTab');
});

function setupAdminEventListeners() {
    document.querySelectorAll('.admin-nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            switchAdminTab(e.currentTarget.dataset.tab);
        });
    });

    const filterSelect = document.querySelector('select[onchange="filterBookingsByStatus(this.value)"]');
    if (filterSelect) {
        filterSelect.addEventListener('change', () => filterBookingsByStatus(filterSelect.value));
    }
}

function switchAdminTab(tabId) {
    document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.admin-nav-tab').forEach(tab => tab.classList.remove('active'));

    const selectedTabContent = document.getElementById(tabId);
    if (selectedTabContent) selectedTabContent.classList.add('active');

    const selectedTab = document.querySelector(`.admin-nav-tab[data-tab="${tabId}"]`);
    if (selectedTab) selectedTab.classList.add('active');

    // Tải dữ liệu tương ứng với tab được chọn
    switch(tabId) {
        case 'dashboardTab': loadDashboardStats(); break;
        case 'bookingsTab': loadAllBookings(); break;
        case 'servicesTab': loadAllServices(); break;
        case 'timeSlotsTab': loadAllTimeSlots(); break;
        case 'usersTab': loadAllUsers(); break;
    }
}

// --- LOGIC QUẢN LÝ ĐẶT LỊCH (Giao diện thẻ mới) ---

async function loadAllBookings() {
    const container = document.getElementById('allBookings');
    if (!container) return;
    container.innerHTML = '<p>Đang tải dữ liệu, vui lòng chờ...</p>';

    try {
        // !!! LƯU Ý: Đảm bảo đường dẫn API '/api/admin/bookings' là chính xác
        const response = await fetch('/api/admin/bookings');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        allBookings = await response.json();
        allBookings.sort((a, b) => new Date(b.date) - new Date(a.date));

        displayAllBookings();
    } catch (error) {
        console.error("Failed to load bookings:", error);
        container.innerHTML = `<div class="alert alert-danger">Không thể tải danh sách đặt lịch. Vui lòng thử lại.</div>`;
    }
}

function displayAllBookings() {
    const container = document.getElementById('allBookings');
    if (!container) return;

    const filteredBookings = currentBookingFilter
        ? allBookings.filter(b => b.status === currentBookingFilter)
        : allBookings;

    if (filteredBookings.length === 0) {
        container.innerHTML = '<p class="text-center mt-4">Không có lịch hẹn nào phù hợp.</p>';
        return;
    }

    container.innerHTML = filteredBookings.map(booking => `
        <div class="booking-card slide-up">
            <div class="booking-card-header">
                <div class="booking-id">ID: #${booking.id}</div>
                <div class="booking-status">
                    <span class="badge ${getStatusClass(booking.status)}">${booking.statusDisplayName}</span>
                </div>
            </div>
            <div class="booking-card-body">
                <div class="booking-info">
                    <p class="info-item">
                        <i class="fas fa-user"></i>
                        <strong>${booking.userFullName}</strong>
                        <span class="text-muted">(${booking.userPhone})</span>
                    </p>
                    <p class="info-item">
                        <i class="fas fa-concierge-bell"></i>
                        <span>${booking.serviceName}</span>
                    </p>
                    <p class="info-item">
                        <i class="fas fa-calendar-alt"></i>
                        <strong>${formatDisplayDate(booking.date)}</strong>
                        <span>, lúc ${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}</span>
                    </p>
                </div>
                <div class="booking-actions">
                    ${renderBookingActions(booking)}
                </div>
            </div>
        </div>
    `).join('');
}

function renderBookingActions(booking) {
    let actions = '';
    if (booking.status === 'PENDING') {
        actions += `<button class="btn btn-success" onclick="handleConfirm(${booking.id})"><i class="fas fa-check"></i> Xác nhận</button>`;
    }
    if (booking.status === 'CONFIRMED') {
        actions += `<button class="btn btn-info" onclick="handleComplete(${booking.id})"><i class="fas fa-flag-checkered"></i> Hoàn thành</button>`;
    }
    if (booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED') {
        actions += `<button class="btn btn-danger" onclick="handleCancel(${booking.id})"><i class="fas fa-times"></i> Hủy lịch</button>`;
    }
    return actions || '<span class="text-muted small">Không có hành động</span>';
}

function filterBookingsByStatus(status) {
    currentBookingFilter = status;
    displayAllBookings();
}

async function handleConfirm(bookingId) {
    if (!confirm(`Bạn có chắc muốn XÁC NHẬN lịch hẹn #${bookingId}?`)) return;
    try {
        showLoading('Đang xác nhận...');
        const response = await fetch(`/api/bookings/${bookingId}/confirm`, { method: 'PUT' });
        if (!response.ok) throw new Error('Thao tác thất bại');
        hideLoading();
        showAlert('Xác nhận lịch hẹn thành công!', 'success');
        loadAllBookings();
    } catch (error) {
        hideLoading();
        showAlert(error.message, 'danger');
    }
}

async function handleCancel(bookingId) {
    const reason = prompt(`Nhập lý do hủy cho lịch hẹn #${bookingId}:`, "Bác sĩ có việc đột xuất");
    if (reason === null) return;
    if (!reason.trim()) {
        showAlert('Vui lòng nhập lý do hủy.', 'warning');
        return;
    }
    try {
        showLoading('Đang hủy lịch...');
        const response = await fetch(`/api/bookings/${bookingId}/cancel?reason=${encodeURIComponent(reason)}`, { method: 'PUT' });
        if (!response.ok) throw new Error('Thao tác thất bại');
        hideLoading();
        showAlert('Hủy lịch hẹn thành công!', 'success');
        loadAllBookings();
    } catch (error) {
        hideLoading();
        showAlert(error.message, 'danger');
    }
}

async function handleComplete(bookingId) {
    if (!confirm(`Bạn có chắc muốn đánh dấu HOÀN THÀNH cho lịch hẹn #${bookingId}?`)) return;
    try {
        showLoading('Đang cập nhật...');
        const response = await fetch(`/api/bookings/${bookingId}/complete`, { method: 'PUT' });
        if (!response.ok) throw new Error('Thao tác thất bại');
        hideLoading();
        showAlert('Cập nhật trạng thái thành công!', 'success');
        loadAllBookings();
    } catch (error) {
        hideLoading();
        showAlert(error.message, 'danger');
    }
}

// --- LOGIC CÁC TAB KHÁC (ĐÃ BỔ SUNG) ---

async function loadAllServices() {
    const container = document.getElementById('allServices');
    if (!container) return;
    container.innerHTML = '<p>Đang tải danh sách dịch vụ...</p>';
    try {
        // !!! LƯU Ý: Đảm bảo đường dẫn API '/api/admin/services' là chính xác
        const response = await fetch('/api/admin/services');
        if (!response.ok) throw new Error('Không thể tải dịch vụ');
        allServices = await response.json();
        displayAllServices();
    } catch (error) {
        console.error("Failed to load services:", error);
        container.innerHTML = `<div class="alert alert-danger">Lỗi: ${error.message}. Vui lòng kiểm tra lại đường dẫn API.</div>`;
    }
}

function displayAllServices() {
    const container = document.getElementById('allServices');
    if (!container) return;

    if (allServices.length === 0) {
        container.innerHTML = '<p class="text-center mt-4">Chưa có dịch vụ nào được thêm.</p>';
        return;
    }

    container.innerHTML = `
        <div class="service-cards-container">
            ${allServices.map(service => `
                <div class="service-manage-card slide-up">
                    <div class="service-info">
                        <div class="service-name">
                            <i class="fas fa-concierge-bell"></i>
                            <strong>${service.name}</strong>
                            <small class="text-muted">(ID: #${service.id})</small>
                        </div>
                        <div class="service-details">
                            <span class="service-detail-item">
                                <i class="fas fa-tag"></i>
                                ${formatPrice(service.price)} VNĐ
                            </span>
                            <span class="service-detail-item">
                                <i class="fas fa-clock"></i>
                                ${service.durationMinutes} phút
                            </span>
                        </div>
                    </div>
                    <div class="service-actions">
                        <button class="btn btn-warning" onclick="alert('Chức năng Sửa dịch vụ #${service.id} đang được phát triển')">
                            <i class="fas fa-pencil-alt"></i> Sửa
                        </button>
                        <button class="btn btn-danger" onclick="alert('Chức năng Xóa dịch vụ #${service.id} đang được phát triển')">
                            <i class="fas fa-trash-alt"></i> Xóa
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function loadAllTimeSlots() {
    const container = document.getElementById('allTimeSlots');
    if (!container) return;
    container.innerHTML = '<p>Đang tải danh sách khung giờ...</p>';
    try {
        // !!! LƯU Ý: Đảm bảo đường dẫn API '/api/admin/timeslots' là chính xác
        const response = await fetch('/api/admin/timeslots');
        if (!response.ok) throw new Error('Không thể tải khung giờ');
        allTimeSlots = await response.json();
        displayAllTimeSlots();
    } catch (error) {
        console.error("Failed to load time slots:", error);
        container.innerHTML = `<div class="alert alert-danger">Lỗi: ${error.message}. Vui lòng kiểm tra lại đường dẫn API.</div>`;
    }
}

function displayAllTimeSlots() {
    const container = document.getElementById('allTimeSlots');
    if (allTimeSlots.length === 0) {
        container.innerHTML = '<p class="text-center mt-4">Chưa có khung giờ nào được tạo.</p>';
        return;
    }
    const slotsByDate = allTimeSlots.reduce((acc, slot) => {
        const date = slot.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(slot);
        return acc;
    }, {});

    container.innerHTML = Object.keys(slotsByDate).sort((a, b) => new Date(b) - new Date(a)).map(date => `
        <div class="card mb-3">
            <div class="card-header">${formatDisplayDate(date)}</div>
            <div class="card-body">
                <div class="time-slots">
                    ${slotsByDate[date].map(slot => `
                        <div class="time-slot ${slot.isBooked ? 'unavailable' : ''}">
                            ${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function loadDashboardStats() {
    const container = document.getElementById('dashboardStats');
    if (container) container.innerHTML = '<p>Chức năng tổng quan sẽ được phát triển sớm.</p>';
}

function loadAllUsers() {
    const container = document.getElementById('allUsers');
    if (container) container.innerHTML = '<p>Chức năng quản lý người dùng sẽ được phát triển sớm.</p>';
}


// --- CÁC HÀM TIỆN ÍCH ---
function formatPrice(price) {
    if (typeof price !== 'number') return 'N/A';
    return new Intl.NumberFormat('vi-VN').format(price);
}

function formatDisplayDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('vi-VN', options);
}

function formatTime(timeString) {
    if (!timeString) return '';
    return timeString.substring(0, 5);
}

function getStatusClass(status) {
    const statusMap = {
        'PENDING': 'bg-warning',
        'CONFIRMED': 'bg-success',
        'CANCELLED': 'bg-danger',
        'COMPLETED': 'bg-info',
        'RESCHEDULED': 'bg-primary'
    };
    return statusMap[status] || 'bg-secondary';
}

function showAlert(message, type = 'info') {
    const alertId = `alert-${Date.now()}`;
    const alert = document.createElement('div');
    alert.id = alertId;
    alert.className = `admin-alert alert-${type} fade-in`; // Use admin-alert class
    alert.innerHTML = message;
    document.body.appendChild(alert);

    setTimeout(() => {
        const el = document.getElementById(alertId);
        if (el) el.remove();
    }, 4000);
}

function showLoading(message) {
    hideLoading();
    const loading = document.createElement('div');
    loading.id = 'loadingModal';
    loading.className = 'modal';
    loading.style.display = 'block';
    loading.innerHTML = `
        <div class="modal-content text-center">
            <div class="loading mb-2"></div>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loadingModal');
    if (loading) loading.remove();
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.remove();
}