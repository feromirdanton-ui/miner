class MiningOptimizer {
  constructor(config = MinerConfig) {
    this.config = config;
    this.stats = {
      cpuUsage: 0,
      memoryUsage: 0,
      hashrate: 0,
      efficiency: 0,
      temperature: 0,
    };
    this.isRunning = false;
    this.monitoringInterval = null;
    this.throttleLevel = 0;
    this.adaptiveMode = config.performance.optimization.adaptive || false;
  }

  startMonitoring() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    this.monitoringInterval = setInterval(() => {
      this.updateStats();
      if (this.adaptiveMode) {
        this.adjustThrottling();
      }
    }, this.config.performance.optimization.updateInterval || 1000);
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isRunning = false;
  }

  updateStats() {
    const estimatedCPU = this.estimateCPUUsage();
    this.stats.cpuUsage = Math.min(100, estimatedCPU);

    if (performance.memory) {
      this.stats.memoryUsage = Math.round(
        (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
      );
    }
  }

  estimateCPUUsage() {
    const baseUsage = this.config.performance.threads.current || 1;
    const maxThreads = navigator.hardwareConcurrency || 4;
    return (baseUsage / maxThreads) * 100;
  }

  adjustThrottling() {
    const cpuLimit = this.config.performance.throttle.cpuLimit || 80;
    const memoryLimit = this.config.performance.throttle.memoryLimit || 512;

    if (this.stats.cpuUsage > cpuLimit) {
      this.increaseThrottle(5);
    } else if (this.stats.cpuUsage < cpuLimit - 10) {
      this.decreaseThrottle(3);
    }

    if (this.stats.memoryUsage > (memoryLimit / 1024) * 100) {
      this.increaseThrottle(10);
    }
  }

  increaseThrottle(amount = 5) {
    this.throttleLevel = Math.min(100, this.throttleLevel + amount);
    this.applyThrottle();
  }

  decreaseThrottle(amount = 3) {
    this.throttleLevel = Math.max(0, this.throttleLevel - amount);
    this.applyThrottle();
  }

  applyThrottle() {
    if (typeof window !== 'undefined' && window.minerWorkers) {
      window.minerWorkers.forEach(worker => {
        worker.postMessage({
          type: 'throttle',
          level: this.throttleLevel,
        });
      });
    }
  }

  optimizeThreads() {
    const cores = navigator.hardwareConcurrency || 4;
    const reserve = this.config.performance.threads.reserve || 1;
    const optimal = Math.max(1, cores - reserve);
    return optimal;
  }

  calculateEfficiency() {
    if (this.stats.cpuUsage === 0) return 0;
    this.stats.efficiency = this.stats.hashrate / this.stats.cpuUsage;
    return this.stats.efficiency;
  }

  getStats() {
    return { ...this.stats };
  }

  resetStats() {
    this.stats = {
      cpuUsage: 0,
      memoryUsage: 0,
      hashrate: 0,
      efficiency: 0,
      temperature: 0,
    };
  }
}
