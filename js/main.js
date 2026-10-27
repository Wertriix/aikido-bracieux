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

  // Sur téléphone (écran tactile) : on lance l'appel directement.
  // Sur ordinateur : on affiche le numéro dans l'encadré et on le copie.
  var tactile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  function afficherNumero(box) {
    var num = ['06', '64', '73', '94', '73'].join(' ');
    var info = box.querySelector('span:last-child');
    if (!info) return;
    info.textContent = num;
    info.style.fontWeight = '700';
    info.style.color = 'var(--red)';
    info.style.fontSize = '1.2rem';
    var hint = box.querySelector('.contact-hint');
    if (!hint) {
      hint = document.createElement('small');
      hint.className = 'contact-hint';
      hint.style.color = 'var(--muted)';
      box.appendChild(hint);
    }
    hint.textContent = '';
    try {
      navigator.clipboard.writeText(num.replace(/ /g, '')).then(function () {
        hint.textContent = 'Numéro copié';
      }, function () { /* ignoré */ });
    } catch (err) { /* ignoré */ }
  }

  document.querySelectorAll('[data-contact]').forEach(function (box) {
    box.addEventListener('click', function (e) {
      e.preventDefault();
      var kind = box.getAttribute('data-contact');
      if (kind === 'tel' && !tactile) { afficherNumero(box); return; }
      var url = contacts[kind]();
      if (kind === 'fb') {
        window.open(url, '_blank', 'noopener');
      } else {
        window.location.href = url;
      }
    });
  });
})();
