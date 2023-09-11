'use client'

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from 'next/navigation';
import { readAndDecodeStream } from '@/utils/readablestream-util';

interface ChatMessage {
    role: string,
    content: string
}

export default function ChatWindow() {
    const [inputMessage, setInputMessage] = useState<string>('')
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const lastMessageRef = useRef<any>(null);

    const searchParams = useSearchParams();
    const botId = searchParams.get('botId');

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

    const submitChat = async () => {
        try {
            const message = inputMessage;
            const chatRequest = buildChatRequest(message);
            
            const res = await fetch('http://localhost:8080/query', {
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                // credentials: 'same-origin',
                body: JSON.stringify({ query: chatRequest, botId: botId })
              });
            
            if (!res.ok) {
                console.log('Error in submitChat', { res });
                throw Error(res.statusText);
            }

            const responseBody = await readAndDecodeStream(res.body?.getReader())

            saveAnwser(responseBody.answer);
            setMessages(messages => ([...messages, {
                "role": "assistant",
                "content": responseBody.answer
            }]))
        } catch (error) {
          if (error) return alert((error as Error).message);
        }
      };

    const botMessageUI = (message: string) => (
        <div className="flex justify-start mr-8">
            <div className="flex flex-row items-center mb-3">
                <div
                    className="relative  text-base bg-white py-3 px-4 shadow rounded-xl"
                >
                    <div>{message}</div>
                </div>
            </div>
        </div>
    )

    const userMessageUI = (message: string) => (
        <div className="flex justify-end ml-8">
            <div className="flex items-center justify-start flex-row-reverse  mb-3">
                <div
                    className="relative  text-base bg-indigo-100 py-3 px-4 shadow rounded-xl"
                >
                    <div>{message}</div>
                </div>
            </div>
        </div>
    )

    const handleSubmit = async () => {
        if (inputMessage.trim()) { // Check to prevent empty strings
          const userMessage = {
            "role": "user",
            "content": inputMessage
          }
          setMessages(messages => ([...messages, userMessage]))
          setInputMessage('')
          await submitChat()
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
          handleSubmit()
        }
    }

    useEffect(() => {
        const messages: ChatMessage[] = [
            {
              "role": "user",
              "content": "summarise the story"
            },
            {
              "role": "assistant",
              "content": "The story is about Bamboo, a panda from China, and Eucalyptus, a koala from Australia, who become unlikely friends through a video call on dropped smartphones. They form a deep bond, despite not understanding each other's language, and share their lives virtually. When a wildfire threatens their habitat, Bamboo risks his life to save Eucalyptus. Their heroic act gains global attention, and they inspire support for wildlife conservation. Eventually, they are reunited in a specially created habitat"
            },
            {
              "role": "user",
              "content": "tell me what happen at end"
            },
            {
              "role": "assistant",
              "content": "At the end of the story, Bamboo and Eucalyptus are reunited in a specially created habitat that combines elements of both their natural environments. They continue to live out their days together, raising their young ones and enjoying the comfort of each other's presence. Their extraordinary friendship and the lessons they taught about love, unity, and friendship continue to inspire people worldwide. Their story becomes a symbol of resilience and the power of connection, leaving a lasting legacy for generations to come."
            }
          ]
        setMessages(messages)
    }, [])

    useEffect(() => {
        if (lastMessageRef.current) {
          lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [messages]);

    return (<>
        <div className="flex h-screen antialiased text-gray-800">
            <div className="flex flex-row h-full w-full overflow-x-hidden">
                <div className="flex flex-col flex-auto h-full">
                    <div
                        className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4"
                    >
                        <div className="flex flex-col h-full overflow-x-auto mb-4">
                            <div className="flex flex-col h-full">
                                <div className="flex-grow">
                                    { messages.map((message, index) => (
                                        <div key={`message-${index}`} ref={index === messages.length - 1 ? lastMessageRef : null}>
                                            {message.role === 'assistant' ? botMessageUI(message.content) : userMessageUI(message.content)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div
                            className="flex flex-row items-center rounded-xl w-full"
                        >
                            <div className="flex-grow ">
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 px-2 h-12"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </div>
                            <div className="ml-2">
                                <button
                                    className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 h-10 flex-shrink-0"
                                    onClick={handleSubmit}
                                >
                                    <span className="">
                                        <svg
                                            className="w-5 h-5 transform rotate-90 -mt-px"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                            ></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}