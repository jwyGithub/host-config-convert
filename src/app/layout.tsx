import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
    title: 'Host配置转换工具',
    description: '支持多种平台的host配置格式转换工具'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={`antialiased`}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}

