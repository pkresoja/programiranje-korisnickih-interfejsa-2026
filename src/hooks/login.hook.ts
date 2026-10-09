import { UserService } from "@/services/user.service"
import { useRoute, useRouter } from "vue-router"

export function useLogin() {
    return () => {
        const router = useRouter()
        const route = useRoute()

        if (!UserService.getActiveUser()) {
            sessionStorage.setItem('to', route.fullPath)
            router.push('/login')
        }
    }
}