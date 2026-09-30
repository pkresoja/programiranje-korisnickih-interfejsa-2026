import type { FlightModel } from "@/models/flight.model"
import axios from "axios"

export class FlightService {
    static async getDepatures(): Promise<FlightModel[]> {
        const rsp = await axios.request({
            method: 'GET',
            url: 'https://flight.pequla.com/api/flight/list',
            params: {
                type: 'departure'
            },
            headers: {
                'Accept': 'application/json',
                'X-Name': 'PKI-2026'
            }
        })

        let flights = []

        for (let obj of rsp.data) {
            flights.push({
                id: obj.id,
                destination: obj.destination,
                imageUrl: `https://img.pequla.com/destination/${obj.destination.split(' ')[0].toLowerCase()}.jpg`,
                flightNumber: obj.flightNumber,
                scheduledAt: obj.scheduledAt
            })
        }

        // Sortiranje po vremenu polaska
        return flights.sort((a: any, b: any) =>
            new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
        )
    }
}