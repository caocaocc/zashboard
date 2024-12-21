import {
  CONNECTIONS_TABLE_ACCESSOR_KEY,
  FONTS,
  LANG,
  PROXY_PREVIEW_TYPE,
  PROXY_SORT_TYPE,
} from '@/config'
import { useStorage } from '@vueuse/core'

// global
export const theme = useStorage<string>('config/theme', 'default')
export const language = useStorage<LANG>(
  'config/language',
  Object.values(LANG).includes(navigator.language as LANG)
    ? (navigator.language as LANG)
    : LANG.EN_US,
)
export const isSiderbarCollapsed = useStorage('config/is-sidebar-collapsed', true)
export const font = useStorage<FONTS>('config/font', FONTS.SYSTEM_UI)
export const autoUpgrade = useStorage('config/auto-upgrade', false)

// proxies
export const showGlobalProxy = useStorage('config/show-global-proxy', false)
export const collapseGroupMap = useStorage<Record<string, boolean>>('config/collapse-group-map', {})
export const twoColumnProxyGroup = useStorage('config/two-columns', false)
export const speedtestUrl = useStorage<string>(
  'config/speedtest-url',
  'https://www.gstatic.com/generate_204',
)
export const speedtestTimeout = useStorage<number>('config/speedtest-timeout', 5000)
export const proxySortType = useStorage<PROXY_SORT_TYPE>(
  'config/proxy-sort-type',
  PROXY_SORT_TYPE.LATENCY_ASC,
)
export const automaticDisconnection = useStorage('config/automatic-disconnection', true)
export const twoColumnNodeForMobile = useStorage('config/two-column-for-mobile', false)
export const truncateProxyName = useStorage('config/truncate-proxy-name', true)
export const proxyPreviewType = useStorage('config/proxy-preview-type', PROXY_PREVIEW_TYPE.AUTO)
export const hideUnavailableProxies = useStorage('config/hide-unavailable-proxies', true)
export const lowLatency = useStorage('config/low-latency', 600)
export const mediumLatency = useStorage('config/medium-latency', 1200)

// connections
export const useConnectionCard = useStorage('config/use-connecticon-card', false)
export const connectionTableColumns = useStorage<CONNECTIONS_TABLE_ACCESSOR_KEY[]>(
  'config/connection-table-columns',
  [
    CONNECTIONS_TABLE_ACCESSOR_KEY.Close,
    CONNECTIONS_TABLE_ACCESSOR_KEY.Host,
    CONNECTIONS_TABLE_ACCESSOR_KEY.Type,
    CONNECTIONS_TABLE_ACCESSOR_KEY.Rule,
    CONNECTIONS_TABLE_ACCESSOR_KEY.Chains,
    CONNECTIONS_TABLE_ACCESSOR_KEY.Download,
    CONNECTIONS_TABLE_ACCESSOR_KEY.Upload,
    CONNECTIONS_TABLE_ACCESSOR_KEY.DlSpeed,
    CONNECTIONS_TABLE_ACCESSOR_KEY.UlSpeed,
    CONNECTIONS_TABLE_ACCESSOR_KEY.ConnectTime,
  ],
)
export const compactConnectionCard = useStorage<boolean>('config/compact-connection-card', true)
export const sourceIPLabelMap = useStorage<Record<string, string>>('config/source-ip-label-map', {})

// logs
export const logRetentionLimit = useStorage<number>('config/log-retention-limit', 1000)
