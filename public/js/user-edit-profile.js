function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop().split(";").shift();
}

async function fetchUserProfile() {
    try {
        const userId = getCookie("userId"); // Lấy userId từ cookie
        if (!userId) {
            console.error("Không tìm thấy userId.");
            return;
        }
        console.log("id = ", userId);
        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
        if (!response.ok) {
            throw new Error("Không thể lấy dữ liệu người dùng.");
        }

        const userData = await response.json();

        // Hiển thị thông tin lên form
        document.getElementById("lname").value = userData.name || "";
        document.getElementById("uname").value = userData.username || "";
        document.querySelector(".crm-profile-pic").src = userData.avatar || "../assets/images/user/11.png";
        document.querySelector("textarea[name='address']").value = userData.address || "";
        document.getElementById("cno").value = userData.phone || "";
        document.getElementById("email").value = userData.email || "";

    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
    }
}

// Gọi hàm khi trang load
document.addEventListener("DOMContentLoaded", fetchUserProfile);



document.getElementById("user-form").addEventListener("submit", async function (event) { 

    const userId = getCookie("userId"); // Lấy userId từ cookie
    if (!userId) {
        console.error("Không tìm thấy userId.");
        return;
    }

    // Lấy dữ liệu từ form
    const updatedData = {
        name: document.getElementById("lname").value,
        username: document.getElementById("uname").value,
        address: document.querySelector("textarea[name='address']").value
    };

    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            alert("Cập nhật không thành công!");

            throw new Error("Cập nhật không thành công.");
        }

        alert("Cập nhật thành công!");

        //        window.location.reload(); // Tải lại trang để thấy thay đổi
    } catch (error) {
        console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
});




document.getElementById("user-form2").addEventListener("submit", async function (event) { 

    const userId = getCookie("userId"); // Lấy userId từ cookie
    if (!userId) {
        console.error("Không tìm thấy userId.");
        return;
    }

    // Lấy dữ liệu từ form
    const updatedData = {
        phone: document.getElementById("cno").value,
        email: document.getElementById("email").value,
    };

    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            alert("Cập nhật không thành công!");

            throw new Error("Cập nhật không thành công.");
        }

        alert("Cập nhật thành công!");

           window.location.reload(); // Tải lại trang để thấy thay đổi
    } catch (error) {
        console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
});
