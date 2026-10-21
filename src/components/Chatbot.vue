<script setup lang="ts">
import { FlightService } from '@/services/flight.service'
import { formatDate } from '@/utils'
import { nextTick, ref } from 'vue'

interface ChatMessage {
    id: number
    text: string
    sender: 'user' | 'bot'
}

const isOpen = ref(false)
const inputMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

let nextMessageId = 1

const messages = ref<ChatMessage[]>([
    {
        id: nextMessageId++,
        text: 'Hi! How can I help you today?',
        sender: 'bot'
    }
])

const suggestions = [
    'Hi!',
    'List flights to Zagreb'
]

async function scrollToBottom() {
    await nextTick()

    if (messagesContainer.value) {
        messagesContainer.value.scrollTop =
            messagesContainer.value.scrollHeight
    }
}

async function getBotResponse(message: string) {
    const text = message.toLowerCase()

    if (
        text.includes('hello') ||
        text.includes('hi') ||
        text.includes('hey')
    ) {
        return 'Hello! What can I help you with?'
    }

    if (text.includes('list')) {
        const all = text.split(' ')
        const dest = String(all[all.length - 1])

        const rsp = await FlightService.getByDestination(dest)

        if (rsp.data.content.length == 0)
            return 'No flights found for ' + dest

        let list = '<ul>'
        for (let f of rsp.data.content) {
            list += `<li><a href="/details/${f.id}" target="_blank">(${f.id}) ${formatDate(f.scheduledAt)}</li></a>`
        }
        list += '</ul>'
        return `<p>I have found the following:</p>${list}`
    }

    return `Didn't quite get you! Can you ask differently?`
}

async function sendMessage(text?: string) {
    const message = (text ?? inputMessage.value).trim()

    if (!message || isTyping.value) return

    messages.value.push({
        id: nextMessageId++,
        text: message,
        sender: 'user'
    })

    inputMessage.value = ''
    isTyping.value = true

    await scrollToBottom()

    // Demo response. Replace this with an API call to an AI backend.
    window.setTimeout(async () => {
        messages.value.push({
            id: nextMessageId++,
            text: await getBotResponse(message),
            sender: 'bot'
        })

        isTyping.value = false
        await scrollToBottom()
    }, 600)
}

function toggleChat() {
    isOpen.value = !isOpen.value

    if (isOpen.value) {
        scrollToBottom()
    }
}
</script>

<template>
    <div class="chatbot-widget">
        <!-- Floating toggle button -->
        <button v-if="!isOpen" type="button" class="btn btn-primary chatbot-toggle rounded-circle shadow-lg"
            aria-label="Open chat assistant" aria-haspopup="dialog" @click="toggleChat">
            <i class="fa-solid fa-comments fa-lg"></i>
            <span class="chatbot-notification"></span>
        </button>

        <!-- Chat window -->
        <section v-if="isOpen" class="card chatbot-window shadow-lg" role="dialog" aria-label="PKI 2026 chat assistant"
            aria-modal="false">
            <!-- Header -->
            <div class="card-header bg-primary text-white d-flex align-items-center justify-content-between py-3">
                <div class="d-flex align-items-center gap-2">
                    <div class="chatbot-avatar">
                        <i class="fa-solid fa-robot"></i>
                    </div>

                    <div>
                        <div class="fw-bold">Assistant</div>
                        <small class="chatbot-status">
                            <span class="status-dot"></span>
                            Here to help
                        </small>
                    </div>
                </div>

                <button type="button" class="btn btn-sm btn-primary border-0" aria-label="Close chat"
                    @click="toggleChat">
                    <i class="fa-solid fa-xmark fa-lg"></i>
                </button>
            </div>

            <!-- Messages -->
            <div ref="messagesContainer" class="card-body chatbot-messages" aria-live="polite"
                aria-relevant="additions">
                <div v-for="message in messages" :key="message.id" class="d-flex mb-3" :class="message.sender === 'user'
                    ? 'justify-content-end'
                    : 'justify-content-start'">
                    <div class="chatbot-bubble" :class="message.sender === 'user'
                        ? 'chatbot-bubble-user'
                        : 'chatbot-bubble-bot'">
                        <div class="chatbot-message-text" v-html="message.text"></div>
                    </div>
                </div>

                <div v-if="isTyping" class="d-flex justify-content-start mb-3">
                    <div class="chatbot-bubble chatbot-bubble-bot">
                        <span class="typing-indicator" aria-label="Assistant is typing">
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </div>
                </div>

                <div v-if="messages.length === 1" class="chatbot-suggestions">
                    <p class="small text-body-secondary mb-2">Quick questions</p>

                    <button v-for="suggestion in suggestions" :key="suggestion" type="button"
                        class="btn btn-sm btn-outline-primary rounded-pill mb-2" @click="sendMessage(suggestion)">
                        {{ suggestion }}
                    </button>
                </div>
            </div>

            <!-- Input -->
            <div class="card-footer bg-body p-3">
                <form class="d-flex gap-2" @submit.prevent="sendMessage()">
                    <input v-model="inputMessage" type="text" class="form-control" placeholder="Type your message..."
                        aria-label="Type your message" autocomplete="off" :disabled="isTyping" />

                    <button type="submit" class="btn btn-primary" aria-label="Send message"
                        :disabled="!inputMessage.trim() || isTyping">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </form>

                <div class="text-center mt-2">
                    <small class="text-body-secondary">
                        Chat Support Assistant
                    </small>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.chatbot-widget {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 1055;
    font-family: inherit;
}

