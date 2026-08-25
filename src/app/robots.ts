import type { MetadataRoute } from "next";

const BASE_URL = "https://www.ptsolutionss.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/register", "/login"],
        disallow: [
          "/dashboard",
          "/stock",
          "/sale",
          "/sales-list",
          "/clients",
          "/client-registration",
          "/product-registration",
          "/cash-flow",
          "/accounts-payable",
          "/accounts-receivable",
          "/config/",
          "/forgot-password",
          "/reset-password",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
