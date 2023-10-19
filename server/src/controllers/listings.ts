import { Request, Response } from "express";

import { findContactByID } from "../db/queries/contacts";
import {
  deleteListingByID,
  deleteListingLeadsByID,
  deleteSoldListingByID,
  findExistingLead,
  getAllUserListings,
  getUserDashboardListings,
  insertNewLead,
  insertNewListing,
  insertSoldListingData,
  removeLead,
  updateListingByID,
} from "../db/queries/listings";
import type { NewListing, NewSoldListing } from "../db/types";

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
    const { page, status } = req.query;

    const userListings = await getAllUserListings(userID, +page!, status as string);

    return res.status(200).json({
      message: "",
      listings: userListings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const getSpecificListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Please provide a listing ID.",
      });
    }

    const listing = req.listing;

    return res.status(200).json({
      message: "",
      listings: [listing],
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
      listings: newListing,
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
      listings: updatedListingByID,
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

    // need to add delete cascade functionality
    const deleteLeadsForListing = await deleteListingLeadsByID(+id, userID);
    const deleteFromSoldListings = await deleteSoldListingByID(+id, userID);
    const deletedListingByID = await deleteListingByID(+id, userID);

    return res.status(200).json({
      message: `Deleted listing: ${deletedListingByID.id}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const markListingAsSold = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { id } = req.params;
    const values: NewSoldListing = req.body;

    if (values.userID !== userID) {
      return res.status(400).json({
        message: "",
      });
    }

    if (values.listingID !== values.listingID) {
      return res.status(400).json({
        message: "",
      });
    }

    const contactByID = await findContactByID(values.contactID as number);

    if (!contactByID) {
      return res.status(400).json({
        message: "That's weird, couldn't find that contact to add. Please try again.",
      });
    }

    const listingMarkedAsSold = await insertSoldListingData(values);

    return res.status(200).json({
      message: `${values.listingID} marked sold.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const addListingLead = async (req: Request, res: Response) => {
  try {
    const { id: listingID, contactID } = req.params;

    const contactByID = await findContactByID(+contactID);

    if (!contactByID) {
      return res.status(400).json({
        message: "That's weird, couldn't find that contact to add. Please try again.",
      });
    }

    const existingLead = await findExistingLead(+listingID, +contactID);

    if (existingLead) {
      return res.status(400).json({
        message: `${contactByID?.name} is already an established lead for listing: ${listingID}`,
      });
    }

    const newListingLead = await insertNewLead(+listingID, +contactID);

    return res.status(201).json({
      message: `Added ${contactByID?.name} to listing: ${listingID}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const removeListingLead = async (req: Request, res: Response) => {
  try {
    const { id: listingID, contactID } = req.params;

    const contactByID = await findContactByID(+contactID);

    const removedLead = await removeLead(+listingID, +contactID);

    return res.status(200).json({
      message: `Successfully removed lead: ${contactByID?.name} from listing: ${listingID}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
