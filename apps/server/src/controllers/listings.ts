import { Request, Response } from "express";

import { findContactByID } from "@propel/drizzle/queries/contacts";
import {
  deleteListingByID,
  findContactsRelatedListings,
  findExistingLead,
  getAllUserListings,
  getUserDashboardListings,
  insertNewLead,
  insertNewListing,
  insertSoldListingData,
  removeLead,
  searchForListings,
  updateListingByID,
} from "@propel/drizzle/queries/listings";

import type { NewListing, NewSoldListing } from "@propel/drizzle/types";
import type { Limit, ListingStatus } from "@propel/types";

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
    const { page, status, limit } = req.query;

    const userListings = await getAllUserListings({
      userID: userID,
      page: +page!,
      status: status as ListingStatus,
      limit: limit as Limit,
    });

    return res.status(200).json({
      message: "",
      listings: userListings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const searchUsersListings = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { address, status, limit, page } = req.query;

    if (!address) {
      return res.status(400).json({
        message: "Please enter an address to search.",
      });
    }

    let usersSearchedListings;

    if (address && address === "") {
      usersSearchedListings = [];
    }

    if (address) {
      usersSearchedListings = await searchForListings({
        userID: userID,
        address: address as string,
        status: status as ListingStatus,
        page: +page!,
        limit: limit as Limit,
      });
    }

    return res.status(200).json({
      listings: usersSearchedListings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const getContactsRelatedListings = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { contactID } = req.params;

    const contactsListings = await findContactsRelatedListings({ userID: userID, contactID: +contactID! });

    return res.status(200).json({
      message: "",
      listings: contactsListings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const getSpecificListing = async (req: Request, res: Response) => {
  try {
    const { listingID } = req.params;

    if (!listingID) {
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
    const { listingID } = req.params;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({});
    }

    const updatedListingByID = await updateListingByID({ listing: req.body, listingID: +listingID!, userID: userID });

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
    const { listingID } = req.params;

    const deletedListingByID = await deleteListingByID(+listingID!, userID);

    return res.status(200).json({
      message: `Deleted listing: ${deletedListingByID?.id}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const markListingAsSold = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { listingID } = req.params;
    const values: NewSoldListing = req.body;

    if (values.userID !== userID) {
      return res.status(400).json({
        message: "",
      });
    }

    if (values.listingID !== +listingID!) {
      return res.status(400).json({
        message: "",
      });
    }

    // TODO: refactor to have contactID & isContactOwner check at router
    const contactByID = await findContactByID(values.contactID as number, userID);

    if (!contactByID) {
      return res.status(400).json({
        message: "That's weird, couldn't find that contact to add. Please try again.",
      });
    }

    await insertSoldListingData(values);

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
    const { listingID, contactID } = req.params;
    const { name } = req.contact;

    const existingLead = await findExistingLead(+listingID!, +contactID!);

    if (existingLead) {
      return res.status(400).json({
        message: `${name} is already an established lead for listing: ${listingID}`,
      });
    }

    await insertNewLead(+listingID!, +contactID!);

    return res.status(201).json({
      message: `Added ${name} to listing: ${listingID}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const removeListingLead = async (req: Request, res: Response) => {
  try {
    const { listingID, contactID } = req.params;
    const { name } = req.contact;

    await removeLead(+listingID!, +contactID!);

    return res.status(200).json({
      message: `Successfully removed lead: ${name} from listing: ${listingID}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
