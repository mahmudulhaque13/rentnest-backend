import Stripe from "stripe";
import config from "../config";

const stripe: Stripe = new Stripe(config.stripeSecretKey);

export default stripe;
