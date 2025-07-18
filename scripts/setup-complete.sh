#!/bin/bash

echo "🚀 Configuration complète de Droovo..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
DB_NAME="resto_db"
DB_USER="root"
DB_HOST="127.0.0.1"
DB_PORT="3306"

echo -e "${BLUE}📋 Vérification des prérequis...${NC}"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm n'est pas installé${NC}"
    exit 1
fi

# Vérifier MySQL
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ MySQL n'est pas installé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Tous les prérequis sont installés${NC}"

# Installer les dépendances
echo -e "${BLUE}📦 Installation des dépendances...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors de l'installation des dépendances${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dépendances installées${NC}"

# Vérifier le fichier .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env manquant, création...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}📝 Veuillez configurer votre fichier .env${NC}"
fi

# Créer la base de données
echo -e "${BLUE}🗄️  Création de la base de données...${NC}"
mysql -u $DB_USER -p -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors de la création de la base de données${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Base de données '$DB_NAME' créée${NC}"

# Générer le client Prisma
echo -e "${BLUE}🔧 Génération du client Prisma...${NC}"
npx prisma generate

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors de la génération du client Prisma${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Client Prisma généré${NC}"

# Appliquer les migrations
echo -e "${BLUE}🔄 Application des migrations...${NC}"
npx prisma db push

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors de l'application des migrations${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Migrations appliquées${NC}"

# Initialiser les données par défaut
echo -e "${BLUE}🌱 Initialisation des données par défaut...${NC}"
npm run dev &
SERVER_PID=$!

# Attendre que le serveur démarre
sleep 10

# Appeler l'API d'initialisation
curl -X POST http://localhost:3000/api/setup/init > /dev/null 2>&1

# Arrêter le serveur temporaire
kill $SERVER_PID > /dev/null 2>&1

echo -e "${GREEN}✅ Données par défaut initialisées${NC}"

echo ""
echo -e "${GREEN}🎉 Configuration terminée avec succès!${NC}"
echo ""
echo -e "${BLUE}📋 Informations importantes:${NC}"
echo -e "   • Base de données: $DB_NAME"
echo -e "   • Admin par défaut: admin@droovo.com / admin123"
echo -e "   • URL de test: http://localhost:3000/api/test-db"
echo ""
echo -e "${BLUE}🚀 Prochaines étapes:${NC}"
echo -e "   1. Vérifiez votre fichier .env"
echo -e "   2. Lancez: ${YELLOW}npm run dev${NC}"
echo -e "   3. Ouvrez: ${YELLOW}http://localhost:3000${NC}"
echo -e "   4. Testez l'inscription/connexion"
echo ""
echo -e "${GREEN}✨ Droovo est prêt à être utilisé!${NC}"
