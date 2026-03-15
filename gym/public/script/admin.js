function showSection(sectionId) {
  let sections = document.querySelectorAll(".content");
  sections.forEach(section => section.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
}

function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function updateDashboard() {
  let members = getData("members") || [];
  let totalMembers = document.getElementById("totalMembers");

  if (totalMembers) {
    totalMembers.textContent = members.length;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  updateDashboard();
});

function addMember() {
  let name = document.getElementById("memberName").value.trim();
  let email = document.getElementById("memberEmail").value.trim();
  let phone = document.getElementById("memberPhone").value.trim();
  let age = document.getElementById("memberAge").value.trim();
  let gender = document.getElementById("memberGender").value;
  let password = document.getElementById("memberPassword").value.trim();

  if (!name || !email || !phone || !age || !gender || !password) {
    alert("Please fill all fields");
    return;
  }

  let members = getData("members");

  let alreadyExists = members.some(member => member.email === email);
  if (alreadyExists) {
    alert("Member already exists with this email");
    return;
  }

  members.push({
    id: Date.now(),
    name,
    email,
    phone,
    age,
    gender,
    password,
    package: "Not Assigned",
    notifications: [],
    bills: [],
    dietPlan: ""
  });

  setData("members", members);

  document.getElementById("memberName").value = "";
  document.getElementById("memberEmail").value = "";
  document.getElementById("memberPhone").value = "";
  document.getElementById("memberAge").value = "";
  document.getElementById("memberGender").value = "";
  document.getElementById("memberPassword").value = "";

   displayMembers();

  alert("Member added successfully");
}

function displayMembers() {
  let members = getData("members");
  let table = document.getElementById("memberTable");
  table.innerHTML = "";

  members.forEach((member, index) => {
    table.innerHTML += `
      <tr>
        <td>${member.name}</td>
        <td>${member.email}</td>
        <td>${member.phone}</td>
        <td>${member.age}</td>
        <td>${member.gender}</td>
        <td>${member.package}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editMember(${index})">Edit</button>
          <button class="action-btn delete-btn" onclick="deleteMember(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function deleteMember(index) {
  let members = getData("members");
  members.splice(index, 1);
  setData("members", members);
  displayMembers();
  updateMemberDropdowns();
  updateDashboard();
}

function editMember(index) {
  let members = getData("members");
  let member = members[index];

  let newName = prompt("Edit name:", member.name);
  let newEmail = prompt("Edit email:", member.email);
  let newPhone = prompt("Edit phone:", member.phone);
  let newAge = prompt("Edit age:", member.age);
  let newGender = prompt("Edit gender:", member.gender);

  if (newName && newEmail && newPhone && newAge && newGender) {
    members[index].name = newName;
    members[index].email = newEmail;
    members[index].phone = newPhone;
    members[index].age = newAge;
    members[index].gender = newGender;

    setData("members", members);
    displayMembers();
    updateMemberDropdowns();
    updateDashboard();
  }
}

function updateMemberDropdowns() {
  let members = getData("members");

  let packageMember = document.getElementById("packageMember");
  let billMember = document.getElementById("billMember");
  let notificationMember = document.getElementById("notificationMember");
  let dietMember = document.getElementById("dietMember");

  packageMember.innerHTML = `<option value="">Select Member</option>`;
  billMember.innerHTML = `<option value="">Select Member</option>`;
  notificationMember.innerHTML = `<option value="">Select Member</option>`;
  dietMember.innerHTML = `<option value="">Select Member</option>`;

  members.forEach((member, index) => {
    packageMember.innerHTML += `<option value="${index}">${member.name}</option>`;
    billMember.innerHTML += `<option value="${index}">${member.name}</option>`;
    notificationMember.innerHTML += `<option value="${index}">${member.name}</option>`;
    dietMember.innerHTML += `<option value="${index}">${member.name}</option>`;
  });
}


function loadpackageMember() {
    let members = getData("members") || [];
  let select = document.getElementById("packageMember");

  select.innerHTML = `<option value="">Select Member</option>`;

  members.forEach((member, index) => {
    select.innerHTML += `<option value="${index}">${member.name}</option>`;
  });
  loadMembersInSelect("packageMember");

}

  window.addEventListener("DOMContentLoaded", function () {
  loadpackageMember();
});

function assignPackage() {
  let memberIndex = document.getElementById("packageMember").value;
  let packageType = document.getElementById("packageType").value;

  if (memberIndex === "" || !packageType) {
    alert("Please select member and package");
    return;
  }

  let members = getData("members");
  members[memberIndex].package = packageType;
  setData("members", members);

  displayMembers();
  alert("Package assigned successfully");
}



function loadNotificationMembers() {
    let members = getData("members") || [];
  let select = document.getElementById("notificationMember");

  select.innerHTML = `<option value="">Select Member</option>`;

  members.forEach((member, index) => {
    select.innerHTML += `<option value="${index}">${member.name}</option>`;
  });
  loadMembersInSelect("notificationMember");
}

function sendNotification() {
  let memberIndex = document.getElementById("notificationMember").value;
  let message = document.getElementById("notificationText").value.trim();

  if (memberIndex === "" || !message) {
    alert("Please select member and write notification");
    return;
  }

  let members = getData("members") || [];

  if (!members[memberIndex]) {
    alert("Invalid member selected");
    return;
  }

  if (!members[memberIndex].notifications) {
    members[memberIndex].notifications = [];
  }

  members[memberIndex].notifications.push({
    message: message,
    date: new Date().toLocaleDateString()
  });

  setData("members", members);
  displayNotifications();

  document.getElementById("notificationMember").value = "";
  document.getElementById("notificationText").value = "";

  alert("Notification sent successfully");
}

function displayNotifications() {
  let members = getData("members") || [];
  let box = document.getElementById("notificationList");

  if (!box) return;

  box.innerHTML = "";

  members.forEach(member => {
    let notifications = member.notifications || [];

    notifications.forEach(note => {
      box.innerHTML += `
        <div class="list-item">
          <strong>${member.name}</strong><br>
          ${note.message}<br>
          <small>${note.date}</small>
        </div>
      `;
    });
  });
}

window.addEventListener("DOMContentLoaded", function () {
  loadNotificationMembers();
  displayNotifications();
});


function loaddietMember() {
    let members = getData("members") || [];
  let select = document.getElementById("dietMember");

  select.innerHTML = `<option value="">Select Member</option>`;

  members.forEach((member, index) => {
    select.innerHTML += `<option value="${index}">${member.name}</option>`;
  });
  loadMembersInSelect("dietMember");

}

window.addEventListener("DOMContentLoaded", function () {
 loaddietMember();
});

function saveDietPlan() {
  let memberIndex = document.getElementById("dietMember").value;
  let dietText = document.getElementById("dietText").value.trim();

  if (memberIndex === "" || !dietText) {
    alert("Please select member and enter diet plan");
    return;
  }

  let members = getData("members");
  members[memberIndex].dietPlan = dietText;
  setData("members", members);

  document.getElementById("dietMember").value = "";
  document.getElementById("dietText").value = "";

  displayDietPlans();
  alert("Diet plan saved successfully");
}

function displayDietPlans() {
  let members = getData("members");
  let box = document.getElementById("dietList");
  box.innerHTML = "";

  members.forEach(member => {
    if (member.dietPlan) {
      box.innerHTML += `
        <div class="list-item">
          <strong>${member.name}</strong><br>
          ${member.dietPlan}
        </div>
      `;
    }
  });
}



function addSupplement() {
  let name = document.getElementById("supplementName").value.trim();
  let price = document.getElementById("supplementPrice").value.trim();

  if (!name || !price) {
    alert("Please enter supplement details");
    return;
  }

  let supplements = getData("supplements");
  supplements.push({ name, price });
  setData("supplements", supplements);

  document.getElementById("supplementName").value = "";
  document.getElementById("supplementPrice").value = "";

  displaySupplements();
  updateDashboard();
}

function displaySupplements() {
  let supplements = getData("supplements");
  let table = document.getElementById("supplementTable");
  table.innerHTML = "";

  supplements.forEach((item, index) => {
    table.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td><button class="delete-btn" onclick="deleteSupplement(${index})">Delete</button></td>
      </tr>
    `;
  });
}

function deleteSupplement(index) {
  let supplements = getData("supplements");
  supplements.splice(index, 1);
  setData("supplements", supplements);
  displaySupplements();
  updateDashboard();
}

function downloadMembersReport() {
  let members = getData("members");

  if (members.length === 0) {
    alert("No members available");
    return;
  }

  let report = "IRONPULSE MEMBERS REPORT\n\n";
  members.forEach((member, index) => {
    report += `${index + 1}. ${member.name} | ${member.email} | ${member.phone} | ${member.age} | ${member.gender} | ${member.package}\n`;
  });

  let blob = new Blob([report], { type: "text/plain" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "members_report.txt";
  link.click();
}

function updateDashboard() {
  let members = getData("members");
  let notificationCount = 0;
  let billCount = 0;

  members.forEach(member => {
    notificationCount += member.notifications.length;
    billCount += member.bills.length;
  });

  document.getElementById("totalMembers").textContent = members.length;
  document.getElementById("totalSupplements").textContent = getData("supplements").length;
  document.getElementById("totalNotifications").textContent = notificationCount;
}

function logoutAdmin() {
  localStorage.removeItem("loggedInAdmin");
  window.location.href = "../public/index.html";
}

window.onload = function () {
  displayMembers();
  displayBills();
  displayNotifications();
  displaySupplements();
  displayDietPlans();
  updateMemberDropdowns();
  updateDashboard();
};