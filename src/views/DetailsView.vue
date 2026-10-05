<script setup lang="ts">
import type { DetailsModel } from '@/models/details.mode';
import { FlightService } from '@/services/flight.service';
import { formatDate } from '@/utils';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const id = Number(route.params.id)

const details = ref<DetailsModel>()
FlightService.getDepartureDetails(id)
   .then(data => details.value = data)

function getInfoText(d: DetailsModel) {
   const time = new Date(d.scheduledAt)

   if (new Date() < time && d.estimatedAt == null)
   return 'On Time'

   if (new Date() < time && d.estimatedAt != null)
   return 'Departing Late'

   if (new Date() > time)
   return 'Departed'
}

function getInfoClass(d: DetailsModel) {
   const time = new Date(d.scheduledAt)

   if (new Date() < time && d.estimatedAt == null)
   return 'text-success fw-bold'

   if (new Date() < time && d.estimatedAt != null)
   return 'text-warning fw-bold'

   if (new Date() > time)
   return 'text-danger fw-bold'
}
</script>

<template>
   <div class="row" v-if="details">
      <div class="col-12 col-md-6 mb-3">
         <img class="img-fluid" :src="details.imageUrl" />
      </div>
      <div class="col-12 col-md-6 mb-3">
         <div class="card">
            <div class="card-header">
               <strong>{{ details.destination }}</strong>
            </div>
            <div class="card-body">
               <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                     <i class="fa-solid fa-hashtag"></i> {{ details.flightNumber }}
                  </li>
                  <li class="list-group-item">
                     <i class="fa-solid fa-clock-rotate-left"></i> {{ formatDate(details.scheduledAt) }}
                  </li>
                  <li class="list-group-item">
                     <i class="fa-solid fa-info"></i> <span :class="getInfoClass(details)">{{getInfoText(details)}}</span>
                  </li>
               </ul>
            </div>
         </div>
      </div>
   </div>

   <!-- OTHER FLIGHTS -->
   <div v-if="details && details.other.length > 0">
      <h5>Other departures:</h5>
      <div class="row">
         <div class="col-12 col-md-2 mb-3" v-for="f in details.other">
            <div class="card text-center">
               <div class="card-header">
                  <strong>{{ f.flightNumber }}</strong>
               </div>
               <div class="card-body">
                  {{ formatDate(f.scheduledAt) }}
               </div>
               <div class="card-footer">
                  <div class="btn-group">
                     <RouterLink :to="`/details/${f.id}`" class="btn btn-sm btn-primary" title="Details">
                        <i class="fa-solid fa-circle-info"></i>
                     </RouterLink>
                     <RouterLink to="#" class="btn btn-sm btn-success" title="Add to cart">
                        <i class="fa-solid fa-cart-shopping"></i>
                     </RouterLink>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>