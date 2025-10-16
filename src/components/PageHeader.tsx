export function PageHeader() {
    return (
        <div className='flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-border/50'>
            <div className='text-center py-4 px-4'>
                <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent'>
                    Host配置转换工具
                </h1>
                <p className='text-sm text-muted-foreground mt-1'>快速转换host配置到不同平台格式</p>
            </div>
        </div>
    );
}

