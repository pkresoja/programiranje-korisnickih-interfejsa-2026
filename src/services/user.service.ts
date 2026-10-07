import type { UserModel } from "@/models/user.model"

const USERS_KEY = 'pki_2026_users'
const ACTIVE_USER_KEY = 'pki_2026_active'

export class UserService {

    static getUsers(): UserModel[] {
        if (localStorage.getItem(USERS_KEY) == null) {
            localStorage.setItem(USERS_KEY, JSON.stringify([
                {
                    email: 'user@example.com',
                    password: 'user123',
                    orders: []
                }
            ]))
        }

        return JSON.parse(localStorage.getItem(USERS_KEY)!)
    }

    static login(email: string, password: string): boolean {
        const users = this.getUsers()

        for (let user of users) {
            if (user.email == email && user.password == password) {
                localStorage.setItem(ACTIVE_USER_KEY, email)
                return true
            }
        }

        return false
    }

    static getActiveUser(): UserModel | null {
        for (let user of this.getUsers()) {
            if (user.email == localStorage.getItem(ACTIVE_USER_KEY)) {
                return user
            }
        }

        return null
    }

    static logout() {
        localStorage.removeItem(ACTIVE_USER_KEY)
    }

}