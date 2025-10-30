<template>
  <div class="@container mx-auto px-4 my-5">
    <div class="@title text-center">Approve_or_Not (IT 03-1)</div>

    <div class="@content my-5">
      <div class="my-2 flex justify-between gap-2">
         <div class="flex gap-2">
            <BaseButton
          variant="success"
          @click="openActionModal('approve')"
        >
          <span class="text-white">อนุมัติ</span>
        </BaseButton>
        <BaseButton
          variant="danger"
          @click="openActionModal('reject')"
        >
          <span class="text-white">ไม่อนุมัติ</span>
        </BaseButton>
         </div>

         <div>
            <BaseButton
          variant="secondary"
          @click="handlerefresh()"
        >
          <span class="text-white">เริ่มใหม่</span>
        </BaseButton>
         </div>
      </div>
      <div class="overflow-x-auto shadow-md rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <input
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  :disabled="
                    sortedRequests.length === 0 ||
                    sortedRequests.filter((r) => r.status_id === 0).length === 0
                  "
                />
              </th>
              <th
                @click="sort('title')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                รายการ
              </th>
              <th
                @click="sort('status_id')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                สถานะ
              </th>
               <th
                @click="sort('reason')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                เหตุผล
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="request in sortedRequests"
              :key="request.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-left">
                <input
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  :checked="selectedRequestIds.includes(request.id)"
                  @change="toggleSelection(request.id)"
                  :disabled="!isActionable(request)"
                />
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ request.title }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusData(request.statusId).class"
                >
                  {{ getStatusData(request.statusId).text }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
               
                <span  class='px-2 inline-flex text-xs leading-5 font-semibold rounded-full'> {{ request.reason }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <BaseModal :show="showModal" @close="showModal = false">
    <template #header>
      <h3 class="text-xl font-bold text-indigo-600">
        {{
          modalActionType === "approve"
            ? "ยืนยันการอนุมัติ"
            : "ยืนยันไม่อนุมัติ"
        }}: {{ selectedRequest ? selectedRequest.title : "" }}
      </h3>
    </template>

    <template #body>
      <p class="text-gray-700 mb-4">เหตุผล :</p>
      <textarea class="w-full border rounded p-2" v-model="reason"> </textarea>
    </template>

    <template #footer>
      <BaseButton variant="secondary" @click="showModal = false">
        ยกเลิก
      </BaseButton>
      <BaseButton
        :variant="modalActionType === 'approve' ? 'primary' : 'danger'"
        @click="handleConfirmAction"
      >
        ยืนยัน
      </BaseButton>
    </template>
  </BaseModal>
</template>
<script setup>

import { ref, computed, onMounted } from "vue"; // 1. เพิ่ม onMounted

import axios from "axios"; // 2. import axios

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import BaseButton from "@/components/base/BaseButton.vue"; // ใช้ Alias '@' ที่กำหนดใน vite.config.js
import BaseModal from "@/components/base/BaseModal.vue";

const requests = ref([]);

const fetchRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests`);
    // API C# คืนค่าในรูปแบบ { status: 200, message: "...", data: [...] }
    if (response.data.status === 200) {
        requests.value = response.data.data;
    } else {
        console.error("API Error:", response.data.message);
        // อาจจะแสดง Error message ให้ผู้ใช้เห็น
    }
  } catch (error) {
    console.error("Fetch failed:", error);
    // กรณีที่เกิด CORS Error หรือ Network Error
  }
};

onMounted(() => {
    fetchRequests();
});

// **Logic สำหรับการจัดเรียง (ต้องเขียนเพิ่ม)**
const sortedRequests = computed(() => {
  // โค้ดสำหรับ sort
  return requests.value;
});

// **ฟังก์ชันใหม่: ตรวจสอบว่ารายการสามารถทำ Action ได้หรือไม่**
const isActionable = (request) => {
  // รายการที่สามารถอนุมัติ/ไม่อนุมัติได้คือ status_id เป็น 0 เท่านั้น
  return request.statusId === 0;
};

// **Computed Property ใหม่:** ตรวจสอบว่ารายการทั้งหมดถูกเลือกหรือไม่
const isAllSelected = computed(() => {
  // กรองเฉพาะรายการที่ทำ Action ได้ (status_id = 0)
  const actionableRequests = sortedRequests.value.filter(
    (req) => req.status_id === 0
  );

  // ถ้าไม่มีรายการให้เลือกเลย ให้ถือว่าเป็น False
  if (actionableRequests.length === 0) return false;

  // True ถ้า ID ที่ถูกเลือกทั้งหมด ตรงกับ ID ของรายการที่ทำ Action ได้ทั้งหมด
  const actionableIds = actionableRequests.map((req) => req.id);
  return (
    selectedRequestIds.value.length === actionableIds.length &&
    selectedRequestIds.value.every((id) => actionableIds.includes(id))
  );
});
// **ฟังก์ชันใหม่: สำหรับการเลือกทั้งหมด/ยกเลิกการเลือกทั้งหมด**
// **ฟังก์ชันแก้ไข: สำหรับการเลือกทั้งหมด/ยกเลิกการเลือกทั้งหมด**
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedRequestIds.value = []; // ยกเลิกการเลือกทั้งหมด
  } else {
    // เลือกเฉพาะรายการที่สามารถทำ Action ได้ (status_id = 0)
    selectedRequestIds.value = sortedRequests.value
      .filter((req) => req.status_id === 0)
      .map((request) => request.id);
  }
};
// **ฟังก์ชันใหม่: สำหรับการเลือก Checkbox ในแต่ละแถว**
const toggleSelection = (requestId) => {
  const index = selectedRequestIds.value.indexOf(requestId);
  if (index === -1) {
    selectedRequestIds.value.push(requestId);
  } else {
    selectedRequestIds.value.splice(index, 1);
  }
};

const getStatusData = (statusId) => {
  switch (statusId) {
    case 0:
      return { text: "รออนุมัติ", class: "text-yellow-600 bg-yellow-100" };
    case 1:
      return { text: "อนุมัติแล้ว", class: "text-green-600 bg-green-100" };
    case 2:
      return { text: "ไม่อนุมัติ", class: "text-red-600 bg-red-100" };
    default:
      return { text: "ไม่ทราบสถานะ", class: "text-gray-600 bg-gray-100" };
  }
};

const selectedRequestIds = ref([]);
const selectedRequest = ref(null); // รายการที่ถูกเลือกสำหรับ Single Action
const reason = ref(""); // เหตุผล

// สถานะควบคุมการเปิด/ปิด Modal
const showModal = ref(false);

// ฟังก์ชันสำหรับเปิด Modal (สำหรับการทำ Single Action)
const openActionModal = ( actionType) => {
 
  console.log(selectedRequestIds.value);
  if(selectedRequestIds.value.length ==0){
    alert("กรุณาเลือกรายการ");
    return;
  }

  modalActionType.value = actionType;
  showModal.value = true;
  reason.value = ""; // เคลียร์เหตุผลเสมอเมื่อเปิด Modal
};

const modalActionType = ref(""); // **สถานะใหม่: 'approve' หรือ 'reject'**

const handleConfirmAction = async () => {
  const action = modalActionType.value === "approve" ? "อนุมัติ" : "ไม่อนุมัติ";

  console.log(
    `ดำเนินการ ${action} สำหรับ ${selectedRequestIds.value} ด้วยเหตุผล: ${reason.value}`
  );
  selectedRequest.value = null;
  showModal.value = false; // ปิด Modal หลังดำเนินการ

  const payload = {
    ActionType: modalActionType.value, // 'approve' หรือ 'reject'
    RequestIds: selectedRequestIds.value,
    Reason: reason.value, // ส่งเหตุผลไปด้วย
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/batch-action`, payload);

    if (response.data.status === 200) {
      alert(response.data.message);
      showModal.value = false;
      selectedRequestIds.value = []; // ล้างรายการที่เลือก
      await fetchRequests(); // ดึงข้อมูลใหม่เพื่อรีเฟรชตาราง
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error("Action failed:", error);
    alert("เกิดข้อผิดพลาดในการเชื่อมต่อ API");
  }

};

const handlerefresh = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/refresh-data-status`, {});

    if (response.data.status === 200) {
      alert(response.data.message);
     
      await fetchRequests(); // ดึงข้อมูลใหม่เพื่อรีเฟรชตาราง
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error("Action failed:", error);
    alert("เกิดข้อผิดพลาดในการเชื่อมต่อ API");
  }
}


</script>
