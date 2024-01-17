<template>
  <v-dialog v-model="visibility" width="500px">
    <success-snackbar
      v-if="showSuccessSnackbar"
      :text="snackbarText"
      @close="showSuccessSnackbar = false"
    />
    <v-card class="modalBackground">
      <v-col class="px-0">
        <v-row no-gutters justify="center">
          <input
            type="file"
            ref="fileInput"
            style="display: none"
            @change="handleFileUpload"
          />
          <div
            class="avatar"
            :style="{
              'background-image': user.avatar
                ? `url(${user.avatar})`
                : `url(${require('@/assets/img/empty_avatar.jpg')})`,
              backgroundSize: 'cover',
            }"
            @click="$refs.fileInput.click()"
          ></div>
        </v-row>
        <v-text-field
          outlined
          dense
          class="rounded-lg"
          v-model="user.first_name"
          placeholder="Введіть ваше ім'я.."
          label="Ім'я"
          :error-messages="firstNameError"
        />
        <v-text-field
          outlined
          dense
          class="rounded-lg"
          v-model="user.last_name"
          placeholder="Введіть ваше прізвище.."
          label="Прізвище"
          :error-messages="lastNameError"
        />
        <v-text-field
          outlined
          dense
          class="rounded-lg"
          v-model="user.email"
          placeholder="Введіть ваш емейл.."
          label="Емейл"
          :error-messages="emailError"
        />
        <v-text-field
          v-if="isEdit"
          outlined
          dense
          class="rounded-lg"
          v-model="user.phone_number"
          placeholder="Введіть ваш номер телефону.."
          label="Номер телефону"
          :error-messages="phoneNumberError"
          v-mask="'+###############'"
        />
        <v-text-field
          v-if="isEdit"
          outlined
          dense
          class="rounded-lg"
          v-model="user.address"
          placeholder="Введіть вашу адресу"
          label="Адрес"
        />
        <v-row no-gutters style="margin-top: 12px">
          <v-btn
            @click="$emit('close')"
            outlined
            color="error"
            width="calc(50% - 8px)"
            style="margin-right: 16px"
            >Скасувати</v-btn
          >
          <v-btn @click="saveUserInfo" color="primary" width="calc(50% - 8px)"
            >Зберегти</v-btn
          >
        </v-row>
      </v-col>
      <input type="fil" />
    </v-card>
  </v-dialog>
</template>

<script>
import modalMixin from "@/mixins/modalMixin";
import usersService from "@/requests/usersService";
import { validationMixin } from "vuelidate";
import { required, minLength, email } from "vuelidate/lib/validators";
import SuccessSnackbar from "@/UI/snackbars/successSnackbar.vue";
export default {
  mixins: [modalMixin, validationMixin],
  components: { SuccessSnackbar },
  data: () => ({
    user: {},
    snackbarText: "",
    showSuccessSnackbar: "",
  }),
  validations: {
    user: {
      first_name: {
        required,
      },
      last_name: {
        required,
      },
      email: {
        required,
        email,
      },
      phone_number: {
        minLength: minLength(10),
      },
    },
  },
  props: {
    userId: {
      require: true,
    },
    isEdit: {
      require: false,
    },
  },
  mounted() {
    if (
      this.isEdit &&
      this.userId !== "" &&
      this.userId !== null &&
      this.userId !== undefined
    ) {
      this.getUserById();
    }
  },
  methods: {
    async getUserById() {
      await usersService.getUserById(this.userId).then((res) => {
        this.user = res.data;
      });
    },
    async saveUserInfo() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.isEdit) {
          let user = {
            avatar: this.user.avatar,
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            email: this.user.email,
            phone_number: this.user.phone_number || "",
            address: this.user.address || "",
          };
          await usersService.updateUser(this.user.id, user).then(() => {
            this.snackbarText = "Дані користувача успішно оновлено";
            this.showSuccessSnackbar = true;
          });
        } else {
          let user = {
            avatar: this.user.avatar,
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            email: this.user.email,
          };
          await usersService.createUser(user).then(() => {
            this.$emit("close");
          });
        }
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.$set(this.user, "avatar", reader.result);
      };
      reader.readAsDataURL(file);
      this.user.avatar_file = file;
    },
  },
  computed: {
    firstNameError() {
      const errors = [];
      const field = this.$v.user.first_name;

      if (!field.$dirty) {
        return errors;
      }

      if (!field.required) {
        errors.push("Обов'язкове поле");
      }

      return errors;
    },
    lastNameError() {
      const errors = [];
      const field = this.$v.user.last_name;

      if (!field.$dirty) {
        return errors;
      }

      if (!field.required) {
        errors.push("Обов'язкове поле");
      }

      return errors;
    },
    phoneNumberError() {
      const errors = [];
      const field = this.$v.user.phone_number;

      if (!field.$dirty) {
        return errors;
      }

      if (!field.minLength) {
        errors.push("Неправильний номер телефону");
      }

      return errors;
    },
    emailError() {
      const errors = [];
      const field = this.$v.user.email;

      if (!field.$dirty) {
        return errors;
      }

      if (!field.required) {
        errors.push("Field is required");
      }
      if (!field.email) {
        errors.push("Field is required");
      }

      return errors;
    },
  },
};
</script>

<style scoped>
.modalBackground {
  padding: 20px;
}
.avatar {
  width: 100px;
  height: 100px;
  background: silver;
  border-radius: 50%;
  margin-bottom: 24px;
  position: relative;
}

.avatar:hover {
  background: silver;
  cursor: pointer;
}

.avatar:hover::after {
  content: url("@/assets/img/camera.png");
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  z-index: 10;
  border-radius: 50%;
  background-color: rgb(0, 0, 0, 0.5);
}
</style>