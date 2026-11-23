import { readFile } from "node:fs/promises";
import { render } from "../../dist/server/entry-server.mjs";

const SITE_URL = "https://ratemymanagement.com";
const DEFAULT_API_URL = "https://backend-p0ja.onrender.com";

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function safeJson(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function replaceMeta(html, attribute, key, content) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const pattern = new RegExp(
    `<meta\\s+[^>]*${attribute}=["']${escapedKey}["'][^>]*>`,
    "i"
  );

  const replacement = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;

  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }

  return html.replace("</head>", `  ${replacement}\n</head>`);
}

function getName(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.name || value.companyName || "";
}

function prepareManager(payload, requestedId) {
  const rawManager =
    payload.manager ||
    payload.data?.manager ||
    payload.data ||
    payload;

  const rawReviews =
    payload.reviews ||
    payload.data?.reviews ||
    rawManager.reviews ||
    [];

  const reviews = rawReviews.map((review) => {
    const {
      userId,
      likes = [],
      dislikes = [],
      ...publicFields
    } = review;

    return {
      ...publicFields,

      // Do not expose reviewer account IDs.
      userId: {
        _id: "",
        name: review.anonymous
          ? "Anonymous"
          : userId?.name || "Employee",
      },

      // The public page only needs counts.
      likes: [],
      dislikes: [],
      likesCount: review.likesCount ?? likes.length,
      dislikesCount: review.dislikesCount ?? dislikes.length,
    };
  });

  return {
    ...rawManager,
    _id: String(rawManager._id || requestedId),
    name: rawManager.name || "Manager",
    position: rawManager.position || "",
    department: rawManager.department || "",
    company: rawManager.company || "",
    branch: rawManager.branch || "",
    reviews,
  };
}

function createMetadata(html, manager, canonicalUrl) {
  const name = manager.name;
  const company = getName(manager.company);

  const title = `${name} – Manager Reviews and Ratings | Rate My Manager`;

  const description = company
    ? `Read workplace reviews and ratings for ${name} at ${company}. Explore employee feedback on leadership, management, and workplace experience.`
    : `Read workplace reviews and ratings for ${name}. Explore employee feedback on leadership, management, and workplace experience.`;

  const image = `${SITE_URL}/previeww.png`;

  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(title)}</title>`
  );

  html = replaceMeta(html, "name", "description", description);

  html = replaceMeta(html, "property", "og:title", title);
  html = replaceMeta(html, "property", "og:description", description);
  html = replaceMeta(html, "property", "og:url", canonicalUrl);
  html = replaceMeta(html, "property", "og:image", image);
  html = replaceMeta(html, "property", "og:type", "profile");

  html = replaceMeta(html, "name", "twitter:title", title);
  html = replaceMeta(html, "name", "twitter:description", description);
  html = replaceMeta(html, "name", "twitter:image", image);
  html = replaceMeta(html, "name", "twitter:card", "summary_large_image");

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: manager.name,
    jobTitle: manager.position || undefined,
    worksFor: company
      ? {
          "@type": "Organization",
          name: company,
        }
      : undefined,
    url: canonicalUrl,
  };

  const schemaScript = `
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <script type="application/ld+json">${safeJson(personSchema)}</script>
  `;

  return html.replace("</head>", `${schemaScript}\n</head>`);
}

export default async function handler(request) {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const managerId = pathParts[pathParts.length - 1];

    if (!managerId) {
      return new Response("Manager not found", { status: 404 });
    }

    const apiBase = (
      process.env.API_BASE_URL ||
      process.env.VITE_API_BASE_URL ||
      DEFAULT_API_URL
    ).replace(/\/+$/, "");

    const apiResponse = await fetch(
      `${apiBase}/api/managers/${encodeURIComponent(managerId)}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (apiResponse.status === 404) {
      return new Response("Manager not found", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    if (!apiResponse.ok) {
      throw new Error(`Manager API returned ${apiResponse.status}`);
    }

    const payload = await apiResponse.json();
    const manager = prepareManager(payload, managerId);

    const projectUrl = new URL("../../", import.meta.url);

    const shell = await readFile(
      new URL("dist/client/index.html", projectUrl),
      "utf8"
    );

    //const { render } = await import(
  //new URL("dist/server/entry-server.mjs", projectUrl).href
//);

    const appHtml = render(
      `${url.pathname}${url.search}`,
      manager
    );

    const canonicalUrl = `${SITE_URL}${url.pathname}`;

    let html = createMetadata(shell, manager, canonicalUrl);

    html = html.replace(
      '<div id="app"></div>',
      `<div id="app">${appHtml}</div>`
    );

    const initialManagerScript = `
      <script>
        window.__INITIAL_MANAGER__ = ${safeJson(manager)};
      </script>
    `;

    html = html.replace(
      "</body>",
      `${initialManagerScript}\n</body>`
    );

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=300",
      },
    });
  } catch (error) {
    console.error("Manager SSR error:", error);

    return new Response("Unable to render manager profile", {
      status: 502,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}

export const config = {
  path: "/management/managers/:name/:id",
  method: ["GET"],
};
