/**
 * Advanced Miner UI - Control panel for crypto selection and configuration
 */

class MinerUI {
  constructor(containerId = 'miner-container') {
    this.container = document.getElementById(containerId);
    this.config = MinerConfig;
    this.optimizer = new MiningOptimizer(this.config);
    this.isInitialized = false;
  }

  /**
   * Initialize the UI
   */
  init() {
    if (this.isInitialized) return;
    this.render();
    this.attachEventListeners();
    this.isInitialized = true;
  }

  /**
   * Render the complete UI
   */
  render() {
    this.container.innerHTML = this.getHTML();
  }

  /**
   * Get HTML template
   */
  getHTML() {
    return `
      <div class="miner-ui">
        <!-- Header -->
        <div class="miner-header">
          <h1>⛏️ Crypto Web Miner v2</h1>
          <div class="status-badge" id="statusBadge">
            <span class="status-light"></span>
            <span class="status-text" id="statusText">Idle</span>
          </div>
        </div>

        <!-- Main Controls -->
        <div class="miner-controls">
          <!-- Cryptocurrency Selection -->
          <div class="control-section crypto-selection">
            <h2>📱 Select Cryptocurrency</h2>
            <div class="crypto-grid" id="cryptoGrid">
              ${this.renderCryptoOptions()}
            </div>
          </div>

          <!-- Wallet Configuration -->
          <div class="control-section wallet-config">
            <h2>💰 Wallet Address</h2>
            <div class="wallet-input-group">
              <input 
                type="text" 
                id="walletAddress" 
                placeholder="Enter wallet address"
                class="wallet-input"
              />
              <button id="validateWallet" class="btn btn-small">Validate</button>
            </div>
            <div class="wallet-note">Address will be saved locally</div>
          </div>

          <!-- Pool Selection -->
          <div class="control-section pool-config">
            <h2>🔗 Mining Pool</h2>
            <select id="poolSelector" class="pool-select">
              ${this.renderPoolOptions()}
            </select>
          </div>

          <!-- Performance Settings -->
          <div class="control-section performance-config">
            <h2>⚡ Performance Settings</h2>
            <div class="setting-row">
              <label>CPU Threads:</label>
              <div class="thread-control">
                <button id="threadMinus" class="btn btn-small">−</button>
                <span id="threadCount" class="thread-display">0</span>
                <button id="threadPlus" class="btn btn-small">+</button>
              </div>
            </div>
            <div class="setting-row">
              <label>CPU Limit:</label>
              <div class="slider-control">
                <input 
                  type="range" 
                  id="cpuLimit" 
                  min="10" 
                  max="100" 
                  value="80"
                  class="slider"
                />
                <span id="cpuLimitValue">80%</span>
              </div>
            </div>
            <div class="setting-row">
              <label>Adaptive Mode:</label>
              <label class="checkbox">
                <input type="checkbox" id="adaptiveMode" />
                <span>Enable adaptive throttling</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Statistics Dashboard -->
        <div class="miner-stats" id="statsPanel">
          <h2>📊 Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Hash Rate</div>
              <div class="stat-value" id="statHashrate">0 H/s</div>
              <div class="stat-subtext" id="statHashrateDetail"></div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Shares Accepted</div>
              <div class="stat-value" id="statShares">0</div>
              <div class="stat-subtext" id="statSharesDetail"></div>
            </div>
            <div class="stat-card">
              <div class="stat-label">CPU Usage</div>
              <div class="stat-value" id="statCPU">0%</div>
              <div class="stat-subtext" id="statCPUDetail"></div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Memory</div>
              <div class="stat-value" id="statMemory">0 MB</div>
              <div class="stat-subtext" id="statMemoryDetail"></div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Uptime</div>
              <div class="stat-value" id="statUptime">00:00:00</div>
              <div class="stat-subtext" id="statUptimeDetail"></div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Efficiency</div>
              <div class="stat-value" id="statEfficiency">0</div>
              <div class="stat-subtext" id="statEfficiencyDetail"></div>
            </div>
          </div>
          <div class="chart-container">
            <canvas id="hashRateChart"></canvas>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="miner-actions">
          <button id="startMining" class="btn btn-primary btn-large">▶️ Start Mining</button>
          <button id="stopMining" class="btn btn-danger btn-large" disabled>⏹️ Stop Mining</button>
          <button id="settingsBtn" class="btn btn-secondary btn-small">⚙️ Settings</button>
          <button id="logsBtn" class="btn btn-secondary btn-small">📋 Logs</button>
        </div>

        <!-- Advanced Settings Modal -->
        <div id="settingsModal" class="modal hidden">
          <div class="modal-content">
            <span class="close" id="closeSettings">&times;</span>
            <h2>Advanced Settings</h2>
            ${this.renderAdvancedSettings()}
          </div>
        </div>

        <!-- Logs Modal -->
        <div id="logsModal" class="modal hidden">
          <div class="modal-content">
            <span class="close" id="closeLogs">&times;</span>
            <h2>Mining Logs</h2>
            <div id="logContainer" class="log-container"></div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render cryptocurrency selection options
   */
  renderCryptoOptions() {
    const cryptos = this.config.cryptocurrencies;
    return Object.entries(cryptos).map(([key, crypto]) => `
      <div class="crypto-card" data-crypto="${key}">
        <div class="crypto-icon">${this.getCryptoIcon(key)}</div>
        <div class="crypto-name">${crypto.name}</div>
        <div class="crypto-symbol">${crypto.symbol}</div>
        <label class="toggle-switch">
          <input type="checkbox" class="crypto-toggle" data-crypto="${key}" ${crypto.enabled ? 'checked' : ''} />
          <span class="toggle-slider"></span>
        </label>
      </div>
    `).join('');
  }

  /**
   * Render pool selection options
   */
  renderPoolOptions() {
    const pools = this.config.pool.pools;
    return Object.entries(pools).map(([key, pool]) => `
      <option value="${key}" ${pool.enabled ? 'selected' : ''} ${!pool.enabled ? 'disabled' : ''}>
        ${pool.name} (${pool.url})
      </option>
    `).join('');
  }

  /**
   * Render advanced settings
   */
  renderAdvancedSettings() {
    return `
      <div class="advanced-settings">
        <div class="setting">
          <label>Pool Whitelist:</label>
          <input type="checkbox" id="poolWhitelist" ${this.config.security.poolWhitelist ? 'checked' : ''} />
        </div>
        <div class="setting">
          <label>Auto Reconnect:</label>
          <input type="checkbox" id="autoReconnect" ${this.config.advanced.autoReconnect ? 'checked' : ''} />
        </div>
        <div class="setting">
          <label>Debug Mode:</label>
          <input type="checkbox" id="debugMode" ${this.config.global.debug ? 'checked' : ''} />
        </div>
        <button class="btn btn-danger" id="resetConfig">Reset to Defaults</button>
      </div>
    `;
  }

  /**
   * Get crypto icon emoji
   */
  getCryptoIcon(crypto) {
    const icons = {
      monero: '🐷',
      bitcoin: '₿',
      ethereum: '🌐',
      litecoin: 'Ł',
      dogecoin: '🐕',
      dash: '💨',
      zcash: '🔐',
    };
    return icons[crypto] || '💰';
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Crypto toggles
    document.querySelectorAll('.crypto-toggle').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const crypto = e.target.dataset.crypto;
        this.config.set(`cryptocurrencies.${crypto}.enabled`, e.target.checked);
        this.updateUIState();
      });
    });

    // Thread controls
    document.getElementById('threadMinus')?.addEventListener('click', () => this.decreaseThreads());
    document.getElementById('threadPlus')?.addEventListener('click', () => this.increaseThreads());

    // CPU limit slider
    document.getElementById('cpuLimit')?.addEventListener('input', (e) => {
      this.config.set('performance.throttle.cpuLimit', parseInt(e.target.value));
      document.getElementById('cpuLimitValue').textContent = e.target.value + '%';
    });

    // Adaptive mode
    document.getElementById('adaptiveMode')?.addEventListener('change', (e) => {
      this.config.set('performance.optimization.adaptive', e.target.checked);
    });

    // Start/Stop buttons
    document.getElementById('startMining')?.addEventListener('click', () => this.startMining());
    document.getElementById('stopMining')?.addEventListener('click', () => this.stopMining());

    // Settings and Logs
    document.getElementById('settingsBtn')?.addEventListener('click', () => this.showSettings());
    document.getElementById('logsBtn')?.addEventListener('click', () => this.showLogs());
    document.getElementById('closeSettings')?.addEventListener('click', () => this.hideSettings());
    document.getElementById('closeLogs')?.addEventListener('click', () => this.hideLogs());

    // Update thread display
    this.updateThreadDisplay();
  }

  /**
   * Update thread display
   */
  updateThreadDisplay() {
    const optimal = this.optimizer.optimizeThreads();
    document.getElementById('threadCount').textContent = optimal;
  }

  /**
   * Increase threads
   */
  decreaseThreads() {
    // Implementation
  }

  /**
   * Decrease threads
   */
  increaseThreads() {
    // Implementation
  }

  /**
   * Update UI state
   */
  updateUIState() {
    const enabledCryptos = this.config.getEnabledCryptos();
    const hasEnabled = Object.keys(enabledCryptos).length > 0;
    
    document.getElementById('startMining').disabled = !hasEnabled;
  }

  /**
   * Start mining
   */
  startMining() {
    const enabledCryptos = this.config.getEnabledCryptos();
    if (Object.keys(enabledCryptos).length === 0) {
      alert('Please select at least one cryptocurrency to mine');
      return;
    }

    document.getElementById('startMining').disabled = true;
    document.getElementById('stopMining').disabled = false;
    document.getElementById('statusText').textContent = 'Running';
    this.optimizer.startMonitoring();
  }

  /**
   * Stop mining
   */
  stopMining() {
    document.getElementById('startMining').disabled = false;
    document.getElementById('stopMining').disabled = true;
    document.getElementById('statusText').textContent = 'Stopped';
    this.optimizer.stopMonitoring();
  }

  /**
   * Show settings modal
   */
  showSettings() {
    document.getElementById('settingsModal').classList.remove('hidden');
  }

  /**
   * Hide settings modal
   */
  hideSettings() {
    document.getElementById('settingsModal').classList.add('hidden');
  }

  /**
   * Show logs modal
   */
  showLogs() {
    document.getElementById('logsModal').classList.remove('hidden');
  }

  /**
   * Hide logs modal
   */
  hideLogs() {
    document.getElementById('logsModal').classList.add('hidden');
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const ui = new MinerUI('miner-container');
    ui.init();
  });
} else {
  const ui = new MinerUI('miner-container');
  ui.init();
}
