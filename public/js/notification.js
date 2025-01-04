const socket = io("http://localhost:3000");

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop().split(";").shift();
}

const userId = getCookie("userId");
const token = getCookie("token");
socket.emit("register", userId);

socket.on("connect", () => {
    console.log("Kết nối đến server WebSocket thành công!");
});

getRecentAlerts(userId);

socket.on("newTaskAssigned", (data) => {
    console.log("Bạn có một nhiệm vụ mới:", data.message);
    getRecentAlerts(userId);
});

async function getRecentAlerts(userId) {
    try {
        const response = await fetch(
            `http://localhost:3000/api/alerts/user/${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch recent alerts");
        }

        const data = await response.json();
        console.log(data.alerts);
        updateNotifications(data.alerts, data.unreadCount);
    } catch (error) {
        console.error("Error fetching recent alerts:", error);
    }
}

function updateNotifications(alerts, unreadCount) {
    const notificationList = document.querySelector(".iq-sub-dropdown .sub-card");
    const notificationCount = document.querySelector(".badge-card");
    const viewAllButton = document.createElement("a");

    viewAllButton.textContent = "View All";
    viewAllButton.classList.add("right-ic", "btn", "btn-primary", "btn-block", "position-relative", "p-2");
    viewAllButton.setAttribute("href", "#");
    viewAllButton.setAttribute("role", "button");

    viewAllButton.addEventListener("click", (e) => {
        e.preventDefault(); // Ngăn chặn hành động mặc định của <a>
        openViewAllModal(alerts);  // Mở modal hiển thị toàn bộ thông báo
    });

    notificationList.innerHTML = "";  // Clear existing notifications
    const notificationsToShow = alerts.slice(0, 2); // Lấy 2 thông báo đầu tiên

    notificationsToShow.forEach((alertData) => {
        const isSpecialUser = userId === '67615bffb7decdd52980f1ce'; // Kiểm tra người dùng đặc biệt
        let newNotification = document.createElement("a");
        newNotification.href = "#";
        newNotification.classList.add("iq-sub-card");

        // Hiển thị thông báo cho người dùng đặc biệt
        if (isSpecialUser) {
            newNotification.innerHTML = `
                <div class="media align-items-center cust-card py-3 border-bottom special-alert">
                    <div class="media-body ml-3">
                        <div class="d-flex align-items-center justify-content-between">
                            <small class="text-dark"><b>${new Date(alertData.timestamp).toLocaleTimeString()}</b></small>
                        </div>
                        <small class="mb-0">
                            <strong>Task:</strong> ${alertData.task_id.title} <br />
                            <strong>Alert Type:</strong> ${alertData.alert_type} <br />
                            <strong>Reason:</strong> ${alertData.reason || "N/A"} <br />
                            <strong>Extend Until:</strong> ${alertData.date_extend ? new Date(alertData.date_extend).toLocaleDateString() : "N/A"} <br />
                        </small>
                    </div>
                </div>
            `;
        } else {
            newNotification.innerHTML = `
                <div class="media align-items-center cust-card py-3 border-bottom">
                    <div class="media-body ml-3">
                        <div class="d-flex align-items-center justify-content-between">
                            <h6 class="mb-0">Admin</h6>
                            <small class="text-dark"><b>${new Date(alertData.timestamp).toLocaleTimeString()}</b></small>
                        </div>
                        <small class="mb-0">
                            <strong>Task:</strong> ${alertData.task_id.title} <br />
                            <strong>Deadline:</strong> ${new Date(alertData.task_id.deadline).toLocaleDateString('en-GB')}
                        </small>
                    </div>
                </div>
            `;
        }

        notificationList.appendChild(newNotification);
    });

    if (notificationCount) {
        notificationCount.innerText = unreadCount;
    }
    notificationList.appendChild(viewAllButton);  // Always add "View All" button at the end

    addModalEventListeners();
}

function openViewAllModal(alerts) {
    let modal = document.getElementById("viewAllModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "viewAllModal";
        modal.className = "modal";
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <div id="allAlertsList" style="max-height: 400px; overflow-y: auto;"></div> <!-- Phần hiển thị các thông báo có thể cuộn -->
            </div>
        `;
        document.body.appendChild(modal);
    }

    const allAlertsList = document.getElementById("allAlertsList");
    allAlertsList.innerHTML = "";  // Clear the list before populating

    alerts.forEach((alertData) => {
        const alertItem = document.createElement("div");
        alertItem.classList.add("alert-item");

        const isSpecialUser = userId === '67615bffb7decdd52980f1ce';
        if (isSpecialUser) {
            alertItem.innerHTML = `
                <div class="media align-items-center cust-card py-3 border-bottom special-alert">
                    <div class="media-body ml-3">
                        <div class="d-flex align-items-center justify-content-between">
                            <small class="text-dark"><b>${new Date(alertData.timestamp).toLocaleTimeString()}</b></small>
                        </div>
                        <small class="mb-0">
                            <strong>Task:</strong> ${alertData.task_id.title} <br />
                            <strong>Alert Type:</strong> ${alertData.alert_type} <br />
                            <strong>Reason:</strong> ${alertData.reason || "N/A"} <br />
                            <strong>Extend Until:</strong> ${alertData.date_extend ? new Date(alertData.date_extend).toLocaleDateString() : "N/A"} <br />
                            <strong>From:</strong> ${alertData.user.username|| "Unknown"}
                        </small>
                    </div>
                </div>
            `;
        } else {
            alertItem.innerHTML = `
                <div class="media align-items-center cust-card py-3 border-bottom">
                    <div class="media-body ml-3">
                        <div class="d-flex align-items-center justify-content-between">
                            <h6 class="mb-0">From admin</h6>
                            <small class="text-dark"><b>${new Date(alertData.timestamp).toLocaleTimeString()}</b></small>
                        </div>
                        <small class="mb-0">
                            <strong>Task:</strong> ${alertData.task_id.title} <br />
                            <strong>Deadline:</strong> ${new Date(alertData.task_id.deadline).toLocaleDateString('en-GB')}
                        </small>
                    </div>
                </div>
            `;
        }

        allAlertsList.appendChild(alertItem);
    });

    modal.style.display = "block";

    modal.querySelector(".close-btn").addEventListener("click", () => {
        modal.style.display = "none";
    });
}

function addModalEventListeners() {
    const notifications = document.querySelectorAll(".iq-sub-card");
    notifications.forEach((notification) => {
        notification.addEventListener("click", (e) => {
            e.preventDefault();
            const alertId = notification.getAttribute("data-alert-id");
            openNotificationModal(alertId, notification.innerHTML);
            markAsRead(alertId);
        });
    });
}

function openNotificationModal(alertId, content) {
    let modal = document.getElementById("alertModal");
    let alertDetail = document.getElementById("alertDetail");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "alertModal";
        modal.className = "modal";
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <p id="alertDetail">${content}</p>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        alertDetail.innerHTML = content;
    }

    modal.style.display = "block";

    modal.querySelector(".close-btn").addEventListener("click", () => {
        modal.style.display = "none";
    });
}

async function markAsRead(alertId) {
    try {
        await fetch(`http://localhost:3000/api/alerts/${alertId}/mark-read`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error("Error marking alert as read:", error);
    }
}