.chatbot-toggle {
    position: relative;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
}

.chatbot-toggle:hover {
    transform: scale(1.06);
}

.chatbot-notification {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 12px;
    height: 12px;
    background-color: #20c997;
    border: 2px solid var(--bs-body-bg);
    border-radius: 50%;
}

.chatbot-window {
    width: 370px;
    height: min(540px, calc(100dvh - 100px));
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 16px;
    border-color: var(--bs-border-color);
    background-color: var(--bs-body-bg);
    animation: chatbot-appear 0.2s ease-out;
}

.chatbot-window>.card-header {
    flex-shrink: 0;
}

.chatbot-avatar {
    display: flex;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    font-size: 18px;
}

.chatbot-status {
    display: flex;
    align-items: center;
    gap: 6px;
    opacity: 0.9;
}

.status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #20c997;
}

.chatbot-messages {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 20px 14px;
    scroll-behavior: smooth;
}

.chatbot-bubble {
    max-width: 85%;
    padding: 11px 14px;
    border-radius: 16px;
    overflow-wrap: anywhere;
    font-size: 0.925rem;
    line-height: 1.5;
}

.chatbot-bubble-user {
    color: #fff;
    background-color: var(--bs-primary);
    border-bottom-right-radius: 4px;
}

.chatbot-bubble-bot {
    color: var(--bs-body-color);
    background-color: var(--bs-secondary-bg);
    border: 1px solid var(--bs-border-color);
    border-bottom-left-radius: 4px;
}

.chatbot-message-text {
    white-space: pre-wrap;
}

.chatbot-suggestions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 20px;
}

.chatbot-suggestions .btn {
    white-space: normal;
    text-align: left;
}

.typing-indicator {
    display: flex;
    gap: 4px;
    padding: 4px 2px;
}

.typing-indicator span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: var(--bs-secondary-color);
    animation: typing 1s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.15s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.3s;
}

.chatbot-window .card-footer {
    flex-shrink: 0;
    border-top: 1px solid var(--bs-border-color);
}

@keyframes typing {

    0%,
    60%,
    100% {
        opacity: 0.4;
        transform: translateY(0);
    }

    30% {
        opacity: 1;
        transform: translateY(-4px);
    }
}

@keyframes chatbot-appear {
    from {
        opacity: 0;
        transform: translateY(10px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@media (max-width: 576px) {
    .chatbot-widget {
        right: 12px;
        bottom: 12px;
    }

    .chatbot-window {
        position: fixed;
        right: 12px;
        bottom: 12px;
        width: calc(100vw - 24px);
        height: min(600px, calc(100dvh - 24px));
        max-width: 400px;
    }

    .chatbot-toggle {
        width: 56px;
        height: 56px;
    }
}

@media (prefers-reduced-motion: reduce) {

    .chatbot-window,
    .chatbot-toggle,
    .typing-indicator span {
        animation: none;
        transition: none;
    }
}
</style>
