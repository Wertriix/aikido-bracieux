/* ==========================================================================
   ÉVÉNEMENTS DU CLUB — le seul endroit à modifier est la liste ci-dessous.

   Pour ajouter un événement :
     1. copie un bloc { ... } (de l'accolade ouvrante à l'accolade fermante + virgule)
     2. colle-le dans la liste EVENEMENTS
     3. remplace les textes entre guillemets

   Champs :
     date        obligatoire, au format AAAA-MM-JJ        ex. '2026-11-15'
     dateFin     facultatif, pour un événement de plusieurs jours
     heure       facultatif                               ex. '10h00 – 12h00'
     lieu        facultatif                               ex. 'Gymnase, Place Jardel'
     type        facultatif                               ex. 'Stage', 'Portes ouvertes'
     titre       obligatoire
     description facultatif

   Les événements passés disparaissent tout seuls. S'il n'y a plus rien à
   afficher, le message « Aucun événement annoncé » réapparaît.
   ========================================================================== */

var EVENEMENTS = [

  /* EXEMPLE : pour l'activer, enlève les « // » au début de chaque ligne,
     puis remplace les textes. Pense à garder la virgule après l'accolade fermante. */

   {
     date: '2026-11-15',
     heure: '10h00 – 12h00',
     lieu: 'Gymnase, Place Lucien Jardel',
     type: 'Portes ouvertes',
     titre: "Titre de l'événement_TEST",
     description: "Courte description de l'événement."
    },

  // {
 //    date: '2026-10-28',
 //    heure: '10h00 – 12h00',
 //    lieu: 'Gymnase, Place Lucien Jardel',
 //    type: 'Portes ouvertes',
 //    titre: "Titre de l'événement_TEST",
  //   description: "Courte description de l'événement."
 //   },

];


/* ==========================================================================
   NE PAS MODIFIER CI-DESSOUS : affichage des événements
   ========================================================================== */
(function () {
  'use strict';

  var list = document.getElementById('agenda-list');
  var empty = document.getElementById('agenda-empty');
  if (!list || typeof EVENEMENTS === 'undefined') return;

  var MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

  function parse(s) {
    var p = String(s).split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  function fmt(d, opts) {
    return d.toLocaleDateString('fr-FR', opts);
  }

  function cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function dateText(start, end) {
    if (end > start) {
      var sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
      if (sameMonth) {
        return 'Du ' + start.getDate() + ' au ' + fmt(end, { day: 'numeric', month: 'long', year: 'numeric' });
      }
      return 'Du ' + fmt(start, { day: 'numeric', month: 'long' }) + ' au ' + fmt(end, { day: 'numeric', month: 'long', year: 'numeric' });
    }
    return cap(fmt(start, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  }

  function meta(icon, text) {
    var li = el('li', 'agenda-meta-item');
    li.appendChild(el('span', 'agenda-icon', icon));
    li.appendChild(el('span', '', text));
    return li;
  }

  function card(x, isNext) {
    var e = x.e;
    var multi = x.end > x.start;
    var sameMonth = multi && x.start.getMonth() === x.end.getMonth();

    var item = el('li', 'agenda-item');

    var date = el('div', 'agenda-date');
    date.appendChild(el('span', 'agenda-day', sameMonth ? x.start.getDate() + '–' + x.end.getDate() : String(x.start.getDate())));
    date.appendChild(el('span', 'agenda-month', MOIS[x.start.getMonth()]));
    item.appendChild(date);

    var body = el('div', 'agenda-body');

    if (isNext || e.type) {
      var tags = el('div', 'agenda-tags');
      if (isNext) tags.appendChild(el('span', 'agenda-tag agenda-tag-next', 'Prochain événement'));
      if (e.type) tags.appendChild(el('span', 'agenda-tag', e.type));
      body.appendChild(tags);
    }

    body.appendChild(el('h3', '', e.titre || 'Événement'));

    var infos = el('ul', 'agenda-meta');
    infos.appendChild(meta('📅', dateText(x.start, x.end)));
    if (e.heure) infos.appendChild(meta('🕒', e.heure));
    if (e.lieu) infos.appendChild(meta('📍', e.lieu));
    body.appendChild(infos);

    if (e.description) body.appendChild(el('p', 'agenda-desc', e.description));

    item.appendChild(body);
    return item;
  }

  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var items = EVENEMENTS
    .map(function (e) {
      var start = parse(e.date);
      var end = e.dateFin ? parse(e.dateFin) : start;
      return { e: e, start: start, end: end };
    })
    .filter(function (x) { return !isNaN(x.start.getTime()) && x.end >= today; })
    .sort(function (a, b) { return a.start - b.start; });

  if (!items.length) return; // le message « Aucun événement annoncé » reste affiché

  if (empty && empty.parentNode) empty.parentNode.removeChild(empty);
  items.forEach(function (x, i) { list.appendChild(card(x, i === 0)); });
})();
