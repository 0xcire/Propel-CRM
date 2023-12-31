import { fakerEN_US } from "@faker-js/faker";
import { getDemoAccountID } from "../utils";

const setPriority = () => {
  const priorities = ["low", "medium", "high"] as const;
  const randomIndex = Math.floor(Math.random() * priorities.length);
  return priorities[randomIndex];
};

export const createFakeTask = ({ complete }: { complete: boolean }) => {
  const date = fakerEN_US.date.between({ from: "2023-10-01T00:00:00.000Z", to: "2024-01-01T00:00:00.000Z" });
  return {
    userID: getDemoAccountID(),
    title: complete ? "This is a complete task." : "This is an incomplete task.",
    description: "Here's an opportunity to add a couple sentences to furthur describe a task.",
    notes: "- Bullet points \n- To provide additional details \n- About the task at hand",
    dueDate: date.toISOString(),
    priority: setPriority(),
    completed: true,
  };
};
