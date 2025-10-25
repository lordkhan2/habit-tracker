// app/_layout.tsx
import { Stack, Redirect, usePathname } from "expo-router";

function RouteGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuth = false; // ← replace with real auth state

    // If not signed in and not already on the auth route, redirect declaratively.
    if (!isAuth && !pathname.startsWith("/auth")) {
        return <Redirect href="/auth" />;
    }

    return <>{children}</>;
}

export default function RootLayout() {
    return (
        <RouteGuard>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                {/* Expo Router will auto-register /auth/index.tsx, so you can omit this line,
           or if you keep it, use the correct path name: "auth/index" */}
                {/* <Stack.Screen name="auth/index" options={{ headerShown: false }} /> */}
            </Stack>
        </RouteGuard>
    );
}
