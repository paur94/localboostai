import {
  lemonSqueezySetup,
  createCheckout,
  getCustomer,
} from "@lemonsqueezy/lemonsqueezy.js";

lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });

export async function createLSCheckout({
  variantId,
  userId,
  email,
  name,
  successUrl,
}: {
  variantId: string;
  userId: string;
  email: string;
  name?: string;
  successUrl: string;
}) {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID!;
  const { data, error } = await createCheckout(storeId, variantId, {
    checkoutData: {
      email,
      name: name ?? undefined,
      custom: { userId },
    },
    productOptions: {
      redirectUrl: successUrl,
    },
  });
  if (error) throw new Error(error.message);
  return data!.data;
}

export async function getLSCustomerPortalUrl(customerId: string) {
  const { data, error } = await getCustomer(customerId);
  if (error) throw new Error(error.message);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data?.data as any)?.attributes?.urls?.customer_portal as string | null ?? null;
}
