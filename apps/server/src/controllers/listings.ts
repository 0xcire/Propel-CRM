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
} from "@propel/drizzle";

import { PropelHTTPError } from "../lib/http-error";
import { handleError } from "../utils";

import type { Request, Response } from "express";
import type { NewListing, NewSoldListing } from "@propel/drizzle";
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
    return handleError(error, res);
  }
};

export const getAllListings = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { page, status, limit } = req.query;

    const userListings = await getAllUserListings({
      userID: userID,
      page: +(page ?? "1"),
      status: status as ListingStatus,
      limit: limit as Limit,
    });

    return res.status(200).json({
      message: "",
      listings: userListings,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const searchUsersListings = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { address, status, limit, page } = req.query;

    if (!address || typeof address !== "string") {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
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
        address: address,
        status: status as ListingStatus,
        page: +(page ?? "1"),
        limit: limit as Limit,
      });
    }

    return res.status(200).json({
      listings: usersSearchedListings,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const getContactsRelatedListings = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { contactID } = req.params;

    if (!contactID) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Contact ID required.",
      });
    }

    const contactsListings = await findContactsRelatedListings({ userID: userID, contactID: +contactID });

    return res.status(200).json({
      message: "",
      listings: contactsListings,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const getSpecificListing = async (req: Request, res: Response) => {
  try {
    const { listingID } = req.params;

    if (!listingID) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Listing ID required.",
      });
    }

    const listing = req.listing;

    return res.status(200).json({
      message: "",
      listings: [listing],
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const createListing = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { address, propertyType, price, bedrooms, baths, squareFeet, description }: NewListing = req.body;

    if (!address || !propertyType || !price || !bedrooms || !baths || !squareFeet || !description) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "All fields required.",
      });
    }

    const listing: NewListing = { ...req.body, userID: userID };

    const newListing = await insertNewListing(listing);

    return res.status(201).json({
      message: "Listing added",
      listings: newListing,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const updateListing = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { listingID } = req.params;

    if (!listingID) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Listing ID required.",
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({});
    }

    const updatedListingByID = await updateListingByID({ listing: req.body, listingID: +listingID, userID: userID });

    return res.status(200).json({
      message: "Updated listing.",
      listings: updatedListingByID,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const deleteListing = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { listingID } = req.params;

    if (!listingID) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Listing ID required.",
      });
    }

    const deletedListingByID = await deleteListingByID(+listingID, userID);

    return res.status(200).json({
      message: `Deleted listing: ${deletedListingByID?.id}`,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const markListingAsSold = async (req: Request, res: Response) => {
  try {
    const { listingID } = req.params;
    const values: NewSoldListing = req.body;

    if (!listingID) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Listing ID required.",
      });
    }

    await insertSoldListingData(values);

    return res.status(200).json({
      message: `Listing: ${values.listingID} sold to ${req.contact.name}`,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const addListingLead = async (req: Request, res: Response) => {
  try {
    const { listingID, contactID } = req.params;
    const { name } = req.contact;

    if (!listingID) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Listing ID required.",
      });
    }

    if (!contactID) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Contact ID required.",
      });
    }

    const existingLead = await findExistingLead(+listingID, +contactID);

    if (existingLead) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: `${name} is already an established lead for listing: ${listingID}`,
      });
    }

    await insertNewLead(+listingID, +contactID);

    return res.status(201).json({
      message: `Added ${name} to listing: ${listingID}`,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const removeListingLead = async (req: Request, res: Response) => {
  try {
    const { listingID, contactID } = req.params;
    const { name } = req.contact;

    if (!listingID) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Listing ID required.",
      });
    }

    if (!contactID) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Contact ID required.",
      });
    }

    await removeLead(+listingID, +contactID);

    return res.status(200).json({
      message: `Successfully removed lead: ${name} from listing: ${listingID}`,
    });
  } catch (error) {
    return handleError(error, res);
  }
};
