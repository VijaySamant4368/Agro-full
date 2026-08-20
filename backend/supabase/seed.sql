-- =========================================================================
-- AGROSAFE TRAVEL — SEED DATA SCRIPT (SUPABASE POSTGRESQL)
-- Populates initial test users, farms, matrix, bookings, escrows, and warnings
-- =========================================================================

-- 1. SEED USERS (Password for all test users: 'Password123!')
-- bcrypt hash for 'Password123!' -> $2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02
INSERT INTO users (id, user_type, first_name, last_name, email, password_hash, phone_number, is_verified) VALUES
(1, 'host', 'Rohit', 'Bisht', 'rohit.bisht@example.com', '$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02', '+91 98765 43210', true),
(2, 'host', 'Anna', 'Mathew', 'anna.mathew@example.com', '$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02', '+91 98765 43211', true),
(3, 'host', 'Vikram', 'Singh', 'vikram.singh@example.com', '$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02', '+91 98765 43212', true),
(4, 'host', 'Tage', 'Yampi', 'tage.yampi@example.com', '$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02', '+91 98765 43213', true),
(5, 'host', 'John', 'Doe', 'john.doe@example.com', '$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02', '+91 98765 43214', true),
(6, 'host', 'Meera', 'Nair', 'meera.nair@example.com', '$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02', '+91 98765 43215', true),
(7, 'guest', 'Arjun', 'Verma', 'arjun.verma@example.com', '$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02', '+91 98765 43220', true),
(8, 'guest', 'Pooja', 'Sharma', 'pooja.sharma@example.com', '$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02', '+91 98765 43221', true),
(9, 'guest', 'Siddharth', 'Rao', 'siddharth.rao@example.com', '$2a$10$wO08272sC8R/0H4K6F3Cze95Z4v8mY.5u1kU5X05n1q2u6A3g6L02', '+91 98765 43222', true);

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 2. SEED STATIC GEO REFERENCES
INSERT INTO static_geo_reference (state, district, subdistrict, center_latitude, center_longitude) VALUES
('Uttarakhand', 'Nainital', 'Ramgarh', 29.426000, 79.552000),
('Uttarakhand', 'Nainital', 'Bhimtal', 29.351000, 79.554000),
('Uttarakhand', 'Nainital', 'Mukteshwar', 29.472000, 79.647000),
('Uttarakhand', 'Chamoli', 'Joshimath', 30.556000, 79.563000),
('Uttarakhand', 'Chamoli', 'Gopeshwar', 30.418000, 79.333000),
('Uttarakhand', 'Chamoli', 'Karnaprayag', 30.261000, 79.219000),
('Kerala', 'Wayanad', 'Meppadi', 11.551000, 76.131000),
('Kerala', 'Wayanad', 'Kalpetta', 11.611000, 76.082000),
('Kerala', 'Wayanad', 'Sultan Bathery', 11.662000, 76.257000),
('Kerala', 'Idukki', 'Munnar', 10.088000, 77.059000),
('Rajasthan', 'Jaipur', 'Amer', 26.985000, 75.851000),
('Arunachal Pradesh', 'Lower Subansiri', 'Ziro', 27.564000, 93.834000);

-- 3. SEED MONTHLY SAFE MATRIX
INSERT INTO monthly_safe_matrix (state, district, year, month, safety_rating, rainfall_mm, soil_stability_index, historical_landslides_count) VALUES
-- Nainital
('Uttarakhand', 'Nainital', 2026, 1, 'Safe', 35.0, 92.0, 0),
('Uttarakhand', 'Nainital', 2026, 2, 'Safe', 45.0, 90.0, 0),
('Uttarakhand', 'Nainital', 2026, 3, 'Safe', 28.0, 94.0, 0),
('Uttarakhand', 'Nainital', 2026, 4, 'Safe', 22.0, 95.0, 0),
('Uttarakhand', 'Nainital', 2026, 5, 'Safe', 60.0, 88.0, 1),
('Uttarakhand', 'Nainital', 2026, 6, 'Moderate', 190.0, 72.0, 3),
('Uttarakhand', 'Nainital', 2026, 7, 'High Risk', 380.0, 45.0, 9),
('Uttarakhand', 'Nainital', 2026, 8, 'High Risk', 410.0, 40.0, 12),
('Uttarakhand', 'Nainital', 2026, 9, 'Moderate', 160.0, 70.0, 4),
('Uttarakhand', 'Nainital', 2026, 10, 'Safe', 25.0, 91.0, 0),
('Uttarakhand', 'Nainital', 2026, 11, 'Safe', 12.0, 96.0, 0),
('Uttarakhand', 'Nainital', 2026, 12, 'Safe', 18.0, 95.0, 0),

