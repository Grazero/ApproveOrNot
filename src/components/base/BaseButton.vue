<template>
  <button :class="buttonClasses" :disabled="disabled" @click="$emit('click')" type="button">
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

// 1. กำหนด Props สำหรับการกำหนดค่า
const props = defineProps({
  variant: {
    type: String,
    default: 'primary', // primary, secondary, danger
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

// 2. กำหนด Style พื้นฐาน
const baseStyles = 'w-30 py-2 px-4 rounded transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';

// 3. กำหนด Style ตาม Variant ที่เลือก
const variantStyles = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md';
    case 'secondary':
      return 'bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm border border-gray-300';
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white shadow-md';
    case "success":
      return "bg-green-600 hover:bg-green-700 text-white shadow-md";
    
    default:
      return 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md';
  }
});

// 4. รวม Class ทั้งหมด
const buttonClasses = computed(() => [
  baseStyles,
  variantStyles.value
]);

// 5. กำหนด Events
defineEmits(['click']);
</script>