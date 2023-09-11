import {
    getSession
  } from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import BotListPage from './BotListPage';

async function BotPage() {
    const [session] = await Promise.all([
        getSession()
      ]);

    if (!session) {
      return redirect('/signin');
    }

    return (
        <section>
            <BotListPage />
        </section>
    )
}

export default BotPage;