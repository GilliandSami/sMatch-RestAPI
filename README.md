<p align="center"><img src="images/Smatch.png" width="400" alt="Logo Smatch - Projet HEIG-VD RestAPI"></p>

# 🎯 **sMatch**

**sMatch** est une API REST créée dans le cadre du cours *"Architecture orientée Web"* à la [HEIG-VD]. Ce projet a pour objectif de réaliser une plateforme sociale pour les étudiants, inspirée de Twitter, où ils peuvent interagir, partager des messages, et collaborer dans des groupes.

---

## 📚 **Table des matières**

- [🎯 sMatch](#-smatch)
  - [🗂️ Collections principales](#️-collections-principales)
  - [🌍 Contexte](#-contexte)
  - [⚙️ Requis](#️-requis)
  - [🚀 Usage](#-usage)
    - [Cloner le projet](#cloner-le-projet)
    - [Installer les dépendances](#installer-les-dépendances)
    - [Configurer l'environnement](#configurer-lenvironnement)
    - [Lancer le serveur](#lancer-le-serveur)
  - [👩‍💻 Fonctionnalités](#-fonctionnalités)
  - [🔒 Sécurité](#-sécurité)
  - [🧪 Tests automatisés](#-tests-automatisés)
    - [Tester l'API](#tester-lapi)
  - [🔧 Configuration](#-configuration)
    - [Variables d'environnement](#variables-denvironnement)
  - [📖 Documentation API](#-documentation-api)
  - [🤝 Contributions](#-contributions)
  - [📜 Licence](#-licence)

---

## 🗂️ **Collections principales**

sMatch repose sur quatre collections principales :

- **Users** : Gestion des utilisateurs (authentification, suivi d'autres utilisateurs).
- **Posts** : Messages publiés par les utilisateurs.
- **Comments** : Commentaires sur les posts.
- **Groups** : Groupes permettant la collaboration et le partage.

---

## 🌍 **Contexte**

Dans cette version initiale, sMatch est pensée comme une application sociale centralisée pour les étudiants. Elle permet les interactions sociales suivantes :

- Créer des messages (posts) et y ajouter des médias.
- Commenter ou liker des messages et des commentaires.
- Suivre ou ne plus suivre d'autres utilisateurs.
- Créer ou rejoindre des groupes, avec des rôles spécifiques (admin ou membre).

Chaque interaction est sécurisée par une authentification par token JWT.

---

## ⚙️ **Requis**

- **Node.js** 14.x ou supérieur
- **MongoDB** 4.x ou supérieur
- **npm** 6.x ou supérieur

---

## 🚀 **Usage**

### **Cloner le projet**

```bash
git clone https://github.com/GilliandSami/sMatch-RestAPI.git
```

### **Installer les dépendances**

```bash
cd smatch
npm install
```

### **Configurer l'environnement**

Créez un fichier .env à la racine avec les variables suivantes :

```shell script
PORT=3000
MONGO_URI=mongodb://127.0.0.1/archioweb
JWT_SECRET=a-demander
CLOUDINARY_CLOUD_NAME=a-demander
CLOUDINARY_API_KEY=a-demander
CLOUDINARY_API_SECRET=a-demander
```

### **Lancer le serveur**

```bash
npm run dev
```

Une fois la commande exécutée, l'API sera accessible à l'adresse : [http://localhost:3000/api](http://localhost:3000/api).

---

## 👩‍💻 **Fonctionnalités**

### **Authentification**

- **Inscription** : Permet aux utilisateurs de créer un compte.
- **Connexion** : Génère un token JWT pour accéder aux fonctionnalités protégées.

### **Interactions sociales**

- Publier, récupérer, mettre à jour, et supprimer des messages.
- Commenter et liker des posts et des commentaires.
- Suivre ou ne plus suivre d'autres utilisateurs.

### **Groupes**

- Créer des groupes.
- Ajouter ou supprimer des membres.
- Mettre à jour ou supprimer des groupes (seulement par les admins).

### **Pagination et filtres**

- Récupération paginée des posts et commentaires.
- Recherche de messages/commentaires contenant des mots-clés spécifiques.

---

## 🔒 **Sécurité**

Toutes les routes sensibles sont protégées par des tokens JWT. L'API utilise également une validation des données entrantes pour garantir l'intégrité des informations.

---

## 🧪 **Tests automatisés**

sMatch inclut des tests unitaires et d'intégration couvrant les principales fonctionnalités :

### **Tester l'API**

Exécutez les tests avec la commande suivante :

```bash
npm test
```

Les tests incluent :
- L'inscription et la connexion d'un utilisateur.
- La création, récupération et suppression de posts.
- La pagination et les filtres sur les messages.
- La gestion des commentaires.
- La création et gestion des groupes.

Les tests utilisent une base de données dédiée pour éviter toute interférence avec les données réelles.

---

## 🔧 **Configuration**

### **Variables d'environnement**

Assurez-vous que les variables suivantes sont correctement définies dans votre fichier `.env` :

- `PORT` : Port sur lequel l'application sera disponible.
- `MONGO_URI` : URL de connexion à votre base MongoDB.
- `JWT_SECRET` : Clé secrète pour la génération des tokens JWT.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` : Clés d'API Cloudinary pour gérer les fichiers médias.

---

## 📖 **Documentation API**

Une documentation interactive est disponible grâce à **Swagger**. Rendez-vous sur l'endpoint suivant pour explorer l'API :

[http://localhost:3000/](http://localhost:3000/)

---

## 🤝 **Contributions**

Les contributions sont les bienvenues ! Merci de respecter les étapes suivantes :

1. Forker le projet.
2. Créer une branche dédiée : `feature/nom-de-votre-feature`.
3. Soumettre une pull request avec une description détaillée.

---
