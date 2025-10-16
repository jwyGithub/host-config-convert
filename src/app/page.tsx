'use client';

import { useEffect } from 'react';
import { useHostConverter } from '@/hooks/useHostConverter';
import { PageHeader } from '@/components/PageHeader';
import { PageFooter } from '@/components/PageFooter';
import { InputArea } from '@/components/InputArea';
import { OutputArea } from '@/components/OutputArea';
import { toast } from 'sonner';

export default function Home() {
    const { state, actions, currentRule, PLATFORM_RULES } = useHostConverter();

    // 当平台切换时重新转换
    useEffect(() => {
        if (state.inputText.trim()) {
            actions.convertHostConfig();
        }
    }, [state.selectedPlatform, state.inputText, actions.convertHostConfig]);

    // 当去重配置变化时重新转换
    useEffect(() => {
        if (state.inputText.trim()) {
            actions.convertHostConfig();
        }
    }, [state.enableDeduplication, state.inputText, actions.convertHostConfig]);

    // 增强的复制功能，包含toast通知
    const handleCopy = async () => {
        try {
            await actions.copyToClipboard();
            toast.success('复制成功', {
                description: '转换结果已复制到剪贴板'
            });
        } catch (err) {
            console.error('复制失败:', err);
            toast.error('复制失败', {
                description: '无法复制到剪贴板，请手动复制'
            });
        }
    };

    return (
        <div className='h-screen bg-background flex flex-col'>
            <PageHeader />

            <div className='flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-2 min-h-0'>
                <InputArea
                    inputText={state.inputText}
                    onInputChange={actions.handleInputChange}
                    isDialogOpen={state.isDialogOpen}
                    onDialogToggle={actions.handleDialogToggle}
                    selectedPlatform={state.selectedPlatform}
                    onPlatformChange={actions.handlePlatformChange}
                    enableDeduplication={state.enableDeduplication}
                    onDeduplicationChange={actions.handleDeduplicationChange}
                    currentRule={currentRule}
                    onRuleChange={actions.handleCustomRuleChange}
                    platformRules={PLATFORM_RULES}
                    userRules={state.userRules}
                />

                <OutputArea outputText={state.outputText} onCopy={handleCopy} />
            </div>

            <PageFooter />
        </div>
    );
}

