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

    // 解析host配置输入（增强版：支持注释和非host行）
    const parseHostInput = useCallback((input: string) => {
        const lines = input.split('\n');
        const results: Array<{ ip: string; host: string; isValid: boolean; originalLine: string }> = [];

        // IP地址正则：支持IPv4和IPv6
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

        for (const line of lines) {
            const trimmedLine = line.trim();

            // 空行直接保留
            if (!trimmedLine) {
                results.push({ ip: '', host: '', isValid: false, originalLine: line });
                continue;
            }

            // 尝试解析为host配置
            const parts = trimmedLine.split(/\s+/);
            if (parts.length >= 2) {
                const ip = parts[0];
                const host = parts[1];

                // 验证IP格式
                if (ipv4Regex.test(ip) || ipv6Regex.test(ip)) {
                    results.push({ ip, host, isValid: true, originalLine: line });
                    continue;
                }
            }

            // 不符合host规则，原样保留
            results.push({ ip: '', host: '', isValid: false, originalLine: line });
        }
        return results;
    }, []);

    // 应用转换规则
    const applyRule = useCallback((rule: string, ip: string, host: string) => {
        return rule.replace(/\$\{ip\}/g, ip).replace(/\$\{host\}/g, host);
    }, []);

    // 转换host配置（增强版：支持注释和非host行）
    const convertHostConfig = useCallback(
        (inputValue?: string) => {
            const currentInput = inputValue || state.inputText;
            if (!currentInput.trim()) {
                dispatch({ type: 'SET_OUTPUT_TEXT', payload: '' });
                return;
            }

            const parsedLines = parseHostInput(currentInput);

            // 检查是否有有效的host行
            const validHosts = parsedLines.filter(line => line.isValid);
            if (validHosts.length === 0) {
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

            // 去重逻辑：基于host + ip的组合（只对有效的host行去重）
            let processedLines = parsedLines;
            if (state.enableDeduplication) {
                const uniqueMap = new Map<string, { ip: string; host: string; isValid: boolean; originalLine: string }>();
                const seenKeys = new Set<string>();

                processedLines = parsedLines.filter(line => {
                    if (!line.isValid) {
                        // 非host行直接保留
                        return true;
                    }

                    const key = `${line.host}:${line.ip}`;
                    if (seenKeys.has(key)) {
                        // 重复的host+ip组合，跳过
                        return false;
                    }

                    seenKeys.add(key);
                    return true;
                });
            }

            // 转换每一行
            const convertedLines = processedLines.map(line => {
                if (line.isValid) {
                    // 有效的host行，应用转换规则
                    return applyRule(rule, line.ip, line.host);
                } else {
                    // 非host行（注释、空行等），原样输出
                    return line.originalLine;
                }
            });

            dispatch({ type: 'SET_OUTPUT_TEXT', payload: convertedLines.join('\n') });
        },
        [state.inputText, state.selectedPlatform, state.customRule, state.userRules, state.enableDeduplication, parseHostInput, applyRule]
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

