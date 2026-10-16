<script setup lang="ts">
import type { DetailsModel } from '@/models/details.model';
import { FlightService } from '@/services/flight.service';
import { formatDate, showLoading } from '@/utils';
import Swal from 'sweetalert2';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = Number(route.params.id);

const details = ref<DetailsModel>();
const weather = ref<{ temp: number; condition: string; icon: string } | null>(null);
const isLoadingWeather = ref(false);

// Fetch flight details
FlightService.getDepartureDetails(id).then(data => {
   details.value = data;
   if (data) {
      fetchWeatherForDestination(data.destination);
   }
});

// Computed property for dynamic Google Maps URL based on destination
const mapEmbedUrl = computed(() => {
   if (!details.value) return '';
   // Uses standard Google Maps embed search query URI
   const query = encodeURIComponent(`Airport or city in ${details.value.destination}`);
   return `https://www.google.com/maps?q=${query}&output=embed`;
});

// Simple mock/fetch helper for Open-Meteo (Free weather API, no key required)
async function fetchWeatherForDestination(destination: string) {
   isLoadingWeather.value = true;
   try {
      let lat = 44.7866, lon = 20.4489; // Default Belgrade
      if (destination.toLowerCase().includes('paris')) { lat = 48.8566; lon = 2.3522; }
      else if (destination.toLowerCase().includes('london')) { lat = 51.5074; lon = -0.1278; }
      else if (destination.toLowerCase().includes('new york')) { lat = 40.7128; lon = -74.0060; }

      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`);
      const data = await res.json();

      if (data && data.current) {
         const code = data.current.weather_code;
         weather.value = {
            temp: Math.round(data.current.temperature_2m),
            ...getWeatherCondition(code)
         };

         Swal.close()
      }
   } catch (e) {
      console.error('Failed to load weather', e);
   } finally {
      isLoadingWeather.value = false;
   }
}

function getWeatherCondition(code: number) {
   if (code === 0) return { condition: 'Clear Sky', icon: 'fa-sun text-warning' };
   if (code >= 1 && code <= 3) return { condition: 'Partly Cloudy', icon: 'fa-cloud-sun text-info' };
   if (code >= 45 && code <= 48) return { condition: 'Foggy', icon: 'fa-smog text-secondary' };
   if (code >= 51 && code <= 67) return { condition: 'Rain Showers', icon: 'fa-cloud-rain text-primary' };
   if (code >= 71 && code <= 77) return { condition: 'Snow', icon: 'fa-snowflake text-light' };
   return { condition: 'Fair', icon: 'fa-cloud text-muted' };
}

function getInfoText(d: DetailsModel) {
   const time = new Date(d.scheduledAt);
   if (new Date() < time && d.estimatedAt == null) return 'On Time';
   if (new Date() < time && d.estimatedAt != null) return 'Departing Late';
   if (new Date() > time) return 'Departed';
}

function getInfoClass(d: DetailsModel) {
   const time = new Date(d.scheduledAt);
   if (new Date() < time && d.estimatedAt == null) return 'badge bg-success-subtle text-success border border-success px-2 py-1';
   if (new Date() < time && d.estimatedAt != null) return 'badge bg-warning-subtle text-warning border border-warning px-2 py-1';
   if (new Date() > time) return 'badge bg-danger-subtle text-danger border border-danger px-2 py-1';
}

onMounted(()=>showLoading())
</script>

<template>
   <div class="container py-4" v-if="details">
      <!-- MAIN FLIGHT SECTION -->
      <div class="row g-4 mb-4 align-items-stretch">
         <!-- Destination Image & Weather Widget -->
         <div class="col-12 col-lg-7">
            <div class="card bg-body-secondary border-secondary shadow-sm h-100 overflow-hidden">
               <div class="position-relative h-100 min-vh-50">
                  <img class="w-100 h-100 object-fit-cover" :src="details.imageUrl" :alt="details.destination"
                     style="min-height: 320px; max-height: 450px;" />
                  <div
                     class="position-absolute bottom-0 start-0 end-0 p-3 bg-gradient-dark text-white d-flex justify-content-between align-items-end">
                     <div>
                        <span class="badge bg-primary mb-1">Featured Destination</span>
                        <h2 class="fw-bold mb-0 text-shadow">{{ details.destination }}</h2>
                     </div>
                     <!-- Weather Badge -->
                     <div v-if="weather"
                        class="card bg-dark bg-opacity-75 border-secondary text-white px-3 py-2 backdrop-blur">
                        <div class="d-flex align-items-center gap-2">
                           <i :class="['fa-solid fs-4', weather.icon]"></i>
                           <div>
                              <div class="fs-5 fw-bold lh-1">{{ weather.temp }}°C</div>
                              <small class="text-muted" style="font-size: 0.75rem;">{{ weather.condition }}</small>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <!-- Flight Details Card -->
         <div class="col-12 col-lg-5">
            <div class="card bg-body-secondary border-secondary shadow-sm h-100 d-flex flex-column">
               <div
                  class="card-header bg-transparent border-secondary py-3 d-flex justify-content-between align-items-center">
                  <h5 class="mb-0 fw-bold text-body">
                     <i class="fa-solid fa-plane-departure text-primary me-2"></i> Flight Summary
                  </h5>
                  <span class="badge bg-secondary font-monospace">ID: {{ details.id }}</span>
               </div>

               <div class="card-body flex-grow-1">
                  <ul class="list-group list-group-flush bg-transparent">
                     <li
                        class="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center py-3">
                        <span class="text-muted"><i class="fa-solid fa-hashtag me-2 text-primary"></i>Flight
                           Number</span>
                        <span class="fw-bold font-monospace">{{ details.flightNumber }}</span>
                     </li>
                     <li
                        class="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center py-3">
                        <span class="text-muted"><i class="fa-solid fa-clock-rotate-left me-2 text-info"></i>Scheduled
                           Time</span>
                        <span class="fw-semibold">{{ formatDate(details.scheduledAt) }}</span>
                     </li>
                     <li class="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center py-3"
                        v-if="details.estimatedAt">
                        <span class="text-muted"><i class="fa-solid fa-clock me-2 text-warning"></i>Estimated
                           Time</span>
                        <span class="fw-semibold text-warning">{{ formatDate(details.estimatedAt) }}</span>
                     </li>
                     <li
                        class="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center py-3">
                        <span class="text-muted"><i class="fa-solid fa-info-circle me-2 text-success"></i>Status</span>
                        <span :class="getInfoClass(details)">{{ getInfoText(details) }}</span>
                     </li>
                  </ul>
               </div>

               <div class="card-footer bg-transparent border-secondary p-3">
                  <RouterLink class="btn btn-primary w-100 py-2 fw-semibold shadow-sm" :to="`/order/${id}`">
                     <i class="fa-solid fa-cart-shopping me-2"></i> Book Ticket for {{ details.destination }}
                  </RouterLink>
               </div>
            </div>
         </div>
      </div>

      <!-- GOOGLE MAPS EMBED SECTION -->
      <div class="row mb-5">
         <div class="col-12">
            <div class="card bg-body-secondary border-secondary shadow-sm overflow-hidden">
               <div class="card-header bg-transparent border-secondary py-3">
                  <h5 class="mb-0 fw-bold text-body">
                     <i class="fa-solid fa-map-location-dot text-primary me-2"></i> Destination Map — {{
                     details.destination }}
                  </h5>
               </div>
               <div class="card-body p-0">
                  <div class="ratio ratio-21x9 map-container">
                     <iframe :src="mapEmbedUrl" class="border-0 w-100" allowfullscreen="" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade" title="Destination Map">
                     </iframe>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <!-- OTHER FLIGHTS SECTION -->
      <div v-if="details.other && details.other.length > 0" class="mt-4">
         <div class="d-flex align-items-center mb-3">
            <h4 class="mb-0 fw-bold text-body"><i class="fa-solid fa-list-ul text-primary me-2"></i>Other Departures
            </h4>
            <span class="badge bg-secondary ms-2 rounded-pill">{{ details.other.length }}</span>
         </div>

         <div class="row g-3">
            <div class="col-12 col-sm-6 col-md-4 col-xl-2" v-for="f in details.other" :key="f.id">
               <div class="card bg-body-secondary border-secondary text-center h-100 shadow-sm hover-card">
                  <div class="card-header bg-transparent border-secondary py-2">
                     <strong class="font-monospace text-primary">{{ f.flightNumber }}</strong>
                  </div>
                  <div class="card-body py-3 d-flex flex-column justify-content-center">
                     <small class="text-muted d-block mb-1">Scheduled</small>
                     <span class="small fw-semibold text-body">{{ formatDate(f.scheduledAt) }}</span>
                  </div>
                  <div class="card-footer bg-transparent border-secondary py-2">
                     <div class="btn-group w-100" role="group">
                        <RouterLink :to="`/details/${f.id}`" class="btn btn-sm btn-outline-info" title="View Details">
                           <i class="fa-solid fa-circle-info"></i>
                        </RouterLink>
                        <RouterLink to="#" class="btn btn-sm btn-outline-success" title="Add to Cart">
                           <i class="fa-solid fa-cart-shopping"></i>
                        </RouterLink>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
.object-fit-cover {
   object-fit: cover;
}

.bg-gradient-dark {
   background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%);
}

.hover-card {
   transition: transform 0.2s ease, border-color 0.2s ease;
}

.hover-card:hover {
   transform: translateY(-3px);
   border-color: var(--bs-primary) !important;
}

/* Optional filter to make Google Maps iframe look more integrated in dark themes */
.map-container iframe {
   filter: grayscale(20%) contrast(110%);
}
</style>