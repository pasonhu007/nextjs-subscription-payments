import {
    getSession,
    getSubscription
  } from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import ChatAction from './ChatAction';


export default async function BotPage() {
    const [session, subscription] = await Promise.all([
        getSession(),
        getSubscription()
      ]);

    if (!session) {
      return redirect('/signin');
    }

    return (
        <section className="bg-black">
            <div>Bot Update Page</div>
            <ChatAction session={session} subscription={subscription}/>
        </section>
    )
}