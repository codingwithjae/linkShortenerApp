const navLinks = document.querySelector('.header__navbar-container');
let isOpen = false;
let currentIcon = null;

function createIcon(iconClass) {
  const icon = document.createElement('i');
  icon.className = `fa ${iconClass} header__nav-icon text-3xl cursor-pointer md:hidden text-white transition-transform`;
  icon.onclick = onToggleMenu;
  return icon;
}

export function initializeMenuButton() {
  const buttonContainer = document.querySelector('.header__menu-button');
  currentIcon = createIcon('fa-bars');
  buttonContainer.appendChild(currentIcon);
}

export function onToggleMenu() {
  isOpen = !isOpen;
  navLinks.classList.toggle('top-28', isOpen);

  if (currentIcon) {
    currentIcon.remove();
  }

  const iconClass = isOpen ? 'fa-times' : 'fa-bars';
  currentIcon = createIcon(iconClass);
  document.querySelector('.header__menu-button').appendChild(currentIcon);
  currentIcon.classList.toggle('rotate-90', isOpen);
}
