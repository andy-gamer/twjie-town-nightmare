

// A Web Audio API wrapper to generate atmospheric sounds procedurally

class AudioManager {
  private ctx: AudioContext | null = null;
  private activeNodes: AudioNode[] = [];
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private rainNodes: AudioNode[] = [];

  constructor() {
    // Context initialized on user interaction
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      // Lower master volume slightly
      this.masterGain.gain.value = 0.8; 
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Sound Effects ---

  playTypeSound() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    
    // Very subtle, crisp click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle'; // Softer than sine for clicks, less harsh than square
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.03);
    
    gain.gain.setValueAtTime(0.015, t); // Very quiet
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start();
    osc.stop(t + 0.04);
  }

  playFootstep(surface: 'dirt' | 'water' | 'wood' = 'dirt') {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    
    // Create noise buffer
    const bufferSize = this.ctx.sampleRate * (surface === 'water' ? 0.4 : 0.1); 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let lastOut = 0;

    for (let i = 0; i < bufferSize; i++) {
        // Different noise textures
        if (surface === 'dirt') {
            // Browner noise (smoother)
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5; // Compensate gain
        } else {
             // White noise
             data[i] = Math.random() * 2 - 1;
        }
        // Envelope
        data[i] *= Math.exp(-i / (this.ctx.sampleRate * (surface === 'water' ? 0.05 : 0.02)));
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    if (surface === 'water') {
        // WATER SPLASH
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, t);
        filter.frequency.linearRampToValueAtTime(1200, t + 0.1); // Splash up
        filter.frequency.exponentialRampToValueAtTime(200, t + 0.3); // Splash down
        
        gain.gain.setValueAtTime(0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    } else if (surface === 'dirt') {
        // DIRT/FOREST FLOOR (Muffled crunch)
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, t); // Low frequency
        filter.Q.value = 1;

        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1); // Short decay

    } else if (surface === 'wood') {
        // TEMPLE FLOOR (Hollow tap)
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, t);
        filter.Q.value = 5; // Resonant

        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08); // Very short
        
        // Add a secondary higher click for wood
        const clickOsc = this.ctx.createOscillator();
        clickOsc.frequency.setValueAtTime(1200, t);
        const clickGain = this.ctx.createGain();
        clickGain.gain.setValueAtTime(0.05, t);
        clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
        clickOsc.connect(clickGain);
        clickGain.connect(this.masterGain!);
        clickOsc.start();
        clickOsc.stop(t+0.05);
    }

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    noise.start();
  }

  playInteract() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    
    // Ethereal bell chime
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, t); // C5
    
    // Overtone
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1046.50, t); // C6
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain!);

    osc.start();
    osc2.start();
    osc.stop(t + 2.0);
    osc2.stop(t + 2.0);
  }

  playScare() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Discordant cluster
    const freqs = [100, 145, 180, 210];
    freqs.forEach(f => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t);
        osc.frequency.linearRampToValueAtTime(f * 0.5, t + 3); // Pitch drop

        const gain = this.ctx!.createGain();
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0, t + 3);

        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);
        osc.start();
        osc.stop(t + 3);
    });
  }

  // Generate a random spectral whisper sound
  playGhostWhisper() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Create a filtered noise burst
    const bufferSize = this.ctx.sampleRate * 1.5; // 1.5 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Bandpass filter moving around to simulate vowels
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 5;
    filter.frequency.setValueAtTime(500, t);
    filter.frequency.linearRampToValueAtTime(1200, t + 0.5);
    filter.frequency.linearRampToValueAtTime(400, t + 1.2);

    // Pan randomly
    const panner = this.ctx.createStereoPanner();
    panner.pan.value = Math.random() * 2 - 1;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.5);
    gain.gain.linearRampToValueAtTime(0, t + 1.5);

    noise.connect(filter);
    filter.connect(panner);
    panner.connect(gain);
    gain.connect(this.masterGain!);

    noise.start();
  }

  // --- Ambience ---

  playRain() {
      if (!this.ctx || this.isMuted) return;
      // Prevent multiple rain instances
      if (this.rainNodes.length > 0) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.1; // Pink-ish noise
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Filter to sound like rain on water/forest
      const hpFilter = this.ctx.createBiquadFilter();
      hpFilter.type = 'highpass';
      hpFilter.frequency.value = 600;

      const lpFilter = this.ctx.createBiquadFilter();
      lpFilter.type = 'lowpass';
      lpFilter.frequency.value = 3000;

      const gain = this.ctx.createGain();
      gain.gain.value = 0.15; // Ambient volume

      noise.connect(hpFilter);
      hpFilter.connect(lpFilter);
      lpFilter.connect(gain);
      gain.connect(this.masterGain!);

      noise.start();
      this.rainNodes.push(noise, hpFilter, lpFilter, gain);
  }

  stopRain() {
      const t = this.ctx?.currentTime || 0;
      this.rainNodes.forEach(node => {
          if (node instanceof GainNode) {
               node.gain.setTargetAtTime(0, t, 1.0);
          } else if (node instanceof AudioScheduledSourceNode) {
               node.stop(t + 1.5);
          }
      });
      this.rainNodes = [];
  }

  stopDrone() {
    if (this.ctx) {
      const t = this.ctx.currentTime;
      this.activeNodes.forEach(node => {
        if (node instanceof GainNode) {
            node.gain.setTargetAtTime(0, t, 0.5); 
        } else if (node instanceof AudioScheduledSourceNode) {
            node.stop(t + 1);
        }
      });
    }
    this.activeNodes = [];
  }

  playDrone(type: 'forest' | 'chanting') {
    if (!this.ctx || this.isMuted) return;
    this.stopDrone();
    const t = this.ctx.currentTime;

    if (type === 'forest') {
      // QUIET AMBIENCE
      
      // 1. Ultra low frequency sine drone
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 40; 
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.05, t + 3); 

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();

      this.activeNodes.push(osc, gain);

      // 2. Rumble
      const rumbleOsc = this.ctx.createOscillator();
      rumbleOsc.type = 'triangle';
      rumbleOsc.frequency.value = 30;
      
      const rumbleFilter = this.ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.value = 80;

      const rumbleGain = this.ctx.createGain();
      rumbleGain.gain.setValueAtTime(0, t);
      rumbleGain.gain.linearRampToValueAtTime(0.02, t + 5);

      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05; 
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 0.01;
      
      lfo.connect(lfoGain);
      lfoGain.connect(rumbleGain.gain);

      rumbleOsc.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(this.masterGain!);

      rumbleOsc.start();
      lfo.start();

      this.activeNodes.push(rumbleOsc, rumbleGain, lfo, lfoGain, rumbleFilter);
      
      // Add Rain Ambience for Forest
      this.playRain();

    } else if (type === 'chanting') {
      // Stop rain when entering temple/chanting scenes if desired
      this.stopRain();

      // 1. Low Drone
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = 55; // A1
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 120; // Very dark

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      
      this.activeNodes.push(osc, gain);
      
      // 2. Whispering Noise Layer
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5; // White noise
      }
      
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.Q.value = 2;
      noiseFilter.frequency.value = 800; 
      
      const noiseLfo = this.ctx.createOscillator();
      noiseLfo.type = 'sine';
      noiseLfo.frequency.value = 0.3; 
      const noiseLfoGain = this.ctx.createGain();
      noiseLfoGain.gain.value = 200; 
      
      noiseLfo.connect(noiseLfoGain);
      noiseLfoGain.connect(noiseFilter.frequency);
      
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0, t);
      noiseGain.gain.linearRampToValueAtTime(0.12, t + 4);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain!);
      
      noise.start();
      noiseLfo.start();
      
      this.activeNodes.push(noise, noiseGain, noiseLfo, noiseLfoGain);
    }
  }
}

export const audioManager = new AudioManager();