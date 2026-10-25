(function () {
  'use strict';

  // Année du pied de page
  document.getElementById('year').textContent = new Date().getFullYear();

  // Menu mobile
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Mise en évidence du jour courant dans le tableau des horaires
  var jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  var aujourdhui = jours[new Date().getDay()];
  document.querySelectorAll('.schedule tbody tr').forEach(function (row) {
    if (row.cells[0].textContent.trim() === aujourdhui) {
      row.style.background = '#f8e3df';
      row.cells[0].textContent += ' (aujourd’hui)';
    }
  });

  // Coordonnées : absentes du HTML, assemblées uniquement au clic
  // (évite qu'elles s'affichent à l'écran ou soient moissonnées par des robots).
  var contacts = {
    tel: function () { return 'tel:' + ['+33', '6', '64', '73', '94', '73'].join(''); },
    mail: function () { return 'mailto:' + ['aikidobracieux', 'hotmail.fr'].join('@'); },
    fb: function () { return 'https://www.facebook.com/people/A%C3%AFkido-Bracieux/61579966506512/'; }
  };

  document.querySelectorAll('[data-contact]').forEach(function (box) {
    box.addEventListener('click', function (e) {
      e.preventDefault();
      var kind = box.getAttribute('data-contact');
      var url = contacts[kind]();
      if (kind === 'fb') {
        window.open(url, '_blank', 'noopener');
      } else {
        window.location.href = url;
      }
    });
  });
})();