-- Chamoli
('Uttarakhand', 'Chamoli', 2026, 1, 'Safe', 40.0, 89.0, 0),
('Uttarakhand', 'Chamoli', 2026, 2, 'Safe', 50.0, 87.0, 0),
('Uttarakhand', 'Chamoli', 2026, 3, 'Safe', 35.0, 91.0, 0),
('Uttarakhand', 'Chamoli', 2026, 4, 'Safe', 30.0, 93.0, 0),
('Uttarakhand', 'Chamoli', 2026, 5, 'Moderate', 75.0, 78.0, 2),
('Uttarakhand', 'Chamoli', 2026, 6, 'Moderate', 220.0, 68.0, 5),
('Uttarakhand', 'Chamoli', 2026, 7, 'High Risk', 460.0, 38.0, 16),
('Uttarakhand', 'Chamoli', 2026, 8, 'High Risk', 490.0, 34.0, 18),
('Uttarakhand', 'Chamoli', 2026, 9, 'Moderate', 180.0, 66.0, 6),
('Uttarakhand', 'Chamoli', 2026, 10, 'Safe', 30.0, 90.0, 1),
('Uttarakhand', 'Chamoli', 2026, 11, 'Safe', 15.0, 95.0, 0),
('Uttarakhand', 'Chamoli', 2026, 12, 'Safe', 20.0, 94.0, 0),

-- Wayanad
('Kerala', 'Wayanad', 2026, 1, 'Safe', 15.0, 96.0, 0),
('Kerala', 'Wayanad', 2026, 2, 'Safe', 20.0, 95.0, 0),
('Kerala', 'Wayanad', 2026, 3, 'Safe', 40.0, 92.0, 0),
('Kerala', 'Wayanad', 2026, 4, 'Safe', 95.0, 86.0, 1),
('Kerala', 'Wayanad', 2026, 5, 'Moderate', 220.0, 74.0, 3),
('Kerala', 'Wayanad', 2026, 6, 'High Risk', 680.0, 42.0, 14),
('Kerala', 'Wayanad', 2026, 7, 'High Risk', 820.0, 32.0, 22),
('Kerala', 'Wayanad', 2026, 8, 'High Risk', 710.0, 36.0, 19),
('Kerala', 'Wayanad', 2026, 9, 'Moderate', 260.0, 69.0, 4),
('Kerala', 'Wayanad', 2026, 10, 'Moderate', 210.0, 76.0, 2),
('Kerala', 'Wayanad', 2026, 11, 'Safe', 70.0, 89.0, 0),
('Kerala', 'Wayanad', 2026, 12, 'Safe', 25.0, 94.0, 0);

