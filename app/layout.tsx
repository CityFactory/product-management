// File: app/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd'; // 1. Import App
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Product Management Dashboard',
  description: 'Technical Test for Summit Global Teknologi',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#00b96b',
              },
            }}
          >
            {/* 2. Bungkus children dengan <App> */}
            <App>{children}</App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}