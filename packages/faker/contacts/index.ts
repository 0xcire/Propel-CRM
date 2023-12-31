import { faker, fakerEN_US } from "@faker-js/faker";
import { generateAddress } from "../utils";

export const createFakeContact = () => {
  const first = faker.person.firstName();
  const last = faker.person.lastName();
  const name = `${first} ${last}`;
  const email = faker.internet.email({
    firstName: first,
    lastName: last,
  });
  const address = generateAddress();

  return {
    name: name,
    email: email,
    phoneNumber: fakerEN_US.phone.number().split("x")[0].trim(),
    address: address,
    createdAt: faker.date.between({ from: "2022-01-01T00:00:00.000Z", to: "2023-08-15T00:00:00.000Z" }),
  };
};
