import { Models } from "react-native-appwrite";

export type Habit = Models.Document & {
    user_id: string;
    title: string;
    description: string;
    frequency: string;
    streak_count: number;
    last_completed: string;
};
