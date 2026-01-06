import React, { useRef, useEffect, useCallback } from 'react';

interface AuroraBackgroundProps {
  className?: string;
  opacity?: number;
  speed?: number;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  className = '',
  opacity = 0.3,
  speed = 1.0
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const programRef = useRef<WebGLProgram | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const uniformsRef = useRef<{
    time: WebGLUniformLocation | null;
    resolution: WebGLUniformLocation | null;
  }>({ time: null, resolution: null });

  // Vertex shader
  const vertexShaderSource = `
    attribute vec2 p;
    void main(){
      gl_Position=vec4(p,0,1);
    }
  `;

  // Fragment shader with green northern lights
  const fragmentShaderSource = `
    precision highp float;
    uniform float time;
    uniform vec2 resolution;

    float h(vec2 p){
      return fract(sin(dot(p,vec2(127.1,311.7)))*43758.545);
    }
    
    float n(vec2 p){
      vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
      return mix(mix(h(i),h(i+vec2(1,0)),u.x),
                 mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);
    }
    
    float fbm(vec2 p){
      float v=0.,a=.5;
      for(int i=0;i<5;i++){v+=a*n(p);p*=2.;a*=.5;}
      return v;
    }

    float mountain(vec2 uv){
      float b=0.32;
      float p1=exp(-pow((uv.x+0.12)*2.6,2.))*0.42;
      float r1=exp(-pow((uv.x-0.35)*3.8,2.))*0.22;
      float r2=exp(-pow((uv.x+0.6)*4.2,2.))*0.16;
      return b+p1+r1+r2+fbm(uv*6.)*0.05;
    }

    // Aurora function for northern lights
    float aurora(vec2 uv, float t) {
      float wave1 = sin(uv.x * 3.0 + t * 0.8) * 0.1;
      float wave2 = sin(uv.x * 5.0 - t * 0.6) * 0.05;
      float wave3 = sin(uv.x * 7.0 + t * 1.2) * 0.03;
      
      float y = uv.y - 0.6 + wave1 + wave2 + wave3;
      float intensity = exp(-abs(y) * 8.0);
      
      // Add flowing noise
      float noise = fbm(vec2(uv.x * 4.0 + t * 0.3, uv.y * 2.0));
      intensity *= (0.7 + 0.3 * noise);
      
      return intensity;
    }

    void main(){
      vec2 uv=gl_FragCoord.xy/resolution;
      uv=uv*2.-1.; 
      uv.x*=resolution.x/resolution.y;

      // Dark night sky with subtle gradient
      vec3 sky=mix(vec3(0.02,0.05,0.08),vec3(0.05,0.12,0.18),uv.y*.5+.5);
      float m=mountain(uv);
      float mask=step(m,uv.y);

      // Calculate distance to mountain silhouette for glow effect
      float distToMountain = abs(uv.y - m);
      float glow = exp(-distToMountain * 12.0) * mask;
      glow += exp(-distToMountain * 6.0) * 0.3 * mask;
      
      // Subtle blue mountain glow
      float glowPulse = 0.8 + 0.2 * sin(time * 0.2);
      glow *= glowPulse;

      // Green Aurora Borealis
      float auroraIntensity = aurora(uv, time);
      auroraIntensity *= mask; // Only show above mountains
      
      // Multiple aurora layers for depth
      float aurora2 = aurora(uv + vec2(0.3, 0.1), time * 0.7) * 0.6;
      float aurora3 = aurora(uv - vec2(0.2, 0.05), time * 1.3) * 0.4;
      
      vec3 auroraColor1 = vec3(0.2, 0.8, 0.4); // Bright green
      vec3 auroraColor2 = vec3(0.1, 0.6, 0.3); // Darker green
      vec3 auroraColor3 = vec3(0.3, 0.9, 0.5); // Light green
      
      vec3 mountainGlow = vec3(0.4, 0.6, 0.8); // Cool blue glow
      vec3 col = sky;
      
      // Add mountain glow
      col += glow * mountainGlow * 0.6;
      
      // Add aurora layers
      col += auroraIntensity * auroraColor1 * 1.2;
      col += aurora2 * auroraColor2 * 0.8;
      col += aurora3 * auroraColor3 * 0.6;

      if(uv.y<m){
        col*=0.15; // Darker mountains
        // Add subtle glow reflection
        col += glow * mountainGlow * 0.1;
      }

      gl_FragColor=vec4(col,1);
    }
  `;

  const createShader = useCallback((gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }, []);

  const createProgram = useCallback((gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null => {
    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  }, []);

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return false;
    }

    glRef.current = gl as WebGLRenderingContext;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return false;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return false;

    programRef.current = program;

    uniformsRef.current = {
      time: gl.getUniformLocation(program, 'time'),
      resolution: gl.getUniformLocation(program, 'resolution')
    };

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    return true;
  }, [createShader, createProgram, vertexShaderSource, fragmentShaderSource]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    gl.viewport(0, 0, canvas.width, canvas.height);
  }, []);

  const render = useCallback((time: number) => {
    const gl = glRef.current;
    const program = programRef.current;
    const uniforms = uniformsRef.current;
    const canvas = canvasRef.current;

    if (!gl || !program || !canvas) return;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    if (uniforms.time) {
      gl.uniform1f(uniforms.time, time * 0.001 * speed);
    }
    if (uniforms.resolution) {
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    animationRef.current = requestAnimationFrame(render);
  }, [speed]);

  useEffect(() => {
    if (!initWebGL()) {
      console.error('Failed to initialize WebGL');
      return;
    }

    resizeCanvas();
    animationRef.current = requestAnimationFrame(render);

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [initWebGL, resizeCanvas, render]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        width: '100%',
        height: '100%',
        opacity: opacity,
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default AuroraBackground;