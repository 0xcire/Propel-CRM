import type { NewListing, NewSoldListing, Listing as _Listing, } from "@propel/drizzle"
import { Listing, ListingSearchQuery, UpdatedListing } from "./types"

export interface IListingsService {
    getDashboardListings(userId: number): Promise<Listing[]> 
    searchListings(userId: number, query: ListingSearchQuery): Promise<Listing[]> 
    getAllListings(userId: number, query: Omit<ListingSearchQuery, 'address'>): Promise<Listing[]>  // again, first three can really be part of this
    getContactsRelatedListings(userId: number, contactId: number): Promise<{ id: number, address: string }[]> 
    createListing(userId: number, newListing: NewListing): Promise<NewListing | undefined> 
    updateListing(userId: number, listingId: number, listing: Partial<_Listing>): Promise<UpdatedListing | undefined> 
    deleteListing(userId: number, listingId: number): Promise<{ id: number; } | undefined> 
    initListingSale(listingId: number, soldListing: NewSoldListing): Promise<void>  // in future this would ideally be initializing bank transfers and etc, right now it makes a db query
    addLeadToListing(contactId: number, listingId: number, name: string): Promise<void> 
    removeLeadFromListing(contactId: number, listingId: number): Promise<void> 

}

// idea:
// have a leads module
// import ListingsService
// import ContactsService
// ^ ideally would inject related typeorm Repository<Listing & Contact> and would make exp MUCH nicer
// await this.leadsService.getLeadInterests() or something