import type { FlightModel } from "./flight.model"

export interface DetailsModel extends FlightModel {
    other: {
      id: number
      flightNumber: string
      scheduledAt: string
      estimatedAt: string | null
    }[]
}