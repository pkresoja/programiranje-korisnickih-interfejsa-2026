<script lang="ts" setup>
import type { OrderModel } from '@/models/order.model';
import { getPriceForOrder } from '@/utils';

export interface OrderCardProps {
    title: string
    orders: OrderModel[]
}

const {title, orders} = defineProps<OrderCardProps>()
</script>

<template>
    <div class="card mb-3">
        <div class="card-header fw-bold">
            {{ title }}
        </div>
        <div class="card-body">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Destination</th>
                        <th scope="col">Flight Number</th>
                        <th scope="col">Flight Class</th>
                        <th scope="col">Return Ticket</th>
                        <th scope="col">Ticket Count</th>
                        <th scope="col">Price</th>
                        <th scope="col">Options</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders">
                        <th scope="row">{{ order.flightId }}</th>
                        <td>{{ order.destination }}</td>
                        <td>{{ order.flightNumber }}</td>
                        <td>
                            <span v-if="order.flightClass == 'f'">
                                First Class
                            </span>
                            <span v-if="order.flightClass == 'b'">
                                Business
                            </span>
                            <span v-if="order.flightClass == 'e'">
                                Economy
                            </span>
                        </td>
                        <td>{{ order.isReturnTicket ? 'Yes' : 'No' }}</td>
                        <td>{{ order.ticketCount }} {{ order.pricePerTicket }}</td>
                        <td>{{ getPriceForOrder(order) }} EUR</td>
                        <td>
                            <slot name="options" :order="order"></slot>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <slot name="footer"></slot>
    </div>
</template>