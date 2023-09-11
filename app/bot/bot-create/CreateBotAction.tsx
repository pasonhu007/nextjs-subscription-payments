'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/SimpleButton';
import { Session } from '@supabase/supabase-js';
import { readAndDecodeStream } from '@/utils/readablestream-util';
import { postDataV2 } from '@/utils/helpers';
import FileUploader from '@/components/ui/FileUploader';
import { extractMultiPDFs, ParsedFileResult } from '@/utils/pdfUtils';

interface Props {
    subscription: any;
    session: Session;
}

export default function CreateBotAction({ subscription, session }: Props) {
    const [botName, setBotName] = useState<string>('');
    const [files, setFiles] = useState<FileList | null>(null);
    const [parsedFiles, setParsedFiles] = useState<ParsedFileResult[]>([])

    const handleBotNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBotName(event.target.value);
    }

    const uploadFiles = async (files: FileList | null, botId: string) => {
        if(!files || files.length === 0) return;

        /* TODO
            1. create files table in supabase
            2. API endpoint to add file record, with file ID/userID/file name/File size/type
            3. then upload File to S3
        */

        try {
            const formData = new FormData();
            formData.append('files', files[0], files[0].name);
            formData.append('botId', botId)

            const result = await postDataV2({
                url: 'http://localhost:8080/uploadFiles',
                data: formData
            });
            return result;
        } catch (error) {
            if (error) return alert((error as Error).message);
        }
    }

    const uploadContentV2 = async (content: string, botId: string) => {
        try {
            const blob = new Blob([content], { type: 'text/plain' });
            const file = new File([blob], 'sample.txt', { type: 'text/plain' });

            const formData = new FormData();
            formData.append('files', file, 'sample.txt');
            formData.append('botId', botId)

            const result = await postDataV2({
                url: 'http://localhost:8080/upload',
                data: formData
            });
            return result;
        } catch (error) {
            if (error) return alert((error as Error).message);
        }
    };

    const createBot = async () => {
        try {
            const content = parsedFiles[0].text;

            const resp = await fetch('/api/manage-bot', {
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                // credentials: 'same-origin',
                body: JSON.stringify({ botName })
            });

            if (!resp.ok) {
                console.log('Error in submitChat', { resp });
                throw Error(resp.statusText);
            }

            const responseBody = await readAndDecodeStream(resp.body?.getReader());

            const contentUploadResult = await uploadContentV2(content, responseBody.id);

            const uploadFilesResult = await uploadFiles(files, responseBody.id);

            console.log(contentUploadResult)
            console.log(uploadFilesResult)
        } catch (error) {
            if (error) return alert((error as Error).message);
        }
    };

    const handleFilesSelected = async (selectFiles: FileList) => {
        // Handle the uploaded files here
        setFiles(selectFiles)

        const parsedFilesResult = await extractMultiPDFs(Array.from(selectFiles))
        setParsedFiles(parsedFilesResult)
        console.log(parsedFilesResult)
    };

    return (
        <div>
            <div className="flex justify-center pt-6 gap-8">
                <div>Subscription: {subscription?.prices?.products?.name}</div>
            </div>
            <div className="max-w-4xl mx-auto">
                <div className='py-5'>
                    <input
                        type="text"
                        name="botName"
                        className="w-full p-3 rounded-md border-2 border-gray-500"
                        placeholder="bot name"
                        maxLength={64}
                        onChange={handleBotNameChange}
                        value={botName}
                    />
                </div>
                <div className="my-5">
                    <FileUploader onFilesSelected={handleFilesSelected}/>
                    {files && (
                        <ul>
                        {Array.from(files).map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                        </ul>
                    )}
                </div>
                <Button
                    type="button"
                    disabled={!session}
                    form="botForm"
                    onClick={createBot}
                >
                    Create Bot
                </Button>
            </div>
        </div>
    )
}