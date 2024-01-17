<template>
  <div>
    <v-row
      no-gutters
      align="center"
      style="margin-top: 32px; margin-bottom: 24px"
    >
      <v-col cols="12" xl="4" lg="4" md="6" sm="12">
        <v-text-field
          dense
          outlined
          label="Пошук"
          placeholder="Введіть тут.."
          hide-details
          class="rounded-lg"
          v-model="search"
        />
      </v-col>
      <v-row no-gutters justify="end">
        <v-btn
          color="primary"
          text
          class="createNesUserBtn"
          @click="showDetailUserModal = true"
          >Новий користувач</v-btn
        >
      </v-row>
    </v-row>

    <v-data-table
      style="width: 100%; background-color: transparent"
      :headers="headers"
      :items="usersListFiltered"
      hide-default-footer
      :items-per-page="100"
      no-data-text=""
      :loading="loading"
    >
      <template v-slot:[`item.avatar`]="{ item }">
        <img
          width="50px"
          height="50px"
          style="border-radius: 50%; margin: 5px 0px"
          :src="item?.avatar"
          alt="user avatar"
        />
      </template>
      <template v-slot:[`item.name`]="{ item }">
        <span
          style="cursor: pointer"
          @click="
            (userId = item.id), (isEdit = true), (showDetailUserModal = true)
          "
          >{{ item?.first_name }} {{ item.last_name }}</span
        >
      </template>
      <template v-slot:[`item.email`]="{ item }">
        <a
          :href="`mailto: ${item.email}`"
          style="text-decoration: none; color: black; font-weight: 500"
          >{{ item.email }}</a
        >
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-icon @click="(userForDeleteId = item.id), (showConfirmModal = true)"
          >mdi-delete-outline</v-icon
        >
      </template>
    </v-data-table>
    <v-row no-gutters justify="center">
      <v-pagination
        v-if="quantityPage > 0"
        :length="quantityPage"
        v-model="page"
        style="margin-top: 24px"
      />
    </v-row>
    <confirm-modal
      v-if="showConfirmModal"
      :visible="showConfirmModal"
      text="Ви впевнені, що хочете видалити користувача?"
      @confirm="deleteUser"
      @close="showConfirmModal = false"
    />
    <user-detail-modal
      v-if="showDetailUserModal"
      :visible="showDetailUserModal"
      :userId="userId"
      :isEdit="isEdit"
      @close="
        (showDetailUserModal = false), (userForDeleteId = ''), (isEdit = false)
      "
    />
  </div>
</template>

<script>
import usersService from "@/requests/usersService";
import confirmModal from "@/UI/confirmModal";
import UserDetailModal from "./userDetailModal.vue";
export default {
  components: {
    confirmModal,
    UserDetailModal,
  },
  data: () => ({
    headers: [
      {
        text: "Аватар",
        align: "start",
        value: "avatar",
        sortable: false,
      },
      { text: "Ім'я", value: "name", align: "start", sortable: true },
      { text: "Email", value: "email", align: "start", sortable: true },
      { text: "Опції", value: "action", sortable: false, align: "end" },
    ],
    usersList: [],
    usersListFiltered: [],
    quantityPage: 0,
    page: 1,
    loading: true,
    showConfirmModal: false,
    showDetailUserModal: false,
    isEdit: false,
    userForDeleteId: "",
    userId: "",
    search: "",
    searchTimeout: "",
  }),
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      await usersService.getUsers(this.page, this.search).then((res) => {
        this.usersList = res.data;
        this.usersListFiltered = this.usersList;
        this.quantityPage = res.total_pages;
        this.page = res.page;
        this.loading = false;
      });
    },
    searchUsers() {
      this.usersListFiltered = this.usersList.filter(
        (user) =>
          user.first_name
            .toLowerCase()
            .includes(this.search.toLocaleLowerCase()) ||
          user.last_name
            .toLowerCase()
            .includes(this.search.toLocaleLowerCase()) ||
          user.email.toLowerCase().includes(this.search.toLocaleLowerCase())
      );
      this.loading = false;
    },
    async deleteUser() {
      await usersService.deleteUser(this.userForDeleteId).then(() => {
        this.showConfirmModal = false;
        this.loading = true;
        this.getUsers();
      });
    },
  },
  watch: {
    page: {
      handler() {
        if (this.page !== null && this.page !== undefined) {
          this.loading = true;
          this.getUsers();
        }
      },
    },
    search: {
      handler() {
        this.loading = true;
        this.quantityPage = 0;
        if (
          this.search !== "" &&
          this.search !== null &&
          this.search !== undefined
        ) {
          clearTimeout(this.searchTimeout);
          this.searchTimeout = setTimeout(() => {
            this.searchUsers();
          }, 500);
        } else {
          this.getUsers();
        }
      },
    },
  },
};
</script>

<style scoped>
.createNesUserBtn {
  text-transform: none;
}
</style>