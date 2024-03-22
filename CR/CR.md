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

-   [tailwindcss](https://tailwindcss.com/) pour garder le contrôle sur le style tout en supprimant le fichier css
-   les [html `template`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) pour dupliquer facilement les composants dans le javascript et préserver la séparation des préoccupations
-   l'authentification google
-   du javascript vanilla pour tout le reste

**Dans le back**

-   express pour le serveur
-   [ably](https://ably.com/) comme service de websocket (le déploiement sur vercel ne permet que des fonction serverless donc pas de websocket)
-   [tursoDB](https://turso.tech/) pour la base de donnée (plan gratuit)

Front et back sont déployés sur [vercel](https://vercel.com/).

L'architecture du projet est la suivante :
![stack architecture](https://www.plantuml.com/plantuml/png/dL5DQzmm4BthLqoN7bh8KfhS5cCIsa8QcXAwFWQ2RCzwHMN9rOmsMKh-U_LXiogbEUHYvkEzf-StbyJIiH-rUADCftsFK6axMFemADxxjlvdVa3NeQw5qBXZO0jE3Nk6NZdiM5aZH2oa6JH2ZmVuBG1anzR5xcFPd9VDXGZTYRcgtiu6LY09SXqGdHqdQz1mH6Gh6P5hyIn4blI4hhGoETlxP30uAdLQsVr4qqUDrLpVctVVROytspF0fyaXqVlLNvoTiuONKcuIwxgv_NO6dxQ1U916QItXPXkupwKJV69qHke7EIbAPdvvz0WZ4ia17qf3jtcM4U61grOVuUhkQ_BJIvQj93mLaV8vDn7TU4SsFn-pX_MwdfFSmEHf7_zeL4nnU_xYzkB_Mv6d2P2Fi05sQXZGvPoWnqdRuuY6Ny2cEvHGaG49kqIycG7bBlBAbLZ0K2u7P91XvgTUSiXc3flIiDjBOr3JlQcgwwQvWnzVjarTdvIgzReyJvOqbjNk27O71X-NTT9un1R81XXJK9a9oUnogNBuUcNX2HqK-OZByF6Z_WC0)
