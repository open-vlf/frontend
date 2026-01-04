import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  getToken as getAppCheckToken,
  initializeAppCheck,
  ReCaptchaV3Provider,
} from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyD13mWpT3VMTzrQf9e_7SL9smQ7A_oh76A",
  authDomain: "vlf-craam-a7df7.firebaseapp.com",
  projectId: "vlf-craam-a7df7",
  storageBucket: "vlf-craam-a7df7.appspot.com",
  messagingSenderId: "921041899898",
  appId: "1:921041899898:web:7210522981ed30d003c6c3",
};

let authInstance: ReturnType<typeof getAuth> | null = null;
let appCheckInstance: ReturnType<typeof initializeAppCheck> | null = null;
let initPromise: Promise<void> | null = null;

async function initFirebase(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    if (typeof window === "undefined") return;

    const app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);

    if (!authInstance.currentUser) {
      await signInAnonymously(authInstance);
    }

    const siteKey = import.meta.env.VITE_APP_CHECK_SITE_KEY as string | undefined;
    if (!siteKey) {
      throw new Error("Missing VITE_APP_CHECK_SITE_KEY");
    }

    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
  })();

  return initPromise;
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  await initFirebase();

  if (!authInstance || !appCheckInstance) {
    throw new Error("Firebase auth not initialized");
  }

  const idToken = await authInstance.currentUser?.getIdToken();
  if (!idToken) {
    throw new Error("Missing auth token");
  }

  const { token: appCheckToken } = await getAppCheckToken(appCheckInstance, false);
  if (!appCheckToken) {
    throw new Error("Missing App Check token");
  }

  return {
    Authorization: `Bearer ${idToken}`,
    "X-Firebase-AppCheck": appCheckToken,
  };
}

export const install = () => {
  void initFirebase();
};
