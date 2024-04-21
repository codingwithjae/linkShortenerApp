import { signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { auth } from './firebase.js';

const logoutButton = document.querySelector('.logged-in');

// Add click event listener to logout button
logoutButton.addEventListener('click', async () => {
  try {
    // Sign out the user
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
});
