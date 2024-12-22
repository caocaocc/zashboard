<template>
  <div class="overflow-y-auto p-2">
    <template v-if="isLargeScreen && twoColumnProxyGroup && renderGroups.length > 1">
      <div class="grid grid-cols-2 gap-1">
        <div
          v-for="idx in [0, 1]"
          :key="idx"
          class="flex flex-1 flex-col gap-1"
        >
          <component
            v-for="name in filterContent(renderGroups, idx)"
            :is="Comp"
            :key="name"
            :name="$t(name)"
          />
        </div>
      </div>
    </template>
    <div
      class="grid grid-cols-1 gap-1"
      v-else
    >
      <component
        v-for="name in renderGroups"
        :is="Comp"
        :key="name"
        :name="$t(name)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProxyGroup from '@/components/proxies/ProxyGroup.vue'
import ProxyProvider from '@/components/proxies/ProxyProvider.vue'
import { useProxies } from '@/composables/proxies'
import { PROXY_TAB_TYPE } from '@/config'
import { isLargeScreen } from '@/helper'
import { twoColumnProxyGroup } from '@/store/settings'
import { computed } from 'vue'

const { proxiesTabShow, renderGroups } = useProxies()

const Comp = computed(() =>
  proxiesTabShow.value === PROXY_TAB_TYPE.PROVIDER ? ProxyProvider : ProxyGroup,
)

const filterContent: <T>(all: T[], target: number) => T[] = (all, target) => {
  return all.filter((_, index: number) => index % 2 === target)
}
</script>
