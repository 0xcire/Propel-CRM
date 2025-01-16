import { handleError, objectNotEmpty } from "../common/utils"
import { PropelHTTPError } from "../lib/http-error"
import { PropelResponse } from "../lib/response"
import { ContactsService } from "./contacts.service"

import type { Request, Response } from 'express'

export class ContactsController {
    private contactsService: ContactsService
    constructor(contactsService: ContactsService) {
        this.contactsService = contactsService
    }

    async handleGetDashboardContacts(req: Request, res: Response) {
        try {
            const id = req.user.id;

            const contacts = await this.contactsService.getDashboardContacts(id)

            return PropelResponse(200, {
                message: '',
                contacts: contacts
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    async handleSearchContacts(req: Request, res:Response) {
        try {
            const userID = req.user.id;
            const { name, page, limit } = req.query;

            if (!name || typeof name !== 'string') {
                throw new PropelHTTPError({
                  code: "BAD_REQUEST",
                  message: "Please enter a name to search.",
                });
            }

            // meh
            if (typeof page !== 'string' || typeof limit !== 'string') {
                throw new PropelHTTPError({
                    code: "BAD_REQUEST",
                    message: "Invalid search",
                });
            }

            const contacts = await this.contactsService.searchContacts(name, userID, page, limit)

            return PropelResponse(200, {
                message: '',
                contacts: contacts
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    async handleGetContacts(req: Request, res: Response) {
        try {
            const userID = req.user.id;
            const { page, limit } = req.query;

            // meh
            if (typeof page !== 'string' || typeof limit !== 'string') {
                throw new PropelHTTPError({
                    code: "BAD_REQUEST",
                    message: "Invalid search",
                });
            }

            const contacts = await this.contactsService.getAllContacts(userID, page, limit)

            return PropelResponse(200, {
                message: '',
                contacts: contacts
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    async handleGetContactById(req: Request, res: Response) {
        try {
            const contactByID = req.contact;
            
            return PropelResponse(200, {
                message: '',
                contacts: [contactByID]
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    async handleCreateContact(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const { name, email, phoneNumber, address } = req.body;

            if (!name || !email || !phoneNumber || !address) {
                throw new PropelHTTPError({
                  code: "BAD_REQUEST",
                  message: "All fields required.",
                });
            }

            const res = await this.contactsService.createContact(userId, { name, email, phoneNumber, address })
        
            return PropelResponse(201, res)
        } catch (error) {
            return handleError(error, res)
        }
    }

    async handleUpdateContact(req: Request, res: Response) {
        try {
            const { contactID } = req.params;

            if (!objectNotEmpty(req.body)) {
                throw new PropelHTTPError({
                    code: "BAD_REQUEST",
                    message: "Nothing to update.",
                });
            }
            
            if (!contactID) {
                throw new PropelHTTPError({
                    code: "BAD_REQUEST",
                    message: "Contact ID required.",
                });
            }

            const updatedContact = await this.contactsService.updateContact(contactID, req.body)

            return PropelResponse(200, {
                message: `Updated ${req.contact.name} successfully.`,
                contact: updatedContact,
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    async handleDeleteContact(req: Request, res: Response) {
            try {
                const userID = req.user.id;
                const { contactID } = req.params;

                if (!contactID) {
                    throw new PropelHTTPError({
                      code: "BAD_REQUEST",
                      message: "Contact ID required.",
                    });
                }

                await this.contactsService.deleteContact(userID, contactID)

                return PropelResponse(200, {
                    message: `Successfully removed ${req.contact.name} from your network.`,
                })
            } catch (error) {
                handleError(error, res)
            }
    }
}