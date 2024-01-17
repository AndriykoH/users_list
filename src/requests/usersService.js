import requestService from "./requestService";

export default {
    async getUsers(page) {
        const response = await requestService.get(`/users?page=${page}`)
        return response?.data
    },
    async getUserById(id) {
        const response = await requestService.get(`/users/${id}`)
        return response?.data
    },
    async createUser(form) {
        const response = await requestService.post(`/users`, form)
        return response?.data
    },
    async updateUser(id, form) {
        const response = await requestService.post(`/users/${id}`, form)
        return response?.data
    },
    async deleteUser(id) {
        const response = await requestService.delete(`/users/${id}`)
        return response?.data
    }
}