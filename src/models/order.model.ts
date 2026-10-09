export interface OrderModel {
    flightId: number
    flightClass: 'f' | 'b' | 'e'
    ticketCount: number
    pricePerTicket: number
    isReturnTicket: boolean
    createdAt: string
    paidAt: string | null
    deletedAt: string | null
}