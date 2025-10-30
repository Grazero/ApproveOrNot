<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-transparent overflow-y-auto"
      @click.self="closeModal" 
    >
      <div 
        class="bg-white rounded-lg shadow-2xl overflow-hidden max-w-lg w-full transform transition-all"
      >

        <div class="px-6 py-4 border-b">
          <slot name="header">
            <h3 class="text-lg font-semibold text-gray-900">หัวข้อ Modal</h3>
          </slot>
        </div>

        <div class="p-6">
          <slot name="body">
            <p class="text-gray-700">ไม่มีเนื้อหา</p>
          </slot>
        </div>

        <div class="px-6 py-4 border-t flex justify-end space-x-3">
          <slot name="footer">
            <BaseButton variant="secondary" @click="closeModal">ปิด</BaseButton>
            <BaseButton variant="primary">ตกลง</BaseButton>
          </slot>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import BaseButton from './BaseButton.vue'; // ต้อง Import BaseButton เข้ามาใช้

// 1. รับ Props
defineProps({
  show: {
    type: Boolean,
    default: false,
  }
});

// 2. กำหนด Events
const emit = defineEmits(['close']);

// 3. ฟังก์ชันสำหรับปิด Modal
const closeModal = () => {
  emit('close');
};
</script>

<style>
/* 4. CSS สำหรับ Modal Transition (แอนิเมชัน) */

/* สถานะเริ่มต้นและสิ้นสุดของ Overlay/Container */
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* สถานะ Active (ความเร็วของแอนิเมชัน) */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

/* สถานะเริ่มต้นและสิ้นสุดของ Modal Panel (ตัวกล่องขาว) */
/* ใช้การ Scale (ซูมเข้า) เพื่อให้ดูสวยงามขึ้น */
.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>