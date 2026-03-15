

function showSection(sectionId) {
  let sections = document.querySelectorAll(".content");
  sections.forEach(section => section.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
}

function loadUserDetails() {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  let box = document.getElementById("userDetailsBox");

  if (!user) {
    box.innerHTML = "<p>No user logged in.</p>";
    return;
  }

  box.innerHTML = `
    <div class="record-card">
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
    </div>
  `;
}

function searchRecords() {
  let searchValue = document.getElementById("searchInput").value.trim().toLowerCase();
  let resultBox = document.getElementById("searchResult");

  if (searchValue === "") {
    resultBox.innerHTML = "<p>Please enter name or email.</p>";
    return;
  }

  const dbRef = ref(database);

  get(child(dbRef, "users"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let users = snapshot.val();
        let filteredUsers = [];

        for (let key in users) {
          let user = users[key];
          if (
            user.name.toLowerCase().includes(searchValue) ||
            user.email.toLowerCase().includes(searchValue)
          ) {
            filteredUsers.push(user);
          }
        }

        if (filteredUsers.length === 0) {
          resultBox.innerHTML = "<p>No record found.</p>";
          return;
        }

        resultBox.innerHTML = filteredUsers.map(user => `
          <div class="record-card">
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
          </div>
        `).join("");
      } else {
        resultBox.innerHTML = "<p>No records found.</p>";
      }
    })
    .catch((error) => {
      resultBox.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

function logoutUser() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../public/index.html";
}

window.showSection = showSection;
window.searchRecords = searchRecords;
window.logoutUser = logoutUser;

window.onload = function () {
  loadUserDetails();
  showSection("viewDetails");
};