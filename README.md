# 🍽️ Droovo - Backend Client

Backend complet pour l'espace client de l'application de livraison de nourriture Droovo.

## 🚀 Installation Rapide

### 1. Cloner et installer
\`\`\`bash
git clone <votre-repo>
cd droovo-client-backend
npm install
\`\`\`

### 2. Configuration
\`\`\`bash
# Copier le fichier d'environnement
cp .env.example .env

# Modifier les variables dans .env
DATABASE_URL="mysql://root:@localhost:3306/resto_db"
SESSION_PASSWORD="votre-clé-secrète-32-caractères"
\`\`\`

### 3. Base de données
\`\`\`bash
# Installation automatique (recommandée)
npm run db:setup

# OU installation manuelle
mysql -u root -p -e "CREATE DATABASE resto_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p resto_db < database/resto_db.sql
npm run db:generate
\`\`\`

### 4. Lancer le serveur
\`\`\`bash
npm run dev
\`\`\`

### 5. Tester
\`\`\`bash
# Test de la base de données
npm run test:db

# OU dans le navigateur
http://localhost:3000/api/test-db
\`\`\`

## 🔧 Diagnostic des Problèmes

### Problème d'inscription ?

1. **Vérifier la connexion DB :**
\`\`\`bash
curl http://localhost:3000/api/test-db
\`\`\`

2. **Vérifier les logs :**
- Ouvrir la console du navigateur (F12)
- Regarder les logs dans le terminal du serveur

3. **Variables d'environnement :**
\`\`\`bash
# Vérifier que .env existe et contient :
DATABASE_URL="mysql://root:@localhost:3306/resto_db"
SESSION_PASSWORD="b3acbfc9e689a3145fc79de2fdb78e96958657947c91ca45f3c354e044b87081"
\`\`\`

4. **Prisma Client :**
\`\`\`bash
npm run db:generate
\`\`\`

## 📡 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur

### Restaurants
- `GET /api/restaurants` - Liste des restaurants
- `GET /api/restaurants/[id]` - Détails d'un restaurant

### Commandes
- `GET /api/orders` - Mes commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders/[id]` - Détails d'une commande
- `PATCH /api/orders/[id]` - Annuler une commande

### Autres
- `GET /api/categories` - Catégories
- `GET /api/dishes/search` - Recherche de plats
- `POST /api/reviews` - Créer un avis
- `GET /api/profile` - Mon profil
- `GET /api/stats/dashboard` - Mes statistiques

## 🛡️ Sécurité

- **Iron-session** : Sessions sécurisées côté serveur
- **Isolation des données** : Chaque client ne voit que ses données
- **Validation Zod** : Toutes les entrées sont validées
- **Logs détaillés** : Pour le debugging et monitoring

## 🐛 Résolution des Problèmes Courants

### Erreur "Cannot connect to database"
\`\`\`bash
# Vérifier que MySQL est démarré
sudo service mysql start

# Tester la connexion
mysql -u root -p -e "SHOW DATABASES;"
\`\`\`

### Erreur "Table doesn't exist"
\`\`\`bash
# Réimporter la base de données
mysql -u root -p resto_db < database/resto_db.sql
npm run db:generate
\`\`\`

### Erreur "Session not working"
\`\`\`bash
# Vérifier SESSION_PASSWORD dans .env
# Doit faire exactement 32 caractères minimum
\`\`\`

## 📊 Structure de la Base de Données

- **users** : Restaurants (4 restaurants de test)
- **customers** : Clients (1 client de test)
- **dishes** : Plats (6 plats variés)
- **orders** : Commandes (1 commande exemple)
- **categories** : Catégories (4 catégories)
- **reviews** : Avis clients
- **promotions** : Offres promotionnelles

## 🔍 Tests Manuels

### Test d'inscription
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123456",
    "phone": "+212600000000"
  }'
\`\`\`

### Test de connexion
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "any"
  }'
\`\`\`

## 📝 Notes Importantes

- Les clients dans votre DB n'ont pas de mot de passe (pour le moment)
- L'authentification se base uniquement sur l'email existant
- Tous les logs sont visibles dans la console pour le debugging
- La session persiste 7 jours par défaut

## 🎯 Prochaines Étapes

1. Tester l'inscription avec le frontend
2. Ajouter un champ password à la table customers
3. Implémenter le hashage des mots de passe
4. Configurer les notifications email
5. Ajouter les WebSockets pour le temps réel
\`\`\`

Maintenant, pour résoudre votre problème d'inscription, suivez ces étapes de diagnostic :

## 🔍 **Diagnostic Étape par Étape**

### **1. Tester la connexion à la base de données :**
\`\`\`bash
curl http://localhost:3000/api/test-db
\`\`\`

### **2. Vérifier les variables d'environnement :**
\`\`\`bash
# Votre fichier .env doit contenir :
DATABASE_URL="mysql://root:@localhost:3306/resto_db"
SESSION_PASSWORD="b3acbfc9e689a3145fc79de2fdb78e96958657947c91ca45f3c354e044b87081"
\`\`\`

### **3. Générer le client Prisma :**
\`\`\`bash
npm run db:generate
\`\`\`

### **4. Tester l'inscription directement :**
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "123456"
  }'
\`\`\`

Les logs détaillés dans le code vous montreront exactement où le problème se situe ! 🎯
