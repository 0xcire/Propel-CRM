import { deleteListingByID, findContactsRelatedListings, findExistingLead, getAllUserListings, getUserDashboardListings, insertNewLead, insertNewListing, insertSoldListingData, isListingSold, NewListing, NewSoldListing, removeLead, searchForListings, updateListingByID } from "@propel/drizzle";

import type { IListingsService } from "./listings.interface";
import { Listing, ListingSearchQuery, UpdatedListing } from "./types";
import { PropelHTTPError } from "../lib/http-error";

export class ListingsService implements IListingsService {
    async getDashboardListings(userId: number): Promise<Listing[]> {
        return await getUserDashboardListings(userId);
    }

    async searchListings(userId: number, { address, status, page, limit }: ListingSearchQuery): Promise<Listing[]> {
        let usersSearchedListings: Listing[] = [];
        
        if (address && address === "") {
          return usersSearchedListings
        }
    
        if (address) {
          usersSearchedListings = await searchForListings({
            userID: userId,
            address: address,
            status: status,
            page: +(page ?? "1"),
            limit: limit,
          }) as Listing[];
        }

        return usersSearchedListings
    }

    async getAllListings(userId: number, { page, status, limit }: Omit<ListingSearchQuery, "address">): Promise<Listing[]> {
        return await getAllUserListings({
            userID: userId,
            page: +(page ?? "1"),
            status: status,
            limit: limit,
        }) as Listing[]; // TODO: look into type diff: price is string or string | undef.
    }

    async getContactsRelatedListings(userId: number, contactId: number): Promise<{ id: number; address: string; }[]> {
        return await findContactsRelatedListings({ userID: userId, contactID: contactId });
    }

    async createListing(userId: number, newListing: NewListing): Promise<NewListing | undefined> {
        return await insertNewListing({ ...newListing, userID: userId });
    }

    async updateListing(userId: number, listingId: number, listing: Partial<Listing>): Promise<UpdatedListing | undefined> {
        return await updateListingByID({ listing, listingID: listingId, userID: userId });
    }

    async deleteListing(userId: number, listingId: number): Promise<{ id: number; } | undefined> {
        return await deleteListingByID(listingId, userId);
    }

    async initListingSale(listingId: number, soldListing: NewSoldListing): Promise<void> {
        const listingIsSold = await isListingSold(+listingId);
        
        if (listingIsSold) {
          throw new PropelHTTPError({
            code: "CONFLICT",
            message: "This listing is already marked sold.",
          });
        }
    
        await insertSoldListingData(soldListing);
    }

    async addLeadToListing(contactId: number, listingId: number, name: string): Promise<void> {
        const existingLead = await findExistingLead(listingId, contactId);
        
        if (existingLead) {
          throw new PropelHTTPError({
            code: "CONFLICT",
            message: `${name} is already an established lead for listing: ${listingId}`,
          });
        }
    
        await insertNewLead(listingId, contactId);
    }

    async removeLeadFromListing(contactId: number, listingId: number): Promise<void> {
        await removeLead(listingId, contactId);
    }
}