-- 4. SEED FARMS
INSERT INTO farms (id, slug, host_id, title, description, state, district, subdistrict, category, latitude, longitude, uses_fallback_coords, nightly_rate, images, amenities, cancellation_policy, emergency_contact, regional_guidelines) VALUES
(1, 'apple-blossom-retreat', 1, 'Apple Blossom Retreat', 'A working apple orchard on the Kumaon ridge. Guests join the morning harvest, learn grafting from the family that has farmed this slope for four generations, and sleep in a restored stone cottage facing the Nanda Devi range.', 'Uttarakhand', 'Nainital', 'Ramgarh', 'Organic Farm', 29.426000, 79.552000, false, 4500.00, ARRAY['https://picsum.photos/seed/apple-orchard/900/600', 'https://picsum.photos/seed/apple-detail/600/600', 'https://picsum.photos/seed/apple-room/600/600'], ARRAY['Organic Farm', 'Rural Connect Wi-Fi', 'Safety Monitoring', 'Local Cuisine', 'Guided Walks', 'Escrow Protection'], 'Full refund if cancelled 48 hours prior to check-in. Safety-related cancellations are always 100% refundable.', 'On-site caretaker available 24/7. Closest medical facility: 9km in Bhowali.', 'Stick to marked orchard paths. Do not feed the resident livestock. Respect the harvest schedule during October.'),
(2, 'spice-route-eco-stay', 2, 'Spice Route Eco-Stay', 'Cardamom, pepper and vanilla grow together under the canopy here. The stay sits above the valley floor with a monsoon-season soil-stability sensor on the access road, reported live to the Safety Matrix.', 'Kerala', 'Wayanad', 'Meppadi', 'Spice Garden', 11.551000, 76.131000, false, 3800.00, ARRAY['https://picsum.photos/seed/spice-garden/900/600', 'https://picsum.photos/seed/spice-detail/600/600', 'https://picsum.photos/seed/spice-room/600/600'], ARRAY['Spice Plantation Tour', 'Rural Connect Wi-Fi', 'Safety Monitoring', 'Local Cuisine', 'Guided Walks', 'Escrow Protection'], 'Full refund if cancelled 48 hours prior to check-in. Safety-related cancellations are always 100% refundable.', 'Host reachable 24/7. Closest medical facility: 6km in Meppadi Town.', 'Leeches are common during monsoon — wear covered footwear. The access road may close on red-alert days.'),
(3, 'amber-harvest-farm', 3, 'Amber Harvest Farm', 'Marigold and rose fields below the Amer ridge, harvested before sunrise for the Jaipur flower market. Guests ride out with the pickers and return for a millet breakfast cooked over a clay stove.', 'Rajasthan', 'Jaipur', 'Amer', 'Floral Fields', 26.985000, 75.851000, false, 5200.00, ARRAY['https://picsum.photos/seed/marigold-field/900/600', 'https://picsum.photos/seed/marigold-detail/600/600', 'https://picsum.photos/seed/amber-room/600/600'], ARRAY['Sunrise Harvest', 'Rural Connect Wi-Fi', 'Safety Monitoring', 'Local Cuisine', 'Heritage Walks', 'Escrow Protection'], 'Full refund if cancelled 48 hours prior to check-in. Safety-related cancellations are always 100% refundable.', 'On-site manager available 24/7. Closest medical facility: 4km in Amer.', 'Summer field work stops by 10 AM — plan visits early. Carry water on all walks.'),
(4, 'mist-valley-paddy', 4, 'Mist Valley Paddy', 'The Apatani valley''s rice-and-fish terraces, farmed without a single plough. Stay in a bamboo longhouse and learn the irrigation system that has run on gravity alone for centuries.', 'Arunachal Pradesh', 'Lower Subansiri', 'Ziro', 'Paddy Fields', 27.564000, 93.834000, false, 4100.00, ARRAY['https://picsum.photos/seed/paddy-terrace/900/600', 'https://picsum.photos/seed/paddy-detail/600/600', 'https://picsum.photos/seed/paddy-room/600/600'], ARRAY['Terrace Farming', 'Rural Connect Wi-Fi', 'Safety Monitoring', 'Local Cuisine', 'Guided Walks', 'Escrow Protection'], 'Full refund if cancelled 48 hours prior to check-in. Safety-related cancellations are always 100% refundable.', 'Host reachable 24/7. Closest medical facility: 3km in Hapoli.', 'Inner Line Permit required for non-residents. Do not walk on terrace bunds during transplanting season.'),
(5, 'green-valley-retreat', 5, 'Green Valley Retreat', 'Experience the serenity of the Himalayas at Green Valley Retreat. Nestled within an active 50-acre cardamom and tea plantation, this retreat offers a unique blend of agricultural education and luxury living.', 'Uttarakhand', 'Chamoli', 'Joshimath', 'Tea & Cardamom', 30.556000, 79.563000, false, 4500.00, ARRAY['https://picsum.photos/seed/green-valley/900/600', 'https://picsum.photos/seed/tea-picking/600/600', 'https://picsum.photos/seed/valley-room/600/600'], ARRAY['Organic Farm', 'Rural Connect Wi-Fi', 'Safety Monitoring', 'Local Cuisine', 'Guided Walks', 'Escrow Protection'], 'Full refund if cancelled 48 hours prior to check-in. Safety-related cancellations are always 100% refundable.', 'On-site caretaker available 24/7. Closest medical facility: 12km in Chamoli Town Center.', 'Please stick to marked trails. Leeches may be present during monsoons. Respect local wildlife and farming schedules.'),
(6, 'sunrise-valley-organic-retreat', 6, 'Sunrise Valley Organic Retreat', 'Rows of turmeric and ginger run down to a stream that feeds the whole valley. The retreat runs entirely on solar and composts every kilogram of kitchen waste back into the beds guests eat from.', 'Kerala', 'Wayanad', 'Kalpetta', 'Organic Farm', 11.611000, 76.082000, false, 3667.00, ARRAY['https://picsum.photos/seed/sunrise-valley/900/600', 'https://picsum.photos/seed/turmeric-detail/600/600', 'https://picsum.photos/seed/sunrise-room/600/600'], ARRAY['Organic Farm', 'Rural Connect Wi-Fi', 'Safety Monitoring', 'Local Cuisine', 'Guided Walks', 'Escrow Protection'], 'Full refund if cancelled 48 hours prior to check-in. Safety-related cancellations are always 100% refundable.', 'Host reachable 24/7. Closest medical facility: 5km in Kalpetta.', 'Stream crossings flood quickly after rain. Follow the host''s route advice during monsoon.');

