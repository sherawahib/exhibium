import { saveForm } from "@/lib/db";

export async function saveFormSubmission(input: {
  formType: string;
  name?: string;
  email?: string;
  phone?: string;
  visitorId?: number;
  payload: Record<string, unknown>;
}) {
  await saveForm(input);
}
