import { handleError } from "../common/utils";
import { PropelHTTPError } from "../lib/http-error";
import { PropelResponse } from "../lib/response";
import { ListingsService } from "./listings.service";

import type { Request, Response } from 'express';
import type { NewListing, NewSoldListing } from "@propel/drizzle";
import type { ListingSearchQuery } from "./types";

export class ListingsController {
    private listingsService: ListingsService

    constructor(listingsService: ListingsService) {
        this.listingsService = listingsService
    }

    handleGetDashboardListings = async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;

            const listings = await this.listingsService.getDashboardListings(userId)

            return PropelResponse(res, 200, {
                message: '',
                listings
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleSearchListings = async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;
            const { address, status, limit, page } = req.query;

            if (!address || typeof address !== "string") {
                throw new PropelHTTPError({
                  code: "BAD_REQUEST",
                  message: "Please enter an address to search.",
                });
            }

            const listings = await this.listingsService.searchListings(userId, { address, status, limit, page } as unknown as ListingSearchQuery)

            return PropelResponse(res, 200, {
                message: '',
                listings: listings
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleGetAllListings = async (req: Request, res: Response) => {
        try {
            const userID = req.user.id;
            const { page, status, limit } = req.query;

            // holy bandaid
            const listings = await this.listingsService.getAllListings(userID,  <Omit<ListingSearchQuery, "address">><unknown>{ page, status, limit })
        
            return PropelResponse(res, 200, {
                message: '',
                listings
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleGetContactsRelatedListings = async (req: Request, res: Response) => {
        try {
            const userID = req.user.id;
            const { contactID } = req.params;

            if (!contactID) {
                throw new PropelHTTPError({
                  code: "BAD_REQUEST",
                  message: "Contact ID required.",
                });
            }

            const listings = await this.listingsService.getContactsRelatedListings(userID, +contactID)

            return PropelResponse(res, 200, {
                messsage: '',
                listings
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleGetListingById = async (req: Request, res: Response) => {
        try {
            const { listingID } = req.params;

            if (!listingID) {
              throw new PropelHTTPError({
                code: "BAD_REQUEST",
                message: "Listing ID required.",
              });
            }

            return PropelResponse(res, 200, {
                message: '',
                listings: [req.listing]
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleCreateListing = async (req: Request, res: Response) => {
        try {
            const userID = req.user.id;
            const { address, propertyType, price, bedrooms, baths, squareFeet, description }: NewListing = req.body;
        
            if (!address || !propertyType || !price || !bedrooms || !baths || !squareFeet || !description) {
                throw new PropelHTTPError({
                  code: "BAD_REQUEST",
                  message: "All fields required.",
                });
            }
            
            const listing = await this.listingsService.createListing(userID, req.body)
        
            return PropelResponse(res, 201, {
                message: "Listing added",
                listings: listing,
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleUpdateListing = async (req: Request, res: Response) => {
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

            const updatedListing = await this.listingsService.updateListing(userID, +listingID, req.body)

            return PropelResponse(res, 200, {
                message: "Updated listing.",
                listings: updatedListing,
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleDeleteListing = async (req: Request, res: Response) => {
        try {
            const userID = req.user.id;
            const { listingID } = req.params;

            if (!listingID) {
                throw new PropelHTTPError({
                  code: "BAD_REQUEST",
                  message: "Listing ID required.",
                });
            }

            const deleteRes = await this.listingsService.deleteListing(userID, +listingID)

            return PropelResponse(res, 200, {
                message: `Deleted listing: ${deleteRes?.id}`,
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleInitListingSale = async (req: Request, res: Response) => {
        try {
            const { listingID } = req.params;
            const values: NewSoldListing = req.body;

            if (!listingID) {
                throw new PropelHTTPError({
                  code: "BAD_REQUEST",
                  message: "Listing ID required.",
                });
            }

            await this.listingsService.initListingSale(+listingID, values)

            return PropelResponse(res, 200, {
                message: `Listing: ${values.listingID} sold to ${req.contact.name}`,
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleAddLeadToListing = async (req: Request, res: Response) => {
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

            await this.listingsService.addLeadToListing(+contactID, +listingID, name)

            return PropelResponse(res, 201, {
                message: `Added ${name} to listing: ${listingID}`,
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleRemoveLeadFromListing = async (req: Request, res: Response) => {
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

            await this.listingsService.removeLeadFromListing(+contactID, +listingID)

            return PropelResponse(res, 200, {
                message: `Successfully removed lead: ${name} from listing: ${listingID}`,
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

}
