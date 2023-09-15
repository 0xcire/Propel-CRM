import { Request, Response } from "express";

import {
  deleteListingByID,
  getAllUserListings,
  getUserDashboardListings,
  insertNewListing,
  updateListingByID,
} from "../db/queries/listings";
import type { NewListing } from "../db/types";

export const getDashboardListings = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const userDashboardListings = await getUserDashboardListings(userID);

    return res.status(200).json({
      message: "",
      listings: userDashboardListings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const getAllListings = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;

    const userListings = await getAllUserListings(userID);

    return res.status(200).json({
      message: "",
      listings: userListings,
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

    const newListing = await insertNewListing(listing);

    return res.status(201).json({
      message: "Listing added",
      data: newListing,
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

    const updatedListingByID = await updateListingByID({ listing: req.body, listingID: +id, userID: userID });

    return res.status(200).json({
      message: "Updated listing.",
      data: updatedListingByID,
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

    const deletedListingByID = await deleteListingByID(+id, userID);

    return res.status(200).json({
      message: `Deleted listing: ${deletedListingByID.id}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
