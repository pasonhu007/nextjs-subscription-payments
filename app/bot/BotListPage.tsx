'use client';

import { useEffect, useState } from 'react';
import { Database } from '@/types_db';
import { useRouter } from 'next/navigation';
import { setcurruentBot } from '@/app/redux/bot/botSlice';
import { useDispatch } from 'react-redux';
import SimpleButton from '@/components/ui/SimpleButton';

type BotDetail = Database['public']['Tables']['bots']['Row'];

export default function BotListPage() {
    const [botDetails, setBotDetails] = useState<BotDetail[]>([]);
    const dispatch = useDispatch();
    const router = useRouter();

    const selectBot = (botDetail: BotDetail) => {
        console.log(`Bot Name: ${botDetail.name}`)
        dispatch(setcurruentBot(botDetail))
        return router.push('/bot/bot-update');
    }

    const gotoCreateBot = () => {
        return router.push('/bot/bot-create');
    }

    useEffect(() => {
        // Fetch the data from the API
        fetch('/api/bot-list')
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            setBotDetails(data);
          })
          .catch((error) => {
            console.error(error.message);
          });
      }, []); 

    return (            
        <div className='grid grid-cols-1 gap-3 md:grid-cols-3 max-w-4xl mx-auto mt-16'>
            <div>
                <SimpleButton onClick={gotoCreateBot}>
                            Create New Bot
                </SimpleButton>
            </div>
            { botDetails?.map(
                (botDetail => (
                    <div key={botDetail.id} 
                        onClick={() => selectBot(botDetail)} 
                        className='p-2 border-2 border-blue-400 rounded-lg'>
                            Bot Name: {botDetail.name}
                    </div>
                ))) }
        </div>
    )
}