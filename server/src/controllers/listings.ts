import { Request, Response } from "express";
import { NewListing } from "../db/types";
import { db } from "../db";
import { listings } from "../db/schema";
import { and, eq } from "drizzle-orm";

// getListing
// one to many user to listings
// many to many listing to contacts
// one to many listing to task

// getListingsTasks
// getListingsContacts

export const getAllListings = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;

    const usersListings = await db.query.listings.findMany({
      where: eq(listings.userID, userID),
    });

    return res.status(200).json({
      message: "",
      data: usersListings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const createListing = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { address, propertyType, price, bedrooms, baths, squareFeet, description }: NewListing = req.body;

    if (!address || !propertyType || !price || !bedrooms || !baths || !squareFeet || !description) {
      return res.status(400).json({});
    }

    const listing: NewListing = { ...req.body, userID: userID };

    const newListing = await db.insert(listings).values(listing).returning({
      id: listings.id,
    });

    return res.status(201).json({
      message: "Listing added",
      data: newListing[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const updateListing = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { id } = req.params;

    const { address, baths, bedrooms, description, price, propertyType, squareFeet }: Partial<NewListing> = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({});
    }

    const updatedListing = await db
      .update(listings)
      .set({
        ...(address
          ? {
              address: address,
            }
          : {}),
        ...(baths
          ? {
              baths: baths,
            }
          : {}),
        ...(bedrooms
          ? {
              bedrooms: bedrooms,
            }
          : {}),
        ...(description
          ? {
              description: description,
            }
          : {}),
        ...(price
          ? {
              price: price,
            }
          : {}),
        ...(propertyType
          ? {
              propertyType: propertyType,
            }
          : {}),
        ...(squareFeet
          ? {
              squareFeet: squareFeet,
            }
          : {}),
      })
      .where(and(eq(listings.id, +id), eq(listings.userID, userID)))
      .returning({
        id: listings.id,
        address: listings.address,
        baths: listings.baths,
        bedrooms: listings.bedrooms,
        description: listings.description,
        price: listings.price,
        propertyType: listings.propertyType,
        squareFeet: listings.squareFeet,
      });

    return res.status(200).json({
      message: "Updated listing.",
      data: updatedListing[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const deleteListing = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { id } = req.params;

    const deletedListing = await db
      .delete(listings)
      .where(and(eq(listings.id, +id), eq(listings.userID, userID)))
      .returning({
        id: listings.id,
      });

    return res.status(200).json({
      message: `Deleted listing: ${deletedListing[0].id}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
