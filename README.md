# 📦 StockMaster Platform

**StockMaster** is a microservices-based stock management system designed to streamline and automate inventory operations for organizations. It offers a modular architecture for flexibility, scalability, and maintainability.

---

## 🧩 Project Overview

The platform is divided into multiple services, each responsible for a specific domain:

- 🗃️ **Product Service** – Manage items and stock levels.
- 👥 **User Service** – Authentication, user roles, and permissions.
- 📊 **Dashboard Service** – Real-time statistics and analytics.
- 🌐 **Frontend Interface** – User-facing interface for interacting with the system.

---

## 🌐 Frontend (React + Vite + Tailwind CSS)

The **frontend** of StockMaster has been developed using:

- **React** – For building dynamic and component-based UIs.
- **Vite** – For fast development and optimized builds.
- **Tailwind CSS** – For clean and responsive design using utility-first classes.

### 🧑‍💻 Frontend Responsibilities

**Tech Stack**: React + Vite + Tailwind CSS  
**Developer**: Bouzouggar Abdelhak

**Features**:
- Authentication (Login/Register with token handling)
- Responsive and clean UI for the main dashboard
- Communication with backend services via REST APIs
- Modular structure for scalability

### 🚀 Running the Frontend Locally

```bash
git clone https://github.com/AbdelhakBouzouggar/StockMaster.git
cd frontend
npm install
npm run dev
```

## 🌐 BackEnd (Node js, Laravel, MongoDB, MySql)

### 🧑🌐 BackEnd Responsibilities

**Tech Stack**: Laravel
**Developer**: Mona Souabni


**Features**:
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan install:api
composer require firebase/php-jwt
php artisan serve
```

**Tech Stack**: 
**Developer**: Nadia

**Features**:
-🔗 API – Gestion des utilisateurs
L'application interagit avec un backend via des appels API pour gérer dynamiquement les utilisateurs. Voici les principales actions effectuées :

📥 1. Récupération de tous les utilisateurs
Méthode : GET

Route : /api/users

Description : Récupère la liste complète des utilisateurs pour l'affichage dans le tableau.

Utilisé pour : Afficher les utilisateurs dès le chargement du composant.

➕ 2. Création d’un nouvel utilisateur
Méthode : POST

Route : /api/users

Body : { name, email, password, role, status }

Description : Ajoute un utilisateur dans la base de données.

Utilisé pour : Formulaire de création via une modale ou un bouton Add New User.

✏️ 3. Mise à jour d’un utilisateur
Méthode : PUT

Route : /api/users/:id

Body : { name?, email?, role?, status? }

Description : Met à jour les informations d’un utilisateur existant.

Utilisé pour : Édition d’un utilisateur via l’icône "modifier".

❌ 4. Suppression d’un utilisateur
Méthode : DELETE

Route : /api/users/:id

Description : Supprime un utilisateur de la base de données.

Utilisé pour : Icône "poubelle" dans la table.
# StockMaster - Service de Notification

## À propos

Ce service de notification est un composant essentiel de l'architecture microservices de StockMaster. Il permet de recevoir et d'afficher en temps réel les modifications apportées au stock de produits, offrant ainsi une visibilité immédiate sur les opérations d'inventaire.

## Fonctionnalités principales

- 📩 **Réception de notifications** via webhook API
- ⚡ **Diffusion en temps réel** grâce à Socket.IO
- 🔔 **Interface utilisateur intuitive** pour visualiser l'historique des notifications
- 🔄 **Support pour différents types d'opérations** (ajout, retrait de produits)
- 📱 **Design responsive** adapté aux ordinateurs et appareils mobiles

## Architecture technique

Le service de notification est développé avec les technologies suivantes :
- **Next.js** avec **TypeScript** pour une expérience de développement optimale
- **Socket.IO** pour les communications en temps réel
- **Chakra UI** pour une interface utilisateur moderne et responsive

## Installation rapide

```bash
# Installer les dépendances
npm install

# Créer un fichier .env.local (voir exemple dans .env.example)

# Lancer le serveur de développement
npm run dev

**Tech Stack**: Authentification
**Developer**: Bouzouggar Abdelhak

**Features**:
- Authentication (Login/Register with token handling)

```bash
git clone https://github.com/AbdelhakBouzouggar/StockMaster.git
cd Authentification-Service
npm install
npm start
```
