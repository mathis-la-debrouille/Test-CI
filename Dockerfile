# Étape 1 : Build de l'application
FROM node:18-alpine AS build

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copier le reste de l'application
COPY . .

# Compiler l'application
RUN npm run build

# Étape 2 : Créer l'image pour la production
FROM node:18-alpine AS production

WORKDIR /app

# Copier uniquement le dossier dist depuis la build
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --only=production

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["node", "dist/main"]
