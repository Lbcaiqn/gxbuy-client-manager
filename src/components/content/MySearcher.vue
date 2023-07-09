<script setup lang="ts">
import { ref } from "vue";

withDefaults(
  defineProps<{
    placeholder: string;
    isSearching: boolean;
    isAllSearching: boolean;
  }>(),
  {
    placeholder: "",
    isSearching: false,
    isAllSearching: false
  }
);

const emit = defineEmits(["search", "allSearch"]);

const keyword = ref("");
</script>

<template>
  <el-card style="margin-bottom: 20px">
    <div class="searcher">
      <el-input
        v-model="keyword"
        :placeholder="placeholder"
        @keydown.enter="emit('search', { type: 'search', keyword })"
      />
      <el-button
        type="primary"
        size="large"
        round
        :disabled="!keyword"
        :loading="isSearching"
        @click="emit('search', { type: 'search', keyword })"
      >
        搜索
      </el-button>
      <el-button
        type="primary"
        size="large"
        round
        :loading="isAllSearching"
        @click="emit('allSearch', { type: 'all' })"
      >
        全部
      </el-button>
    </div>
  </el-card>
</template>

<style lang="less" scoped>
.searcher {
  display: flex;
  align-items: center;
}
</style>
