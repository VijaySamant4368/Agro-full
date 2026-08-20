import { supabase, isLiveSupabaseConfigured } from "../config/supabase.js";
import { ENV } from "../config/env.js";

async function runSeed() {
  console.log("==================================================");
  console.log("🌱 AGROSAFE TRAVEL — SUPABASE SEED SCRIPT");
  console.log("==================================================");
  console.log(`DB Mode: ${ENV.DB_MODE}`);
  console.log(`Live Supabase Configured: ${isLiveSupabaseConfigured()}`);

  if (!isLiveSupabaseConfigured()) {
    console.error("❌ Live Supabase credentials not found or set to mock. Please check your credentials.");
    process.exit(1);
  }

  try {
    // 1. Seed Users
    console.log("\n[1/11] Seeding Users...");
    const usersData = [
      { id: 1, user_type: "host", first_name: "Rohit", last_name: "Bisht", email: "rohit.bisht@example.com", password_hash: "$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02", phone_number: "+91 98765 43210", is_verified: true },
      { id: 2, user_type: "host", first_name: "Anna", last_name: "Mathew", email: "anna.mathew@example.com", password_hash: "$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02", phone_number: "+91 98765 43211", is_verified: true },
      { id: 3, user_type: "host", first_name: "Vikram", last_name: "Singh", email: "vikram.singh@example.com", password_hash: "$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02", phone_number: "+91 98765 43212", is_verified: true },
      { id: 4, user_type: "host", first_name: "Tage", last_name: "Yampi", email: "tage.yampi@example.com", password_hash: "$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02", phone_number: "+91 98765 43213", is_verified: true },
      { id: 5, user_type: "host", first_name: "John", last_name: "Doe", email: "john.doe@example.com", password_hash: "$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02", phone_number: "+91 98765 43214", is_verified: true },
      { id: 6, user_type: "host", first_name: "Meera", last_name: "Nair", email: "meera.nair@example.com", password_hash: "$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02", phone_number: "+91 98765 43215", is_verified: true },
      { id: 7, user_type: "guest", first_name: "Arjun", last_name: "Verma", email: "arjun.verma@example.com", password_hash: "$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02", phone_number: "+91 98765 43220", is_verified: true },
      { id: 8, user_type: "guest", first_name: "Pooja", last_name: "Sharma", email: "pooja.sharma@example.com", password_hash: "$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02", phone_number: "+91 98765 43221", is_verified: true },
      { id: 9, user_type: "guest", first_name: "Siddharth", last_name: "Rao", email: "siddharth.rao@example.com", password_hash: "$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02", phone_number: "+91 98765 43222", is_verified: true },
    ];
    const { error: userErr } = await supabase.from("users").upsert(usersData, { onConflict: "id" });
    if (userErr) throw new Error(`Users seed error: ${userErr.message}`);
    console.log("✅ Users seeded (9 records)");

    // 2. Seed Static Geo Reference
    console.log("\n[2/11] Seeding Static Geo References...");
    const geoData = [
      { id: 1, state: "Uttarakhand", district: "Nainital", subdistrict: "Ramgarh", center_latitude: 29.426, center_longitude: 79.552 },
      { id: 2, state: "Uttarakhand", district: "Nainital", subdistrict: "Bhimtal", center_latitude: 29.351, center_longitude: 79.554 },
      { id: 3, state: "Uttarakhand", district: "Nainital", subdistrict: "Mukteshwar", center_latitude: 29.472, center_longitude: 79.647 },
      { id: 4, state: "Uttarakhand", district: "Chamoli", subdistrict: "Joshimath", center_latitude: 30.556, center_longitude: 79.563 },
      { id: 5, state: "Uttarakhand", district: "Chamoli", subdistrict: "Gopeshwar", center_latitude: 30.418, center_longitude: 79.333 },
      { id: 6, state: "Uttarakhand", district: "Chamoli", subdistrict: "Karnaprayag", center_latitude: 30.261, center_longitude: 79.219 },
      { id: 7, state: "Kerala", district: "Wayanad", subdistrict: "Meppadi", center_latitude: 11.551, center_longitude: 76.131 },
      { id: 8, state: "Kerala", district: "Wayanad", subdistrict: "Kalpetta", center_latitude: 11.611, center_longitude: 76.082 },
      { id: 9, state: "Kerala", district: "Wayanad", subdistrict: "Sultan Bathery", center_latitude: 11.662, center_longitude: 76.257 },
      { id: 10, state: "Kerala", district: "Idukki", subdistrict: "Munnar", center_latitude: 10.088, center_longitude: 77.059 },
      { id: 11, state: "Rajasthan", district: "Jaipur", subdistrict: "Amer", center_latitude: 26.985, center_longitude: 75.851 },
      { id: 12, state: "Arunachal Pradesh", district: "Lower Subansiri", subdistrict: "Ziro", center_latitude: 27.564, center_longitude: 93.834 },
    ];
    const { error: geoErr } = await supabase.from("static_geo_reference").upsert(geoData, { onConflict: "id" });
    if (geoErr) throw new Error(`Static Geo seed error: ${geoErr.message}`);
    console.log("✅ Static Geo References seeded (12 records)");

    // 3. Seed Monthly Safe Matrix
    console.log("\n[3/11] Seeding Monthly Safe Matrix...");
    const matrixData = [
      // Nainital
      { state: "Uttarakhand", district: "Nainital", year: 2026, month: 1, safety_rating: "Safe", rainfall_mm: 35.0, soil_stability_index: 92.0, historical_landslides_count: 0 },
      { state: "Uttarakhand", district: "Nainital", year: 2026, month: 2, safety_rating: "Safe", rainfall_mm: 45.0, soil_stability_index: 90.0, historical_landslides_count: 0 },
      { state: "Uttarakhand", district: "Nainital", year: 2026, month: 3, safety_rating: "Safe", rainfall_mm: 28.0, soil_stability_index: 94.0, historical_landslides_count: 0 },
      { state: "Uttarakhand", district: "Nainital", year: 2026, month: 4, safety_rating: "Safe", rainfall_mm: 22.0, soil_stability_index: 95.0, historical_landslides_count: 0 },
      { state: "Uttarakhand", district: "Nainital", year: 2026, month: 5, safety_rating: "Safe", rainfall_mm: 60.0, soil_stability_index: 88.0, historical_landslides_count: 1 },
      { state: "Uttarakhand", district: "Nainital", year: 2026, month: 6, safety_rating: "Moderate", rainfall_mm: 190.0, soil_stability_index: 72.0, historical_landslides_count: 3 },
      { state: "Uttarakhand", district: "Nainital", year: 2026, month: 7, safety_rating: "High Risk", rainfall_mm: 380.0, soil_stability_index: 45.0, historical_landslides_count: 9 },
      { state: "Uttarakhand", district: "Nainital", year: 2026, month: 8, safety_rating: "High Risk", rainfall_mm: 410.0, soil_stability_index: 40.0, historical_landslides_count: 12 },
      { state: "Uttarakhand", district: "Nainital", year: 2026, month: 9, safety_rating: "Moderate", rainfall_mm: 160.0, soil_stability_index: 70.0, historical_landslides_count: 4 },
      { state: "Uttarakhand", district: "Nainital", year: 2026, month: 10, safety_rating: "Safe", rainfall_mm: 25.0, soil_stability_index: 91.0, historical_landslides_count: 0 },
      { state: "Uttarakhand", district: "Nainital", year: 2026, month: 11, safety_rating: "Safe", rainfall_mm: 12.0, soil_stability_index: 96.0, historical_landslides_count: 0 },
      { state: "Uttarakhand", district: "Nainital", year: 2026, month: 12, safety_rating: "Safe", rainfall_mm: 18.0, soil_stability_index: 95.0, historical_landslides_count: 0 },

      // Chamoli
      { state: "Uttarakhand", district: "Chamoli", year: 2026, month: 1, safety_rating: "Safe", rainfall_mm: 40.0, soil_stability_index: 89.0, historical_landslides_count: 0 },
      { state: "Uttarakhand", district: "Chamoli", year: 2026, month: 2, safety_rating: "Safe", rainfall_mm: 50.0, soil_stability_index: 87.0, historical_landslides_count: 0 },
      { state: "Uttarakhand", district: "Chamoli", year: 2026, month: 3, safety_rating: "Safe", rainfall_mm: 35.0, soil_stability_index: 91.0, historical_landslides_count: 0 },
      { state: "Uttarakhand", district: "Chamoli", year: 2026, month: 4, safety_rating: "Safe", rainfall_mm: 30.0, soil_stability_index: 93.0, historical_landslides_count: 0 },
      { state: "Uttarakhand", district: "Chamoli", year: 2026, month: 5, safety_rating: "Moderate", rainfall_mm: 75.0, soil_stability_index: 78.0, historical_landslides_count: 2 },
      { state: "Uttarakhand", district: "Chamoli", year: 2026, month: 6, safety_rating: "Moderate", rainfall_mm: 220.0, soil_stability_index: 68.0, historical_landslides_count: 5 },
      { state: "Uttarakhand", district: "Chamoli", year: 2026, month: 7, safety_rating: "High Risk", rainfall_mm: 460.0, soil_stability_index: 38.0, historical_landslides_count: 16 },
      { state: "Uttarakhand", district: "Chamoli", year: 2026, month: 8, safety_rating: "High Risk", rainfall_mm: 490.0, soil_stability_index: 34.0, historical_landslides_count: 18 },
      { state: "Uttarakhand", district: "Chamoli", year: 2026, month: 9, safety_rating: "Moderate", rainfall_mm: 180.0, soil_stability_index: 66.0, historical_landslides_count: 6 },
      { state: "Uttarakhand", district: "Chamoli", year: 2026, month: 10, safety_rating: "Safe", rainfall_mm: 30.0, soil_stability_index: 90.0, historical_landslides_count: 1 },
      { state: "Uttarakhand", district: "Chamoli", year: 2026, month: 11, safety_rating: "Safe", rainfall_mm: 15.0, soil_stability_index: 95.0, historical_landslides_count: 0 },
      { state: "Uttarakhand", district: "Chamoli", year: 2026, month: 12, safety_rating: "Safe", rainfall_mm: 20.0, soil_stability_index: 94.0, historical_landslides_count: 0 },

      // Wayanad
      { state: "Kerala", district: "Wayanad", year: 2026, month: 1, safety_rating: "Safe", rainfall_mm: 15.0, soil_stability_index: 96.0, historical_landslides_count: 0 },
      { state: "Kerala", district: "Wayanad", year: 2026, month: 2, safety_rating: "Safe", rainfall_mm: 20.0, soil_stability_index: 95.0, historical_landslides_count: 0 },
      { state: "Kerala", district: "Wayanad", year: 2026, month: 3, safety_rating: "Safe", rainfall_mm: 40.0, soil_stability_index: 92.0, historical_landslides_count: 0 },
      { state: "Kerala", district: "Wayanad", year: 2026, month: 4, safety_rating: "Safe", rainfall_mm: 95.0, soil_stability_index: 86.0, historical_landslides_count: 1 },
      { state: "Kerala", district: "Wayanad", year: 2026, month: 5, safety_rating: "Moderate", rainfall_mm: 220.0, soil_stability_index: 74.0, historical_landslides_count: 3 },
      { state: "Kerala", district: "Wayanad", year: 2026, month: 6, safety_rating: "High Risk", rainfall_mm: 680.0, soil_stability_index: 42.0, historical_landslides_count: 14 },
      { state: "Kerala", district: "Wayanad", year: 2026, month: 7, safety_rating: "High Risk", rainfall_mm: 820.0, soil_stability_index: 32.0, historical_landslides_count: 22 },
      { state: "Kerala", district: "Wayanad", year: 2026, month: 8, safety_rating: "High Risk", rainfall_mm: 710.0, soil_stability_index: 36.0, historical_landslides_count: 19 },
      { state: "Kerala", district: "Wayanad", year: 2026, month: 9, safety_rating: "Moderate", rainfall_mm: 260.0, soil_stability_index: 69.0, historical_landslides_count: 4 },
      { state: "Kerala", district: "Wayanad", year: 2026, month: 10, safety_rating: "Moderate", rainfall_mm: 210.0, soil_stability_index: 76.0, historical_landslides_count: 2 },
      { state: "Kerala", district: "Wayanad", year: 2026, month: 11, safety_rating: "Safe", rainfall_mm: 70.0, soil_stability_index: 89.0, historical_landslides_count: 0 },
      { state: "Kerala", district: "Wayanad", year: 2026, month: 12, safety_rating: "Safe", rainfall_mm: 25.0, soil_stability_index: 94.0, historical_landslides_count: 0 },
    ];
    const { error: matErr } = await supabase.from("monthly_safe_matrix").upsert(matrixData, { onConflict: "state,district,year,month" });
    if (matErr) throw new Error(`Monthly Matrix seed error: ${matErr.message}`);
    console.log("✅ Monthly Safe Matrix seeded (36 records)");

    // 4. Seed Farms
    console.log("\n[4/11] Seeding Farms...");
    const farmsData = [
      {
        id: 1,
        slug: "apple-blossom-retreat",
        host_id: 1,
        title: "Apple Blossom Retreat",
        description: "A working apple orchard on the Kumaon ridge. Guests join the morning harvest, learn grafting from the family that has farmed this slope for four generations, and sleep in a restored stone cottage facing the Nanda Devi range.",
        state: "Uttarakhand",
        district: "Nainital",
        subdistrict: "Ramgarh",
        category: "Organic Farm",
        latitude: 29.426,
        longitude: 79.552,
        uses_fallback_coords: false,
        nightly_rate: 4500.0,
        images: ["https://picsum.photos/seed/apple-orchard/900/600", "https://picsum.photos/seed/apple-detail/600/600", "https://picsum.photos/seed/apple-room/600/600"],
        amenities: ["Organic Farm", "Rural Connect Wi-Fi", "Safety Monitoring", "Local Cuisine", "Guided Walks", "Escrow Protection"],
        cancellation_policy: "Full refund if cancelled 48 hours prior to check-in. Safety-related cancellations are always 100% refundable.",
        emergency_contact: "On-site caretaker available 24/7. Closest medical facility: 9km in Bhowali.",
        regional_guidelines: "Stick to marked orchard paths. Do not feed the resident livestock. Respect the harvest schedule during October.",
      },
      {
        id: 2,
        slug: "spice-route-eco-stay",
        host_id: 2,
        title: "Spice Route Eco-Stay",
        description: "Cardamom, pepper and vanilla grow together under the canopy here. The stay sits above the valley floor with a monsoon-season soil-stability sensor on the access road, reported live to the Safety Matrix.",
        state: "Kerala",
        district: "Wayanad",
        subdistrict: "Meppadi",
        category: "Spice Garden",
        latitude: 11.551,
        longitude: 76.131,
        uses_fallback_coords: false,
        nightly_rate: 3800.0,
        images: ["https://picsum.photos/seed/spice-garden/900/600", "https://picsum.photos/seed/spice-detail/600/600", "https://picsum.photos/seed/spice-room/600/600"],
        amenities: ["Spice Plantation Tour", "Rural Connect Wi-Fi", "Safety Monitoring", "Local Cuisine", "Guided Walks", "Escrow Protection"],
        cancellation_policy: "Full refund if cancelled 48 hours prior to check-in. Safety-related cancellations are always 100% refundable.",
        emergency_contact: "Host reachable 24/7. Closest medical facility: 6km in Meppadi Town.",
        regional_guidelines: "Leeches are common during monsoon — wear covered footwear. The access road may close on red-alert days.",
      },
      {
        id: 3,
        slug: "amber-harvest-farm",
        host_id: 3,
        title: "Amber Harvest Farm",
        description: "Marigold and rose fields below the Amer ridge, harvested before sunrise for the Jaipur flower market. Guests ride out with the pickers and return for a millet breakfast cooked over a clay stove.",
        state: "Rajasthan",
        district: "Jaipur",
        subdistrict: "Amer",
        category: "Floral Fields",
        latitude: 26.985,
        longitude: 75.851,
        uses_fallback_coords: false,
        nightly_rate: 5200.0,
        images: ["https://picsum.photos/seed/marigold-field/900/600", "https://picsum.photos/seed/marigold-detail/600/600", "https://picsum.photos/seed/amber-room/600/600"],
        amenities: ["Sunrise Harvest", "Rural Connect Wi-Fi", "Safety Monitoring", "Local Cuisine", "Heritage Walks", "Escrow Protection"],
        cancellation_policy: "Full refund if cancelled 48 hours prior to check-in. Safety-related cancellations are always 100% refundable.",
        emergency_contact: "On-site manager available 24/7. Closest medical facility: 4km in Amer.",
        regional_guidelines: "Summer field work stops by 10 AM — plan visits early. Carry water on all walks.",
      },
      {
        id: 4,
        slug: "mist-valley-paddy",
        host_id: 4,
        title: "Mist Valley Paddy",
        description: "The Apatani valley's rice-and-fish terraces, farmed without a single plough. Stay in a bamboo longhouse and learn the irrigation system that has run on gravity alone for centuries.",
        state: "Arunachal Pradesh",
        district: "Lower Subansiri",
        subdistrict: "Ziro",
        category: "Paddy Fields",
        latitude: 27.564,
        longitude: 93.834,
        uses_fallback_coords: false,
        nightly_rate: 4100.0,
        images: ["https://picsum.photos/seed/paddy-terrace/900/600", "https://picsum.photos/seed/paddy-detail/600/600", "https://picsum.photos/seed/paddy-room/600/600"],
        amenities: ["Terrace Farming", "Rural Connect Wi-Fi", "Safety Monitoring", "Local Cuisine", "Guided Walks", "Escrow Protection"],
        cancellation_policy: "Full refund if cancelled 48 hours prior to check-in. Safety-related cancellations are always 100% refundable.",
        emergency_contact: "Host reachable 24/7. Closest medical facility: 3km in Hapoli.",
        regional_guidelines: "Inner Line Permit required for non-residents. Do not walk on terrace bunds during transplanting season.",
      },
      {
        id: 5,
        slug: "green-valley-retreat",
        host_id: 5,
        title: "Green Valley Retreat",
        description: "Experience the serenity of the Himalayas at Green Valley Retreat. Nestled within an active 50-acre cardamom and tea plantation, this retreat offers a unique blend of agricultural education and luxury living.",
        state: "Uttarakhand",
        district: "Chamoli",
        subdistrict: "Joshimath",
        category: "Tea & Cardamom",
        latitude: 30.556,
        longitude: 79.563,
        uses_fallback_coords: false,
        nightly_rate: 4500.0,
        images: ["https://picsum.photos/seed/green-valley/900/600", "https://picsum.photos/seed/tea-picking/600/600", "https://picsum.photos/seed/valley-room/600/600"],
        amenities: ["Organic Farm", "Rural Connect Wi-Fi", "Safety Monitoring", "Local Cuisine", "Guided Walks", "Escrow Protection"],
        cancellation_policy: "Full refund if cancelled 48 hours prior to check-in. Safety-related cancellations are always 100% refundable.",
        emergency_contact: "On-site caretaker available 24/7. Closest medical facility: 12km in Chamoli Town Center.",
        regional_guidelines: "Please stick to marked trails. Leeches may be present during monsoons. Respect local wildlife and farming schedules.",
      },
      {
        id: 6,
        slug: "sunrise-valley-organic-retreat",
        host_id: 6,
        title: "Sunrise Valley Organic Retreat",
        description: "Rows of turmeric and ginger run down to a stream that feeds the whole valley. The retreat runs entirely on solar and composts every kilogram of kitchen waste back into the beds guests eat from.",
        state: "Kerala",
        district: "Wayanad",
        subdistrict: "Kalpetta",
        category: "Organic Farm",
        latitude: 11.611,
        longitude: 76.082,
        uses_fallback_coords: false,
        nightly_rate: 3667.0,
        images: ["https://picsum.photos/seed/sunrise-valley/900/600", "https://picsum.photos/seed/turmeric-detail/600/600", "https://picsum.photos/seed/sunrise-room/600/600"],
        amenities: ["Organic Farm", "Rural Connect Wi-Fi", "Safety Monitoring", "Local Cuisine", "Guided Walks", "Escrow Protection"],
        cancellation_policy: "Full refund if cancelled 48 hours prior to check-in. Safety-related cancellations are always 100% refundable.",
        emergency_contact: "Host reachable 24/7. Closest medical facility: 5km in Kalpetta.",
        regional_guidelines: "Stream crossings flood quickly after rain. Follow the host's route advice during monsoon.",
      },
    ];
    const { error: farmErr } = await supabase.from("farms").upsert(farmsData, { onConflict: "id" });
    if (farmErr) throw new Error(`Farms seed error: ${farmErr.message}`);
    console.log("✅ Farms seeded (6 records)");

    // 5. Seed Bookings
    console.log("\n[5/11] Seeding Bookings...");
    const bookingsData = [
      { id: 1, booking_code: "AGS-48213", guest_id: 7, farm_id: 5, stay_start_date: "2026-09-15", stay_end_date: "2026-09-18", total_guests: 2, current_status: "Confirmed" },
      { id: 2, booking_code: "AGS-47990", guest_id: 8, farm_id: 2, stay_start_date: "2026-06-02", stay_end_date: "2026-06-05", total_guests: 4, current_status: "Completed" },
      { id: 3, booking_code: "AGS-47612", guest_id: 9, farm_id: 3, stay_start_date: "2026-03-11", stay_end_date: "2026-03-13", total_guests: 2, current_status: "Cancelled" },
    ];
    const { error: bookErr } = await supabase.from("bookings").upsert(bookingsData, { onConflict: "id" });
    if (bookErr) throw new Error(`Bookings seed error: ${bookErr.message}`);
    console.log("✅ Bookings seeded (3 records)");

    // 6. Seed Landslide Reports
    console.log("\n[6/11] Seeding Landslide Reports...");
    const reportsData = [
      { id: 1, report_code: "WG-LS-0098", uploaded_by_user_id: 7, image_s3_url: "https://picsum.photos/seed/landslide-1/800/600", latitude: 17.49, longitude: 73.15, location_name: "Bamnoli Hill Road, Satara", details: "Massive slope slip blocking both lanes", report_time: "2026-08-08T05:00:00.000Z", cnn_confidence_score: 0.94, processing_status: "Processed", severity: "Critical" },
      { id: 2, report_code: "UK-LS-0451", uploaded_by_user_id: 8, image_s3_url: "https://picsum.photos/seed/landslide-2/800/600", latitude: 30.55, longitude: 79.56, location_name: "NH-7 near Joshimath, Chamoli", details: "Mudflow debris on NH-7 approach slope", report_time: "2026-08-07T12:35:00.000Z", cnn_confidence_score: 0.88, processing_status: "Processed", severity: "High" },
      { id: 3, report_code: "KL-LS-0212", uploaded_by_user_id: 2, image_s3_url: "https://picsum.photos/seed/landslide-3/800/600", latitude: 11.55, longitude: 76.13, location_name: "Meppadi Ghat, Wayanad", details: "Tree collapse with localized mud sliding", report_time: "2026-08-06T02:12:00.000Z", cnn_confidence_score: 0.76, processing_status: "Processed", severity: "Medium" },
      { id: 4, report_code: "HP-LS-0077", uploaded_by_user_id: 9, image_s3_url: "https://picsum.photos/seed/landslide-4/800/600", latitude: 31.58, longitude: 78.27, location_name: "Kinnaur Valley Approach Road", details: "Minor loose gravel and rockfall", report_time: "2026-08-04T08:50:00.000Z", cnn_confidence_score: 0.65, processing_status: "Processed", severity: "Low" },
    ];
    const { error: repErr } = await supabase.from("landslide_reports").upsert(reportsData, { onConflict: "id" });
    if (repErr) throw new Error(`Landslide Reports seed error: ${repErr.message}`);
    console.log("✅ Landslide Reports seeded (4 records)");

    // 7. Seed Warnings
    console.log("\n[7/11] Seeding Warnings...");
    const warningsData = [
      { id: 1, warning_code: "WRN-2026-UK09", warning_source: "Automated_CNN", report_id: 2, farm_id: 5, host_id: null, title: "NH-7 Joshimath Sector Debris Flow", description: "Automated CNN classified mudslide debris across Chamoli valley approach. Precautionary travel advisory dispatched to upcoming stays.", severity: "High", epicenter_lat: 30.55, epicenter_lng: 79.56, impact_radius_km: 15.0, issued_at: "2026-08-07T12:40:00.000Z", expires_at: "2026-08-14T12:40:00.000Z", status: "Active" },
      { id: 2, warning_code: "WRN-2026-KL04", warning_source: "Manual_Host", report_id: null, farm_id: 2, host_id: 2, title: "Heavy Monsoon Incline Saturation Advisory", description: "Host manual warning issued for Meppadi tea slopes due to 48-hour continuous downpour. Escrow 100% refund safeguard activated.", severity: "Medium", epicenter_lat: 11.551, epicenter_lng: 76.131, impact_radius_km: 8.0, issued_at: "2026-08-06T02:30:00.000Z", expires_at: "2026-08-10T02:30:00.000Z", status: "Active" },
      { id: 3, warning_code: "WRN-2026-WG01", warning_source: "Automated_CNN", report_id: 1, farm_id: null, host_id: null, title: "Bamnoli Ghat Primary Ridge Collapse", description: "Severe road severance detected by automated satellite & ground drone inference. Immediate route diversion enforced.", severity: "Critical", epicenter_lat: 17.49, epicenter_lng: 73.15, impact_radius_km: 25.0, issued_at: "2026-08-08T05:05:00.000Z", expires_at: "2026-08-15T05:05:00.000Z", status: "Active" },
      { id: 4, warning_code: "WRN-2026-HP02", warning_source: "Automated_CNN", report_id: 4, farm_id: null, host_id: null, title: "Minor Rockfall near Kinnaur Gateway", description: "Debris cleared by BRO highway teams. Area normalized and reopened for farmstay traffic.", severity: "Low", epicenter_lat: 31.58, epicenter_lng: 78.27, impact_radius_km: 10.0, issued_at: "2026-08-04T08:55:00.000Z", expires_at: "2026-08-06T08:55:00.000Z", status: "Expired" },
    ];
    const { error: warnErr } = await supabase.from("warnings").upsert(warningsData, { onConflict: "id" });
    if (warnErr) throw new Error(`Warnings seed error: ${warnErr.message}`);
    console.log("✅ Warnings seeded (4 records)");

    // 8. Seed Payments
    console.log("\n[8/11] Seeding Payments...");
    const paymentsData = [
      { id: 1, payment_code: "PAY-88213", booking_id: 1, stay_amount: 13500.0, platform_fee: 450.0, total_charged: 13950.0, escrow_status: "Held_In_Escrow", gateway_ref: "rzp_live_984128941" },
      { id: 2, payment_code: "PAY-87990", booking_id: 2, stay_amount: 11400.0, platform_fee: 450.0, total_charged: 11850.0, escrow_status: "Released_To_Host", gateway_ref: "rzp_live_871239011" },
      { id: 3, payment_code: "PAY-87612", booking_id: 3, stay_amount: 10400.0, platform_fee: 450.0, total_charged: 10850.0, escrow_status: "Refunded_To_Guest", gateway_ref: "rzp_live_761298412" },
    ];
    const { error: payErr } = await supabase.from("payments").upsert(paymentsData, { onConflict: "id" });
    if (payErr) throw new Error(`Payments seed error: ${payErr.message}`);
    console.log("✅ Payments seeded (3 records)");

    // 9. Seed Payment Transaction Logs
    console.log("\n[9/11] Seeding Payment Transaction Logs...");
    const txData = [
      { id: 1, payment_id: 1, transaction_type: "Charge", payment_gateway_ref: "rzp_live_984128941", amount: 13950.0, note: "Initial booking charge authorized & funds locked in AgroSafe Escrow Vault.", processed_at: "2026-08-02T08:52:00.000Z" },
      { id: 2, payment_id: 2, transaction_type: "Charge", payment_gateway_ref: "rzp_live_871239011", amount: 11850.0, note: "Pre-stay booking hold in escrow.", processed_at: "2026-05-18T05:45:00.000Z" },
      { id: 3, payment_id: 2, transaction_type: "Payout", payment_gateway_ref: "payout_bank_991823", amount: 11400.0, note: "Stay successfully completed. Host escrow payout disbursed to Anna Mathew.", processed_at: "2026-06-06T04:00:00.000Z" },
      { id: 4, payment_id: 3, transaction_type: "Charge", payment_gateway_ref: "rzp_live_761298412", amount: 10850.0, note: "Pre-stay escrow booking hold.", processed_at: "2026-02-28T11:10:00.000Z" },
      { id: 5, payment_id: 3, transaction_type: "Refund", payment_gateway_ref: "rfnd_rzp_761298412_01", amount: 10850.0, note: "100% Emergency Escrow Refund triggered via Landslide Warning Protocol.", processed_at: "2026-03-02T04:45:00.000Z" },
    ];
    const { error: txErr } = await supabase.from("payment_transaction_log").upsert(txData, { onConflict: "id" });
    if (txErr) throw new Error(`Payment Transaction Logs seed error: ${txErr.message}`);
    console.log("✅ Payment Transaction Logs seeded (5 records)");

    // 10. Seed Booking Status Logs
    console.log("\n[10/11] Seeding Booking Status Logs...");
    const bStatusData = [
      { id: 1, booking_id: 1, previous_status: "Pending", new_status: "Confirmed", reason: "Escrow funds successfully captured from card ending in 4242", changed_at: "2026-08-02T08:52:00.000Z" },
      { id: 2, booking_id: 2, previous_status: "Confirmed", new_status: "Active", reason: "Guest checked in on-site", changed_at: "2026-06-02T06:30:00.000Z" },
      { id: 3, booking_id: 2, previous_status: "Active", new_status: "Completed", reason: "Guest checkout completed with 5-star host feedback", changed_at: "2026-06-05T05:30:00.000Z" },
      { id: 4, booking_id: 3, previous_status: "Confirmed", new_status: "Cancelled", reason: "Safety Warning triggered in district — automatic 100% guest refund processed", changed_at: "2026-03-02T04:45:00.000Z" },
    ];
    const { error: bStatErr } = await supabase.from("booking_status_log").upsert(bStatusData, { onConflict: "id" });
    if (bStatErr) throw new Error(`Booking Status Logs seed error: ${bStatErr.message}`);
    console.log("✅ Booking Status Logs seeded (4 records)");

    // 11. Seed Notification Logs
    console.log("\n[11/11] Seeding Notification Logs...");
    const notifData = [
      { id: 1, user_id: 7, warning_id: 1, related_booking_id: 1, notification_type: "Push", title: "⚠️ High Priority: Hazard Alert in Chamoli Zone", message_content: "A verified mudslide debris flow was reported 12km from Green Valley Retreat. Your booking ref AGS-48213 is protected by 100% Escrow Refund Guarantee.", is_read: false, severity: "warning", dispatched_at: "2026-08-07T12:42:00.000Z" },
      { id: 2, user_id: 2, warning_id: 2, related_booking_id: 2, notification_type: "SMS", title: "Manual Warning Broadcast Confirmed", message_content: "Your manual safety alert for Meppadi tea slopes was broadcast to 4 active travellers within the 8km radius.", is_read: true, severity: "info", dispatched_at: "2026-08-06T02:35:00.000Z" },
      { id: 3, user_id: 9, warning_id: null, related_booking_id: 3, notification_type: "Email", title: "100% Escrow Refund Disbursed", message_content: "Due to disaster safety protocols, full payment of ₹10,850 for booking AGS-47612 has been refunded back to your original source account.", is_read: true, severity: "info", dispatched_at: "2026-03-02T04:50:00.000Z" },
      { id: 4, user_id: 1, warning_id: null, related_booking_id: 2, notification_type: "Push", title: "Escrow Payout Credited: ₹11,400", message_content: "Pooja Sharma's checkout at Spice Route Eco-Stay was completed. Funds released from AgroSafe Escrow Vault to your bank account.", is_read: true, severity: "info", dispatched_at: "2026-06-06T04:05:00.000Z" },
    ];
    const { error: notifErr } = await supabase.from("notification_log").upsert(notifData, { onConflict: "id" });
    if (notifErr) throw new Error(`Notification Logs seed error: ${notifErr.message}`);
    console.log("✅ Notification Logs seeded (4 records)");

    console.log("\n==================================================");
    console.log("🎉 ALL SEED DATA SUCCESSFULLY SYNCED TO SUPABASE!");
    console.log("==================================================");
  } catch (err: any) {
    console.error("\n❌ SEEDING FAILED:", err.message);
    if (err.message.includes("schema cache") || err.message.includes("does not exist")) {
      console.error("\n👉 Tables not yet created in Supabase PostgreSQL.");
      console.error("1. Open Supabase Dashboard -> SQL Editor");
      console.error("2. Paste & run contents of `supabase/schema.sql`");
      console.error("3. Re-run `npm run seed` (or run `supabase/seed.sql` in SQL Editor)");
    }
    process.exit(1);
  }
}

runSeed();
