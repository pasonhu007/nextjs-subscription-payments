
import { getBotDetails } from "@/app/supabase-server";

export async function GET(req: Request) {
    if (req.method === 'GET') {
      const botDetails = await getBotDetails();
      
      return new Response(JSON.stringify(botDetails), {
          status: 200
      });
    } else {
      return new Response('Method Not Allowed', {
        headers: { Allow: 'GET' },
        status: 405
      });
    }
  }
  