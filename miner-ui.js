class MinerUI {
  constructor(containerId = 'miner-container') {
    this.container = document.getElementById(containerId);
    this.config = MinerConfig;
    this.optimizer = new MiningOptimizer(this.config);
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized || !this.container) return;
    this.render();
    this.attachEventListeners();
    this.updateThreadDisplay();
    this.isInitialized = true;
  }

  render() {
    this.container.innerHTML = this.getHTML();
  }

  getHTML() {
    return `
      <div class="miner-ui">
        <div class="miner-header">
          <h1>⛏️ Crypto Web Miner v2</h1>
          <div class="status-badge" id="statusBadge">
            <span class="status-light"></span>
            <span class="status-text" id="statusText">Idle</span>
          </div>
        </div>

        <div class="miner-controls">
          <div class="control-section crypto-selection">
            <h2>💱 Select Cryptocurrency</h2>
            <div class="crypto-grid" id="cryptoGrid">
              ${this.renderCryptoOptions()}
            </div>
          </div>

          <div class="control-section wallet-config">
            <h2>💰 Wallet Address</h2>
            <div class="wallet-input-group">
              <input type="text" id="walletAddress" placeholder="Enter wallet address" class="wallet-input" />
              <button id="validateWallet" class="btn btn-small">Validate</button>
            </div>
            <div class="wallet-note">Address will be saved locally</div>
          </div>

          <div class="control-section pool-config">
            <h2>🔗 Mining Pool</h2>
            <select id="poolSelector" class="pool-select">
              ${this.renderPoolOptions()}
            </select>
          </div>

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
                <input type="range" id="cpuLimit" min="10" max="100" value="80" class="slider" />
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

        <div class="miner-stats" id="statsPanel">
          <h2>📊 Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-label">Hash Rate</div><div class="stat-value" id="statHashrate">0 H/s</div></div>
            <div class="stat-card"><div class="stat-label">Shares Accepted</div><div class="stat-value" id="statShares">0</div></div>
            <div class="stat-card"><div class="stat-label">CPU Usage</div><div class="stat-value" id="statCPU">0%</div></div>
            <div class="stat-card"><div class="stat-label">Memory</div><div class="stat-value" id="statMemory">0 MB</div></div>
            <div class="stat-card"><div class="stat-label">Uptime</div><div class="stat-value" id="statUptime">00:00:00</div></div>
            <div class="stat-card"><div class="stat-label">Efficiency</div><div class="stat-value" id="statEfficiency">0</div></div>
          </div>
        </div>

        <div class="miner-actions">
          <button id="startMining" class="btn btn-primary btn-large">▶️ Start Mining</button>
          <button id="stopMining" class="btn btn-danger btn-large" disabled>⏹️ Stop Mining</button>
          <button id="settingsBtn" class="btn btn-secondary btn-small">⚙️ Settings</button>
        </div>
      </div>
    `;
  }

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

  renderPoolOptions() {
    const pools = this.config.pool.pools;
    return Object.entries(pools).map(([key, pool]) => `
      <option value="${key}" ${pool.enabled ? 'selected' : ''}>
        ${pool.name} (${pool.url})
      </option>
    `).join('');
  }

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

  attachEventListeners() {
    document.querySelectorAll('.crypto-toggle').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const crypto = e.target.dataset.crypto;
        this.config.set(`cryptocurrencies.${crypto}.enabled`, e.target.checked);
        this.updateUIState();
      });
    });

    document.getElementById('threadMinus')?.addEventListener('click', () => this.decreaseThreads());
    document.getElementById('threadPlus')?.addEventListener('click', () => this.increaseThreads());

    document.getElementById('cpuLimit')?.addEventListener('input', (e) => {
      this.config.set('performance.throttle.cpuLimit', parseInt(e.target.value));
      document.getElementById('cpuLimitValue').textContent = e.target.value + '%';
    });

    document.getElementById('adaptiveMode')?.addEventListener('change', (e) => {
      this.config.set('performance.optimization.adaptive', e.target.checked);
    });

    document.getElementById('startMining')?.addEventListener('click', () => this.startMining());
    document.getElementById('stopMining')?.addEventListener('click', () => this.stopMining());
  }

  updateThreadDisplay() {
    const optimal = this.optimizer.optimizeThreads();
    document.getElementById('threadCount').textContent = optimal;
  }

  decreaseThreads() {
    const current = parseInt(document.getElementById('threadCount').textContent);
    if (current > 1) {
      const newCount = current - 1;
      document.getElementById('threadCount').textContent = newCount;
      this.config.set('performance.threads.current', newCount);
    }
  }

  increaseThreads() {
    const current = parseInt(document.getElementById('threadCount').textContent);
    const max = navigator.hardwareConcurrency || 4;
    if (current < max) {
      const newCount = current + 1;
      document.getElementById('threadCount').textContent = newCount;
      this.config.set('performance.threads.current', newCount);
    }
  }

  updateUIState() {
    const enabledCryptos = this.config.getEnabledCryptos();
    const hasEnabled = Object.keys(enabledCryptos).length > 0;
    document.getElementById('startMining').disabled = !hasEnabled;
  }

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

  stopMining() {
    document.getElementById('startMining').disabled = false;
    document.getElementById('stopMining').disabled = true;
    document.getElementById('statusText').textContent = 'Stopped';
    this.optimizer.stopMonitoring();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('miner-container')) {
      const ui = new MinerUI('miner-container');
      ui.init();
    }
  });
} else {
  if (document.getElementById('miner-container')) {
    const ui = new MinerUI('miner-container');
    ui.init();
  }
}
