import type { Page } from "@playwright/test";

import type { Listing } from "@propel/drizzle";

type ListingFormFields = Partial<Omit<Listing, "id" | "userID" | "createdAt">> & {
  save?: boolean;
};

export const createListingsFixture = (page: Page) => {
  return {
    submitForm: async ({
      address,
      baths,
      bedrooms,
      description,
      price,
      propertyType,
      squareFeet,
      save,
    }: ListingFormFields) => {
      address && (await page.fill("input[name='address']", address));
      description && (await page.fill("textarea[name='description']", description));

      price && (await page.fill("input[name='price']", price));
      squareFeet && (await page.fill("input[name='squareFeet']", squareFeet.toString()));

      if (propertyType) {
        await page.getByTestId("property-type").click();
        await page
          .getByText(propertyType as string)
          .last()
          .click();
      }

      if (bedrooms) {
        await page.getByTestId("bedrooms").click();
        await page.getByText(bedrooms.toString()).last().click();
      }

      if (baths) {
        await page.getByTestId("baths").click();
        await page.getByText(baths.toString()).last().click();
      }

      await page.getByRole("button", { name: save ? "Save" : "Add" }).click();
    },
  };
};
