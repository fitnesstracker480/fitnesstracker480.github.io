document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const adminLoginForm = document.getElementById('admin-login-form');
    const background = document.body;
  
    const trackerSection = document.getElementById('tracker-section');
    const workoutForm = document.getElementById('workout-form');
    const workoutList = document.getElementById('workout-list');
    const totalSetsSpan = document.getElementById('total-sets');
    const logoutButton = document.getElementById('logout');
  
    let currentUser = null;
    let totalSets = 0;
    let workouts = [];
    let clickCounter = 0;
  
    showRegisterLink.addEventListener('click', () => {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
    });
  
    showLoginLink.addEventListener('click', () => {
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
    });
  
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value.trim();
  
      const user = JSON.parse(localStorage.getItem(username));
      if (user && user.password === password) {
        currentUser = username;
        loadWorkouts();
        authSection.style.display = 'none';
        trackerSection.style.display = 'block';
        showWelcomeMessage(username); // Toon welkomstboodschap na succesvol inloggen
        checkAdminStatus(); // Controleer de adminstatus na inloggen
      } else {
        alert('Ongeldige gebruikersnaam of wachtwoord');
      }
    });
  
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('register-username').value.trim();
      const password = document.getElementById('register-password').value.trim();
  
      if (localStorage.getItem(username)) {
        alert('Gebruikersnaam is al in gebruik');
      } else {
        const user = { password: password, workouts: [] };
        localStorage.setItem(username, JSON.stringify(user));
        currentUser = username; // Automatisch inloggen na registratie
        loadWorkouts();
        alert('Registratie succesvol! Je bent nu ingelogd.');
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        authSection.style.display = 'none';
        trackerSection.style.display = 'block';
        showWelcomeMessage(username);
        checkAdminStatus(); // Controleer de adminstatus na registratie
      }
    });
  
    // Background click counter
    background.addEventListener('click', () => {
      clickCounter++;
      if (clickCounter === 50) {
        displayAdminLogin(); // Toon de admin login na 5 klikken
      }
    });
  
    // Admin Login Event
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const adminUsername = document.getElementById('admin-username').value.trim();
      const adminPassword = document.getElementById('admin-password').value.trim();
  
      // Hier controleer je de admin credentials
      if (adminUsername === 'admin' && adminPassword === 'katlol245') {
        displayAdminSection(); // Toon de admin sectie
        hideContainer(); // Verberg de container div
      } else {
        alert('Ongeldige admin gebruikersnaam of wachtwoord');
      }
    });
  
    workoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const workoutInput = document.getElementById('workout');
      const setsInput = document.getElementById('sets');
      const repsInput = document.getElementById('reps');
  
      const workout = workoutInput.value.trim();
      const sets = parseInt(setsInput.value.trim());
      const reps = parseInt(repsInput.value.trim());
  
      if (workout && sets > 0 && reps > 0) {
        addWorkoutToList(workout, sets, reps);
        updateTotalSets(sets);
  
        workouts.push({ name: workout, sets: sets, reps: reps });
        saveWorkouts();
  
        workoutInput.value = '';
        setsInput.value = '';
        repsInput.value = '';
      }
    });
  
    workoutList.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const li = e.target.parentElement;
        const workoutName = li.firstChild.textContent.split(' - ')[0];
        const sets = parseInt(li.firstChild.textContent.split(' - ')[1]);
        const reps = parseInt(li.firstChild.textContent.split(' - ')[2]);
  
        removeWorkoutFromList(li, sets);
        workouts = workouts.filter(workout => !(workout.name === workoutName && workout.sets === sets && workout.reps === reps));
        saveWorkouts();
      }
    });
  
    logoutButton.addEventListener('click', () => {
      logoutUser();
    });
  
    function showWelcomeMessage(username) {
      const welcomeMessage = document.createElement('div');
      welcomeMessage.classList.add('welcome-message');
      welcomeMessage.textContent = `Welkom ${username}`;
  
      document.body.appendChild(welcomeMessage);
  
      setTimeout(() => {
        welcomeMessage.classList.add('fade-out');
        setTimeout(() => {
          welcomeMessage.remove();
        }, 1000);
      }, 3000);
    }
  
    function addWorkoutToList(workout, sets, reps) {
      const li = document.createElement('li');
      li.innerHTML = `${workout} - ${sets} sets - ${reps} reps <button class="verzend">Verwijder</button>`;
      workoutList.appendChild(li);
    }
  
    function updateTotalSets(sets) {
      totalSets += sets;
      totalSetsSpan.textContent = totalSets;
    }
  
    function removeWorkoutFromList(li, sets) {
      workoutList.removeChild(li);
      totalSets -= sets;
      totalSetsSpan.textContent = totalSets;
    }
  
    function saveWorkouts() {
      const user = JSON.parse(localStorage.getItem(currentUser));
      user.workouts = workouts;
      localStorage.setItem(currentUser, JSON.stringify(user));
    }
  
    function loadWorkouts() {
      const user = JSON.parse(localStorage.getItem(currentUser));
      workouts = user.workouts;
      totalSets = 0;
      workoutList.innerHTML = '';
      workouts.forEach(workout => {
        addWorkoutToList(workout.name, workout.sets, workout.reps);
        updateTotalSets(workout.sets);
      });
    }
  
    function logoutUser() {
      currentUser = null;
      workouts = [];
      totalSets = 0;
      totalSetsSpan.textContent = totalSets;
      workoutList.innerHTML = '';
      authSection.style.display = 'block';
      trackerSection.style.display = 'none';
  
      // Herlaad de pagina
      window.location.reload();
    }
  
    function displayAdminLogin() {
      // Toon het admin login formulier na 5 klikken
      adminLoginForm.style.display = 'block';
    }
  
    function displayAdminSection() {
      // Verberg authSection en trackerSection
      authSection.style.display = 'none';
      trackerSection.style.display = 'none';
  
      // Toon de admin sectie
      const adminSection = document.createElement('div');
      adminSection.id = 'admin-section';
      adminSection.innerHTML = `
        <h2>Admin Section</h2>
        <button id="delete-all-users">Verwijder Alle Gebruikers en Gegevens</button>
        <div id="user-list"></div>
        <h3>Gebruikers Sets Informatie:</h3>
        <ul id="users-sets-info"></ul>
      `;
      document.body.appendChild(adminSection);
  
      const deleteAllUsersButton = document.getElementById('delete-all-users');
      deleteAllUsersButton.addEventListener('click', () => {
        if (confirm('Weet je zeker dat je alle gebruikers en hun gegevens wilt verwijderen?')) {
          deleteAllUsers();
        }
      });
  
      // Laat de lijst met gebruikers zien
      const userListDiv = document.getElementById('user-list');
      for (let i = 0; i < localStorage.length; i++) {
        const username = localStorage.key(i);
        if (username !== 'admin') {
          const userData = JSON.parse(localStorage.getItem(username));
          const userElement = document.createElement('div');
          userElement.textContent = `Gebruikersnaam: ${username}, Wachtwoord: ${userData.password}`;
          userListDiv.appendChild(userElement);
        }
      }

      // Laat de sets informatie van gebruikers zien
      const usersSetsInfoList = document.getElementById('users-sets-info');
      for (let i = 0; i < localStorage.length; i++) {
        const username = localStorage.key(i);
        if (username !== 'admin') {
          const userData = JSON.parse(localStorage.getItem(username));
          const setsInfoElement = document.createElement('li');
          setsInfoElement.textContent = `Gebruiker: ${username}, Totale Sets: ${calculateTotalSets(userData.workouts)}`;
          usersSetsInfoList.appendChild(setsInfoElement);
        }
      }
    }
  
    function calculateTotalSets(workouts) {
      let totalSets = 0;
      workouts.forEach(workout => {
        totalSets += workout.sets;
      });
      return totalSets;
    }
  
    function deleteAllUsers() {
      localStorage.clear();
      alert('Alle gebruikers en hun gegevens zijn verwijderd.');
      logoutAdmin();
    }
  
    function logoutAdmin() {
      const adminSection = document.getElementById('admin-section');
      adminSection.remove();
      authSection.style.display = 'block';
      trackerSection.style.display = 'none';
    }
  
    function hideContainer() {
      const container = document.querySelector('.container');
      container.style.display = 'none';
    }
  
    function checkAdminStatus() {
      if (currentUser === 'admin') {
        displayAdminSection();
      }
    }
});
