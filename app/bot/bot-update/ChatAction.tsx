'use client';

import Button from '@/components/ui/Button';
import { Session } from '@supabase/supabase-js';
import { getCurrentBot } from '@/app/redux/selectors';
import { readAndDecodeStream } from '@/utils/readablestream-util';

interface Props {
    subscription: any;
    session: Session;
}

export default async function ChatAction({subscription, session}: Props) {
    const botDetail = getCurrentBot();

    if (!botDetail){
        return (<div></div>)
    }

    const buildChatRequest = (message: string) => {
        // TODO: once reached max_token/message, clear the localstorage, or shorten it
        let storedMessagesRaw = localStorage.getItem('chat_messages');
        let storedMessages: [object?] = storedMessagesRaw ? JSON.parse(storedMessagesRaw) : [];

        storedMessages.push({ role: 'user', content: message });
        localStorage.setItem('chat_messages', JSON.stringify(storedMessages));
        return storedMessages;
    }

    const saveAnwser = (anwser: string) => {
        const storedMessagesRaw = localStorage.getItem('chat_messages');
        const storedMessages: [object?] = storedMessagesRaw ? JSON.parse(storedMessagesRaw) : [];
        storedMessages.push({ role: 'assistant', content: anwser });
        localStorage.setItem('chat_messages', JSON.stringify(storedMessages));
        return storedMessages;
    }

    const submitChat = async (chatForm: FormData) => {
        try {
            const message = chatForm.get('message') as string;
            const chatRequest = buildChatRequest(message);
            
            const res = await fetch('http://localhost:8080/query', {
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                // credentials: 'same-origin',
                body: JSON.stringify({ query: chatRequest, botId: botDetail.id })
              });
            
            if (!res.ok) {
                console.log('Error in submitChat', { res });
                throw Error(res.statusText);
            }

            const responseBody = await readAndDecodeStream(res.body?.getReader())

            saveAnwser(responseBody.answer);
            console.log(responseBody)
        } catch (error) {
          if (error) return alert((error as Error).message);
        }
      };

    return (
        <div className='pt-10'>
            <div className="flex justify-center pt-6 gap-8">
                <div>ChatAction: {botDetail.name}</div>
            </div>
            <div>
                <form id="chatForm" action={submitChat}>
                    <input
                        type="text"
                        name="message"
                        className="w-1/2 p-3 rounded-md bg-zinc-800"
                        placeholder="message"
                        maxLength={64}
                    />
                </form>
                <Button
                    variant="slim"
                    type="submit"
                    disabled={!session}
                    form="chatForm"
                >
                    Chat Submit
                </Button>
            </div>
        </div>
    )
}