import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

export async function POST(req: Request) {
    if (req.method === 'POST') {
      const { botName } = await req.json();
      console.log(`!!!botName!!!: ${botName}`);
      try {
        const supabase = createRouteHandlerClient<Database>({cookies});
        const {
          data: { user }
        } = await supabase.auth.getUser();
  
        if (!user) throw Error('Could not get user');

        const { data: result, error: supabaseError } = await supabaseAdmin
            .from('bots')
            .insert([{ user_id: user.id, name: botName }])
            .select()
            .single();
        if (supabaseError) throw supabaseError;

        console.log(`!!! bot create result: "${JSON.stringify(result)}"`);

        return new Response(JSON.stringify(result), {
          status: 200
        });
      } catch (err: any) {
        console.log(err);
        return new Response(
          JSON.stringify({ error: { statusCode: 500, message: err.message } }),
          {
            status: 500
          }
        );
      }
    } else {
      return new Response('Method Not Allowed', {
        headers: { Allow: 'POST' },
        status: 405
      });
    }
  }