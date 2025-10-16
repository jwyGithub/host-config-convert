import { HelpCircle } from 'lucide-react';

export function PageFooter() {
    return (
        <div className='flex-shrink-0 py-3 flex items-center justify-center bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 border-t border-border/50'>
            <div className='flex items-center gap-2 text-xs text-muted-foreground bg-white/80 dark:bg-gray-800/80 px-3 py-2 rounded-full border border-border/30 shadow-sm'>
                <HelpCircle className='w-3 h-3 text-blue-500' />
                <span>输入格式：IP地址 域名 | 支持批量转换 | 点击配置按钮切换平台</span>
            </div>
        </div>
    );
}

