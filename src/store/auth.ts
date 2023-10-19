import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const name = ref<string | null>(localStorage.getItem("name"));
  const email = ref<string | null>(localStorage.getItem("email"));
  const authenticated = ref<boolean>(!!name.value && !!email.value);

  function login(userName: string, userEmail: string) {
    name.value = userName;
    email.value = userEmail;

    localStorage.setItem("name", userName);
    localStorage.setItem("email", userEmail);

    authenticated.value = true;
  }

  function logout() {
    name.value = null;
    email.value = null;

    localStorage.clear();

    authenticated.value = false;
  }

  function getUserLabel() {
    if (name.value) {
      const splitName = name.value.split(" ");

      if (splitName.length > 1) {
        return `${splitName[0][0]}${splitName[1][0]}`;
      } else {
        return `${splitName[0][0]}${splitName[0][1]}`;
      }
    }

    return "";
  }

  return { authenticated, name, email, login, logout, getUserLabel };
});
