import { contact } from "@/content/portfolio";

type ContactBody = {
  name?: string;
  email?: string;
  details?: string;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const details = String(body.details || "").trim();

  if (!name || !email || !details) {
    return Response.json(
      { ok: false, error: "Name, email, and details are required." },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return Response.json({ ok: false, error: "Invalid email." }, { status: 400 });
  }
  if (details.length > 5000) {
    return Response.json(
      { ok: false, error: "Message is too long." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || contact.email;
  const from =
    process.env.CONTACT_FROM || "Portfolio Contact <onboarding@resend.dev>";

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY missing — dry-run OK", {
        name,
        email,
        details: details.slice(0, 120),
      });
      return Response.json({ ok: true, dryRun: true });
    }
    return Response.json(
      {
        ok: false,
        error: "Mail relay offline. Use Copy Email instead.",
        fallback: "copy",
      },
      { status: 503 }
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Portfolio inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${details}`,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("[contact] Resend error", res.status, errText);
    return Response.json(
      {
        ok: false,
        error: "Transmission failed. Copy the email and send directly.",
        fallback: "copy",
      },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
