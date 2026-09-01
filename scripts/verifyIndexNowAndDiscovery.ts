import http from "http";

function fetchUrl(path: string, retries = 5): Promise<{ statusCode: number; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    const attempt = (n: number) => {
      const req = http.get(`http://127.0.0.1:3000${path}`, { headers: { "User-Agent": "Mozilla/5.0 (compatible; Bingbot/2.0)" } }, (res) => {
        let body = "";
        res.on("data", (chunk) => { body += chunk; });
        res.on("end", () => {
          resolve({ statusCode: res.statusCode || 0, headers: res.headers, body });
        });
      });
      req.on("error", (err: any) => {
        if (n > 0 && (err.code === "ECONNREFUSED" || err.code === "ECONNRESET")) {
          setTimeout(() => attempt(n - 1), 1000);
        } else {
          reject(err);
        }
      });
    };
    attempt(retries);
  });
}

async function verifyDiscoveryAndIndexNow() {
  console.log("=== STARTING BING WEBMASTER & INDEXNOW DISCOVERY VERIFICATION ===");
  
  let failed = 0;

  // 1. Verify BingSiteAuth.xml
  try {
    const res = await fetchUrl("/BingSiteAuth.xml");
    if (res.statusCode === 200 && res.body.includes("<users>")) {
      console.log("✅ PASS: /BingSiteAuth.xml is valid and accessible.");
    } else {
      console.error(`❌ FAIL: /BingSiteAuth.xml returned status ${res.statusCode}`);
      failed++;
    }
  } catch (e: any) {
    console.error(`❌ ERROR fetching /BingSiteAuth.xml: ${e.message}`);
    failed++;
  }

  // 2. Verify IndexNow verification key file (mehzan_indexnow_sec_2026.txt)
  try {
    const res = await fetchUrl("/mehzan_indexnow_sec_2026.txt");
    if (res.statusCode === 200 && res.body.includes("mehzan_indexnow_sec_2026")) {
      console.log("✅ PASS: IndexNow verification key file is accessible.");
    } else {
      console.error(`❌ FAIL: IndexNow key file returned status ${res.statusCode}`);
      failed++;
    }
  } catch (e: any) {
    console.error(`❌ ERROR fetching IndexNow key file: ${e.message}`);
    failed++;
  }

  // 3. Verify Sitemap.xml
  try {
    const res = await fetchUrl("/sitemap.xml");
    if (res.statusCode === 200 && res.body.includes("<urlset")) {
      console.log(`✅ PASS: /sitemap.xml is valid (${res.body.split("<url>").length - 1} URLs).`);
    } else {
      console.error(`❌ FAIL: /sitemap.xml returned status ${res.statusCode}`);
      failed++;
    }
  } catch (e: any) {
    console.error(`❌ ERROR fetching /sitemap.xml: ${e.message}`);
    failed++;
  }

  // 4. Verify Robots.txt
  try {
    const res = await fetchUrl("/robots.txt");
    if (res.statusCode === 200 && res.body.includes("Sitemap:")) {
      console.log("✅ PASS: /robots.txt is valid and includes sitemaps.");
    } else {
      console.error(`❌ FAIL: /robots.txt returned status ${res.statusCode}`);
      failed++;
    }
  } catch (e: any) {
    console.error(`❌ ERROR fetching /robots.txt: ${e.message}`);
    failed++;
  }

  // 5. Test IndexNow API endpoint via POST
  try {
    const postData = JSON.stringify({
      urls: ["https://www.mehzandigital.com/en/json-formatter"]
    });
    const reqRes = await new Promise<{ statusCode: number; body: string }>((resolve, reject) => {
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port: 3000,
          path: "/api/seo/indexnow",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData),
          },
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => { body += chunk; });
          res.on("end", () => resolve({ statusCode: res.statusCode || 0, body }));
        }
      );
      req.on("error", reject);
      req.write(postData);
      req.end();
    });

    if (reqRes.statusCode === 200) {
      console.log("✅ PASS: IndexNow API endpoint successfully handled submission request.");
    } else {
      console.error(`❌ FAIL: IndexNow API returned status ${reqRes.statusCode}: ${reqRes.body}`);
      failed++;
    }
  } catch (e: any) {
    console.error(`❌ ERROR testing IndexNow API: ${e.message}`);
    failed++;
  }

  if (failed === 0) {
    console.log("\nSUCCESS: All Bing Webmaster and IndexNow discovery verifications passed successfully!");
  } else {
    console.error(`\nFAILURE: ${failed} verification checks failed.`);
    process.exit(1);
  }
}

verifyDiscoveryAndIndexNow();
