import { parseRoute, GONE_410_SLUGS, TOOL_SLUG_ALIASES } from "../src/services/routerService";
import { getRobotsMeta } from "../src/services/seoService";
import { CATEGORIES_DATA } from "../src/data/categoriesData";

function testRedirectsAnd410s() {
  console.log("==================================================");
  console.log("VERIFYING 410 GONE, 301 ALIASES & PRIVATE ROUTES");
  console.log("==================================================\n");

  let successCount = 0;
  let failCount = 0;

  // 1. Verify 410 Gone Slugs
  console.log(`Checking ${GONE_410_SLUGS.size} retired 410 Gone slugs...`);
  for (const slug of Array.from(GONE_410_SLUGS)) {
    const route = parseRoute(`/en/${slug}`, "");
    if (route.is410 && route.tab === "410") {
      successCount++;
    } else {
      console.error(`❌ Expected 410 for /en/${slug}, but got:`, route);
      failCount++;
    }
  }

  // 2. Verify 301 Aliases
  console.log(`Checking ${Object.keys(TOOL_SLUG_ALIASES).length} tool 301 alias mappings...`);
  for (const alias of Object.keys(TOOL_SLUG_ALIASES)) {
    const canonicalTarget = TOOL_SLUG_ALIASES[alias];
    const route = parseRoute(`/en/${alias}`, "");
    if (route.tab === "tool-detail" && route.toolSlug === canonicalTarget) {
      successCount++;
    } else {
      console.error(`❌ Alias /en/${alias} did not map to canonical tool ${canonicalTarget}, got:`, route);
      failCount++;
    }
  }

  // 3. Verify Private / Admin Routes
  const privateRoutes = ["/admin", "/dashboard", "/login", "/register", "/forgot-password", "/profile", "/history", "/favorites"];
  console.log(`Checking ${privateRoutes.length} private/admin routes for noindex restriction...`);
  for (const pPath of privateRoutes) {
    const route = parseRoute(pPath, "");
    if (route.tab === "admin" || route.tab === "login" || route.tab === "register" || route.tab === "forgot-password" || route.tab === "dashboard" || route.tab === "history" || route.tab === "favorites") {
      const robotsMeta = getRobotsMeta("PRIVATE");
      if (robotsMeta.includes("noindex")) {
        successCount++;
      } else {
        console.error(`❌ Private route ${pPath} missing noindex meta!`);
        failCount++;
      }
    } else {
      console.error(`❌ Private route ${pPath} failed parsing, got:`, route);
      failCount++;
    }
  }

  console.log("\n==================================================");
  console.log("410 GONE, 301 ALIASES & PRIVATE ROUTE SUMMARY");
  console.log("==================================================");
  console.log(`- Total Tests Passing: ${successCount}`);
  console.log(`- Total Tests Failing: ${failCount}`);
  console.log("==================================================\n");
}

testRedirectsAnd410s();
