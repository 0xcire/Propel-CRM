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

    handleGetDashboardContacts = async (req: Request, res: Response) => {
        try {
            const id = req.user.id;

            const contacts = await this.contactsService.getDashboardContacts(id)

            return PropelResponse(res, 200, {
                message: '',
                contacts: contacts
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleSearchContacts = async (req: Request, res:Response) => {
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

            return PropelResponse(res, 200, {
                message: '',
                contacts: contacts
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleGetContacts = async (req: Request, res: Response) => {
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

            return PropelResponse(res, 200, {
                message: '',
                contacts: contacts
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleGetContactById = async (req: Request, res: Response) => {
        try {
            const contactByID = req.contact;
            
            return PropelResponse(res, 200, {
                message: '',
                contacts: [contactByID]
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleCreateContact = async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;
            const { name, email, phoneNumber, address } = req.body;

            if (!name || !email || !phoneNumber || !address) {
                throw new PropelHTTPError({
                  code: "BAD_REQUEST",
                  message: "All fields required.",
                });
            }

            const data = await this.contactsService.createContact(userId, { name, email, phoneNumber, address })
        
            return PropelResponse(res, 201, data)
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleUpdateContact = async (req: Request, res: Response) => {
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

            return PropelResponse(res, 200, {
                message: `Updated ${req.contact.name} successfully.`,
                contact: updatedContact,
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleDeleteContact = async (req: Request, res: Response) => {
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

                return PropelResponse(res, 200, {
                    message: `Successfully removed ${req.contact.name} from your network.`,
                })
            } catch (error) {
                handleError(error, res)
            }
    }
}