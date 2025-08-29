// This file acts as a single source of truth for subscription plan details.
// It ensures that when a user registers for a plan, the correct usage limits
// are applied to their account.

interface PlanDetails {
  [key: string]: {
    pages: number;
  };
}

export const PLAN_DETAILS: PlanDetails = {
  Free: {
    pages: 5,
  },
  Starter: {
    pages: 400, // Based on the monthly plan
  },
  Professional: {
    pages: 1000, // Based on the monthly plan
  },
  Business: {
    pages: 4000, // Based on the monthly plan
  },
};

// Helper to get plan details safely, falling back to the Free plan
export const getPlanDetails = (planName: string) => {
  return PLAN_DETAILS[planName] || PLAN_DETAILS.Free;
};
