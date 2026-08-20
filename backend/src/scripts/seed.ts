import bcrypt from "bcryptjs";
import { supabase, isLiveSupabaseConfigured } from "../config/supabase.js";
import { ENV } from "../config/env.js";

async function runSeed() {
  console.log("==================================================");
  console.log("🌱 AGROSAFE TRAVEL — SUPABASE SEED SCRIPT");
  console.log("==================================================");
  console.log(`DB Mode: ${ENV.DB_MODE}`);
  console.log(`Live Supabase Configured: ${isLiveSupabaseConfigured()}`);

  if (!isLiveSupabaseConfigured()) {
    console.error("❌ Live Supabase credentials not found or set to mock. Please check your credentials in .env.");
    process.exit(1);
  }

  try {
    const defaultPasswordHash = bcrypt.hashSync("password123", 10);

    // 1. Seed Users (2 Hosts, 2 Guests)
    console.log("\n[1/11] Seeding Users (2 Hosts, 2 Guests | Password: password123)...");
    const usersData = [
      { id: 1, user_type: "host", first_name: "Rohit", last_name: "Bisht", email: "rohit.bisht@example.com", password_hash: defaultPasswordHash, phone_number: "+91 98765 43210", is_verified: true },
      { id: 2, user_type: "host", first_name: "Vikram", last_name: "Singh", email: "vikram.singh@example.com", password_hash: defaultPasswordHash, phone_number: "+91 98765 43211", is_verified: true },
      { id: 3, user_type: "guest", first_name: "Arjun", last_name: "Verma", email: "arjun.verma@example.com", password_hash: defaultPasswordHash, phone_number: "+91 98765 43220", is_verified: true },
      { id: 4, user_type: "guest", first_name: "Pooja", last_name: "Sharma", email: "pooja.sharma@example.com", password_hash: defaultPasswordHash, phone_number: "+91 98765 43221", is_verified: true },
    ];
    const { error: userErr } = await supabase.from("users").upsert(usersData, { onConflict: "id" });
    if (userErr) throw new Error(`Users seed error: ${userErr.message}`);
    console.log("✅ Users seeded (4 records)");

    // 2. Seed Static Geo Reference (Northern Hilly Districts)
    console.log("\n[2/11] Seeding Static Geo References...");
    const geoData = [
      { id: 1, state: "Uttarakhand", district: "Nainital", subdistrict: "Ramgarh", center_latitude: 29.426, center_longitude: 79.552 },
      { id: 2, state: "Uttarakhand", district: "Nainital", subdistrict: "Mukteshwar", center_latitude: 29.472, center_longitude: 79.647 },
      { id: 3, state: "Uttarakhand", district: "Nainital", subdistrict: "Bhimtal", center_latitude: 29.351, center_longitude: 79.554 },
      { id: 4, state: "Uttarakhand", district: "Chamoli", subdistrict: "Joshimath", center_latitude: 30.556, center_longitude: 79.563 },
      { id: 5, state: "Uttarakhand", district: "Chamoli", subdistrict: "Gopeshwar", center_latitude: 30.418, center_longitude: 79.333 },
      { id: 6, state: "Uttarakhand", district: "Chamoli", subdistrict: "Karnaprayag", center_latitude: 30.261, center_longitude: 79.219 },
      { id: 7, state: "Uttarakhand", district: "Almora", subdistrict: "Ranikhet", center_latitude: 29.643, center_longitude: 79.432 },
      { id: 8, state: "Uttarakhand", district: "Almora", subdistrict: "Kausani", center_latitude: 29.854, center_longitude: 79.597 },
      { id: 9, state: "Uttarakhand", district: "Tehri Garhwal", subdistrict: "Kanatal", center_latitude: 30.416, center_longitude: 78.337 },
      { id: 10, state: "Uttarakhand", district: "Dehradun", subdistrict: "Chakrata", center_latitude: 30.701, center_longitude: 77.869 },
      { id: 11, state: "Uttarakhand", district: "Pithoragarh", subdistrict: "Munsiyari", center_latitude: 30.067, center_longitude: 80.233 },
      { id: 12, state: "Uttarakhand", district: "Uttarkashi", subdistrict: "Harsil", center_latitude: 31.034, center_longitude: 78.738 },
      { id: 13, state: "Himachal Pradesh", district: "Mandi", subdistrict: "Parashar", center_latitude: 31.754, center_longitude: 77.101 },
      { id: 14, state: "Himachal Pradesh", district: "Mandi", subdistrict: "Kamand", center_latitude: 31.781, center_longitude: 76.992 },
      { id: 15, state: "Himachal Pradesh", district: "Mandi", subdistrict: "Barot", center_latitude: 32.036, center_longitude: 76.844 },
      { id: 16, state: "Himachal Pradesh", district: "Kullu", subdistrict: "Naggar", center_latitude: 32.138, center_longitude: 77.172 },
      { id: 17, state: "Himachal Pradesh", district: "Kullu", subdistrict: "Jibhi", center_latitude: 31.637, center_longitude: 77.348 },
      { id: 18, state: "Himachal Pradesh", district: "Kullu", subdistrict: "Manali", center_latitude: 32.243, center_longitude: 77.189 },
      { id: 19, state: "Himachal Pradesh", district: "Shimla", subdistrict: "Mashobra", center_latitude: 31.127, center_longitude: 77.234 },
      { id: 20, state: "Himachal Pradesh", district: "Shimla", subdistrict: "Narkanda", center_latitude: 31.258, center_longitude: 77.458 },
      { id: 21, state: "Himachal Pradesh", district: "Shimla", subdistrict: "Kotgarh", center_latitude: 31.317, center_longitude: 77.489 },
      { id: 22, state: "Himachal Pradesh", district: "Kinnaur", subdistrict: "Sangla", center_latitude: 31.423, center_longitude: 78.261 },
      { id: 23, state: "Himachal Pradesh", district: "Kinnaur", subdistrict: "Kalpa", center_latitude: 31.538, center_longitude: 78.256 },
      { id: 24, state: "Himachal Pradesh", district: "Kangra", subdistrict: "Bir", center_latitude: 32.046, center_longitude: 76.721 },
      { id: 25, state: "Himachal Pradesh", district: "Kangra", subdistrict: "Dharamkot", center_latitude: 32.248, center_longitude: 76.326 },
      { id: 26, state: "Himachal Pradesh", district: "Solan", subdistrict: "Chail", center_latitude: 30.969, center_longitude: 77.194 },
    ];
    const { error: geoErr } = await supabase.from("static_geo_reference").upsert(geoData, { onConflict: "id" });
    if (geoErr) throw new Error(`Static Geo seed error: ${geoErr.message}`);
    console.log("✅ Static Geo References seeded (26 records)");

    // 3. Seed Monthly Safe Matrix
    console.log("\n[3/11] Seeding Monthly Safe Matrix...");
    const matrixDistricts = [
      { state: "Uttarakhand", district: "Nainital", rainBase: 35, rainPeak: 410, soilBase: 95, soilLow: 40 },
      { state: "Uttarakhand", district: "Chamoli", rainBase: 40, rainPeak: 490, soilBase: 94, soilLow: 34 },
      { state: "Uttarakhand", district: "Almora", rainBase: 25, rainPeak: 360, soilBase: 96, soilLow: 48 },
      { state: "Uttarakhand", district: "Tehri Garhwal", rainBase: 30, rainPeak: 390, soilBase: 93, soilLow: 42 },
      { state: "Uttarakhand", district: "Uttarkashi", rainBase: 45, rainPeak: 470, soilBase: 90, soilLow: 36 },
      { state: "Himachal Pradesh", district: "Mandi", rainBase: 30, rainPeak: 430, soilBase: 92, soilLow: 38 },
      { state: "Himachal Pradesh", district: "Kullu", rainBase: 35, rainPeak: 380, soilBase: 94, soilLow: 45 },
      { state: "Himachal Pradesh", district: "Shimla", rainBase: 28, rainPeak: 340, soilBase: 95, soilLow: 50 },
      { state: "Himachal Pradesh", district: "Kinnaur", rainBase: 20, rainPeak: 220, soilBase: 88, soilLow: 40 },
      { state: "Himachal Pradesh", district: "Kangra", rainBase: 40, rainPeak: 520, soilBase: 91, soilLow: 32 },
    ];

    const matrixData: any[] = [];
    for (const d of matrixDistricts) {
      for (let month = 1; month <= 12; month++) {
        const isMonsoon = month === 7 || month === 8;
        const isShoulder = month === 6 || month === 9;
        const safety_rating = isMonsoon ? "High Risk" : isShoulder ? "Moderate" : "Safe";
        const rainfall_mm = isMonsoon ? d.rainPeak : isShoulder ? Math.round(d.rainPeak * 0.45) : d.rainBase;
        const soil_stability_index = isMonsoon ? d.soilLow : isShoulder ? Math.round((d.soilBase + d.soilLow) / 2) : d.soilBase;
        const historical_landslides_count = isMonsoon ? 12 : isShoulder ? 3 : 0;

        matrixData.push({
          state: d.state,
          district: d.district,
          year: 2026,
          month,
          safety_rating,
          rainfall_mm,
          soil_stability_index,
          historical_landslides_count,
        });
      }
    }
    const { error: matErr } = await supabase.from("monthly_safe_matrix").upsert(matrixData, { onConflict: "state,district,year,month" });
    if (matErr) throw new Error(`Monthly Matrix seed error: ${matErr.message}`);
    console.log(`✅ Monthly Safe Matrix seeded (${matrixData.length} records)`);

    // 4. Seed Farms (24 Farms in Northern Hilly Areas between Host 1 and Host 2)
    console.log("\n[4/11] Seeding Farms (24 Northern Hilly Farmstays)...");
    const farmsData = [
      // HOST 1 (Rohit Bisht) - Uttarakhand & Himachal Farms (IDs 1-12)
      {
        id: 1,
        slug: "apple-blossom-retreat",
        host_id: 1,
        title: "Apple Blossom Retreat",
        description: "A working apple and apricot orchard on the Kumaon ridge. Guests join seasonal pruning, grafting, and harvest with panoramic views of the Nanda Devi range.",
        state: "Uttarakhand",
        district: "Nainital",
        subdistrict: "Ramgarh",
        category: "Himalayan Orchard",
        latitude: 29.426,
        longitude: 79.552,
        uses_fallback_coords: false,
        nightly_rate: 4500.0,
        images: ["https://picsum.photos/seed/apple-orchard-1/900/600", "https://picsum.photos/seed/apple-detail-1/600/600"],
        amenities: ["Organic Apple Orchard", "Wi-Fi", "Safety Monitoring", "Kumaoni Meals", "Guided Walks", "Escrow Protection"],
        cancellation_policy: "Full refund 48 hours prior to check-in. Safety-related cancellations are always 100% refunded.",
        emergency_contact: "Caretaker Anand: +91 98765 11001. Nearest medical center 8km in Bhowali.",
        regional_guidelines: "Follow marked orchard trails. Respect harvest schedule during peak season.",
      },
      {
        id: 2,
        slug: "oak-terrace-organic-farm",
        host_id: 1,
        title: "Oak Terrace Organic Farm",
        description: "Stone cottages set amidst terraced organic mustard and barley fields. High-altitude mountain views with morning farm milking and solar-powered amenities.",
        state: "Uttarakhand",
        district: "Nainital",
        subdistrict: "Mukteshwar",
        category: "Organic Farm",
        latitude: 29.472,
        longitude: 79.647,
        uses_fallback_coords: false,
        nightly_rate: 4200.0,
        images: ["https://picsum.photos/seed/oak-terrace-2/900/600", "https://picsum.photos/seed/oak-detail-2/600/600"],
        amenities: ["Milking Experience", "Wi-Fi", "Safety Monitoring", "Solar Powered", "Guided Treks", "Escrow Protection"],
        cancellation_policy: "Full refund 48 hours prior to check-in. Disaster alerts guarantee 100% immediate refund.",
        emergency_contact: "Host Rohit: +91 98765 43210. Primary clinic 4km in Mukteshwar.",
        regional_guidelines: "Keep cottage doors latched at night. Mountain weather cools quickly in evenings.",
      },
      {
        id: 3,
        slug: "bhimtal-valley-herb-farm",
        host_id: 1,
        title: "Bhimtal Valley Herb Farm",
        description: "Medicinal herb cultivation and lemon groves beside freshwater runoff canals. Hands-on chamomile tea harvesting and valley relaxation.",
        state: "Uttarakhand",
        district: "Nainital",
        subdistrict: "Bhimtal",
        category: "Permaculture Retreat",
        latitude: 29.351,
        longitude: 79.554,
        uses_fallback_coords: false,
        nightly_rate: 3800.0,
        images: ["https://picsum.photos/seed/herb-farm-3/900/600"],
        amenities: ["Herb Processing", "Wi-Fi", "Safety Monitoring", "Farm-to-Table Meals", "Escrow Protection"],
        cancellation_policy: "Standard 48hr cancellation with full escrow protection.",
        emergency_contact: "Caretaker Prem: +91 98765 11002.",
        regional_guidelines: "Harvest herbs only with guided supervision.",
      },
      {
        id: 4,
        slug: "joshimath-high-ridge-stay",
        host_id: 1,
        title: "Joshimath High Ridge Stay",
        description: "Upper Alaknanda terraced potato and walnut farmstead. Overlooks the gateway to Nanda Devi National Park with integrated slope telemetry.",
        state: "Uttarakhand",
        district: "Chamoli",
        subdistrict: "Joshimath",
        category: "Organic Farm",
        latitude: 30.556,
        longitude: 79.563,
        uses_fallback_coords: false,
        nightly_rate: 3600.0,
        images: ["https://picsum.photos/seed/joshimath-ridge-4/900/600"],
        amenities: ["Walnut Picking", "Safety Monitoring & Sensors", "Traditional Garhwali Meals", "Escrow Protection"],
        cancellation_policy: "100% automated refund guarantee upon slope stability warnings.",
        emergency_contact: "Host Rohit: +91 98765 43210. Community Health Center Joshimath 3km.",
        regional_guidelines: "Adhere to BRO road advisory broadcasts during monsoon months.",
      },
      {
        id: 5,
        slug: "gopeshwar-pine-valley-homestead",
        host_id: 1,
        title: "Gopeshwar Pine Valley Homestead",
        description: "Nestled amidst thick pine and deodar forests, producing organic red rice, hill beans, and wild rhododendron juice.",
        state: "Uttarakhand",
        district: "Chamoli",
        subdistrict: "Gopeshwar",
        category: "Organic Farm",
        latitude: 30.418,
        longitude: 79.333,
        uses_fallback_coords: false,
        nightly_rate: 3200.0,
        images: ["https://picsum.photos/seed/gopeshwar-farm-5/900/600"],
        amenities: ["Organic Farming", "Wi-Fi", "Safety Sensors", "Local Cuisine", "Escrow Protection"],
        cancellation_policy: "Full 48hr flexible cancellation policy.",
        emergency_contact: "Caretaker Mohan: +91 98765 11003.",
        regional_guidelines: "No plastic disposal on terrace perimeters.",
      },
      {
        id: 6,
        slug: "alaknanda-confluence-farm",
        host_id: 1,
        title: "Alaknanda Confluence Farm",
        description: "Riverside citrus and ginger terraces near Karnaprayag confluence. Peaceful riverfront walks and river-cooled cottages.",
        state: "Uttarakhand",
        district: "Chamoli",
        subdistrict: "Karnaprayag",
        category: "Organic Farm",
        latitude: 30.261,
        longitude: 79.219,
        uses_fallback_coords: false,
        nightly_rate: 3400.0,
        images: ["https://picsum.photos/seed/confluence-farm-6/900/600"],
        amenities: ["Citrus Harvesting", "Wi-Fi", "Safety Monitoring", "River Trail", "Escrow Protection"],
        cancellation_policy: "100% refund guarantee under flood/rain alerts.",
        emergency_contact: "Host Rohit: +91 98765 43210.",
        regional_guidelines: "Do not venture into river current without safety vest.",
      },
      {
        id: 7,
        slug: "ranikhet-cedar-estate",
        host_id: 1,
        title: "Ranikhet Cedar Estate",
        description: "Historic cedar-flanked plum and peach orchard. Guests experience traditional pit-composting, bee-keeping, and mountain sunset teas.",
        state: "Uttarakhand",
        district: "Almora",
        subdistrict: "Ranikhet",
        category: "Himalayan Orchard",
        latitude: 29.643,
        longitude: 79.432,
        uses_fallback_coords: false,
        nightly_rate: 4800.0,
        images: ["https://picsum.photos/seed/ranikhet-estate-7/900/600"],
        amenities: ["Apiary / Beekeeping", "Wi-Fi", "Safety Monitoring", "Organic Kitchen", "Escrow Protection"],
        cancellation_policy: "48-hour free cancellation.",
        emergency_contact: "Caretaker Diwan: +91 98765 11004.",
        regional_guidelines: "Do not disturb apiary boxes without keeper suit.",
      },
      {
        id: 8,
        slug: "kausani-tea-terrace-retreat",
        host_id: 1,
        title: "Kausani Tea Terrace Retreat",
        description: "Miniature organic tea estate with unobstructed 300km Himalayan panoramas. Learn artisan hand-rolling of high-altitude green tea.",
        state: "Uttarakhand",
        district: "Almora",
        subdistrict: "Kausani",
        category: "Tea & Cardamom",
        latitude: 29.854,
        longitude: 79.597,
        uses_fallback_coords: false,
        nightly_rate: 5100.0,
        images: ["https://picsum.photos/seed/kausani-tea-8/900/600"],
        amenities: ["Tea Tasting", "Wi-Fi", "Safety Monitoring", "Himalayan Views", "Escrow Protection"],
        cancellation_policy: "Full refund 48 hours prior to check-in.",
        emergency_contact: "Host Rohit: +91 98765 43210.",
        regional_guidelines: "Morning plucking sessions begin at 7:00 AM.",
      },
      {
        id: 9,
        slug: "parashar-lake-dairy-farmstay",
        host_id: 1,
        title: "Parashar Lake Dairy Farmstay",
        description: "High-altitude pasture farm below the sacred Parashar ridge. Pure indigenous cow dairy farming, artisanal butter churning, and cedar log cabins.",
        state: "Himachal Pradesh",
        district: "Mandi",
        subdistrict: "Parashar",
        category: "Permaculture Retreat",
        latitude: 31.754,
        longitude: 77.101,
        uses_fallback_coords: false,
        nightly_rate: 4600.0,
        images: ["https://picsum.photos/seed/parashar-dairy-9/900/600"],
        amenities: ["Dairy & Churning", "Wi-Fi", "Safety Sensors", "Wood-fired Stove", "Escrow Protection"],
        cancellation_policy: "Weather-safe 100% immediate escrow refund.",
        emergency_contact: "Caretaker Hemraj: +91 98765 11005.",
        regional_guidelines: "Road approach passes high incline — check weather alerts before departure.",
      },
      {
        id: 10,
        slug: "kamand-valley-eco-ranch",
        host_id: 1,
        title: "Kamand Valley Eco Ranch",
        description: "Valley permaculture ranch near Uhl river tributaries. Hydro-cooled vegetable polyhouses and trout-pond sustainable aquaculture.",
        state: "Himachal Pradesh",
        district: "Mandi",
        subdistrict: "Kamand",
        category: "Permaculture Retreat",
        latitude: 31.781,
        longitude: 76.992,
        uses_fallback_coords: false,
        nightly_rate: 3900.0,
        images: ["https://picsum.photos/seed/kamand-ranch-10/900/600"],
        amenities: ["Polyhouse Farming", "Wi-Fi", "IIT Telemetry Station", "Organic Meals", "Escrow Protection"],
        cancellation_policy: "Full 48hr flexible escrow protection.",
        emergency_contact: "Host Rohit: +91 98765 43210.",
        regional_guidelines: "Wear rubber boots in polyhouse irrigation beds.",
      },
      {
        id: 11,
        slug: "barot-trout-and-herb-orchard",
        host_id: 1,
        title: "Barot Trout & Herb Orchard",
        description: "Lush valley farm with fresh water streamlets, kiwi vines, and terraced red kidney beans.",
        state: "Himachal Pradesh",
        district: "Mandi",
        subdistrict: "Barot",
        category: "Organic Farm",
        latitude: 32.036,
        longitude: 76.844,
        uses_fallback_coords: false,
        nightly_rate: 3700.0,
        images: ["https://picsum.photos/seed/barot-farm-11/900/600"],
        amenities: ["Kiwi Orchard", "Wi-Fi", "Safety Monitoring", "Stream Trail", "Escrow Protection"],
        cancellation_policy: "Full refund up to 48 hours before check-in.",
        emergency_contact: "Caretaker Rakesh: +91 98765 11006.",
        regional_guidelines: "Check Uhl valley road clearance after heavy showers.",
      },
      {
        id: 12,
        slug: "kanatal-pine-permaculture",
        host_id: 1,
        title: "Kanatal Pine Permaculture",
        description: "Fog-kissed terraced farm cultivating rare Himalayan herbs and heirloom buckwheat at 8,500 feet altitude.",
        state: "Uttarakhand",
        district: "Tehri Garhwal",
        subdistrict: "Kanatal",
        category: "Permaculture Retreat",
        latitude: 30.416,
        longitude: 78.337,
        uses_fallback_coords: false,
        nightly_rate: 4400.0,
        images: ["https://picsum.photos/seed/kanatal-farm-12/900/600"],
        amenities: ["Heirloom Grain Harvest", "Wi-Fi", "Safety Monitoring", "Bonfire Dinners", "Escrow Protection"],
        cancellation_policy: "100% refund guarantee upon adverse road notifications.",
        emergency_contact: "Host Rohit: +91 98765 43210.",
        regional_guidelines: "High wind gusts possible in autumn.",
      },

      // HOST 2 (Vikram Singh) - Himachal & Uttarakhand Farms (IDs 13-24)
      {
        id: 13,
        slug: "naggar-heritage-apple-estate",
        host_id: 2,
        title: "Naggar Heritage Apple Estate",
        description: "Century-old Kathkuni architectural estate surrounded by Royal Delicious apple trees overlooking the snowcapped Beas Valley.",
        state: "Himachal Pradesh",
        district: "Kullu",
        subdistrict: "Naggar",
        category: "Himalayan Orchard",
        latitude: 32.138,
        longitude: 77.172,
        uses_fallback_coords: false,
        nightly_rate: 5500.0,
        images: ["https://picsum.photos/seed/naggar-estate-13/900/600"],
        amenities: ["Heritage Kathkuni Stay", "Wi-Fi", "Safety Monitoring", "Himachali Dham", "Escrow Protection"],
        cancellation_policy: "48-hour flexible cancellation.",
        emergency_contact: "Host Vikram: +91 98765 43211. Manali hospital 18km.",
        regional_guidelines: "Wood carvings are heritage artefacts — please do not lean items against them.",
      },
      {
        id: 14,
        slug: "jibhi-riverstone-cottages",
        host_id: 2,
        title: "Jibhi Riverstone Cottages",
        description: "Cedar wood river cottages with an organic trout pool, walnut drying courtyards, and direct forest trail access to Jalori Pass.",
        state: "Himachal Pradesh",
        district: "Kullu",
        subdistrict: "Jibhi",
        category: "Organic Farm",
        latitude: 31.637,
        longitude: 77.348,
        uses_fallback_coords: false,
        nightly_rate: 4900.0,
        images: ["https://picsum.photos/seed/jibhi-cottages-14/900/600"],
        amenities: ["Walnut Processing", "Wi-Fi", "Safety Monitoring", "River Lounge", "Escrow Protection"],
        cancellation_policy: "100% refund on Jalori Pass weather warning closures.",
        emergency_contact: "Host Vikram: +91 98765 43211.",
        regional_guidelines: "Check Jalori pass road conditions during rains.",
      },
      {
        id: 15,
        slug: "old-manali-permaculture-sanctuary",
        host_id: 2,
        title: "Old Manali Permaculture Sanctuary",
        description: "Chemical-free permaculture sanctuary cultivating ancient amaranth, cannabis-hemp fiber, and heritage pear varieties.",
        state: "Himachal Pradesh",
        district: "Kullu",
        subdistrict: "Manali",
        category: "Permaculture Retreat",
        latitude: 32.243,
        longitude: 77.189,
        uses_fallback_coords: false,
        nightly_rate: 4700.0,
        images: ["https://picsum.photos/seed/old-manali-15/900/600"],
        amenities: ["Permaculture Workshop", "Wi-Fi", "Safety Monitoring", "Vegan Farm Meals", "Escrow Protection"],
        cancellation_policy: "48-hour free cancellation.",
        emergency_contact: "Caretaker Lalit: +91 98765 11007.",
        regional_guidelines: "Strictly organic zero-waste property.",
      },
      {
        id: 16,
        slug: "mashobra-wildflower-orchard",
        host_id: 2,
        title: "Mashobra Wildflower Orchard",
        description: "High-ridge cherry and plum orchard bordered by Craignano oak forests. Morning bird-watching walks and apple cider press workshops.",
        state: "Himachal Pradesh",
        district: "Shimla",
        subdistrict: "Mashobra",
        category: "Himalayan Orchard",
        latitude: 31.127,
        longitude: 77.234,
        uses_fallback_coords: false,
        nightly_rate: 5200.0,
        images: ["https://picsum.photos/seed/mashobra-orchard-16/900/600"],
        amenities: ["Cider Pressing", "Wi-Fi", "Safety Monitoring", "Forest Walks", "Escrow Protection"],
        cancellation_policy: "48-hour flexible refund.",
        emergency_contact: "Host Vikram: +91 98765 43211.",
        regional_guidelines: "Forest edge is a reserve sanctuary — keep fires strictly in designated pits.",
      },
      {
        id: 17,
        slug: "narkanda-cherry-peak-homestead",
        host_id: 2,
        title: "Narkanda Cherry Peak Homestead",
        description: "Situated at 9,000 feet, specializing in dark sweet cherries and golden apples with sweeping views of the Hatu Peak range.",
        state: "Himachal Pradesh",
        district: "Shimla",
        subdistrict: "Narkanda",
        category: "Himalayan Orchard",
        latitude: 31.258,
        longitude: 77.458,
        uses_fallback_coords: false,
        nightly_rate: 4300.0,
        images: ["https://picsum.photos/seed/narkanda-cherry-17/900/600"],
        amenities: ["Cherry Picking", "Wi-Fi", "Safety Sensors", "Hatu Peak Treks", "Escrow Protection"],
        cancellation_policy: "100% refund safeguard under fog/frost alerts.",
        emergency_contact: "Caretaker Jagdish: +91 98765 11008.",
        regional_guidelines: "Dress warmly; night temperatures remain crisp year-round.",
      },
      {
        id: 18,
        slug: "kotgarh-apple-cradle-farm",
        host_id: 2,
        title: "Kotgarh Apple Cradle Farm",
        description: "The historical birthplace of Himalayan apples in India. Experience authentic colonial-era apple cellars, honey harvest, and orchard walks.",
        state: "Himachal Pradesh",
        district: "Shimla",
        subdistrict: "Kotgarh",
        category: "Himalayan Orchard",
        latitude: 31.317,
        longitude: 77.489,
        uses_fallback_coords: false,
        nightly_rate: 4600.0,
        images: ["https://picsum.photos/seed/kotgarh-cradle-18/900/600"],
        amenities: ["Heritage Apple Cellar", "Wi-Fi", "Safety Monitoring", "Farm Tours", "Escrow Protection"],
        cancellation_policy: "48-hour standard cancellation.",
        emergency_contact: "Host Vikram: +91 98765 43211.",
        regional_guidelines: "Historic cellars are underground — watch footing on stone steps.",
      },
      {
        id: 19,
        slug: "sangla-valley-saffron-and-almond-estate",
        host_id: 2,
        title: "Sangla Valley Saffron & Almond Estate",
        description: "Baspa river terrace farm cultivating Kinnauri red apples, sweet almonds, and wild mountain saffron under the Kinner Kailash massif.",
        state: "Himachal Pradesh",
        district: "Kinnaur",
        subdistrict: "Sangla",
        category: "Organic Farm",
        latitude: 31.423,
        longitude: 78.261,
        uses_fallback_coords: false,
        nightly_rate: 5800.0,
        images: ["https://picsum.photos/seed/sangla-almond-19/900/600"],
        amenities: ["Almond Shelling", "Wi-Fi", "Safety Monitoring & Radar", "Wood Fire Stoves", "Escrow Protection"],
        cancellation_policy: "100% automated refund on mountain corridor road alerts.",
        emergency_contact: "Caretaker Tenzin: +91 98765 11009.",
        regional_guidelines: "Check Hindustan-Tibet road status via AgroSafe warning system.",
      },
      {
        id: 20,
        slug: "kalpa-pinnacle-orchards",
        host_id: 2,
        title: "Kalpa Pinnacle Orchards",
        description: "Perched over the deep Sutlej gorge facing the direct sunrise onto Jorkanden peak. Specializes in prized golden Kinnaur apples and sun-dried apricots.",
        state: "Himachal Pradesh",
        district: "Kinnaur",
        subdistrict: "Kalpa",
        category: "Himalayan Orchard",
        latitude: 31.538,
        longitude: 78.256,
        uses_fallback_coords: false,
        nightly_rate: 5300.0,
        images: ["https://picsum.photos/seed/kalpa-orchard-20/900/600"],
        amenities: ["Apricot Drying", "Wi-Fi", "Safety Monitoring", "Sunrise Deck", "Escrow Protection"],
        cancellation_policy: "100% refund guarantee on regional landslide alerts.",
        emergency_contact: "Host Vikram: +91 98765 43211.",
        regional_guidelines: "High altitude (9,700 ft) — drink plenty of water upon arrival.",
      },
      {
        id: 21,
        slug: "bir-tea-and-organic-terrace",
        host_id: 2,
        title: "Bir Tea & Organic Terrace",
        description: "Certified organic orthodox tea gardens beneath the paragliding landing meadows. Fresh strawberry patches, artisan baking, and mountain sunsets.",
        state: "Himachal Pradesh",
        district: "Kangra",
        subdistrict: "Bir",
        category: "Tea & Cardamom",
        latitude: 32.046,
        longitude: 76.721,
        uses_fallback_coords: false,
        nightly_rate: 4100.0,
        images: ["https://picsum.photos/seed/bir-tea-21/900/600"],
        amenities: ["Tea Tasting", "Wi-Fi", "Safety Monitoring", "Organic Bakery", "Escrow Protection"],
        cancellation_policy: "48-hour free cancellation.",
        emergency_contact: "Caretaker Sunil: +91 98765 11010.",
        regional_guidelines: "Respect tea bush rows during photography.",
      },
      {
        id: 22,
        slug: "dharamkot-cedar-permaculture",
        host_id: 2,
        title: "Dharamkot Cedar Permaculture",
        description: "Dhauladhar mountain base farm cultivating organic microgreens, sourdough grain, and wild mint with meditation spots in cedar woods.",
        state: "Himachal Pradesh",
        district: "Kangra",
        subdistrict: "Dharamkot",
        category: "Permaculture Retreat",
        latitude: 32.248,
        longitude: 76.326,
        uses_fallback_coords: false,
        nightly_rate: 3800.0,
        images: ["https://picsum.photos/seed/dharamkot-farm-22/900/600"],
        amenities: ["Microgreens Harvesting", "Wi-Fi", "Safety Monitoring", "Yoga Space", "Escrow Protection"],
        cancellation_policy: "48-hour flexible escrow protection.",
        emergency_contact: "Host Vikram: +91 98765 43211.",
        regional_guidelines: "Eco-sanctuary — no loud audio after 9 PM.",
      },
      {
        id: 23,
        slug: "chail-apple-and-rose-orchard",
        host_id: 2,
        title: "Chail Apple & Rose Orchard",
        description: "Secluded terrace gardens producing Damask rose water, crisp Golden Delicious apples, and wild forest honey in Solan hills.",
        state: "Himachal Pradesh",
        district: "Solan",
        subdistrict: "Chail",
        category: "Floral Fields",
        latitude: 30.969,
        longitude: 77.194,
        uses_fallback_coords: false,
        nightly_rate: 4500.0,
        images: ["https://picsum.photos/seed/chail-orchard-23/900/600"],
        amenities: ["Rose Distillation", "Wi-Fi", "Safety Monitoring", "Outdoor Dinners", "Escrow Protection"],
        cancellation_policy: "48-hour free cancellation.",
        emergency_contact: "Caretaker Ramesh: +91 98765 11011.",
        regional_guidelines: "Rose distillation runs early morning at 6:30 AM.",
      },
      {
        id: 24,
        slug: "harsil-valley-apple-ranch",
        host_id: 2,
        title: "Harsil Valley Apple Ranch",
        description: "Bhagirathi river tributary farmstead renowned for Wilson apple varieties, dried beans, and cedar log cabins below Gangotri peaks.",
        state: "Uttarakhand",
        district: "Uttarkashi",
        subdistrict: "Harsil",
        category: "Himalayan Orchard",
        latitude: 31.034,
        longitude: 78.738,
        uses_fallback_coords: false,
        nightly_rate: 5600.0,
        images: ["https://picsum.photos/seed/harsil-apple-24/900/600"],
        amenities: ["Wilson Apple Tour", "Wi-Fi", "Safety Sensors", "River Campfire", "Escrow Protection"],
        cancellation_policy: "100% automated refund on highway weather alerts.",
        emergency_contact: "Host Vikram: +91 98765 43211.",
        regional_guidelines: "Check Uttarkashi-Harsil highway status via AgroSafe console before driving.",
      },
    ];

    const { error: farmErr } = await supabase.from("farms").upsert(farmsData, { onConflict: "id" });
    if (farmErr) throw new Error(`Farms seed error: ${farmErr.message}`);
    console.log(`✅ Farms seeded (${farmsData.length} Northern Hilly farmstays across 2 Hosts)`);

    // 5. Seed Bookings
    console.log("\n[5/11] Seeding Bookings...");
    const bookingsData = [
      { id: 1, booking_code: "AGS-48213", guest_id: 3, farm_id: 1, stay_start_date: "2026-09-15", stay_end_date: "2026-09-18", total_guests: 2, current_status: "Confirmed" },
      { id: 2, booking_code: "AGS-47990", guest_id: 4, farm_id: 13, stay_start_date: "2026-06-02", stay_end_date: "2026-06-05", total_guests: 2, current_status: "Completed" },
      { id: 3, booking_code: "AGS-47612", guest_id: 3, farm_id: 4, stay_start_date: "2026-08-10", stay_end_date: "2026-08-13", total_guests: 2, current_status: "Cancelled" },
      { id: 4, booking_code: "AGS-49102", guest_id: 4, farm_id: 19, stay_start_date: "2026-10-04", stay_end_date: "2026-10-07", total_guests: 3, current_status: "Confirmed" },
    ];
    const { error: bookErr } = await supabase.from("bookings").upsert(bookingsData, { onConflict: "id" });
    if (bookErr) throw new Error(`Bookings seed error: ${bookErr.message}`);
    console.log("✅ Bookings seeded (4 records)");

    // 6. Seed Landslide Reports
    console.log("\n[6/11] Seeding Landslide Reports...");
    const reportsData = [
      { id: 1, report_code: "UK-LS-0451", uploaded_by_user_id: 3, image_s3_url: "https://picsum.photos/seed/landslide-joshimath/800/600", latitude: 30.556, longitude: 79.563, location_name: "NH-7 near Joshimath, Chamoli", details: "Mudflow debris on NH-7 approach slope", report_time: "2026-08-07T12:35:00.000Z", cnn_confidence_score: 0.88, processing_status: "Processed", severity: "High" },
      { id: 2, report_code: "HP-LS-0077", uploaded_by_user_id: 4, image_s3_url: "https://picsum.photos/seed/landslide-kinnaur/800/600", latitude: 31.423, longitude: 78.261, location_name: "Sangla Valley Approach Road, Kinnaur", details: "Minor loose gravel and rockfall near stream crossing", report_time: "2026-08-04T08:50:00.000Z", cnn_confidence_score: 0.72, processing_status: "Processed", severity: "Medium" },
      { id: 3, report_code: "HP-LS-0105", uploaded_by_user_id: 3, image_s3_url: "https://picsum.photos/seed/landslide-mandi/800/600", latitude: 31.754, longitude: 77.101, location_name: "Parashar Ridge Incline Road, Mandi", details: "Heavy rainfall mud saturation on hairpin turn", report_time: "2026-08-06T09:15:00.000Z", cnn_confidence_score: 0.91, processing_status: "Processed", severity: "High" },
    ];
    const { error: repErr } = await supabase.from("landslide_reports").upsert(reportsData, { onConflict: "id" });
    if (repErr) throw new Error(`Landslide Reports seed error: ${repErr.message}`);
    console.log("✅ Landslide Reports seeded (3 records)");

    // 7. Seed Warnings (Active & Historical for Northern Hilly Farms)
    console.log("\n[7/11] Seeding Warnings...");
    const warningsData = [
      { id: 1, warning_code: "WRN-2026-UK09", warning_source: "Automated_CNN", report_id: 1, farm_id: 4, host_id: null, title: "NH-7 Joshimath Sector Debris Flow", description: "Automated verification identified mudslide debris across Chamoli valley approach road. Precautionary travel advisory dispatched.", severity: "High", epicenter_lat: 30.556, epicenter_lng: 79.563, impact_radius_km: 15.0, issued_at: "2026-08-07T12:40:00.000Z", expires_at: "2026-08-14T12:40:00.000Z", status: "Active" },
      { id: 2, warning_code: "WRN-2026-HP03", warning_source: "Manual_Host", report_id: 3, farm_id: 9, host_id: 1, title: "Heavy Downpour Incline Saturation Advisory", description: "Host manual warning issued for Parashar hill slope due to continuous rain. Escrow 100% refund safeguard activated.", severity: "High", epicenter_lat: 31.754, epicenter_lng: 77.101, impact_radius_km: 10.0, issued_at: "2026-08-06T09:30:00.000Z", expires_at: "2026-08-12T09:30:00.000Z", status: "Active" },
      { id: 3, warning_code: "WRN-2026-HP02", warning_source: "Automated_CNN", report_id: 2, farm_id: 19, host_id: null, title: "Loose Gravel on Sangla Gateway Road", description: "Debris cleared by mountain highway maintenance teams. Route normalized for farmstay guests.", severity: "Low", epicenter_lat: 31.423, epicenter_lng: 78.261, impact_radius_km: 8.0, issued_at: "2026-08-04T08:55:00.000Z", expires_at: "2026-08-06T08:55:00.000Z", status: "Expired" },
    ];
    const { error: warnErr } = await supabase.from("warnings").upsert(warningsData, { onConflict: "id" });
    if (warnErr) throw new Error(`Warnings seed error: ${warnErr.message}`);
    console.log("✅ Warnings seeded (3 records)");

    // 8. Seed Payments
    console.log("\n[8/11] Seeding Payments & Escrow Ledger...");
    const paymentsData = [
      { id: 1, payment_code: "PAY-88213", booking_id: 1, stay_amount: 13500.0, platform_fee: 450.0, total_charged: 13950.0, escrow_status: "Held_In_Escrow", gateway_ref: "rzp_live_984128941" },
      { id: 2, payment_code: "PAY-87990", booking_id: 2, stay_amount: 16500.0, platform_fee: 450.0, total_charged: 16950.0, escrow_status: "Released_To_Host", gateway_ref: "rzp_live_871239011" },
      { id: 3, payment_code: "PAY-87612", booking_id: 3, stay_amount: 10800.0, platform_fee: 450.0, total_charged: 11250.0, escrow_status: "Refunded_To_Guest", gateway_ref: "rzp_live_761298412" },
      { id: 4, payment_code: "PAY-89102", booking_id: 4, stay_amount: 17400.0, platform_fee: 450.0, total_charged: 17850.0, escrow_status: "Held_In_Escrow", gateway_ref: "rzp_live_891023441" },
    ];
    const { error: payErr } = await supabase.from("payments").upsert(paymentsData, { onConflict: "id" });
    if (payErr) throw new Error(`Payments seed error: ${payErr.message}`);
    console.log("✅ Payments seeded (4 records)");

    // 9. Seed Payment Transaction Logs
    console.log("\n[9/11] Seeding Payment Transaction Logs...");
    const txData = [
      { id: 1, payment_id: 1, transaction_type: "Charge", payment_gateway_ref: "rzp_live_984128941", amount: 13950.0, note: "Initial booking charge captured and locked in AgroSafe Escrow Vault.", processed_at: "2026-08-02T08:52:00.000Z" },
      { id: 2, payment_id: 2, transaction_type: "Charge", payment_gateway_ref: "rzp_live_871239011", amount: 16950.0, note: "Pre-stay booking hold in escrow vault.", processed_at: "2026-05-18T05:45:00.000Z" },
      { id: 3, payment_id: 2, transaction_type: "Payout", payment_gateway_ref: "payout_bank_991823", amount: 16500.0, note: "Stay completed safely. Escrow payout disbursed to Vikram Singh.", processed_at: "2026-06-06T04:00:00.000Z" },
      { id: 4, payment_id: 3, transaction_type: "Charge", payment_gateway_ref: "rzp_live_761298412", amount: 11250.0, note: "Pre-stay escrow booking hold.", processed_at: "2026-08-01T11:10:00.000Z" },
      { id: 5, payment_id: 3, transaction_type: "Refund", payment_gateway_ref: "rfnd_rzp_761298412_01", amount: 11250.0, note: "100% Emergency Escrow Refund triggered via Joshimath Landslide Warning.", processed_at: "2026-08-07T12:45:00.000Z" },
      { id: 6, payment_id: 4, transaction_type: "Charge", payment_gateway_ref: "rzp_live_891023441", amount: 17850.0, note: "Pre-stay hold locked in escrow for upcoming autumn stay.", processed_at: "2026-08-10T14:30:00.000Z" },
    ];
    const { error: txErr } = await supabase.from("payment_transaction_log").upsert(txData, { onConflict: "id" });
    if (txErr) throw new Error(`Payment Transaction Logs seed error: ${txErr.message}`);
    console.log("✅ Payment Transaction Logs seeded (6 records)");

    // 10. Seed Booking Status Logs
    console.log("\n[10/11] Seeding Booking Status Logs...");
    const bStatusData = [
      { id: 1, booking_id: 1, previous_status: "Pending", new_status: "Confirmed", reason: "Escrow payment authorized", changed_at: "2026-08-02T08:52:00.000Z" },
      { id: 2, booking_id: 2, previous_status: "Confirmed", new_status: "Completed", reason: "Guest checkout completed with verified host feedback", changed_at: "2026-06-05T05:30:00.000Z" },
      { id: 3, booking_id: 3, previous_status: "Confirmed", new_status: "Cancelled", reason: "Active hazard warning in Joshimath sector — automatic 100% guest refund processed", changed_at: "2026-08-07T12:45:00.000Z" },
      { id: 4, booking_id: 4, previous_status: "Pending", new_status: "Confirmed", reason: "Escrow payment captured", changed_at: "2026-08-10T14:30:00.000Z" },
    ];
    const { error: bStatErr } = await supabase.from("booking_status_log").upsert(bStatusData, { onConflict: "id" });
    if (bStatErr) throw new Error(`Booking Status Logs seed error: ${bStatErr.message}`);
    console.log("✅ Booking Status Logs seeded (4 records)");

    // 11. Seed Notification Logs
    console.log("\n[11/11] Seeding Notification Logs...");
    const notifData = [
      { id: 1, user_id: 3, warning_id: 1, related_booking_id: 3, notification_type: "Push", title: "⚠️ Hazard Alert: Joshimath Sector", message_content: "A verified mudslide debris flow was reported near Joshimath. Your booking ref AGS-47612 has been refunded under 100% Escrow Protection.", is_read: false, severity: "warning", dispatched_at: "2026-08-07T12:45:00.000Z" },
      { id: 2, user_id: 1, warning_id: 2, related_booking_id: null, notification_type: "SMS", title: "Manual Warning Broadcast Active", message_content: "Your manual safety alert for Parashar hill slope has been broadcast across the regional safety network.", is_read: true, severity: "info", dispatched_at: "2026-08-06T09:35:00.000Z" },
      { id: 3, user_id: 2, warning_id: null, related_booking_id: 2, notification_type: "Push", title: "Escrow Payout Credited: ₹16,500", message_content: "Pooja Sharma's checkout at Naggar Heritage Apple Estate was completed. Funds released to your bank account.", is_read: true, severity: "info", dispatched_at: "2026-06-06T04:05:00.000Z" },
      { id: 4, user_id: 4, warning_id: null, related_booking_id: 4, notification_type: "Email", title: "Booking Confirmation & Escrow Hold", message_content: "Your reservation AGS-49102 at Sangla Valley Saffron & Almond Estate is confirmed and secured in escrow.", is_read: false, severity: "info", dispatched_at: "2026-08-10T14:32:00.000Z" },
    ];
    const { error: notifErr } = await supabase.from("notification_log").upsert(notifData, { onConflict: "id" });
    if (notifErr) throw new Error(`Notification Logs seed error: ${notifErr.message}`);
    console.log("✅ Notification Logs seeded (4 records)");

    console.log("\n==================================================");
    console.log("🎉 ALL NORTHERN HILLY SEED DATA SUCCESSFULLY SYNCED TO SUPABASE!");
    console.log("==================================================");
    console.log("👥 Seeded Accounts (Password: password123):");
    console.log("  • Host 1: rohit.bisht@example.com (12 Uttarakhand & HP Farms)");
    console.log("  • Host 2: vikram.singh@example.com (12 Himachal & Uttarakhand Farms)");
    console.log("  • Guest 1: arjun.verma@example.com (Active / Refunded Bookings)");
    console.log("  • Guest 2: pooja.sharma@example.com (Confirmed / Completed Bookings)");
    console.log("==================================================");
  } catch (err: any) {
    console.error("\n❌ SEEDING FAILED:", err.message);
    process.exit(1);
  }
}

runSeed();
