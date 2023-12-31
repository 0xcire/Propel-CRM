import { fakerEN_US } from "@faker-js/faker";

export const getDemoAccountID = () => 10;

export const generateAddress = () => {
  const stateAbbr = fakerEN_US.location.state({ abbreviated: true });
  const zipcode = fakerEN_US.location.zipCode({ format: "#####", state: stateAbbr });
  const address = `${fakerEN_US.location.streetAddress()}, ${fakerEN_US.location.city()}, ${stateAbbr} ${zipcode}`;

  return address;
};
