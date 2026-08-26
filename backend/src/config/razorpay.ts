import Razorpay from "razorpay";
import { ENV } from "./env.js";

export const isRazorpayConfigured = () =>
  Boolean(ENV.RAZORPAY_KEY_ID && ENV.RAZORPAY_KEY_SECRET);

export const razorpay = new Razorpay({
  key_id: ENV.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: ENV.RAZORPAY_KEY_SECRET || "placeholder",
});
