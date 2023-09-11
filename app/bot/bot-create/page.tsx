import {
    getSession,
    getSubscription
  } from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import CreateBotAction from './CreateBotAction';
import UploadAction from './UploadAction';


export default async function BotPage() {
    const [session, subscription] = await Promise.all([
        getSession(),
        getSubscription()
      ]);

    if (!session) {
      return redirect('/signin');
    }

    return (
        <div>
            <CreateBotAction session={session} subscription={subscription}/>
        </div>
    )
}