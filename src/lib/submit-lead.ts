import { createServerFn } from "@tanstack/react-start";

export const submitLead = createServerFn({ method: "POST" })
  .validator((input: unknown) => input)
  .handler(async ({ data }) => {
    const { saveLead } = await import("./sheets.server");
    return saveLead(data);
  });
