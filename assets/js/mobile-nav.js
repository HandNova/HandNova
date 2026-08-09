document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.navbar').forEach(function (navbar) {
    var links = navbar.querySelector('.nav-links');
    if (!links) return;

    var toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Abrir menú');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>' +
      '</svg>';
    navbar.appendChild(toggle);

    toggle.addEventListener('click', function () {
      var abierto = links.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      toggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });

    function cerrarMenu() {
      links.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    }

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', cerrarMenu);
    });

    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) cerrarMenu();
    });
  });

  /* ---- Accesibilidad del menú desplegable "Más" -----------------------
     Antes solo se abría con :hover, así que era imposible de usar con
     teclado. Ahora también se abre/cierra con clic o Enter, y se anuncia
     su estado con aria-expanded para lectores de pantalla. ------------- */
  document.querySelectorAll('.dropdown').forEach(function (dropdown) {
    var trigger = dropdown.querySelector(':scope > a');
    var menu = dropdown.querySelector('.dropdown-menu');
    if (!trigger || !menu) return;

    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    function abrir() {
      dropdown.classList.add('dropdown-abierto');
      trigger.setAttribute('aria-expanded', 'true');
    }
    function cerrar() {
      dropdown.classList.remove('dropdown-abierto');
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      dropdown.classList.contains('dropdown-abierto') ? cerrar() : abrir();
    });

    dropdown.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { cerrar(); trigger.focus(); }
    });

    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) cerrar();
    });
  });
});