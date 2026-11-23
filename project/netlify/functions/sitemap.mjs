const SITE_URL = "https://ratemymanagement.com";
const MANAGERS_API = "https://backend-p0ja.onrender.com/api/managers";

const STATIC_PATHS = [
  "/",
  "/contact",
  "/team",
  "/privacy",
  "/terms",
  "/how-it-works/find-manager",
  "/how-it-works/create-manager",
  "/All-Companies",
  "/Toxic-Workplace-Blog",
];

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[char]);
}

function createManagerSlug(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export default async function handler(request) {
  if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET" },
    });
  }

  try {
    const response = await fetch(MANAGERS_API, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Managers API returned ${response.status}`);
    }

    const payload = await response.json();
    const managers = Array.isArray(payload)
      ? payload
      : payload.managers;

    if (!Array.isArray(managers)) {
      throw new Error("Unexpected managers API response format");
    }

    const urls = new Set(
      STATIC_PATHS.map((path) => `${SITE_URL}${path}`)
    );

    for (const manager of managers) {
      const id = manager?._id || manager?.id;
      const name = manager?.name;

      if (!id || !name) continue;

      const slug = createManagerSlug(name);

      if (!slug) continue;

      urls.add(
        `${SITE_URL}/management/managers/${slug}/${encodeURIComponent(String(id))}`
      );
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls]
  .map((url) => `  <url>
    <loc>${escapeXml(url)}</loc>
  </url>`)
  .join("\n")}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=300",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);

    return new Response("Unable to generate sitemap", {
      status: 502,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}