import { TESTMAIL_ENDPOINT, TESTMAIL_KEY, TESTMAIL_NAMESPACE } from "../config";

type TestMailResponse = {
  result: "success" | "fail";
  message: string | null;
  count: number;
  limit: number;
  offset: number;
  emails: Array<unknown>;
};

export const createEmailsFixture = () => {
  return {
    getByTag: async (tag: string) => {
      const res = await fetch(
        `${TESTMAIL_ENDPOINT}?apikey=${TESTMAIL_KEY}&namespace=${TESTMAIL_NAMESPACE}&tag=${tag}&livequery=true`
      );

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      const data: TestMailResponse = await res.json();

      return data;
    },
  };
};
