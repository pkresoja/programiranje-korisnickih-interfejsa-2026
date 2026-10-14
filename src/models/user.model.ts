import type { OrderModel } from "./order.model"

export interface UserModel {
    email: string
    password: string
    destination: string
    orders: OrderModel[]
}