/**
 * Mining Optimizer - Advanced performance tuning
 * Handles CPU throttling, adaptive difficulty, and memory management
 */

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
    this.throttleLevel = 0; // 0-100
    this.adaptiveMode = config.performance.optimization.adaptive || false;
  }

  /**
   * Start performance monitoring
   */
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

  /**
   * Stop performance monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isRunning = false;
  }

  /**
   * Update system performance statistics
   */
  updateStats() {
    // Estimate CPU usage from worker performance
    const estimatedCPU = this.estimateCPUUsage();
    this.stats.cpuUsage = Math.min(100, estimatedCPU);

    // Estimate memory usage
    if (performance.memory) {
      this.stats.memoryUsage = Math.round(
        (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
      );
    }

    // Log stats if debug enabled
    if (this.config.global.debug) {
      console.log(`[Optimizer] CPU: ${this.stats.cpuUsage}% | Mem: ${this.stats.memoryUsage}%`);
    }
  }

  /**
   * Estimate CPU usage from system performance
   */
  estimateCPUUsage() {
    // This is a simplified estimation
    // In production, you'd integrate with more accurate monitoring
    const baseUsage = this.config.performance.threads.current || 1;
    const maxThreads = navigator.hardwareConcurrency || 4;
    return (baseUsage / maxThreads) * 100;
  }

  /**
   * Adjust throttling based on system resources
   */
  adjustThrottling() {
    const cpuLimit = this.config.performance.throttle.cpuLimit || 80;
    const memoryLimit = this.config.performance.throttle.memoryLimit || 512;

    // Adjust if CPU exceeds limit
    if (this.stats.cpuUsage > cpuLimit) {
      this.increaseThrottle(5);
    } else if (this.stats.cpuUsage < cpuLimit - 10) {
      this.decreaseThrottle(3);
    }

    // Adjust if memory exceeds limit
    if (this.stats.memoryUsage > (memoryLimit / 1024) * 100) {
      this.increaseThrottle(10);
    }
  }

  /**
   * Increase throttling level
   */
  increaseThrottle(amount = 5) {
    this.throttleLevel = Math.min(100, this.throttleLevel + amount);
    this.applyThrottle();
  }

  /**
   * Decrease throttling level
   */
  decreaseThrottle(amount = 3) {
    this.throttleLevel = Math.max(0, this.throttleLevel - amount);
    this.applyThrottle();
  }

  /**
   * Apply current throttle level
   */
  applyThrottle() {
    // Send throttle level to workers
    if (typeof window !== 'undefined' && window.minerWorkers) {
      window.minerWorkers.forEach(worker => {
        worker.postMessage({
          type: 'throttle',
          level: this.throttleLevel,
        });
      });
    }
  }

  /**
   * Optimize thread count based on CPU cores
   */
  optimizeThreads() {
    const cores = navigator.hardwareConcurrency || 4;
    const reserve = this.config.performance.threads.reserve || 1;
    const optimal = Math.max(1, cores - reserve);
    
    return optimal;
  }

  /**
   * Calculate mining efficiency
   */
  calculateEfficiency() {
    if (this.stats.cpuUsage === 0) return 0;
    // Efficiency = hashrate / CPU usage
    this.stats.efficiency = this.stats.hashrate / this.stats.cpuUsage;
    return this.stats.efficiency;
  }

  /**
   * Get current stats
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Reset stats
   */
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MiningOptimizer;
}
