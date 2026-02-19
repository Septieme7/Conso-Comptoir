# Pub/Bar/lounge - Calculateur de consos

Application web statique pour calculer les notes de plusieurs personnes lors d’un apéro au ** Pub **.  
Elle permet de :

- Ajouter / supprimer des personnes.
- Pour chaque personne, ajouter des consommations avec nom et prix.
- Visualiser le total par personne et le total général.
- Définir un **seuil d’alerte** (ex: 30 €) ; quand le total général atteint ce montant, une sonnerie retentit.
- Choisir parmi **6 sonneries** différentes (fichiers à placer dans `assets/sound/`).
- Basculer entre **thème clair et sombre** (les logos/images restent visibles).
- Design **responsive** (mobile, tablette, desktop).
- Éléments décoratifs : images latérales (`10.png` et `5.png`) courant du haut au footer, images de footer (`6.png` et `11.png`) encadrant le message "À consommer avec modération".
- Logo en **canvas** combinant `1.png` (au centre) et `2.png` (en cadre).

## Installation

1. Clonez ou téléchargez ce dépôt.
2. Placez vos images dans `assets/images/` :
   - `BGPub1.png` (fond de page)      
   - `1.png`, `2.png`, `5.png`, `6.png`, `10.png`, `11.png`
3. Placez 6 fichiers son dans `assets/sound/` nommés `son1.mp3` … `son6.mp3`.
4. Ouvrez `index.html` dans un navigateur moderne.

## Technologies utilisées

- HTML5 sémantique
- CSS3 (variables, flexbox, grid, transitions)
- JavaScript pur (ES6) – sans framework
- Canvas API pour l’effet logo

## Personnalisation

- Modifiez le seuil d’alerte directement dans l’interface.
- Changez les sons en remplaçant les fichiers dans `assets/sound/`.
- Ajustez les images décoratives en respectant les noms.

## Remarques

- L’alerte sonore ne se déclenche qu’une fois par dépassement ; elle se réarme automatiquement quand le total repasse sous le seuil.
- Les prix sont saisis en euro, avec deux décimales.
- Le mode sombre/clair conserve une bonne lisibilité du logo grâce au canvas.

## Auteur

Seven7... 