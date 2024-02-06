import { Page, WorkerInfo } from "@playwright/test";
import { TESTMAIL_ENDPOINT, TESTMAIL_KEY, TESTMAIL_NAMESPACE } from "../config";

export const createEmailsFixture = (page: Page, workerInfo: WorkerInfo) => {
  console.log(page, workerInfo);
  return {
    getByTag: async (tag: string) => {
      const res = await fetch(
        `${TESTMAIL_ENDPOINT}?apikey=${TESTMAIL_KEY}&namespace=${TESTMAIL_NAMESPACE}&tag=${tag}&livequery=true`
      );

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      return data;
    },
  };
};
