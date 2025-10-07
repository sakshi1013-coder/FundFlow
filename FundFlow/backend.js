  // apiKey: "AIzaSyAnCmv5nvQe109-FT507ZdRkUkKxLSc9Cs",
  // authDomain: "fundflow-f1fff.firebaseapp.com",
  // projectId: "fundflow-f1fff",
  // storageBucket: "fundflow-f1fff.firebasestorage.app",
  // messagingSenderId: "646525058573",
  // appId: "1:646525058573:web:1f8b596dfe35f6e83e1f44",
  // measurementId: "G-MPZRVEBKK7"


//login sign 
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAnCmv5nvQe109-FT507ZdRkUkKxLSc9Cs",
  authDomain: "fundflow-f1fff.firebaseapp.com",
  projectId: "fundflow-f1fff",
  storageBucket: "fundflow-f1fff.firebasestorage.app",
  messagingSenderId: "646525058573",
  appId: "1:646525058573:web:1f8b596dfe35f6e83e1f44",
  measurementId: "G-MPZRVEBKK7"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

// FirebaseUI config
const uiConfig = {
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  signInSuccessUrl: window.location.href,
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      return false; // Prevent redirect
    }
  }
};
const ui = new firebaseui.auth.AuthUI(firebase.auth());

// Modal logic
const authModal = document.getElementById('auth-modal');
const authLink = document.getElementById('auth-link');
const closeModal = document.getElementById('close-auth-modal');
const navUsername = document.getElementById('nav-username');

authLink.onclick = function() {
  authModal.classList.add('active');
  ui.start('#auth-container', uiConfig);
};
closeModal.onclick = function() {
  authModal.classList.remove('active');
};
window.onclick = function(event) {
  if (event.target === authModal) authModal.classList.remove('active');
};

// Auth state logic
firebase.auth().onAuthStateChanged(function(user) {
  const userInfo = document.getElementById('user-info');
  const logoutBtn = document.getElementById('logout-btn');
  const logoutIcon = document.getElementById('logout-icon');
  if (user) {
    let displayName = user.displayName;
    if (!displayName) {
      displayName = user.email ? user.email.split('@')[0] : "User";
    }
    navUsername.textContent = displayName;
    userInfo.innerHTML = `Logged in as <b>${displayName}</b>`;
    logoutBtn.style.display = 'inline-block';
    document.getElementById('auth-container').style.display = 'none';
    logoutIcon.style.display = 'inline-block'; // Show icon after login

    // Add click event to username to open dashboard
    navUsername.style.cursor = 'pointer';
    navUsername.onclick = function() {
      window.location.href = 'Dashboard.html';
    };
  } else {
    navUsername.textContent = "Signup / Login";
    userInfo.innerHTML = '';
    logoutBtn.style.display = 'none';
    document.getElementById('auth-container').style.display = 'block';
    logoutIcon.style.display = 'none'; // Hide icon when logged out
  }
});

document.getElementById('logout-btn').onclick = function() {
  firebase.auth().signOut();
  authModal.classList.remove('active');
};


