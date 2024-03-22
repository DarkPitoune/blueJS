# Compte rendu TP fullstack

## Présentation du projet

Les fonctionnalités que nous avons choisi d'implémenter sur ce projet sont les suivantes :

-   possibilité d'écrire des messages que d'autres utilisateurs peuvent voir
-   persistance des messages dans le temps
-   possibilité de supprimer des messages
-   plusieurs canaux de discussion
-   connexion avec son compte google
-   (affichage en direct des messages sur les autres clients)

## Choix techniques et architecture

Pour le front nous avons choisi une architecture la plus simple possible qui exploite le moins de technologies modernes possible. Parmis les choix intéressants, nous avons :
**Dans le front**

-   tailwindcss pour garder le contrôle sur le style tout en supprimant le fichier css
-   les html `template` pour dupliquer facilement les composants dans le javascript et préserver la séparation des préoccupations
-   l'authentification google
-   du javascript vanilla pour tout le reste

**Dans le back**

-   express pour le serveur
-   ably.io comme service de websocket (le déploiement sur vercel ne permet que des fonction serverless donc pas de websocket)
-   tursoDB pour la base de donnée (plan gratuit)

Front et back sont déployés sur vercel.
