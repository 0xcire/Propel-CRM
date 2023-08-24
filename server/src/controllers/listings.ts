import { Request, Response } from "express";
import { NewListing } from "../db/types";
import { db } from "../db";
import { listings } from "../db/schema";

// getListing
// one to many user to listings
// many to many listing to contacts
// one to many listing to task

// getListingsTasks
// getListingsContacts

export const getAllListings = async (req: Request, res: Response) => {
  try {
    return 0;
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
    return 0;
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const deleteListing = async (req: Request, res: Response) => {
  try {
    return 0;
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
