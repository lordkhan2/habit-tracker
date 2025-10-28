import {
    client,
    DATABASE_ID,
    databases,
    HABITS_COLLECTION_ID,
    HABITS_COMPLETIONS_ID,
    RealtimeResponse,
} from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Button, Surface, Text } from "react-native-paper";
import { Habit } from "../types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";

export default function Index() {
    const { signOut, user } = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);

    const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

    useEffect(() => {
        if (user) {
            const channel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
            const habitsSubscription = client.subscribe(
                channel,
                (response: RealtimeResponse) => {
                    if (
                        response.events.includes(
                            "databases.*.collections.*.documents.*.create",
                        )
                    ) {
                        fetchHabits();
                    } else if (
                        response.events.includes(
                            "databases.*.collections.*.documents.*.update",
                        )
                    ) {
                        fetchHabits();
                    } else if (
                        response.events.includes(
                            "databases.*.collections.*.documents.*.delete",
                        )
                    ) {
                        fetchHabits();
                    }
                },
            );
            fetchHabits();

            return () => {
                habitsSubscription();
            };
        }
    }, [user]);

    const fetchHabits = async () => {
        try {
            if (!user?.$id) return;
            const response = await databases.listDocuments<Habit>(
                DATABASE_ID,
                HABITS_COLLECTION_ID,
                [Query.equal("user_id", user.$id)],
            );
            setHabits(response.documents);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteHabit = async (id: string) => {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                HABITS_COLLECTION_ID,
                id,
            );
        } catch (error) {
            console.log(error);
        }
    };
    const handleCompleteHabit = async (id: string) => {
        if (!user) return;
        const currentDate = new Date().toISOString();
        try {
            await databases.createDocument(
                DATABASE_ID,
                HABITS_COMPLETIONS_ID,
                ID.unique(),
                {
                    habit_id: id,
                    user_id: user.$id,
                    completed_at: currentDate,
                },
            );
            const habit = habits?.find((h) => h.$id === id);
            if (!habit) return;
            await databases.updateDocument(
                DATABASE_ID,
                HABITS_COLLECTION_ID,
                id,
                {
                    streak_count: habit.streak_count + 1,
                    last_completed: currentDate,
                },
            );
        } catch (error) {
            console.log(error);
        }
    };

    const renderRightActions = () => {
        return (
            <View style={styles.swipeActionRight}>
                <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={32}
                    color={"#fff"}
                />
            </View>
        );
    };

    const renderLeftActions = () => (
        <View style={styles.swipeActionLeft}>
            <MaterialCommunityIcons
                name="trash-can-outline"
                size={32}
                color={"#fff"}
            />
        </View>
    );
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={styles.title}>
                    Today&apos;s Habit
                </Text>
                <Button mode="text" onPress={signOut} icon={"logout"}>
                    Sign Out
                </Button>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {habits?.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>
                            No habits yet. Add your first Habit!
                        </Text>
                    </View>
                ) : (
                    habits?.map((habits, key) => (
                        <Swipeable
                            key={key}
                            ref={(ref) => {
                                swipeableRefs.current[habits.$id] = ref;
                            }}
                            overshootLeft={false}
                            overshootRight={false}
                            renderLeftActions={renderLeftActions}
                            renderRightActions={renderRightActions}
                            onSwipeableOpen={(direction) => {
                                if (direction === "left") {
                                    handleDeleteHabit(habits.$id);
                                } else if (direction === "right") {
                                    handleCompleteHabit(habits.$id);
                                }
                                swipeableRefs.current[habits.$id]?.close();
                            }}
                        >
                            <Surface style={styles.card} elevation={0}>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>
                                        {habits.title}
                                    </Text>
                                    <Text style={styles.cardDescription}>
                                        {habits.description}
                                    </Text>
                                    <View style={styles.cardFooter}>
                                        <View style={styles.streakBadge}>
                                            <MaterialCommunityIcons
                                                name="fire"
                                                size={18}
                                                color={"#ff9800"}
                                            />
                                            <Text style={styles.streakText}>
                                                {habits.streak_count} day streak
                                            </Text>
                                        </View>
                                        <View style={styles.frequencyBadge}>
                                            <Text style={styles.frequencyText}>
                                                {habits.frequency
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    habits.frequency.slice(1)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </Surface>
                        </Swipeable>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    title: {
        fontWeight: "bold",
    },
    card: {
        marginBottom: 18,
        borderRadius: 18,
        backgroundColor: "#f7f2f8",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    cardContent: {
        padding: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#22223b",
    },
    cardDescription: {
        fontSize: 15,
        marginBottom: 16,
        color: "#6c6c80",
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    streakBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff3e0",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    streakText: {
        marginLeft: 6,
        color: "#ff9800",
        fontWeight: "bold",
        fontSize: 14,
    },
    frequencyBadge: {
        backgroundColor: "#ede7f6",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    frequencyText: {
        color: "#7c4dff",
        fontWeight: "bold",
        fontSize: 14,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyStateText: {
        color: "#666666",
    },
    swipeActionLeft: {
        justifyContent: "center",
        alignItems: "flex-start",
        flex: 1,
        backgroundColor: "#e53935",
        borderRadius: 18,
        marginBottom: 18,
        marginTop: 2,
        paddingLeft: 16,
    },
    swipeActionRight: {
        justifyContent: "center",
        alignItems: "flex-end",
        flex: 1,
        backgroundColor: "#4caf50",
        borderRadius: 18,
        marginBottom: 18,
        marginTop: 2,
        paddingRight: 16,
    },
});
