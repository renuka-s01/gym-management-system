function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function showSection(sectionId, element) {
  let sections = document.querySelectorAll(".content");
  sections.forEach(section => section.classList.remove("active"));

  let menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach(item => item.classList.remove("active-menu"));

  document.getElementById(sectionId).classList.add("active");

  if (element && !element.classList.contains("logout-btn")) {
    element.classList.add("active-menu");
  }
}

function logoutMember() {
  let confirmLogout = confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    localStorage.removeItem("loggedInMember");
    window.location.href = "../public/index.html";
  }
}

function loadMemberData() {
  let loggedInMember = JSON.parse(localStorage.getItem("loggedInMember"));

  if (!loggedInMember) {
    alert("Please login first");
    window.location.href = "../public/index.html";
    return;
  }

  let members = getData("members");
  let currentMember = members.find(member => member.name === loggedInMember.name);

  if (!currentMember) {
    alert("Member data not found");
    window.location.href = "../public/index.html";
    return;
  }

  document.getElementById("welcomeText").innerText = `Welcome, ${currentMember.name}`;

  let billReceiptList = document.getElementById("billReceiptList");
  let billNotificationList = document.getElementById("billNotificationList");

  billReceiptList.innerHTML = "";
  billNotificationList.innerHTML = "";

  let bills = currentMember.bills || [];
  let notifications = currentMember.notifications || [];

  if (bills.length === 0) {
    billReceiptList.innerHTML = `
      <div class="empty-card">
        <h3>No Bills Found</h3>
        <p>Your bill receipts will appear here.</p>
      </div>
    `;
  } else {
    bills.forEach(bill => {
      billReceiptList.innerHTML += `
        <div class="receipt-card">
          <h3>Bill Receipt</h3>
          <p><strong>Name:</strong> ${currentMember.name}</p>
          <p><strong>Amount:</strong> ₹${bill.amount}</p>
          <p><strong>Date:</strong> ${bill.date || "Not available"}</p>
        </div>
      `;
    });
  }

  if (notifications.length === 0) {
    billNotificationList.innerHTML = `
      <div class="empty-card">
        <h3>No Notifications</h3>
        <p>Your notifications will appear here.</p>
      </div>
    `;
  } else {
    notifications.forEach(note => {
      billNotificationList.innerHTML += `
        <div class="notice-card">
          <h3>Notification</h3>
          <p><strong>Message:</strong> ${note.message}</p>
          <p><strong>Date:</strong> ${note.date || "Not available"}</p>
        </div>
      `;
    });
  }
}

window.onload = function () {
  loadMemberData();
};