import { PrismaClient } from '@prisma/client';
// const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sports = [
    {
        name: 'Baseball',
        description: 'Baseball',
        verified: true
    },
    {
        name: 'Basketball',
        description: 'Basketball',
        verified: true
    },
    {
        name: 'Baseball',
        description: 'Baseball',
        verified: true
    },
    {
        name: 'Boxing',
        description: 'Boxing',
        verified: true
    },
    {
        name: 'Cheerleading',
        description: 'Cheerleading',
        verified: true
    },
    {
        name: 'Cricket',
        description: 'Cricket',
        verified: true
    },
    {
        name: 'Cross fit',
        description: 'Crossfit',
        verified: true
    },
    {
        name: 'Cycling',
        description: 'Cycling',
        verified: true
    },
    {
        name: 'Dance',
        description: 'dance',
        verified: true
    },
    {
        name: 'Field Hockey',
        description: 'Field hockey',
        verified: true
    },
    {
        name: 'Figure Skating',
        description: 'Figure Skating',
        verified: true
    },
    {
        name: 'Fishing',
        description: 'Fishing',
        verified: true
    },
    {
        name: 'Fitness',
        description: 'Fitness',
        verified: true
    },
    {
        name: 'American Football',
        description: 'American Football',
        verified: true
    },
    {
        name: 'Soccer',
        description: 'Soccer',
        verified: true
    },
    {
        name: 'Golf',
        description: 'Golf',
        verified: true
    },
    {
        name: 'Gymnastics',
        description: 'Gymnastics',
        verified: true
    },
    {
        name: 'Handball',
        description: 'Handball',
        verified: true
    },
    {
        name: 'Hiking',
        description: 'Hiking',
        verified: true
    },
    {
        name: 'Ice hockey',
        description: 'Ice hockey',
        verified: true
    },
    {
        name: 'Kite surfing',
        description: 'Kite surfing',
        verified: true
    },
    {
        name: 'Lacrosse',
        description: 'Lacrosse',
        verified: true
    },
    {
        name: 'MMA',
        description: 'MMA',
        verified: true
    },
    {
        name: 'Padel Tennis',
        description: 'Padel Tennis',
        verified: true
    },
    {
        name: 'Rowing',
        description: 'Rowing',
        verified: true
    },
    {
        name: 'Rugby',
        description: 'Rugby',
        verified: true
    },
    {
        name: 'Running',
        description: 'Running',
        verified: true
    },
    {
        name: 'Sailing',
        description: 'Sailing',
        verified: true
    },
    {
        name: 'Skateboarding',
        description: 'Skateboarding',
        verified: true
    },
    {
        name: 'Skiing',
        description: 'Skiing',
        verified: true
    },
    {
        name: 'Snowboarding',
        description: 'Snowboarding',
        verified: true
    },
    {
        name: 'Softball',
        description: 'Softball',
        verified: true
    },
    {
        name: 'Surfing',
        description: 'Surfing',
        verified: true
    },
    {
        name: 'Swimming',
        description: 'Swimming',
        verified: true
    },
    {
        name: 'Table Tennis',
        description: 'Table Tennis',
        verified: true
    },
    {
        name: 'Tennis',
        description: 'Tennis',
        verified: true
    },
    {
        name: 'Track & Field',
        description: 'Track & Field',
        verified: true
    },
    {
        name: 'Volleyball',
        description: 'Volleyball',
        verified: true
    },
    {
        name: 'Wrestling',
        description: 'Wrestling',
        verified: true
    },
    {
        name: 'Yoga',
        description: 'Yoga',
        verified: true
    },
    {
        name: 'Other',
        description: 'Other',
        verified: true
    }
]

async function up() {
    prisma.tags.createMany({
        data: sports
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error);
    })
}

up();