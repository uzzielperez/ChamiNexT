import React, { useRef, useEffect, useCallback } from 'react';

interface ShaderBackgroundProps {
  className?: string;
  opacity?: number;
  speed?: number;
}

const ShaderBackground: React.FC<ShaderBackgroundProps> = ({
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

  // Vertex shader - simple pass-through
  const vertexShaderSource = `
    attribute vec2 p;
    void main(){
      gl_Position=vec4(p,0,1);
    }
  `;

  // Fragment shader - Mont Blanc Alpine Light shader
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

    void main(){
      vec2 uv=gl_FragCoord.xy/resolution;
      uv=uv*2.-1.; 
      uv.x*=resolution.x/resolution.y;

      vec3 sky=mix(vec3(0.08,0.14,0.22),vec3(0.2,0.32,0.5),uv.y*.5+.5);
      float m=mountain(uv);
      float mask=step(m,uv.y);

      vec2 dir=normalize(vec2(0.5,1.));
      float d=abs(dot(uv,vec2(-dir.y,dir.x)));
      d+=fbm(uv*2.+time*0.05)*0.12;
      float beam=smoothstep(0.45,0.,d)*mask;
      beam*=smoothstep(m,m+0.18,uv.y);

      vec3 ice=vec3(0.6,0.75,0.95);
      vec3 snow=vec3(0.95,0.97,1.);
      vec3 col=sky;
      col+=beam*mix(ice,snow,beam)*1.3;

      if(uv.y<m){
        col*=0.25;
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

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return false;

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return false;

    programRef.current = program;

    // Get uniform locations
    uniformsRef.current = {
      time: gl.getUniformLocation(program, 'time'),
      resolution: gl.getUniformLocation(program, 'resolution')
    };

    // Create buffer for full-screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]), gl.STATIC_DRAW);

    // Set up attributes
    const positionLocation = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Enable blending for transparency
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

    // Clear canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Use program
    gl.useProgram(program);

    // Set uniforms
    if (uniforms.time) {
      gl.uniform1f(uniforms.time, time * 0.001 * speed);
    }
    if (uniforms.resolution) {
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    }

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Continue animation
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

export default ShaderBackground;