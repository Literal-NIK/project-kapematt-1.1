import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TO = "josesofia888@gmail.com";
const FROM = "Kapematt Website <onboarding@resend.dev>";

const escape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const row = (label: string, value: string) =>
  `<tr><td style="padding:6px 12px 6px 0;font-family:monospace;font-size:12px;color:#666;vertical-align:top">${escape(
    label,
  )}</td><td style="padding:6px 0;font-size:14px">${escape(value).replace(
    /\n/g,
    "<br />",
  )}</td></tr>`;

async function sendEmail(subject: string, rows: [string, string][]) {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) throw new Error("Email is not configured yet.");

  const html = `<div style="font-family:system-ui,sans-serif"><h2 style="margin:0 0 12px">${escape(
    subject,
  )}</h2><table>${rows.map(([l, v]) => row(l, v)).join("")}</table></div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from: FROM, to: [TO], subject, html }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Resend failed [${response.status}]: ${body}`);
    throw new Error("We couldn't send your message. Please try again or call the store.");
  }

  return { ok: true as const };
}

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  contact: z.string().trim().min(1).max(255),
  topic: z.string().trim().min(1).max(100),
  message: z.string().trim().min(1).max(2000),
});

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) =>
    sendEmail(`Contact form: ${data.topic}`, [
      ["Name", data.name],
      ["Contact", data.contact],
      ["Topic", data.topic],
      ["Message", data.message],
    ]),
  );

const cakeSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(1).max(40),
  date: z.string().trim().min(1).max(40),
  servings: z.string().trim().min(1).max(40),
  notes: z.string().trim().min(1).max(2000),
});

export const sendCakeInquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => cakeSchema.parse(input))
  .handler(async ({ data }) =>
    sendEmail(`Custom cake inquiry — ${data.name}`, [
      ["Name", data.name],
      ["Phone", data.phone],
      ["Collection date", data.date],
      ["Servings", data.servings],
      ["Design notes", data.notes],
    ]),
  );
