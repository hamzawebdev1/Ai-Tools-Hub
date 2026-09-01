import http from "http";

function fetchUrl(urlPath: string, headers: Record<string, string> = {}): Promise<{ status: number; headers: any; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.get(
      {
        host: "127.0.0.1",
        port: 3000,
        path: urlPath,
        headers,
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          resolve({ status: res.statusCode || 0, headers: res.headers, body });
        });
      }
    );
    req.on("error", (err) => reject(err));
  });
}

async function runTests() {
  console.log("=== TESTING LIVE SERVER HTTP ROUTES ===");

  try {
    // Test 1: Canonical tool route /en/jpg-to-pdf
    const res1 = await fetchUrl("/en/jpg-to-pdf", {
      Host: "www.mehzandigital.com",
      "X-Forwarded-Host": "www.mehzandigital.com",
      "X-Forwarded-Proto": "https",
    });
    console.log(`[GET /en/jpg-to-pdf] Status: ${res1.status}`);
    console.log(`  - Has H1: ${res1.body.includes("<h1")}`);
    console.log(`  - Has Canonical: ${res1.body.includes('<link rel="canonical" href="https://www.mehzandigital.com/en/jpg-to-pdf"')}`);
    console.log(`  - Has OG Title: ${res1.body.includes('<meta property="og:title"')}`);
    console.log(`  - Has Twitter Card: ${res1.body.includes('<meta name="twitter:card"')}`);

    // Test 2: Legacy tool route /jpg-to-pdf (301 redirect)
    const res2 = await fetchUrl("/jpg-to-pdf", {
      Host: "www.mehzandigital.com",
      "X-Forwarded-Host": "www.mehzandigital.com",
      "X-Forwarded-Proto": "https",
    });
    console.log(`[GET /jpg-to-pdf] Status: ${res2.status} -> Location: ${res2.headers.location}`);

    // Test 3: Legacy /tool/jpg-to-pdf route (301 redirect)
    const res3 = await fetchUrl("/tool/jpg-to-pdf", {
      Host: "www.mehzandigital.com",
      "X-Forwarded-Host": "www.mehzandigital.com",
      "X-Forwarded-Proto": "https",
    });
    console.log(`[GET /tool/jpg-to-pdf] Status: ${res3.status} -> Location: ${res3.headers.location}`);

    // Test 4: Sitemap
    const res4 = await fetchUrl("/sitemap.xml", { Host: "www.mehzandigital.com" });
    console.log(`[GET /sitemap.xml] Status: ${res4.status}`);
    console.log(`  - Has urlset: ${res4.body.includes("<urlset")}`);

    // Test 5: Robots.txt
    const res5 = await fetchUrl("/robots.txt", {
      Host: "www.mehzandigital.com",
      "X-Forwarded-Host": "www.mehzandigital.com",
      "X-Forwarded-Proto": "https",
    });
    console.log(`[GET /robots.txt] Status: ${res5.status}`);
    console.log(`  - Has Sitemap link: ${res5.body.includes("Sitemap: https://www.mehzandigital.com/sitemap.xml")}`);

    console.log("\nALL SERVER HTTP ROUTE TESTS COMPLETED!");
  } catch (err) {
    console.error("Error connecting to dev server:", err);
  }
}

runTests();
