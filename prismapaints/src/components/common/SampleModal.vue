<template>
  <div :class="['modal-backdrop', { active: isOpen }]" @click.self="$emit('close')">
    <div class="modal-card">
      <span class="modal-close" @click="$emit('close')">&times;</span>
      <h3 style="font-size: 2rem; margin-bottom: 6px; color: var(--clr-primary);">Request Paint Sample</h3>
      <p style="font-size: 0.9rem; color: var(--clr-text-muted); margin-bottom: 24px;">Fill out the form below to receive physical color cards or schedule a technical consultation.</p>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">Full Name *</label>
          <input type="text" v-model="form.name" class="form-input" placeholder="e.g. Ali Al-Khalifa" required>
        </div>

        <div class="form-group">
          <label class="form-label">Email Address *</label>
          <input type="email" v-model="form.email" class="form-input" placeholder="e.g. ali@example.bh" required>
        </div>

        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input type="tel" v-model="form.phone" class="form-input" placeholder="+973 17732373">
        </div>

        <div class="form-group">
          <label class="form-label">Message / Project Details</label>
          <textarea v-model="form.message" class="form-textarea" rows="3" placeholder="Tell us about your project or surface requirements..."></textarea>
        </div>

        <button type="submit" class="btn-primary" style="width: 100%; justify-content: center;" :disabled="isSubmitting">
          {{ isSubmitting ? 'Sending Request...' : 'Submit Inquiry' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  palette: Array,
  surface: String
})

const emit = defineEmits(['close', 'submitted'])

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (!form.value.name || !form.value.email) return

  isSubmitting.value = true

  const payload = {
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone,
    surface: props.surface || 'General',
    selected_colors: props.palette.map(c => `${c.name} (${c.hex})`),
    message: form.value.message
  }

  try {
    const res = await fetch('/api/send_mail.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const result = await res.json()
    emit('submitted', result.message || 'Request sent successfully!')
    form.value = { name: '', email: '', phone: '', message: '' }
    emit('close')
  } catch (err) {
    emit('submitted', 'Thank you! Your request was received.')
    emit('close')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: var(--transition-smooth);
}

.modal-backdrop.active {
  opacity: 1;
  pointer-events: auto;
}

.modal-card {
  background: var(--clr-bg-card);
  border-radius: 24px;
  padding: 40px;
  width: 90%;
  max-width: 540px;
  position: relative;
  box-shadow: 0 25px 60px rgba(0,0,0,0.3);
  transform: translateY(20px);
  transition: var(--transition-smooth);
}

.modal-backdrop.active .modal-card {
  transform: translateY(0);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 1.5rem;
  color: var(--clr-text-muted);
  cursor: pointer;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--clr-text-main);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--clr-border);
  border-radius: 12px;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  outline: none;
  transition: var(--transition-smooth);
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--clr-primary);
  box-shadow: 0 0 0 3px rgba(124, 59, 41, 0.15);
}
</style>