SELECT setval('farms_id_seq', (SELECT MAX(id) FROM farms));

-- 5. SEED BOOKINGS
INSERT INTO bookings (id, booking_code, guest_id, farm_id, stay_start_date, stay_end_date, total_guests, current_status) VALUES
(1, 'AGS-48213', 7, 5, '2026-09-15', '2026-09-18', 2, 'Confirmed'),
(2, 'AGS-47990', 8, 2, '2026-06-02', '2026-06-05', 4, 'Completed'),
(3, 'AGS-47612', 9, 3, '2026-03-11', '2026-03-13', 2, 'Cancelled');

SELECT setval('bookings_id_seq', (SELECT MAX(id) FROM bookings));

-- 6. SEED LANDSLIDE REPORTS
INSERT INTO landslide_reports (id, report_code, uploaded_by_user_id, image_s3_url, latitude, longitude, location_name, details, report_time, cnn_confidence_score, processing_status, severity) VALUES
(1, 'WG-LS-0098', 7, 'https://picsum.photos/seed/landslide-1/800/600', 17.490000, 73.150000, 'Bamnoli Ghat Road, Western Ghats', 'Massive slope slip blocking both lanes', '2026-08-08 10:30:00+05:30', 0.94, 'Processed', 'Critical'),
(2, 'UK-LS-0451', 8, 'https://picsum.photos/seed/landslide-2/800/600', 30.550000, 79.560000, 'NH-7 near Joshimath, Chamoli', 'Mudflow debris on NH-7 approach slope', '2026-08-07 18:05:00+05:30', 0.88, 'Processed', 'High'),
(3, 'KL-LS-0212', 2, 'https://picsum.photos/seed/landslide-3/800/600', 11.550000, 76.130000, 'Meppadi Ghat, Wayanad', 'Tree collapse with localized mud sliding', '2026-08-06 07:42:00+05:30', 0.76, 'Processed', 'Medium'),
(4, 'HP-LS-0077', 9, 'https://picsum.photos/seed/landslide-4/800/600', 31.580000, 78.270000, 'Kinnaur Valley Approach Road', 'Minor loose gravel and rockfall', '2026-08-04 14:20:00+05:30', 0.65, 'Processed', 'Low');

SELECT setval('landslide_reports_id_seq', (SELECT MAX(id) FROM landslide_reports));

-- 7. SEED WARNINGS
INSERT INTO warnings (id, warning_code, warning_source, report_id, farm_id, host_id, title, description, severity, epicenter_lat, epicenter_lng, impact_radius_km, issued_at, expires_at, status) VALUES
(1, 'WRN-2026-UK09', 'Automated_CNN', 2, 5, NULL, 'NH-7 Joshimath Sector Debris Flow', 'Automated CNN classified mudslide debris across Chamoli valley approach. Precautionary travel advisory dispatched to upcoming stays.', 'High', 30.550000, 79.560000, 15.0, '2026-08-07 18:10:00+05:30', '2026-08-14 18:10:00+05:30', 'Active'),
(2, 'WRN-2026-KL04', 'Manual_Host', NULL, 2, 2, 'Heavy Monsoon Incline Saturation Advisory', 'Host manual warning issued for Meppadi tea slopes due to 48-hour continuous downpour. Escrow 100% refund safeguard activated.', 'Medium', 11.551000, 76.131000, 8.0, '2026-08-06 08:00:00+05:30', '2026-08-10 08:00:00+05:30', 'Active'),
(3, 'WRN-2026-WG01', 'Automated_CNN', 1, NULL, NULL, 'Bamnoli Ghat Primary Ridge Collapse', 'Severe road severance detected by automated satellite & ground drone inference. Immediate route diversion enforced.', 'Critical', 17.490000, 73.150000, 25.0, '2026-08-08 10:35:00+05:30', '2026-08-15 10:35:00+05:30', 'Active'),
(4, 'WRN-2026-HP02', 'Automated_CNN', 4, NULL, NULL, 'Minor Rockfall near Kinnaur Gateway', 'Debris cleared by BRO highway teams. Area normalized and reopened for farmstay traffic.', 'Low', 31.580000, 78.270000, 10.0, '2026-08-04 14:25:00+05:30', '2026-08-06 14:25:00+05:30', 'Expired');

