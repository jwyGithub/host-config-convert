import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface ConfigDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedPlatform: string;
    onPlatformChange: (platform: string) => void;
    enableDeduplication: boolean;
    onDeduplicationChange: (enabled: boolean) => void;
    currentRule: string;
    onRuleChange: (rule: string) => void;
    platformRules: Record<string, string>;
    userRules: Record<string, string>;
}

export function ConfigDialog({
    isOpen,
    onOpenChange,
    selectedPlatform,
    onPlatformChange,
    enableDeduplication,
    onDeduplicationChange,
    currentRule,
    onRuleChange,
    platformRules,
    userRules
}: ConfigDialogProps) {
    const handleRuleChange = (value: string) => {
        if (selectedPlatform === 'custom') {
            onRuleChange(value);
        } else {
            // 更新用户修改的规则
            onRuleChange(value);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant='outline'
                    size='sm'
                    className='hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200'
                >
                    <Settings className='w-4 h-4 mr-2' />
                    配置
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[900px] w-[90vw] max-h-[85vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>转换规则配置</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                    <div>
                        <label className='text-sm font-medium'>输出平台</label>
                        <Select value={selectedPlatform} onValueChange={onPlatformChange}>
                            <SelectTrigger className='mt-2'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='clash'>Clash</SelectItem>
                                <SelectItem value='charles'>Charles</SelectItem>
                                <SelectItem value='custom'>自定义</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className='text-sm font-medium'>去重设置</label>
                        <div className='mt-2 flex items-center space-x-2'>
                            <Switch id='deduplication' checked={enableDeduplication} onCheckedChange={onDeduplicationChange} />
                            <label htmlFor='deduplication' className='text-sm text-muted-foreground'>
                                启用去重（基于host + ip组合）
                            </label>
                        </div>
                        <p className='text-xs text-muted-foreground mt-1'>开启后，相同的host和ip组合只会保留一个</p>
                    </div>
                    <div>
                        <label className='text-sm font-medium'>转换规则</label>
                        <Textarea
                            className='mt-2 min-h-[300px] font-mono text-sm'
                            placeholder={
                                selectedPlatform === 'custom'
                                    ? '请输入自定义转换规则，使用 ${ip} 和 ${host} 作为占位符'
                                    : '当前平台的默认规则'
                            }
                            value={currentRule}
                            onChange={e => handleRuleChange(e.target.value)}
                        />
                        <p className='text-xs text-muted-foreground mt-1'>
                            {selectedPlatform === 'custom'
                                ? '自定义转换规则，使用 ${ip} 和 ${host} 作为占位符'
                                : `这是 ${selectedPlatform} 平台的规则，可以直接编辑`}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

