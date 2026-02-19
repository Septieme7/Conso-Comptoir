# Pub/Bar/Lounge - Calculateur de consommations

Application web statique pour calculer les notes de plusieurs personnes lors d'un apéro dans un bar.  
Elle permet de gérer plusieurs participants, d'ajouter des consommations, de définir des seuils d'alerte personnels, et de déclencher une alarme sonore personnalisable.

## Fonctionnalités

- 👥 **Participants** : ajoutez autant de personnes que voulu avec des noms aléatoires modifiables.
- 🍺 **Carte des boissons** : créez votre propre carte en ajoutant des boissons avec leur prix. Chaque boisson peut être supprimée individuellement.
- ⚙️ **Alerte par personne** : chaque participant a son propre seuil de budget. Quand il est dépassé (et que l'alerte est activée), une sonnerie retentit.
- 🔇 **Mute individuel** : possibilité de couper le son pour un participant spécifique.
- ⏹️ **Bouton Stop** : interrompt le son en cours et réarme l'alerte.
- 🎵 **7 sons d'alerte** : choisissez parmi 7 sonneries différentes (fichiers à placer dans `assets/sound/`).
- 🌓 **Thème sombre/clair** : basculez l'apparence avec le bouton en haut à droite.
- ℹ️ **Aide contextuelle** : cliquez sur le "i" pour afficher une bulle d'explication.
- 🖼️ **Fond aléatoire** : à chaque chargement de page, un fond différent parmi 7 images est choisi.
- 📱 **Responsive** : s'adapte aux écrans mobiles et tablettes.
- 💾 **Persistance** : toutes les données (personnes, consommations, seuils, boissons) sont sauvegardées dans le navigateur.

## Installation

1. Clonez ou téléchargez ce dépôt.
2. Placez vos images dans `assets/images/` :
   - `Logo7.png` (logo principal)
   - `BGPub1.png` à `BGPub7.png` (fonds d'écran)
   - `6.png` et `11.png` (images du footer)
3. Placez 7 fichiers son dans `assets/sound/` nommés `alarm1.mp3` … `alarm7.mp3`.
4. Ouvrez `index.html` dans un navigateur moderne.

## Technologies utilisées

- HTML5 sémantique
- CSS3 (variables, flexbox, grid, transitions)
- JavaScript pur (ES6) – sans framework
- Canvas API pour l'affichage du logo
- LocalStorage pour la persistance

## Personnalisation

- Modifiez le seuil d’alerte directement dans l’interface.
- Changez les sons en remplaçant les fichiers dans `assets/sound/`.
- Ajoutez vos propres fonds en respectant la numérotation `BGPubX.png`.
- Pour changer le logo, remplacez `Logo7.png` par votre image (conservez le nom).

## Remarques

- L’alerte sonore ne se déclenche qu’une fois par dépassement. Le bouton "Stop" permet de l'arrêter et de la réarmer.
- Les prix sont saisis en euro, avec deux décimales.
- Le mode sombre/clair adapte les couleurs sans affecter la lisibilité.

## Auteur

Seven7...