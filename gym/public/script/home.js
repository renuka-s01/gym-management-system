function calculateBMI() {
  let weight = parseFloat(document.getElementById("weight").value);
  let height = parseFloat(document.getElementById("height").value) / 100;
  
  if (!weight || !height || weight <= 0 || height <= 0) {
    document.getElementById("result").innerText = "Enter valid values";
    return;
  }

  let bmi = (weight / (height * height)).toFixed(2);
  let category = "";

  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  document.getElementById("result").innerText = `${bmi} (${category})`;
}



function showMessage(event) {
  event.preventDefault();

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let plan = document.getElementById("plan").value;
  let successMsg = document.getElementById("successMsg");

  if (!name || !email || !phone || !plan) {
    successMsg.innerText = "Please fill all fields.";
    successMsg.style.color = "red";
    return;
  }

  // Store new member in localStorage
  let members = JSON.parse(localStorage.getItem("members")) || [];

  let newMember = {
    id: Date.now(),
    name,
    email,
    phone,
    plan,
    password: "member123" // default password for simplicity
  };

  members.push(newMember);
  localStorage.setItem("members", JSON.stringify(members));

  successMsg.innerText = "Registration Successful! Your password is 'member123'.";
  successMsg.style.color = "lightgreen";

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("plan").value = "";
}


function login() {
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value.trim();
  let role = document.getElementById("role").value;
  let message = document.getElementById("message");

  message.innerText = "";

  if (!username || !password || !role) {
    message.innerText = "Please fill all fields";
    message.style.color = "red";
    return;
  }

  // ADMIN LOGIN
  if (role === "admin") {
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("loggedInAdmin", JSON.stringify({ username: "admin" }));
      window.location.href = "../public/admin.html";
      return;
    } else {
      message.innerText = "Invalid admin username or password";
      message.style.color = "red";
      return;
    }
  }

  // FETCH USERS AND MEMBERS FROM LOCALSTORAGE
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let members = JSON.parse(localStorage.getItem("members")) || [];

  // USER LOGIN
  if (role === "user") {
    // Merge users and members to allow member also login as user
    let allUsers = [...users, ...members];
    let foundUser = allUsers.find(user =>
      (user.name.toLowerCase() === username.toLowerCase() ||
       user.email.toLowerCase() === username.toLowerCase()) &&
      user.password === password
    );

    if (foundUser) {
      localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
      window.location.href = "../public/user.html";
    } else {
      message.innerText = "Invalid user login";
      message.style.color = "red";
    }
    return;
  }

  // MEMBER LOGIN
  if (role === "member") {
    let foundMember = members.find(member =>
      (member.name.toLowerCase() === username.toLowerCase() ||
       member.email.toLowerCase() === username.toLowerCase()) &&
      member.password === password
    );

    if (foundMember) {
      localStorage.setItem("loggedInMember", JSON.stringify(foundMember));
      window.location.href = "../public/member.html";
    } else {
      message.innerText = "Invalid member login";
      message.style.color = "red";
    }
  }
}