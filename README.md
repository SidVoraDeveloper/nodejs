# Hiki - Node JS

### Requirements:

* Node installed on your computer
* Docker
* Docker-Compose

## Quick Start

1. Clone the repository: `git clone https://github.com/gethiki/hiki-node-js`
2. `cd hiki-node-js`
3. `npm install`
4. `cp copy.env .env` and fill the required information
5. `docker-compose up`
6. `npx prisma migrate dev --preview-feature`
7. `node prisma/seeds/create_sports.ts` `node prisma/seeds/create_notifications.ts`
8. `npm run dev`

All done!