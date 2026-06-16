"use client";

/**
 * AmbientAudio — synthesises soft, looping nature ambience using the Web Audio API.
 *
 * No external audio files are used. Every texture is generated procedurally with
 * filtered noise + oscillators so the experience is fully self-contained.
 *
 * Each section has a unique sonic signature:
 *   - forest    : filtered wind + occasional bird chirps
 *   - waterfall : dense brown noise (constant rushing)
 *   - river     : gentle pink noise with slow modulation
 *   - ocean     : slow swelling waves (low-pass filtered noise with LFO)
 *   - night     : low drone + cricket pulses
 *
 * Only the active section's audio plays at any time. Transitions are 1s fades.
 */

export type Scene =
  | "forest"
  | "waterfall"
  | "river"
  | "ocean"
  | "night"
  | "path"
  | "lake"
  | "canopy";

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentScene: Scene | null = null;
  private nodes: AudioNode[] = [];
  private oscillators: OscillatorNode[] = [];
  private intervals: number[] = [];
  private started = false;

  /** Must be called from a user gesture (click/keydown) to satisfy autoplay rules. */
  async unlock() {
    if (this.started) return;
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctx();
      await this.ctx.resume();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0;
      this.masterGain.connect(this.ctx.destination);
      this.started = true;
    } catch {
      // Audio is non-essential — fail silently.
    }
  }

  get isUnlocked() {
    return this.started && this.ctx?.state === "running";
  }

  /** Fade out current scene then build and fade in the next. */
  async setScene(scene: Scene) {
    if (!this.ctx || !this.masterGain) return;
    if (this.currentScene === scene) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Fade out
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0, now + 1);

    // After fade, tear down and rebuild
    await new Promise((r) => setTimeout(r, 1050));
    this.teardown();

    this.currentScene = scene;
    this.buildScene(scene);

    // Fade in
    const inTime = ctx.currentTime;
    this.masterGain!.gain.cancelScheduledValues(inTime);
    this.masterGain!.gain.setValueAtTime(0, inTime);
    this.masterGain!.gain.linearRampToValueAtTime(0.55, inTime + 1);
  }

  private teardown() {
    this.oscillators.forEach((o) => {
      try {
        o.stop();
      } catch {
        /* already stopped */
      }
    });
    this.oscillators = [];
    this.nodes.forEach((n) => {
      try {
        n.disconnect();
      } catch {
        /* noop */
      }
    });
    this.nodes = [];
    this.intervals.forEach((id) => clearInterval(id));
    this.intervals = [];
  }

  private buildScene(scene: Scene) {
    if (!this.ctx || !this.masterGain) return;
    switch (scene) {
      case "forest":
        this.buildForest();
        break;
      case "waterfall":
        this.buildWaterfall();
        break;
      case "river":
        this.buildRiver();
        break;
      case "ocean":
        this.buildOcean();
        break;
      case "night":
        this.buildNight();
        break;
      case "path":
        this.buildPath();
        break;
      case "lake":
        this.buildLake();
        break;
      case "canopy":
        this.buildCanopy();
        break;
    }
  }

  /** Generate a buffer of noise (white/pink/brown-ish). */
  private makeNoiseBuffer(seconds: number, type: "white" | "pink" | "brown") {
    const ctx = this.ctx!;
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    if (type === "white") {
      for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    } else if (type === "pink") {
      let b0 = 0,
        b1 = 0,
        b2 = 0,
        b3 = 0,
        b4 = 0,
        b5 = 0,
        b6 = 0;
      for (let i = 0; i < length; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856;
        b4 = 0.55 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    } else {
      // brown
      let last = 0;
      for (let i = 0; i < length; i++) {
        const w = Math.random() * 2 - 1;
        last = (last + 0.02 * w) / 1.02;
        data[i] = last * 3.5;
      }
    }
    return buffer;
  }

  private makeNoiseSource(type: "white" | "pink" | "brown", seconds = 4) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.makeNoiseBuffer(seconds, type);
    src.loop = true;
    src.start();
    this.oscillators.push(src as unknown as OscillatorNode);
    return src;
  }

  private buildForest() {
    const ctx = this.ctx!;
    const master = this.masterGain!;

    // Wind: pink noise through low-pass with slow LFO modulation
    const wind = this.makeNoiseSource("pink", 4);
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = 600;
    windFilter.Q.value = 0.6;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.18;
    wind.connect(windFilter).connect(windGain).connect(master);

    // Slow LFO on wind filter
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 250;
    lfo.connect(lfoGain).connect(windFilter.frequency);
    lfo.start();
    this.oscillators.push(lfo);

    // Bird chirps — short FM sine bursts at random intervals
    const chirp = () => {
      if (!this.ctx || !this.masterGain) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      const baseFreq = 1800 + Math.random() * 1400;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.linearRampToValueAtTime(baseFreq + 600, t + 0.08);
      osc.frequency.linearRampToValueAtTime(baseFreq - 200, t + 0.16);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.06, t + 0.02);
      g.gain.linearRampToValueAtTime(0, t + 0.18);
      osc.connect(g).connect(master);
      osc.start(t);
      osc.stop(t + 0.2);
    };
    const id = window.setInterval(() => {
      if (Math.random() > 0.45) chirp();
      if (Math.random() > 0.7) setTimeout(chirp, 220);
    }, 1800);
    this.intervals.push(id);

    this.nodes.push(windFilter, windGain, lfoGain);
  }

  private buildWaterfall() {
    const ctx = this.ctx!;
    const master = this.masterGain!;

    // Dense brown noise — the constant rush of falling water
    const rush = this.makeNoiseSource("brown", 4);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 180;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 2400;
    const gain = ctx.createGain();
    gain.gain.value = 0.42;
    rush.connect(hp).connect(lp).connect(gain).connect(master);

    // Subtle high-frequency hiss for spray
    const spray = this.makeNoiseSource("white", 2);
    const sprayHp = ctx.createBiquadFilter();
    sprayHp.type = "highpass";
    sprayHp.frequency.value = 5000;
    const sprayGain = ctx.createGain();
    sprayGain.gain.value = 0.04;
    spray.connect(sprayHp).connect(sprayGain).connect(master);

    this.nodes.push(hp, lp, gain, sprayHp, sprayGain);
  }

  private buildRiver() {
    const ctx = this.ctx!;
    const master = this.masterGain!;

    // Pink noise with midrange emphasis — bubbling, flowing stream
    const flow = this.makeNoiseSource("pink", 4);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 900;
    bp.Q.value = 0.4;
    const gain = ctx.createGain();
    gain.gain.value = 0.32;
    flow.connect(bp).connect(gain).connect(master);

    // Slow LFO on gain — the ebb and surge of current
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.08;
    lfo.connect(lfoGain).connect(gain.gain);
    lfo.start();
    this.oscillators.push(lfo);

    // High-frequency sparkle
    const sparkle = this.makeNoiseSource("white", 2);
    const sparkleHp = ctx.createBiquadFilter();
    sparkleHp.type = "highpass";
    sparkleHp.frequency.value = 4000;
    const sparkleGain = ctx.createGain();
    sparkleGain.gain.value = 0.03;
    sparkle.connect(sparkleHp).connect(sparkleGain).connect(master);

    this.nodes.push(bp, gain, lfoGain, sparkleHp, sparkleGain);
  }

  private buildOcean() {
    const ctx = this.ctx!;
    const master = this.masterGain!;

    // Brown noise — the deep surf
    const surf = this.makeNoiseSource("brown", 4);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1200;
    const gain = ctx.createGain();
    gain.gain.value = 0.34;
    surf.connect(lp).connect(gain).connect(master);

    // Slow LFO mimics waves — gain swells every ~6s
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.16;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.22;
    lfo.connect(lfoGain).connect(gain.gain);
    lfo.start();
    this.oscillators.push(lfo);

    // Second LFO on filter for slow tonal shift
    const lfo2 = ctx.createOscillator();
    lfo2.frequency.value = 0.09;
    const lfo2Gain = ctx.createGain();
    lfo2Gain.gain.value = 400;
    lfo2.connect(lfo2Gain).connect(lp.frequency);
    lfo2.start();
    this.oscillators.push(lfo2);

    this.nodes.push(lp, gain, lfoGain, lfo2Gain);
  }

  private buildNight() {
    const ctx = this.ctx!;
    const master = this.masterGain!;

    // Low drone — barely-audible stillness
    const drone = ctx.createOscillator();
    drone.type = "sine";
    drone.frequency.value = 70;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.08;
    drone.connect(droneGain).connect(master);
    drone.start();
    this.oscillators.push(drone);

    // Higher shimmer
    const shimmer = ctx.createOscillator();
    shimmer.type = "sine";
    shimmer.frequency.value = 210;
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.025;
    shimmer.connect(shimmerGain).connect(master);
    shimmer.start();
    this.oscillators.push(shimmer);

    // Soft wind bed
    const wind = this.makeNoiseSource("pink", 4);
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = 350;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.08;
    wind.connect(windFilter).connect(windGain).connect(master);

    // Cricket pulses — short sine bursts around 4-5kHz
    const cricket = () => {
      if (!this.ctx || !this.masterGain) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 4200 + Math.random() * 700;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.025, t + 0.01);
      g.gain.linearRampToValueAtTime(0, t + 0.05);
      osc.connect(g).connect(master);
      osc.start(t);
      osc.stop(t + 0.06);
    };
    const id = window.setInterval(() => {
      if (Math.random() > 0.3) {
        cricket();
        setTimeout(cricket, 80);
        setTimeout(cricket, 160);
      }
    }, 900);
    this.intervals.push(id);

    this.nodes.push(droneGain, shimmerGain, windFilter, windGain);
  }

  /** Open forest road — windier and more spacious than the dense forest scene. */
  private buildPath() {
    const ctx = this.ctx!;
    const master = this.masterGain!;

    // Stronger wind — pink noise through mid low-pass
    const wind = this.makeNoiseSource("pink", 4);
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = 850;
    windFilter.Q.value = 0.5;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.26;
    wind.connect(windFilter).connect(windGain).connect(master);

    // Slow LFO — gusts every ~7s
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.14;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.12;
    lfo.connect(lfoGain).connect(windGain.gain);
    lfo.start();
    this.oscillators.push(lfo);

    // Filter LFO for tonal movement
    const lfo2 = ctx.createOscillator();
    lfo2.frequency.value = 0.07;
    const lfo2Gain = ctx.createGain();
    lfo2Gain.gain.value = 300;
    lfo2.connect(lfo2Gain).connect(windFilter.frequency);
    lfo2.start();
    this.oscillators.push(lfo2);

    // Distant rustling leaves — sparse high-frequency crackles
    const rustle = () => {
      if (!this.ctx || !this.masterGain) return;
      const t = ctx.currentTime;
      const burst = this.makeNoiseSource("white", 0.4);
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 3000;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.035, t + 0.05);
      g.gain.linearRampToValueAtTime(0, t + 0.35);
      burst.connect(hp).connect(g).connect(master);
      // Auto-stop the burst source after 0.5s
      (burst as unknown as { stop: (t: number) => void }).stop(t + 0.5);
    };
    const id = window.setInterval(() => {
      if (Math.random() > 0.35) rustle();
    }, 1200);
    this.intervals.push(id);

    this.nodes.push(windFilter, windGain, lfoGain, lfo2Gain);
  }

  /** Still misty lake — gentle water lapping against wood + distant birds. */
  private buildLake() {
    const ctx = this.ctx!;
    const master = this.masterGain!;

    // Soft wind bed
    const wind = this.makeNoiseSource("pink", 4);
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = 420;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.14;
    wind.connect(windFilter).connect(windGain).connect(master);

    // Water lapping — short filtered noise bursts at slow intervals
    const lap = () => {
      if (!this.ctx || !this.masterGain) return;
      const t = ctx.currentTime;
      const burst = this.makeNoiseSource("brown", 0.6);
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 600;
      bp.Q.value = 0.8;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.08, t + 0.08);
      g.gain.linearRampToValueAtTime(0, t + 0.5);
      burst.connect(bp).connect(g).connect(master);
      (burst as unknown as { stop: (t: number) => void }).stop(t + 0.7);
    };
    const id = window.setInterval(() => {
      if (Math.random() > 0.4) lap();
    }, 2200);
    this.intervals.push(id);

    // Distant bird — soft high sine, very occasional
    const distantBird = () => {
      if (!this.ctx || !this.masterGain) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      const baseFreq = 1400 + Math.random() * 600;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.linearRampToValueAtTime(baseFreq + 200, t + 0.12);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.03, t + 0.05);
      g.gain.linearRampToValueAtTime(0, t + 0.2);
      osc.connect(g).connect(master);
      osc.start(t);
      osc.stop(t + 0.22);
    };
    const id2 = window.setInterval(() => {
      if (Math.random() > 0.7) distantBird();
    }, 4500);
    this.intervals.push(id2);

    this.nodes.push(windFilter, windGain);
  }

  /** Sunlit canopy — bright bird song + rustling leaves + warm wind. */
  private buildCanopy() {
    const ctx = this.ctx!;
    const master = this.masterGain!;

    // Warm soft wind
    const wind = this.makeNoiseSource("pink", 4);
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = 700;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.12;
    wind.connect(windFilter).connect(windGain).connect(master);

    // Brighter bird chorus — more frequent and varied than forest
    const chirp = (baseFreq: number, duration: number) => {
      if (!this.ctx || !this.masterGain) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.linearRampToValueAtTime(baseFreq + 500, t + duration * 0.4);
      osc.frequency.linearRampToValueAtTime(baseFreq - 100, t + duration);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.02);
      g.gain.linearRampToValueAtTime(0, t + duration);
      osc.connect(g).connect(master);
      osc.start(t);
      osc.stop(t + duration + 0.05);
    };
    const id = window.setInterval(() => {
      if (Math.random() > 0.3) {
        chirp(2200 + Math.random() * 1800, 0.1 + Math.random() * 0.15);
        if (Math.random() > 0.5)
          setTimeout(
            () => chirp(2200 + Math.random() * 1800, 0.08 + Math.random() * 0.12),
            130,
          );
      }
    }, 900);
    this.intervals.push(id);

    // Leaf rustle — high-freq noise crackles, more often than in 'path'
    const rustle = () => {
      if (!this.ctx || !this.masterGain) return;
      const t = ctx.currentTime;
      const burst = this.makeNoiseSource("white", 0.3);
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 4000;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.025, t + 0.04);
      g.gain.linearRampToValueAtTime(0, t + 0.25);
      burst.connect(hp).connect(g).connect(master);
      (burst as unknown as { stop: (t: number) => void }).stop(t + 0.35);
    };
    const id2 = window.setInterval(() => {
      if (Math.random() > 0.25) rustle();
    }, 800);
    this.intervals.push(id2);

    this.nodes.push(windFilter, windGain);
  }
}

export const ambientAudio = new AmbientAudioEngine();
