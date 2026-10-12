import type { OrderModel } from "./models/order.model"

export function formatDate(iso: string) {
    return new Date(iso).toLocaleString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export function getPriceForOrder(order: OrderModel) {
    return order.pricePerTicket * order.ticketCount * (order.isReturnTicket ? 1.8 : 1)
}