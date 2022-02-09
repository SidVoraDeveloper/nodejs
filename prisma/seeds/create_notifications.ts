import { PrismaClient } from '@prisma/client';
// const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const events = [
    {
        eventName: 'Like'
    },
    {
        eventName: 'Follow'
    },
    {
        eventName: 'Comment'
    }
]

async function up() {
    prisma.eventTypes.createMany({
        data: events
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error);
    })
}

up();