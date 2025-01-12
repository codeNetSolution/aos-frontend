
# Insta-Light

Insta-Light est une application web légère, développée avec **React**, **TypeScript**, **Vite** et stylisée avec **Tailwind CSS**. Ce projet est conteneurisé avec Docker pour faciliter le déploiement et le développement.

---

## Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancer l'application](#lancer-lapplication)
- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)
- [Technologies utilisées](#technologies-utilisées)

---

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

- **Docker** : [Installer Docker]
- **Docker Compose** 
- Facultatif : **Node.js** (si vous souhaitez lancer l'application sans Docker)

---

## Installation

### Cloner le dépôt
Clonez ce projet sur votre machine locale :
```bash
git clone https://github.com/codeNetSolution/aos-frontend.git
cd insta-light-client
```

### Configurer les dépendances
Si vous modifiez ou testez sans Docker, installez les dépendances Node.js :
```bash
npm install
npm install bcryptjs
```

---

## Lancer l'application

### Avec Docker

1. **Construisez et lancez l'application** avec Docker Compose :
   ```bash
   docker-compose up --build
   ```

2. **Accédez à l'application** dans votre navigateur à l'adresse :
   ```
   http://localhost:5173
   ```

3. Pour arrêter l'application :
   ```bash
   docker-compose down -v
   ```

---

### Sans Docker (Mode local)

Si vous souhaitez exécuter l'application directement sur votre machine (sans conteneur) :

1. Assurez-vous d'avoir Node.js installé.
2. Installez les dépendances :
   ```bash
   npm install
   npm install bcryptjs
   ```
3. Lancez l'application en mode développement :
   ```bash
   npm run dev
   ```
4. Ouvrez votre navigateur et rendez-vous sur :
   ```
   http://localhost:5173
   ```

---

## Fonctionnalités

- **Interface utilisateur moderne** grâce à Tailwind CSS
- **Performances optimisées** avec Vite
- **Typed components** avec TypeScript
- Prêt pour le déploiement avec Docker

---

## Structure du projet

Voici une vue d'ensemble des principaux dossiers et fichiers du projet :

```
insta-light-client/
├── src/                # Code source principal
│   ├── components/     # Composants réutilisables
│   ├── pages/          # Pages de l'application
│   ├── assets/         
│   ├── contexts/       # Gestion des contextes globaux
│   ├── routes/         # Définition des routes
│   ├── styles/         # Fichiers de style supplémentaires
│   ├── types/          # Définitions des types TypeScript
│   └── App.tsx         # Composant racine
├── public/             # Fichiers statiques
├── Dockerfile          # Configuration Docker pour l'image
├── docker-compose.yml  # Configuration Docker Compose
├── package.json        # Dépendances 
├── tailwind.config.js  # Configuration Tailwind CSS
└── vite.config.ts      # Configuration Vite
```

---

## Technologies utilisées

- **React** : Bibliothèque JavaScript pour construire des interfaces utilisateur
- **TypeScript** : Superset typé de JavaScript
- **Vite** : Outil de développement rapide et léger
- **Tailwind CSS** : Framework CSS utilitaire
- **Docker** : Conteneurisation pour le déploiement
- **Docker Compose** : Orchestration multi-conteneurs


---

## Contact

Créé par [SAIDOUN Abdelkrim](mailto:abdelkrim.saidoun@univ-rouen.fr). N'hésitez pas à me contacter pour toute question ou suggestion !
