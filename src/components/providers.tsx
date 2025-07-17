"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: 'white',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              color: 'white',
            },
          },
        }}
      />
    </SessionProvider>
  );
}