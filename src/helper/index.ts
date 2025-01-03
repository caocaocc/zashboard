import { PROXY_SORT_TYPE } from '@/config'
import { getLatencyByName, proxyMap } from '@/store/proxies'
import { hideUnavailableProxies, language, proxySortType, sourceIPLabelMap } from '@/store/settings'
import { timeSaved } from '@/store/statistics'
import type { Connection } from '@/types'
import { useWindowSize } from '@vueuse/core'
import dayjs from 'dayjs'
import prettyBytes, { type Options } from 'pretty-bytes'
import { computed } from 'vue'

export const prettyBytesHelper = (bytes: number, opts?: Options) => {
  return prettyBytes(bytes, {
    binary: false,
    ...opts,
  })
}

const windowSize = useWindowSize()

export const isLargeScreen = computed(() => {
  return windowSize.width.value > 1280
})

export const isSmallScreen = computed(() => {
  return windowSize.width.value < 640
})

export const fromNow = (timestamp: string) => {
  return dayjs(timestamp).locale(language.value).fromNow()
}

export const getLatencyExceptZero = (name: string) => {
  const latency = getLatencyByName(name)

  return latency === 0 ? Infinity : latency
}

const isProxyGroup = (name: string) => {
  const proxyNode = proxyMap.value[name]

  if (!proxyNode) {
    return false
  }

  return (
    ['direct', 'reject', 'reject-drop', 'pass'].includes(proxyNode.type.toLowerCase()) ||
    !!proxyNode.all
  )
}

export const sortAndFilterProxyNodes = (proxies: string[]) => {
  proxies = [...proxies]

  if (hideUnavailableProxies.value) {
    proxies = proxies.filter((name) => {
      return isProxyGroup(name) || getLatencyByName(name) > 0
    })
  }
  switch (proxySortType.value) {
    case PROXY_SORT_TYPE.DEFAULT:
      return proxies
    case PROXY_SORT_TYPE.NAME_ASC:
      return proxies.sort((prev, next) => prev.localeCompare(next))
    case PROXY_SORT_TYPE.NAME_DESC:
      return proxies.sort((prev, next) => next.localeCompare(prev))
    case PROXY_SORT_TYPE.LATENCY_ASC:
      return proxies.sort((prev, next) => getLatencyExceptZero(prev) - getLatencyExceptZero(next))
    case PROXY_SORT_TYPE.LATENCY_DESC:
      return proxies.sort((prev, next) => getLatencyExceptZero(next) - getLatencyExceptZero(prev))
  }
}

export const getIPLabelFromMap = (ip: string) => {
  const isIPv6 = ip.includes(':')

  for (const key in sourceIPLabelMap.value) {
    if (key.startsWith('/')) {
      const regex = new RegExp(key, 'i')

      if (regex.test(ip)) {
        return sourceIPLabelMap.value[key]
      }
    } else if (ip === key || (isIPv6 && ip.endsWith(key))) {
      return sourceIPLabelMap.value[key]
    }
  }
  return ip
}

export const getProcessFromConnection = (connection: Connection) => {
  return (
    connection.metadata.process ||
    connection.metadata.processPath.replace(/^.*[/\\](.*)$/, '$1') ||
    '-'
  )
}

export const getToolTipForParams = (
  params: ToolTipParams,
  config: {
    suffix: string
    binary: boolean
  },
) => {
  const { suffix = '', binary = false } = config

  // fake data
  if (params.data.name < timeSaved + 1) {
    return ``
  }
  return `
    <div class="flex items-center my-2 gap-1">
      <div class="w-4 h-4 rounded-full" style="background-color: ${params.color}"></div>
      ${params.seriesName}
      (${dayjs(params.data.name).format('HH:mm:ss')}): ${prettyBytesHelper(params.data.value, {
        binary: binary,
      })}${suffix}
    </div>`
}

export const exportSettings = () => {
  const settings: Record<string, string | null> = {}

  for (const key in localStorage) {
    if (key.startsWith('config/') || key.startsWith('setup/')) {
      settings[key] = localStorage.getItem(key)
    }
  }

  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'zashboard-settings'
  a.click()
  URL.revokeObjectURL(url)
}

export const importSettings = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const settings = JSON.parse(reader.result as string)
      for (const key in settings) {
        localStorage.setItem(key, settings[key])
      }
      location.reload()
    }
    reader.readAsText(file)
  }
  input.click()
}
