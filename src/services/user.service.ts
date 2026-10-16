import type { OrderModel } from "@/models/order.model"
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
                    destination: 'Zagreb',
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

    static addOrder(order: OrderModel) {
        const activeUser = this.getActiveUser()
        const users = this.getUsers()

        if (activeUser) {
            for (let user of users) {
                if (user.email === activeUser.email) {
                    user.orders.push(order)
                }
            }

            localStorage.setItem(USERS_KEY, JSON.stringify(users))
        }
    }

    static pay() {
        const activeUser = this.getActiveUser()
        const users = this.getUsers()
        const now = new Date().toISOString()

        if (activeUser) {
            for (let user of users) {
                if (user.email === activeUser.email) {
                    for (let order of user.orders) {
                        order.paidAt = now
                    }
                }
            }

            localStorage.setItem(USERS_KEY, JSON.stringify(users))
        }
    }

    static removeOrder(order: OrderModel) {
        const activeUser = this.getActiveUser()
        const users = this.getUsers()

        if (activeUser) {
            for (let user of users) {
                if (user.email === activeUser.email) {
                    for (let obj of user.orders) {
                        if (order.createdAt == obj.createdAt) {
                            obj.deletedAt = new Date().toISOString()
                        }
                    }
                }
            }

            localStorage.setItem(USERS_KEY, JSON.stringify(users))
        }
    }

    static changePassword(newPassword: string) {
        const activeUser = this.getActiveUser()
        const users = this.getUsers()

        if (activeUser) {
            for (let user of users) {
                if (user.email === activeUser.email) {
                    user.password = newPassword
                }
            }

            localStorage.setItem(USERS_KEY, JSON.stringify(users))
        }
    }

    static createUser(email: string, password: string, destination: string) {
        const users = this.getUsers()

        for (let user of users) {
            if (user.email === email) {
                return 'Email already in use!'
            }
        }

        if (password.length < 8) {
            return 'Password must be at least 8 chars long!'
        }

        users.push({
            email, password, destination, orders: []
        })

        localStorage.setItem(USERS_KEY, JSON.stringify(users))
        return null
    }
}