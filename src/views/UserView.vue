<script lang="ts" setup>
import { useLogin } from '@/hooks/login.hook';
import { UserService } from '@/services/user.service';
import { onMounted } from 'vue';

const validateLogin = useLogin()

onMounted(() => validateLogin())
</script>

<template>
    <div class="card">
        <div class="card-header fw-bold">
            Orders
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
                        <th scope="col">Options</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in UserService.getActiveUser()?.orders">
                        <th scope="row">{{ order.flightId }}</th>
                        <td>/</td>
                        <td>/</td>
                        <td>{{ order.flightClass }}</td>
                        <td>{{ order.isReturnTicket }}</td>
                        <td>{{ order.ticketCount }}</td>
                        <td>
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-primary">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button type="button" class="btn btn-sm btn-danger">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <p class="fw-bold display-6">Total: 0EUR</p>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div class="card-footer">
            <button type="button" class="btn btn-success">
                <i class="fa-solid fa-credit-card"></i> Checkout
            </button>
        </div>
    </div>
    <pre>{{ UserService.getActiveUser() }}</pre>
</template>