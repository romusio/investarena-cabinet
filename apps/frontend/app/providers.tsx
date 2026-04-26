'use client';

import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 2500,
                    style: {
                        background: 'rgba(10, 10, 16, 0.92)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '14px',
                    },
                }}
            />
        </>
    );
}
