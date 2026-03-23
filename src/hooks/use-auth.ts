import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, signOutUser, getUserData, UserData } from '@/lib/auth';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChange(async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Fetch additional user data from Firestore
                const additionalData = await getUserData(firebaseUser.uid);
                setUserData(additionalData);
            } else {
                setUserData(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signOut = async () => {
        const { error } = await signOutUser();
        if (error) {
            console.error('Error signing out:', error);
        }
    };

    return {
        user,
        userData,
        loading,
        signOut,
    };
};