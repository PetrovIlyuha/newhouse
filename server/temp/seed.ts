require("dotenv").config();

import { connectDatabase } from "../src/database";
import { Listing } from "../src/lib/types";
import { ObjectId } from "mongodb";
const seed = async () => {
  try {
    console.log("[seed] : running");
    const db = await connectDatabase();
    const listings: Listing[] = [
      {
        _id: new ObjectId(),
        title: "Clean and fully furnished apartment. 5 min away from CN Tower",
        image:
          "https://res.cloudinary.com/tiny-house/image/upload/v1560641352/mock/Toronto/toronto-listing-1_exv0tf.jpg",
        address: "3210 Scotchmere Dr W, Toronto, ON, CA",
        price: 10000,
        numOfGuests: 2,
        numOfBeds: 1,
        rating: 5
      },
      {
        _id: new ObjectId(),
        title: "Luxurious home with private pool",
        image:
          "https://res.cloudinary.com/tiny-house/image/upload/v1560645376/mock/Los%20Angeles/los-angeles-listing-1_aikhx7.jpg",
        address: "100 Hollywood Hills Dr, Los Angeles, California",
        price: 15000,
        numOfGuests: 2,
        numOfBeds: 1,
        rating: 4
      },
      {
        _id: new ObjectId(),
        title: "Single bedroom located in the heart of downtown San Fransisco",
        image:
          "https://res.cloudinary.com/tiny-house/image/upload/v1560646219/mock/San%20Fransisco/san-fransisco-listing-1_qzntl4.jpg",
        address: "200 Sunnyside Rd, San Fransisco, California",
        price: 25000,
        numOfGuests: 3,
        numOfBeds: 2,
        rating: 3
      },
      {
        _id: new ObjectId(),
        title:
          "Newly listed 4 BR, 1 BA home on a generous 50 x 180 level lot in a great west side neighborhood. Clearfield, PA",
        image:
          "https://photos.zillowstatic.com/cc_ft_768/IS3z3dkdkgq6ig1000000000.webp",
        address: "219 W Pine St, Clearfield, PA 16830",
        price: 98000,
        numOfGuests: 5,
        numOfBeds: 4,
        rating: 5
      },
      {
        _id: new ObjectId(),
        title:
          "UNIQUE BRICK RAISED RANCH HOME with possible Income Potential or Mother In Law quarters",
        image:
          "https://photos.zillowstatic.com/cc_ft_768/IS3ford3z2rk510000000000.webp",
        address: "6120 Sullivan Trl, Nazareth, PA 18064",
        price: 149000,
        numOfGuests: 9,
        numOfBeds: 4,
        rating: 5
      }
    ];

    for (const listing of listings) {
      await db.listings.insertOne(listing);
    }

    console.log("[seed]: success");
  } catch {
    throw new Error("failed to seed database");
  }
};

seed();
