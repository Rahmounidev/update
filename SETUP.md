# Guide de Configuration Droovo

## Prérequis

- Node.js 18+ 
- MySQL 8.0+
- npm ou yarn

## Installation Automatique

\`\`\`bash
# 1. Cloner le projet
git clone <votre-repo>
cd droovo-restaurant-app

# 2. Configuration automatique
npm run setup
\`\`\`

## Installation Manuelle

### 1. Installer les dépendances
\`\`\`bash
npm install
\`\`\`

### 2. Configuration de l'environnement
\`\`\`bash
# Copier le fichier d'exemple
cp .env.example .env

# Modifier les variables selon votre configuration
\`\`\`

### 3. Base de données
\`\`\`bash
# Créer la base de données
mysql -u root -p -e "CREATE DATABASE resto_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Générer le client Prisma
npx prisma generate

# Appliquer le schéma
npx prisma db push

# Initialiser les données
npm run dev &
curl -X POST http://localhost:3000/api/setup/init
\`\`\`

### 4. Démarrage
\`\`\`bash
npm run dev
\`\`\`

## Tests

### Test de connexion DB
\`\`\`bash
curl http://localhost:3000/api/test-db
\`\`\`

### Test d'inscription
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User", 
    "email": "test@example.com",
    "password": "123456"
  }'
\`\`\`

### Test de connexion
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
\`\`\`

## Comptes par défaut

- **Admin**: admin@droovo.com / admin123
- **Test Client**: Créez via l'interface d'inscription

## Structure de la base de données

- `users` - Restaurants et administrateurs
- `customers` - Clients de l'application
- `sessions` - Sessions utilisateur
- `roles` - Rôles et permissions
- `orders` - Commandes
- `dishes` - Plats des restaurants
- `categories` - Catégories de plats

## Dépannage

### Erreur de connexion DB
1. Vérifiez que MySQL est démarré
2. Vérifiez DATABASE_URL dans .env
3. Testez: `mysql -u root -p`

### Erreur Prisma
1. Régénérez le client: `npx prisma generate`
2. Réappliquez le schéma: `npx prisma db push`

### Erreur de session
1. Vérifiez SESSION_PASSWORD dans .env
2. Videz les cookies du navigateur

## URLs importantes

- Application: http://localhost:3000
- Test DB: http://localhost:3000/api/test-db
- Connexion: http://localhost:3000/login
- Inscription: http://localhost:3000/login (onglet inscription)
