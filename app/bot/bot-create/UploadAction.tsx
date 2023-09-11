'use client';

import Button from '@/components/ui/Button';
import { postDataV2 } from '@/utils/helpers';
import { Session } from '@supabase/supabase-js';

interface Props {
    subscription: any;
    session: Session;
}

export default async function UploadAction({subscription, session}: Props) {
    const uploadContentV2 = async (contentForm: FormData) => {
        try {
            const content = contentForm.get('content') as string;
            
            const blob = new Blob([content], { type: 'text/plain' });
            const file = new File([blob], 'sample.txt', { type: 'text/plain' });

            const formData = new FormData();
            formData.append('files', file, 'sample.txt');
            formData.append('botId', 'b4b2674b-33de-4633-9c3d-db4e1a2b16a6')
          
            const result = await postDataV2({
                url: 'http://localhost:8080/upload',
                data: formData
            });
            console.log(JSON.stringify(result))
        } catch (error) {
          if (error) return alert((error as Error).message);
        }
      };

    return (
        <div>
            <div className="flex justify-center pt-6 gap-8">
                <div>Subscription: {subscription?.prices?.products?.name}</div>
            </div>
            <div>
                <form id="contentForm" action={uploadContentV2}>
                    <textarea
                        id="text-area"
                        name="content"
                        className="w-1/2 p-3 rounded-md bg-zinc-800"
                        placeholder="ai content"
                    />
                </form>
                <Button
                    variant="slim"
                    type="submit"
                    disabled={!session}
                    form="contentForm"
                >
                    Upload Content
                </Button>
            </div>
        </div>
    )
}