SELECT setval('warnings_id_seq', (SELECT MAX(id) FROM warnings));

-- 8. SEED PAYMENTS & ESCROWS
INSERT INTO payments (id, payment_code, booking_id, stay_amount, platform_fee, total_charged, escrow_status, gateway_ref) VALUES
(1, 'PAY-88213', 1, 13500.00, 450.00, 13950.00, 'Held_In_Escrow', 'rzp_live_984128941'),
(2, 'PAY-87990', 2, 11400.00, 450.00, 11850.00, 'Released_To_Host', 'rzp_live_871239011'),
(3, 'PAY-87612', 3, 10400.00, 450.00, 10850.00, 'Refunded_To_Guest', 'rzp_live_761298412');

SELECT setval('payments_id_seq', (SELECT MAX(id) FROM payments));

-- 9. SEED PAYMENT TRANSACTION LOGS
INSERT INTO payment_transaction_log (payment_id, transaction_type, payment_gateway_ref, amount, note, processed_at) VALUES
(1, 'Charge', 'rzp_live_984128941', 13950.00, 'Initial booking charge authorized & funds locked in AgroSafe Escrow Vault.', '2026-08-02 14:22:00+05:30'),
(2, 'Charge', 'rzp_live_871239011', 11850.00, 'Pre-stay booking hold in escrow.', '2026-05-18 11:15:00+05:30'),
(2, 'Payout', 'payout_bank_991823', 11400.00, 'Stay successfully completed. Host escrow payout disbursed to Anna Mathew.', '2026-06-06 09:30:00+05:30'),
(3, 'Charge', 'rzp_live_761298412', 10850.00, 'Pre-stay escrow booking hold.', '2026-02-28 16:40:00+05:30'),
(3, 'Refund', 'rfnd_rzp_761298412_01', 10850.00, '100% Emergency Escrow Refund triggered via Landslide Warning Protocol.', '2026-03-02 10:15:00+05:30');

-- 10. SEED BOOKING STATUS LOGS
INSERT INTO booking_status_log (booking_id, previous_status, new_status, reason, changed_at) VALUES
(1, 'Pending', 'Confirmed', 'Escrow funds successfully captured from card ending in 4242', '2026-08-02 14:22:00+05:30'),
(2, 'Confirmed', 'Active', 'Guest checked in on-site', '2026-06-02 12:00:00+05:30'),
(2, 'Active', 'Completed', 'Guest checkout completed with 5-star host feedback', '2026-06-05 11:00:00+05:30'),
(3, 'Confirmed', 'Cancelled', 'Safety Warning triggered in district — automatic 100% guest refund processed', '2026-03-02 10:15:00+05:30');

-- 11. SEED NOTIFICATION LOGS
INSERT INTO notification_log (user_id, warning_id, related_booking_id, notification_type, title, message_content, is_read, severity, dispatched_at) VALUES
(7, 1, 1, 'Push', '⚠️ High Priority: Hazard Alert in Chamoli Zone', 'A verified mudslide debris flow was reported 12km from Green Valley Retreat. Your booking ref AGS-48213 is protected by 100% Escrow Refund Guarantee.', false, 'warning', '2026-08-07 18:12:00+05:30'),
(2, 2, 2, 'SMS', 'Manual Warning Broadcast Confirmed', 'Your manual safety alert for Meppadi tea slopes was broadcast to 4 active travellers within the 8km radius.', true, 'info', '2026-08-06 08:05:00+05:30'),
(9, NULL, 3, 'Email', '100% Escrow Refund Disbursed', 'Due to disaster safety protocols, full payment of ₹10,850 for booking AGS-47612 has been refunded back to your original source account.', true, 'info', '2026-03-02 10:20:00+05:30'),
(1, NULL, 2, 'Push', 'Escrow Payout Credited: ₹11,400', 'Pooja Sharma''s checkout at Spice Route Eco-Stay was completed. Funds released from AgroSafe Escrow Vault to your bank account.', true, 'info', '2026-06-06 09:35:00+05:30');
