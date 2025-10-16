import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface OutputAreaProps {
    outputText: string;
    onCopy: () => void;
}

export function OutputArea({ outputText, onCopy }: OutputAreaProps) {
    return (
        <div className='flex flex-col h-full'>
            <div className='flex items-center justify-between mb-2'>
                <h2 className='text-lg font-semibold'>转换结果</h2>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={onCopy}
                    disabled={!outputText}
                    className='hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    <Copy className='w-4 h-4 mr-2' />
                    复制
                </Button>
            </div>
            <Textarea
                placeholder='转换结果将显示在这里'
                value={outputText}
                readOnly
                className='flex-1 font-mono text-sm bg-muted/50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-green-300'
            />
        </div>
    );
}

