import { useReducer, useCallback, useMemo } from 'react';

// 状态类型定义
interface HostConverterState {
    inputText: string;
    outputText: string;
    selectedPlatform: string;
    customRule: string;
    isDialogOpen: boolean;
    userRules: Record<string, string>;
    enableDeduplication: boolean;
}

// 动作类型定义
type HostConverterAction =
    | { type: 'SET_INPUT_TEXT'; payload: string }
    | { type: 'SET_OUTPUT_TEXT'; payload: string }
    | { type: 'SET_SELECTED_PLATFORM'; payload: string }
    | { type: 'SET_CUSTOM_RULE'; payload: string }
    | { type: 'SET_DIALOG_OPEN'; payload: boolean }
    | { type: 'SET_USER_RULES'; payload: Record<string, string> }
    | { type: 'SET_ENABLE_DEDUPLICATION'; payload: boolean }
    | { type: 'UPDATE_USER_RULE'; payload: { platform: string; rule: string } };

// 初始状态
const initialState: HostConverterState = {
    inputText: '',
    outputText: '',
    selectedPlatform: 'clash',
    customRule: '',
    isDialogOpen: false,
    userRules: {},
    enableDeduplication: false
};

// Reducer函数
function hostConverterReducer(state: HostConverterState, action: HostConverterAction): HostConverterState {
    switch (action.type) {
        case 'SET_INPUT_TEXT':
            return { ...state, inputText: action.payload };
        case 'SET_OUTPUT_TEXT':
            return { ...state, outputText: action.payload };
        case 'SET_SELECTED_PLATFORM':
            return { ...state, selectedPlatform: action.payload };
        case 'SET_CUSTOM_RULE':
            return { ...state, customRule: action.payload };
        case 'SET_DIALOG_OPEN':
            return { ...state, isDialogOpen: action.payload };
        case 'SET_USER_RULES':
            return { ...state, userRules: action.payload };
        case 'SET_ENABLE_DEDUPLICATION':
            return { ...state, enableDeduplication: action.payload };
        case 'UPDATE_USER_RULE':
            return {
                ...state,
                userRules: {
                    ...state.userRules,
                    [action.payload.platform]: action.payload.rule
                }
            };
        default:
            return state;
    }
}

// 平台转换规则
const PLATFORM_RULES = {
    clash: '${host}=${ip},',
    charles: `<dnsSpoof>
  <name>\${host}</name>
  <address>\${ip}</address>
  <enabled>true</enabled>
</dnsSpoof>`,
    custom: ''
};

// 自定义Hook
export function useHostConverter() {
    const [state, dispatch] = useReducer(hostConverterReducer, initialState);

    // 解析host配置输入
    const parseHostInput = useCallback((input: string) => {
        const lines = input.trim().split('\n');
        const results: Array<{ ip: string; host: string }> = [];

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine) {
                const parts = trimmedLine.split(/\s+/);
                if (parts.length >= 2) {
                    const ip = parts[0];
                    const host = parts[1];
                    results.push({ ip, host });
                }
            }
        }
        return results;
    }, []);

    // 应用转换规则
    const applyRule = useCallback((rule: string, ip: string, host: string) => {
        return rule.replace(/\$\{ip\}/g, ip).replace(/\$\{host\}/g, host);
    }, []);

    // 转换host配置
    const convertHostConfig = useCallback(
        (inputValue?: string) => {
            const currentInput = inputValue || state.inputText;
            if (!currentInput.trim()) {
                dispatch({ type: 'SET_OUTPUT_TEXT', payload: '' });
                return;
            }

            const parsedHosts = parseHostInput(currentInput);
            if (parsedHosts.length === 0) {
                dispatch({ type: 'SET_OUTPUT_TEXT', payload: '无法解析输入的host配置，请检查格式是否正确' });
                return;
            }

            const rule =
                state.selectedPlatform === 'custom'
                    ? state.customRule
                    : state.userRules[state.selectedPlatform] || PLATFORM_RULES[state.selectedPlatform as keyof typeof PLATFORM_RULES];

            if (!rule) {
                dispatch({ type: 'SET_OUTPUT_TEXT', payload: '请先配置转换规则' });
                return;
            }

            // 去重逻辑：基于host + ip的组合
            let processedHosts = parsedHosts;
            if (state.enableDeduplication) {
                const uniqueMap = new Map<string, { ip: string; host: string }>();
                parsedHosts.forEach(({ ip, host }) => {
                    const key = `${host}:${ip}`;
                    if (!uniqueMap.has(key)) {
                        uniqueMap.set(key, { ip, host });
                    }
                });
                processedHosts = Array.from(uniqueMap.values());
            }

            const convertedLines = processedHosts.map(({ ip, host }) => applyRule(rule, ip, host));
            dispatch({ type: 'SET_OUTPUT_TEXT', payload: convertedLines.join('\n') });
        },
        [state.inputText, state.selectedPlatform, state.customRule, state.userRules, state.enableDeduplication]
    );

    // 复制到剪贴板
    const copyToClipboard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(state.outputText);
            // 这里可以添加toast通知
        } catch (err) {
            console.error('复制失败:', err);
            // 这里可以添加错误toast通知
        }
    }, [state.outputText]);

    // 处理输入变化
    const handleInputChange = useCallback(
        (value: string) => {
            dispatch({ type: 'SET_INPUT_TEXT', payload: value });
            if (value.trim()) {
                convertHostConfig(value);
            } else {
                dispatch({ type: 'SET_OUTPUT_TEXT', payload: '' });
            }
        },
        [convertHostConfig]
    );

    // 处理平台变化
    const handlePlatformChange = useCallback((platform: string) => {
        dispatch({ type: 'SET_SELECTED_PLATFORM', payload: platform });
    }, []);

    // 处理去重配置变化
    const handleDeduplicationChange = useCallback((enabled: boolean) => {
        dispatch({ type: 'SET_ENABLE_DEDUPLICATION', payload: enabled });
    }, []);

    // 处理自定义规则变化
    const handleCustomRuleChange = useCallback((rule: string) => {
        dispatch({ type: 'SET_CUSTOM_RULE', payload: rule });
    }, []);

    // 处理用户规则变化
    const handleUserRuleChange = useCallback((platform: string, rule: string) => {
        dispatch({ type: 'UPDATE_USER_RULE', payload: { platform, rule } });
    }, []);

    // 处理弹窗开关
    const handleDialogToggle = useCallback((open: boolean) => {
        dispatch({ type: 'SET_DIALOG_OPEN', payload: open });
    }, []);

    // 计算当前规则
    const currentRule = useMemo(() => {
        return state.selectedPlatform === 'custom'
            ? state.customRule
            : state.userRules[state.selectedPlatform] || PLATFORM_RULES[state.selectedPlatform as keyof typeof PLATFORM_RULES];
    }, [state.selectedPlatform, state.customRule, state.userRules]);

    return {
        state,
        actions: {
            handleInputChange,
            handlePlatformChange,
            handleDeduplicationChange,
            handleCustomRuleChange,
            handleUserRuleChange,
            handleDialogToggle,
            copyToClipboard,
            convertHostConfig
        },
        currentRule,
        PLATFORM_RULES
    };
}

