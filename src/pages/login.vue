<script setup lang='ts'>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store'

const auth = useAuthStore()

const router = useRouter()

const password = ref('')
const errorMessage = ref('')

function login() {
  auth.login(password.value)
  if (auth.authentificated) {
    password.value = ''
    errorMessage.value = ''
    router.push('/admin')
  }
  else {
    password.value = ''
    errorMessage.value = 'Login Error - Try again'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow">
        <h2 class="mt-6 text-center text-3xl font-extrabold">
          Sign in to Administration area
        </h2>
        <p class="mt-2 text-center text-sm">
          Use: 1234 ;-)
        </p>
        <p v-if="errorMessage.length > 0" class="mt-2 text-center text-sm text-red-600">
          Login Error - Try again
        </p>
      </div>
      <form class="mt-8 space-y-6" action="#" method="POST">
        <input type="hidden" name="remember" value="true">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input id="email-address" v-model="auth.email" name="email" type="email" autocomplete="email" required="" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" v-model="password" name="password" type="password" autocomplete="current-password" required="" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password">
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium hover:text-indigo-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <Button class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" @click="login">
            Sign in
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
