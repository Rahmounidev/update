#!/bin/bash

echo "🚀 Configuration de la base de données Droovo..."

# Vérifier si MySQL est installé
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Variables
DB_NAME="resto_db"
DB_USER="root"
DB_HOST="127.0.0.1"
DB_PORT="3306"

echo "📝 Création de la base de données..."

# Créer la base de données
mysql -u $DB_USER -p -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if [ $? -eq 0 ]; then
    echo "✅ Base de données '$DB_NAME' créée avec succès"
else
    echo "❌ Erreur lors de la création de la base de données"
    exit 1
fi

# Importer les données
echo "📊 Importation des données..."
mysql -u $DB_USER -p $DB_NAME < database/resto_db.sql

if [ $? -eq 0 ]; then
    echo "✅ Données importées avec succès"
else
    echo "❌ Erreur lors de l'importation des données"
    exit 1
fi

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Client Prisma généré avec succès"
else
    echo "❌ Erreur lors de la génération du client Prisma"
    exit 1
fi

echo "🎉 Configuration terminée avec succès!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Vérifiez votre fichier .env"
echo "2. Lancez: npm run dev"
echo "3. Testez: http://localhost:3000/api/test-db"
