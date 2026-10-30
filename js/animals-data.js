/* =========================================================
   Paws & Purpose Animal Rescue — animals-data.js
   Single source of truth for the content that JavaScript renders
   dynamically: adoptable animals, sponsorship tiers, volunteer roles
   and shelter locations.

   NOTE: adoption fees and sponsorship amounts are illustrative
   figures for this student project, not real prices.

   To add a new animal, copy an object below. The listing page,
   search/filter/sort, the profile modal and the enquiry form all
   read from this list.
   ========================================================= */

window.PP = window.PP || {};

PP.data = {
  "animals": [
    {
      "id": "buddy",
      "name": "Buddy",
      "type": "dog",
      "breed": "Cross-breed",
      "sex": "Male",
      "ageMonths": 24,
      "age": "2 years",
      "status": "available",
      "fee": 1200,
      "traits": [
        "Good with kids",
        "Food-motivated",
        "Walks well on lead"
      ],
      "blurb": "Gentle, food-motivated, loves long walks.",
      "bio": "Buddy is a gentle, food-motivated boy who loves long walks and short naps in the sun. He came to us as a stray from Rosettenville and has blossomed into a confident, friendly dog who is great with children and other dogs. He is house-trained and knows sit and paw.",
      "art": {
        "bg": "sage",
        "body": "#8fa37e",
        "ear": "#6d8564",
        "eye": "#332e2a"
      }
    },
    {
      "id": "miso",
      "name": "Miso",
      "type": "cat",
      "breed": "Domestic shorthair",
      "sex": "Female",
      "ageMonths": 12,
      "age": "1 year",
      "status": "available",
      "fee": 800,
      "traits": [
        "Independent",
        "Quiet",
        "Indoor cat"
      ],
      "blurb": "Quiet companion, best with a sunny windowsill.",
      "bio": "Miso is a curious, quiet companion best suited to a calm home with a sunny windowsill. She is independent but loves a chin scratch on her own terms, and she would suit a working person or couple who want a low-drama, affectionate cat.",
      "art": {
        "bg": "sand",
        "body": "#efe7d8",
        "ear": "#e0d5bd",
        "stroke": "#e0d5bd",
        "eye": "#332e2a"
      }
    },
    {
      "id": "nala",
      "name": "Nala",
      "type": "dog",
      "breed": "Boerboel cross",
      "sex": "Female",
      "ageMonths": 48,
      "age": "4 years",
      "status": "reserved",
      "fee": 1200,
      "traits": [
        "Loyal",
        "Calm",
        "Needs a garden"
      ],
      "blurb": "Steady senior girl, looking for a quiet home.",
      "bio": "Nala is a steady, affectionate girl looking for a quiet home to settle into. She is calm indoors, protective but gentle, and best suited to a home with a secure garden and an adult owner who understands large breeds. Nala currently has a meet-and-greet pending.",
      "art": {
        "bg": "sage",
        "body": "#6d8564",
        "ear": "#332e2a",
        "earOpacity": 0.3,
        "eye": "#332e2a"
      }
    },
    {
      "id": "shadow",
      "name": "Shadow",
      "type": "cat",
      "breed": "Domestic shorthair",
      "sex": "Male",
      "ageMonths": 36,
      "age": "3 years",
      "status": "available",
      "fee": 800,
      "traits": [
        "Playful",
        "Lap cat",
        "Good with cats"
      ],
      "blurb": "Loves feather toys and warm laps in equal measure.",
      "bio": "Shadow loves feather toys and warm laps in equal measure. He is a sociable, playful three-year-old who gets along with other cats and would thrive in a home where someone is around in the evenings. Black cats are often overlooked, so he has been waiting a while.",
      "art": {
        "bg": "sand",
        "body": "#332e2a",
        "ear": "#332e2a",
        "eye": "#efe7d8",
        "mouth": "#efe7d8"
      }
    },
    {
      "id": "coco",
      "name": "Coco",
      "type": "dog",
      "breed": "Jack Russell cross",
      "sex": "Female",
      "ageMonths": 8,
      "age": "8 months",
      "status": "available",
      "fee": 1500,
      "traits": [
        "Energetic",
        "Needs training",
        "Active home"
      ],
      "blurb": "A bundle of energy best suited to an active household.",
      "bio": "Coco is a bundle of energy best suited to an active household. At eight months she is still learning her manners and needs daily exercise, puzzle feeders and patient, consistent training. Her adoption fee is slightly higher because puppies need a second round of vaccinations.",
      "art": {
        "bg": "sage",
        "body": "#efe7d8",
        "ear": "#e0d5bd",
        "stroke": "#e0d5bd",
        "eye": "#332e2a"
      }
    },
    {
      "id": "pixel",
      "name": "Pixel",
      "type": "cat",
      "breed": "Tabby",
      "sex": "Female",
      "ageMonths": 60,
      "age": "5 years",
      "status": "available",
      "fee": 600,
      "traits": [
        "Affectionate",
        "Gets along with other cats",
        "Senior"
      ],
      "blurb": "A lap cat through and through, gets along with other cats.",
      "bio": "Pixel is a lap cat through and through. Five years old and settled, she gets along with other cats and will happily purr beside you all evening. Because she is a little older, her adoption fee is reduced.",
      "art": {
        "bg": "sand",
        "body": "#8fa37e",
        "ear": "#6d8564",
        "eye": "#332e2a"
      }
    },
    {
      "id": "biscuit",
      "name": "Biscuit",
      "type": "dog",
      "breed": "Labrador cross",
      "sex": "Male",
      "ageMonths": 72,
      "age": "6 years",
      "status": "available",
      "fee": 700,
      "traits": [
        "Gentle",
        "Good with kids",
        "Senior"
      ],
      "blurb": "A mellow, tail-wagging senior who loves company.",
      "bio": "Biscuit is a mellow, tail-wagging senior who loves company and a good sniff around the block. He was surrendered when his owner moved abroad and is happiest when he is near his people. Senior adoption fees are reduced.",
      "art": {
        "bg": "sage",
        "body": "#d9c79c",
        "ear": "#b8a373",
        "eye": "#332e2a"
      }
    },
    {
      "id": "luna",
      "name": "Luna",
      "type": "cat",
      "breed": "Siamese cross",
      "sex": "Female",
      "ageMonths": 24,
      "age": "2 years",
      "status": "available",
      "fee": 800,
      "traits": [
        "Chatty",
        "Affectionate",
        "Good with kids"
      ],
      "blurb": "A talkative, people-loving cat who follows you from room to room.",
      "bio": "Luna is a talkative, people-loving cat who follows you from room to room and will tell you all about her day. She is good with respectful children and would suit a family who are home often.",
      "art": {
        "bg": "sand",
        "body": "#c9b79a",
        "ear": "#6b6259",
        "eye": "#332e2a"
      }
    }
  ],
  "tiers": [
    {
      "id": "bronze",
      "name": "Bronze",
      "monthly": 100,
      "covers": "a week of food for one animal, plus a photo update every quarter"
    },
    {
      "id": "silver",
      "name": "Silver",
      "monthly": 250,
      "covers": "food and basic vet care, plus a monthly photo and progress update"
    },
    {
      "id": "gold",
      "name": "Gold",
      "monthly": 500,
      "covers": "full care for one animal, plus a personal visit invitation each quarter"
    }
  ],
  "volunteerRoles": [
    {
      "id": "dog-walking",
      "name": "Dog walking & enrichment"
    },
    {
      "id": "admin-events",
      "name": "Admin & events"
    },
    {
      "id": "transport",
      "name": "Transport & vet runs"
    },
    {
      "id": "foster",
      "name": "Foster care"
    }
  ],
  "locations": [
    {
      "id": "main",
      "name": "Main shelter",
      "address": "12 Rooiberg Road, Rosettenville, Johannesburg South, 2190",
      "lat": -26.25,
      "lng": 28.0583,
      "hours": "Mon–Fri 09:00–17:00 · Sat 09:00–13:00 · Closed Sun & public holidays"
    },
    {
      "id": "satellite",
      "name": "Satellite intake point",
      "address": "City & Suburban Veterinary Clinic, 4 Anderson Street, City and Suburban, Johannesburg, 2001",
      "lat": -26.2085,
      "lng": 28.0625,
      "hours": "Urgent drop-offs only — please call ahead"
    }
  ]
};
