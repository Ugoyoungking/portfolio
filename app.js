AOS.init({duration:1000});

new Typed(".typed-text",{
  strings:["Frontend Developer","Backend Developer","Web Designer","Graphic Designer","Problem Solver"],
  typeSpeed:70,backSpeed:40,loop:true
});

const toggleDark=document.getElementById("toggle-dark");
toggleDark.addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  toggleDark.textContent=document.body.classList.contains("dark")?"☀️ Light Mode":"🌙 Dark Mode";
});
// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});
// Modals
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeBtns = document.querySelectorAll('.close');

document.getElementById('loginBtn').onclick = () => loginModal.style.display = 'flex';
document.getElementById('signupBtn').onclick = () => signupModal.style.display = 'flex';

closeBtns.forEach(btn => btn.onclick = () => {
  loginModal.style.display = 'none';
  signupModal.style.display = 'none';
});

// Signup
document.getElementById('doSignup').onclick = () => {
  const email = document.getElementById('signupEmail').value;
  const pass = document.getElementById('signupPassword').value;
  localStorage.setItem('user', JSON.stringify({ email, pass }));
  alert("Signup successful! Please login.");
  signupModal.style.display = 'none';
};

// Login
document.getElementById('doLogin').onclick = () => {
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPassword').value;
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.email === email && user.pass === pass) {
    alert("Login successful! 🎉");
    loginModal.style.display = 'none';
  } else {
    alert("Invalid credentials ❌");
  }
};


const searchInput=document.getElementById("projectSearch");
const projects=document.querySelectorAll(".project");
searchInput.addEventListener("keyup",()=>{
  const search=searchInput.value.toLowerCase();
  projects.forEach(project=>{
    const title=project.dataset.title.toLowerCase();
    project.style.display=title.includes(search)?"block":"none";
  });
});

const scrollBtn=document.getElementById("scrollTopBtn");
window.addEventListener("scroll",()=>{scrollBtn.style.display=window.scrollY>300?"block":"none"});
scrollBtn.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})});

// EmailJS config
emailjs.init("YOUR_USER_ID"); // replace with your EmailJS public key
document.getElementById("contact-form").addEventListener("submit",function(e){
  e.preventDefault();
  emailjs.send("YOUR_SERVICE_ID","YOUR_TEMPLATE_ID",{
    from_name:document.getElementById("name").value,
    from_email:document.getElementById("email").value,
    message:document.getElementById("message").value
  }).then(()=>{
    alert("✅ Message Sent Successfully!");
    document.getElementById("contact-form").reset();
  },(error)=>{
    alert("❌ Failed to send message: "+JSON.stringify(error));
  });
});
