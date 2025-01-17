import { handleError } from "../common/utils";
import { PropelHTTPError } from "../lib/http-error";
import { PropelResponse } from "../lib/response";
import { ListingsService } from "./listings.service";

import type { Request, Response } from 'express'
import { ListingSearchQuery } from "./types";
import { NewListing, NewSoldListing } from "@propel/drizzle";

export class ListingsController {
    private listingsService: ListingsService

    constructor(listingsService: ListingsService) {
        this.listingsService = listingsService
    }

    async handleGetDashboardListings(req: Request, res: Response) {
        try {
            const userId = req.user.id;

            const listings = await this.listingsService.getDashboardListings(userId)

            return PropelResponse(200, {
                message: '',
                listings
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    async handleSearchListings(req: Request, res: Response) {
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

            return PropelResponse(200, {
                message: '',
                listings: listings
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    async handleGetAllListings(req: Request, res: Response) {
        try {
            const userID = req.user.id;
            const { page, status, limit } = req.query;

            const listings = await this.listingsService.getAllListings(userID, { page, status, limit } as unknown as ListingSearchQuery)
        
            return PropelResponse(200, {
                message: '',
                listings
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    async handleGetContactsRelatedListings(req: Request, res: Response) {
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

            return PropelResponse(200, {
                messsage: '',
                listings
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    async handleGetListingById(req: Request, res: Response) {
        try {
            const { listingID } = req.params;

            if (!listingID) {
              throw new PropelHTTPError({
                code: "BAD_REQUEST",
                message: "Listing ID required.",
              });
            }

            return PropelResponse(200, {
                message: '',
                listings: [req.listing]
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    async handleCreateListing(req: Request, res: Response) {
        try {
            const userID = req.user.id;
            const { address, propertyType, price, bedrooms, baths, squareFeet, description }: NewListing = req.body;
        
            // TODO: does validate request not do this
            if (!address || !propertyType || !price || !bedrooms || !baths || !squareFeet || !description) {
                throw new PropelHTTPError({
                  code: "BAD_REQUEST",
                  message: "All fields required.",
                });
            }
            
            const listing = await this.listingsService.createListing(userID, { address, propertyType, price, bedrooms, baths, squareFeet, description })
        
            return PropelResponse(201, {
                message: "Listing added",
                listings: listing,
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    async handleUpdateListing(req: Request, res: Response) {
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

            return PropelResponse(200, {
                message: "Updated listing.",
                listings: updatedListing,
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    async handleDeleteListing(req: Request, res: Response) {
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

            return PropelResponse(200, {
                message: `Deleted listing: ${deleteRes?.id}`,
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    async handleInitListingSale(req: Request, res: Response) {
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

            return PropelResponse(200, {
                message: `Listing: ${values.listingID} sold to ${req.contact.name}`,
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    async handleAddLeadToListing(req: Request, res: Response) {
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

            return PropelResponse(201, {
                message: `Added ${name} to listing: ${listingID}`,
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    async handleRemoveLeadFromListing(req: Request, res: Response) {
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

            return PropelResponse(200, {
                message: `Successfully removed lead: ${name} from listing: ${listingID}`,
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

}
