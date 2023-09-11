// import { cookies } from 'next/headers';
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { stripe } from '@/utils/stripe';
// import { createOrRetrieveCustomer } from '@/utils/supabase-admin';
// import { getURL } from '@/utils/helpers';
// import { Database } from '@/types_db';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    const { content } = await req.json();
    console.log(`!!!content!!!: ${content}`);
    return new Response(JSON.stringify({ content }), {
        status: 200
    });
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405
    });
  }
}
