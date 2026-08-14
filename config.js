/**
 * Crypto Web Miner - Configuration File
 * Central configuration for all mining settings
 * All features are OFF by default - enable what you need
 */

const MinerConfig = {
  // ============ GLOBAL SETTINGS ============
  global: {
    // Enable/disable the miner entirely
    enabled: true,
    // Use local storage to persist settings
    persistSettings: true,
    // Enable debug mode for console logging
    debug: false,
    // Worker update interval in milliseconds
    updateInterval: 1000,
    // Idle detection timeout (seconds before stopping)
    idleTimeout: 300,
  },

  // ============ POOL SETTINGS ============
  pool: {
    // Default mining pool
    default: 'moneroocean',
    pools: {
      moneroocean: {
        name: 'Monero Ocean',
        url: 'wss://ws.moneroocean.stream:8084',
        port: 8084,
        ssl: true,
        enabled: false, // DISABLED BY DEFAULT
      },
      supportxmr: {
        name: 'SupportXMR',
        url: 'wss://pool.supportxmr.com:443',
        port: 3333,
        ssl: true,
        enabled: false, // DISABLED BY DEFAULT
      },
      minergate: {
        name: 'MinerGate',
        url: 'wss://ws.minergate.com:8080',
        port: 8080,
        ssl: true,
        enabled: false, // DISABLED BY DEFAULT
      },
    },
  },

  // ============ CRYPTOCURRENCY SETTINGS ============
  cryptocurrencies: {
    // Monero (XMR)
    monero: {
      enabled: false, // DISABLED BY DEFAULT
      symbol: 'XMR',
      name: 'Monero',
      algorithmFamily: 'CryptoNight',
      variants: ['v8', 'v7', 'v6'],
      defaultVariant: 'v8',
      difficulty: 100000,
      blockReward: 4.6,
    },
    // Bitcoin
    bitcoin: {
      enabled: false, // DISABLED BY DEFAULT
      symbol: 'BTC',
      name: 'Bitcoin',
      algorithmFamily: 'SHA256',
      variants: ['stratum'],
      defaultVariant: 'stratum',
      difficulty: 1,
      blockReward: 6.25,
    },
    // Ethereum
    ethereum: {
      enabled: false, // DISABLED BY DEFAULT
      symbol: 'ETH',
      name: 'Ethereum',
      algorithmFamily: 'Ethash',
      variants: ['v1', 'v2'],
      defaultVariant: 'v1',
      difficulty: 1000000000000,
      blockReward: 2,
    },
    // Litecoin
    litecoin: {
      enabled: false, // DISABLED BY DEFAULT
      symbol: 'LTC',
      name: 'Litecoin',
      algorithmFamily: 'Scrypt',
      variants: ['standard'],
      defaultVariant: 'standard',
      difficulty: 100000,
      blockReward: 12.5,
    },
    // Dogecoin
    dogecoin: {
      enabled: false, // DISABLED BY DEFAULT
      symbol: 'DOGE',
      name: 'Dogecoin',
      algorithmFamily: 'Scrypt',
      variants: ['standard'],
      defaultVariant: 'standard',
      difficulty: 100000,
      blockReward: 10000,
    },
    // Dash
    dash: {
      enabled: false, // DISABLED BY DEFAULT
      symbol: 'DASH',
      name: 'Dash',
      algorithmFamily: 'X11',
      variants: ['standard'],
      defaultVariant: 'standard',
      difficulty: 50000,
      blockReward: 5.5,
    },
  },

  // ============ WALLET SETTINGS ============
  wallet: {
    // Require wallet address
    required: true,
    // Save wallet to local storage
    saveToLocalStorage: true,
    // Default wallet (empty = user must enter)
    default: '',
    // Wallet validation regex
    validationRegex: /^[a-zA-Z0-9]{26,106}$/,
  },

  // ============ PERFORMANCE OPTIMIZATION ============
  performance: {
    // Thread settings
    threads: {
      // Auto-detect CPU cores
      autoDetect: true,
      // Maximum threads (0 = unlimited)
      max: 0,
      // Reserve cores for system (subtract from available)
      reserve: 1,
      // Allow user to modify threads
      allowUserModification: true,
    },
    // Throttling settings
    throttle: {
      // CPU usage limit (0-100%)
      cpuLimit: 80,
      // Memory limit in MB
      memoryLimit: 512,
      // Enable adaptive throttling
      adaptive: true,
    },
    // Optimization settings
    optimization: {
      // Use WebAssembly if available
      useWasm: true,
      // Enable worker pooling
      workerPooling: true,
      // Batch processing size
      batchSize: 100,
      // Enable memory caching
      caching: true,
      // Cache size in MB
      cacheSize: 64,
    },
  },

  // ============ STATISTICS SETTINGS ============
  statistics: {
    // Enable statistics tracking
    enabled: true,
    // Statistics update interval (ms)
    updateInterval: 1000,
    // Keep statistics history
    keepHistory: true,
    // History retention (hours)
    historyRetention: 24,
    // Send statistics to server
    sendToServer: false,
    // Server endpoint
    serverEndpoint: '',
  },

  // ============ UI SETTINGS ============
  ui: {
    // Show mining status
    showStatus: true,
    // Show detailed statistics
    showDetailedStats: true,
    // Show charts
    showCharts: true,
    // Chart update frequency (ms)
    chartUpdateInterval: 1000,
    // Chart data points to keep
    chartMaxDataPoints: 120,
    // Theme (light/dark)
    theme: 'dark',
    // Show notifications
    showNotifications: true,
    // Notification position (top/bottom)
    notificationPosition: 'top-right',
  },

  // ============ ADVANCED SETTINGS ============
  advanced: {
    // Enable advanced options in UI
    showAdvanced: false,
    // Mining difficulty adjustment
    difficultyAdjustment: true,
    // Auto-reconnect on connection loss
    autoReconnect: true,
    // Reconnection attempts
    maxReconnectAttempts: 5,
    // Reconnection delay (ms)
    reconnectDelay: 5000,
    // Enable mining during idle
    mineOnIdle: false,
    // Idle detection threshold (ms)
    idleThreshold: 60000,
  },

  // ============ SECURITY SETTINGS ============
  security: {
    // Require HTTPS for pool connections
    requireHttps: true,
    // Verify pool certificate
    verifyCertificate: true,
    // Enable rate limiting
    rateLimit: true,
    // Max requests per minute
    rateLimitPerMinute: 60,
    // Enable CSRF protection
    csrfProtection: true,
    // Allow only whitelisted pools
    poolWhitelist: true,
  },

  // ============ LOGGING SETTINGS ============
  logging: {
    // Enable logging
    enabled: true,
    // Log level (debug, info, warn, error)
    level: 'info',
    // Max log entries
    maxEntries: 1000,
    // Log to console
    logToConsole: false,
    // Send logs to server
    sendToServer: false,
    // Server endpoint
    serverEndpoint: '',
  },

  /**
   * Get configuration value with dot notation
   * @param {string} key - Configuration key (e.g., "pool.default")
   * @param {*} defaultValue - Default value if key not found
   * @returns {*} Configuration value
   */
  get(key, defaultValue = null) {
    const keys = key.split('.');
    let value = this;
    for (const k of keys) {
      value = value[k];
      if (value === undefined) return defaultValue;
    }
    return value;
  },

  /**
   * Set configuration value with dot notation
   * @param {string} key - Configuration key
   * @param {*} value - New value
   */
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

  /**
   * Get all enabled cryptocurrencies
   * @returns {Object} Enabled cryptocurrencies
   */
  getEnabledCryptos() {
    return Object.fromEntries(
      Object.entries(this.cryptocurrencies).filter(([_, cfg]) => cfg.enabled)
    );
  },

  /**
   * Save configuration to localStorage
   */
  save() {
    try {
      localStorage.setItem('minerConfig', JSON.stringify(this));
    } catch (e) {
      if (this.global.debug) console.error('Failed to save config:', e);
    }
  },

  /**
   * Load configuration from localStorage
   */
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

  /**
   * Reset to default settings
   */
  reset() {
    localStorage.removeItem('minerConfig');
    location.reload();
  },
};

// Auto-load configuration on script load
if (typeof localStorage !== 'undefined') {
  MinerConfig.load();
}
