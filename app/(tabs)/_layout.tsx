import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: "coral" }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => {
                        return focused ? (
                            <FontAwesome name="home" size={24} color={color} />
                        ) : (
                            <FontAwesome name="home" size={24} color={color} />
                        );
                    },
                }}
            />
            <Tabs.Screen name="login" options={{ title: "Login" }} />
        </Tabs>
    );
}
