import { Textarea } from '@/components/ui/textarea';
import { ConfigDialog } from './ConfigDialog';

interface InputAreaProps {
    inputText: string;
    onInputChange: (value: string) => void;
    isDialogOpen: boolean;
    onDialogToggle: (open: boolean) => void;
    selectedPlatform: string;
    onPlatformChange: (platform: string) => void;
    enableDeduplication: boolean;
    onDeduplicationChange: (enabled: boolean) => void;
    currentRule: string;
    onRuleChange: (rule: string) => void;
    platformRules: Record<string, string>;
    userRules: Record<string, string>;
}

export function InputArea({
    inputText,
    onInputChange,
    isDialogOpen,
    onDialogToggle,
    selectedPlatform,
    onPlatformChange,
    enableDeduplication,
    onDeduplicationChange,
    currentRule,
    onRuleChange,
    platformRules,
    userRules
}: InputAreaProps) {
    return (
        <div className='flex flex-col h-full'>
            <div className='flex items-center justify-between mb-2'>
                <h2 className='text-lg font-semibold'>输入Host配置</h2>
                <ConfigDialog
                    isOpen={isDialogOpen}
                    onOpenChange={onDialogToggle}
                    selectedPlatform={selectedPlatform}
                    onPlatformChange={onPlatformChange}
                    enableDeduplication={enableDeduplication}
                    onDeduplicationChange={onDeduplicationChange}
                    currentRule={currentRule}
                    onRuleChange={onRuleChange}
                    platformRules={platformRules}
                    userRules={userRules}
                />
            </div>
            <Textarea
                placeholder='请输入host配置，格式：IP地址 域名\n例如：\n117.80.117.48 baidu.com\n192.168.1.1 example.com'
                value={inputText}
                onChange={e => onInputChange(e.target.value)}
                className='flex-1 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300'
            />
        </div>
    );
}

