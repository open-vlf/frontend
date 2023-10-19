<script setup lang="ts">
import { useForm, Form } from "vee-validate";
import * as Yup from "yup";
import { useAuthStore } from "@/store";

const visible = defineModel<boolean>({ required: true });
const { editable, onDownload } = defineProps({
  editable: {
    type: Boolean,
    default: false,
  },
  onDownload: {
    type: Function,
  },
});

const schema = Yup.object().shape({
  name: Yup.string()
    .min(2, "This name is too short!")
    .matches(RegExp("^[a-zA-Z]+(([a-zA-Z ])?[a-zA-Z]*)*$"), {
      message: "Please use only characters",
    })
    .required("We need your name to continue!"),
  email: Yup.string()
    .email("This email format is invalid")
    .required("We need your name to continue!"),
});

const authStore = useAuthStore();
const { defineComponentBinds, handleSubmit, resetForm, errors, setValues } =
  useForm({
    validationSchema: schema,
    initialValues: {
      name: authStore.name,
      email: authStore.email,
    },
  });

const name = defineComponentBinds("name");
const email = defineComponentBinds("email");

const onSubmit = handleSubmit((values) => {
  const user = values as { name: string; email: string };

  authStore.login(user.name.trim(), user.email);

  if (onDownload) {
    onDownload();
  }

  visible.value = false;
  resetForm();
});

function onDelete() {
  authStore.logout();
  visible.value = false;
  resetForm();
}

function onHide() {
  resetForm();

  setValues({ name: authStore.name, email: authStore.email });
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    @after-hide="onHide"
    @show="onHide"
    modal
    close-on-escape
    closable
    header="One more thing"
    class="md:w-40% w-70%"
  >
    <template #header>
      <p class="text-2xl font-bold">
        <i
          :class="`pi pi-${editable ? 'lock' : 'link'} mr-1`"
          style="font-size: 1.2rem"
        />
        {{ editable ? "Managing my information" : "One more thing" }}
      </p>
    </template>

    <p v-if="editable" class="card mt-0 mb-6 p-4">
      You are reviewing your download information, feel free to edit or remove
      them!
    </p>

    <p v-else class="card mt-0 mb-6 p-4">
      To maintain data integrity, we kindly request that you provide some
      information before proceeding with the data download. We appreciate your
      understanding!
    </p>

    <form @submit="onSubmit" class="flex flex-col gap-2">
      <div class="flex flex-col gap-2">
        <label for="name">Name</label>

        <InputText
          id="name"
          v-bind="name"
          type="text"
          :class="{ 'p-invalid': errors.name }"
          aria-describedby="text-error"
        />

        <small class="p-error" id="text-error">
          {{ errors.name || "&nbsp;" }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="email">Email</label>

        <InputText
          id="email"
          v-bind="email"
          type="text"
          :class="{ 'p-invalid': errors.email }"
          aria-describedby="text-error"
        />

        <small class="p-error" id="text-error">
          {{ errors.email || "&nbsp;" }}
        </small>
      </div>

      <div v-if="editable" class="flex mt-4">
        <Button
          outlined
          label="Delete"
          icon="pi pi-trash"
          class="w-full mr-4"
          @click="onDelete"
        />

        <Button
          type="submit"
          label="Save"
          icon="pi pi-check"
          class="w-full ml-4"
        />
      </div>

      <Button
        v-else
        type="submit"
        label="Download"
        icon="pi pi-download"
        class="mt-4"
      />
    </form>
  </Dialog>
</template>

<style scoped></style>
