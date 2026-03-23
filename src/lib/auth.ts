import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
    User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Google OAuth provider
const googleProvider = new GoogleAuthProvider();

export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    role: 'citizen' | 'municipal-employee';
    coins?: number;
    employeeId?: string;
    department?: string;
    firstName?: string;
    lastName?: string;
}

// Sign up with email and password
export const signUpWithEmail = async (
    email: string,
    password: string,
    userData: Omit<UserData, 'uid' | 'email'>
) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update the user's display name
        await updateProfile(user, {
            displayName: userData.displayName
        });

        // Store additional user data in Firestore
        const userDocData: UserData = {
            uid: user.uid,
            email: user.email!,
            displayName: userData.displayName,
            role: userData.role,
            coins: 0, // Initialize coins to 0
            ...(userData.employeeId && { employeeId: userData.employeeId }),
            ...(userData.department && { department: userData.department }),
            ...(userData.firstName && { firstName: userData.firstName }),
            ...(userData.lastName && { lastName: userData.lastName })
        };

        await setDoc(doc(db, 'users', user.uid), userDocData);

        return { user, error: null };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { user: null, error: errorMessage };
    }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { user: null, error: errorMessage };
    }
};

// Sign in with Google
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if user document exists, if not create one
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            const userData: UserData = {
                uid: user.uid,
                email: user.email!,
                displayName: user.displayName || 'User',
                role: 'citizen', // Default role for Google sign-in
                firstName: user.displayName?.split(' ')[0],
                lastName: user.displayName?.split(' ').slice(1).join(' ')
            };
            await setDoc(doc(db, 'users', user.uid), userData);
        }

        return { user, error: null };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { user: null, error: errorMessage };
    }
};

// Sign out
export const signOutUser = async () => {
    try {
        await signOut(auth);
        return { error: null };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { error: errorMessage };
    }
};

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<UserData | null> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            return userDoc.data() as UserData;
        }
        return null;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};