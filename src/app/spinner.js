// Función para ocultar el spinner
export function hideLoadingSpinner() {
    document.getElementById('loading-spinner').classList.add('hidden');
  }
  
  // Muestra el spinner cuando la página comienza a cargar
  document.addEventListener('DOMContentLoaded', function () {
    // Temporizador para ocultar el spinner después de 3 segundos (ajusta según sea necesario)
    setTimeout(hideLoadingSpinner, 3000);
  });
  
  // Oculta el spinner cuando todos los recursos de la página han terminado de cargar
  window.addEventListener('load', function () {
    hideLoadingSpinner();
  });
  