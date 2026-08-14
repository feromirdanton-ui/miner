/**
 * Crypto Web Miner - Configuration File
 * Central configuration for all mining settings
 * All features are OFF by default - enable what you need
 */

const MinerConfig = {
  // ============ GLOBAL SETTINGS ============
  global: {
    enabled: true,
    persistSettings: true,
    debug: false,
    updateInterval: 1000,
    idleTimeout: 300,
  },

  // ============ POOL SETTINGS ============
  pool: {
    default: 'moneroocean',
    pools: {
      moneroocean: {
        name: 'Monero Ocean',
        url: 'wss://ws.moneroocean.stream:8084',
        port: 8084,
        ssl: true,
        enabled: false,
      },
      supportxmr: {
        name: 'SupportXMR',
        url: 'wss://pool.supportxmr.com:443',
        port: 3333,
        ssl: true,
        enabled: false,
      },
    },
  },

  // ============ CRYPTOCURRENCY SETTINGS ============
  cryptocurrencies: {
    monero: { enabled: false, symbol: 'XMR', name: 'Monero', algorithmFamily: 'CryptoNight', variants: ['v8', 'v7', 'v6'], defaultVariant: 'v8', difficulty: 100000, blockReward: 4.6, poolFee: 0.5 },
    bitcoin: { enabled: false, symbol: 'BTC', name: 'Bitcoin', algorithmFamily: 'SHA256', variants: ['stratum'], defaultVariant: 'stratum', difficulty: 1, blockReward: 6.25, poolFee: 2.0 },
    ethereum: { enabled: false, symbol: 'ETH', name: 'Ethereum', algorithmFamily: 'Ethash', variants: ['v1', 'v2'], defaultVariant: 'v1', difficulty: 1000000000000, blockReward: 2, poolFee: 1.5 },
    litecoin: { enabled: false, symbol: 'LTC', name: 'Litecoin', algorithmFamily: 'Scrypt', variants: ['standard'], defaultVariant: 'standard', difficulty: 100000, blockReward: 12.5, poolFee: 1.0 },
    dogecoin: { enabled: false, symbol: 'DOGE', name: 'Dogecoin', algorithmFamily: 'Scrypt', variants: ['standard'], defaultVariant: 'standard', difficulty: 100000, blockReward: 10000, poolFee: 0.5 },
    dash: { enabled: false, symbol: 'DASH', name: 'Dash', algorithmFamily: 'X11', variants: ['standard'], defaultVariant: 'standard', difficulty: 50000, blockReward: 5.5, poolFee: 1.5 },
    zcash: { enabled: false, symbol: 'ZEC', name: 'Zcash', algorithmFamily: 'Equihash', variants: ['200_9', '144_5'], defaultVariant: '200_9', difficulty: 50000, blockReward: 3.125, poolFee: 2.0 },
  },

  // ============ WALLET SETTINGS ============
  wallet: {
    required: true,
    saveToLocalStorage: true,
    default: '',
    validationRegex: /^[a-zA-Z0-9]{26,106}$/,
  },

  // ============ PERFORMANCE OPTIMIZATION ============
  performance: {
    threads: {
      autoDetect: true,
      max: 0,
      reserve: 1,
      allowUserModification: true,
    },
    throttle: {
      cpuLimit: 80,
      memoryLimit: 512,
      adaptive: true,
    },
    optimization: {
      useWasm: true,
      workerPooling: true,
      batchSize: 100,
      caching: true,
      cacheSize: 64,
      useSIMD: true,
    },
  },

  // ============ STATISTICS SETTINGS ============
  statistics: {
    enabled: true,
    updateInterval: 1000,
    keepHistory: true,
    historyRetention: 24,
    sendToServer: false,
    serverEndpoint: '',
  },

  // ============ UI SETTINGS ============
  ui: {
    showStatus: true,
    showDetailedStats: true,
    showCharts: true,
    chartUpdateInterval: 1000,
    chartMaxDataPoints: 120,
    theme: 'dark',
    showNotifications: true,
    notificationPosition: 'top-right',
  },

  // ============ ADVANCED SETTINGS ============
  advanced: {
    showAdvanced: false,
    difficultyAdjustment: true,
    autoReconnect: true,
    maxReconnectAttempts: 5,
    reconnectDelay: 5000,
    mineOnIdle: false,
    idleThreshold: 60000,
  },

  // ============ SECURITY SETTINGS ============
  security: {
    requireHttps: true,
    verifyCertificate: true,
    rateLimit: true,
    rateLimitPerMinute: 60,
    csrfProtection: true,
    poolWhitelist: true,
  },

  get(key, defaultValue = null) {
    const keys = key.split('.');
    let value = this;
    for (const k of keys) {
      value = value[k];
      if (value === undefined) return defaultValue;
    }
    return value;
  },

  set(key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    let obj = this;
    for (const k of keys) {
      if (!obj[k]) obj[k] = {};
      obj = obj[k];
    }
    obj[lastKey] = value;
    if (this.global.persistSettings) {
      this.save();
    }
  },

  getEnabledCryptos() {
    return Object.fromEntries(
      Object.entries(this.cryptocurrencies).filter(([_, cfg]) => cfg.enabled)
    );
  },

  getEnabledPools() {
    return Object.fromEntries(
      Object.entries(this.pool.pools).filter(([_, cfg]) => cfg.enabled)
    );
  },

  save() {
    try {
      localStorage.setItem('minerConfig', JSON.stringify(this));
    } catch (e) {
      if (this.global.debug) console.error('Failed to save config:', e);
    }
  },

  load() {
    try {
      const saved = localStorage.getItem('minerConfig');
      if (saved) {
        const cfg = JSON.parse(saved);
        Object.assign(this, cfg);
      }
    } catch (e) {
      if (this.global.debug) console.error('Failed to load config:', e);
    }
  },

  reset() {
    localStorage.removeItem('minerConfig');
    location.reload();
  },
};

if (typeof localStorage !== 'undefined') {
  MinerConfig.load();
}
