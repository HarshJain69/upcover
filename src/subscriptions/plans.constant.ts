import { capitalize } from 'lodash';

export enum PlanId {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
}

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  currency: string;
  stripePriceId: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: PlanId.BASIC,
    name: capitalize(PlanId.BASIC),
    price: 999,
    currency: 'USD',
    stripePriceId: 'price_basic_REPLACE_ME',
    features: ['Up to 1 user', 'Basic support', '10 GB storage'],
  },
  {
    id: PlanId.STANDARD,
    name: capitalize(PlanId.STANDARD),
    price: 1999,
    currency: 'USD',
    stripePriceId: 'price_standard_REPLACE_ME',
    features: ['Up to 5 users', 'Priority support', '50 GB storage'],
  },
  {
    id: PlanId.PREMIUM,
    name: capitalize(PlanId.PREMIUM),
    price: 3999,
    currency: 'USD',
    stripePriceId: 'price_premium_REPLACE_ME',
    features: ['Unlimited users', '24/7 support', '500 GB storage'],
  },
];
