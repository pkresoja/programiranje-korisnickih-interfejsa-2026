import type { FlightModel } from "@/models/flight.model"
import axios, { type AxiosResponse } from "axios"

const client = axios.create({
    baseURL: 'https://flight.pequla.com/api/flight',
    headers: {
        'Accept': 'application/json',
        'X-Name': 'PKI-2026'
    }
})

export class FlightService {
    static async getDepatures(): Promise<FlightModel[]> {
        const rsp = await client.request({
            method: 'GET',
            url: '/list',
            params: {
                type: 'departure'
            }
        })

        return this.mapResponseToObject(rsp)
    }

    static async getByDestination(dest: string) {
        return await client.request({
            method: 'GET',
            url: `/destination/${dest}`,
            params: {
                type: 'departure',
                size: 30,
                sort: 'scheduledAt,asc'
            }
        })
    }

    static async getDepartureDetails(id: number) {
        const details = await client.get(`/${id}`)
        const other = await this.getByDestination(details.data.destination)

        let otherButFiltered = []
        for (let obj of other.data.content) {
            if (obj.id !== details.data.id) {
                otherButFiltered.push({
                    id: obj.id,
                    flightNumber: obj.flightNumber,
                    scheduledAt: obj.scheduledAt,
                    estimatedAt: obj.estimatedAt
                })
            }
        }

        return {
            id: details.data.id,
            destination: details.data.destination,
            imageUrl: this.getImageUrl(details.data),
            flightNumber: details.data.flightNumber,
            scheduledAt: details.data.scheduledAt,
            estimatedAt: details.data.estimatedAt,
            other: otherButFiltered
        }
    }

    static async getDeparturesByIds(ids: number[]) {
        const rsp = await client.request({
            url: '/list',
            method: 'POST',
            data: ids
        })


        // Fake sleep for 5 sec
        await new Promise(resolve => setTimeout(resolve, 2000))

        return this.mapResponseToObject(rsp)
    }

    static async getDestinations() {
        return await client.get('/destination')
    }

    static async mapResponseToObject(rsp: AxiosResponse) {
        let flights = []

        for (let obj of rsp.data) {
            flights.push({
                id: obj.id,
                destination: obj.destination,
                imageUrl: this.getImageUrl(obj),
                flightNumber: obj.flightNumber,
                scheduledAt: obj.scheduledAt,
                estimatedAt: obj.estimatedAt
            })
        }

        // Sortiranje po vremenu polaska
        return flights.sort((a: any, b: any) =>
            new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
        )
    }

    static getImageUrl(obj: any) {
        return `https://img.pequla.com/destination/${obj.destination.split(' ')[0].toLowerCase()}.jpg`
    }
}