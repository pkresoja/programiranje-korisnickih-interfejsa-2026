export interface OrderModel {
    flightId: number
    flightClass: 'f' | 'b' | 'e'
    ticketCount: number
    pricePerTicket: number
    isReturnTicket: boolean
    destination?: string
    flightNumber?: string
    scheduledAt?: string
    estimatedAt?: string | null
    createdAt: string
    paidAt: string | null
    deletedAt: string | null
}