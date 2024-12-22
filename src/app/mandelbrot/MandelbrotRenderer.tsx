'use client';

import React, { useEffect, useRef } from 'react';
import Viewport from '../../canvas/Viewport';

interface Props {
  viewport: Viewport;
}

const MandelbrotRenderer: React.FC<Props> = ({ viewport }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      alert('Unable to initialize WebGL. Your browser may not support it.');
      return;
    }

    const vertexShaderSource = `
      attribute vec4 aVertexPosition;
      void main() {
        gl_Position = aVertexPosition;
      }
    `;

    const fragmentShaderSource = `
      precision highp float;

      uniform vec4 uViewport;
      uniform vec2 uResolution;

      int mandelbrot(vec2 c) {
        vec2 z = vec2(0.0);
        for (int i = 0; i < 256; i++) {
          z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
          if (dot(z, z) > 4.0) {
            return i;
          }
        }
        return 0;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        vec2 c = vec2(uViewport.x + uv.x * uViewport.z, uViewport.y + uv.y * uViewport.w);
        int iterations = mandelbrot(c);

        if (iterations == 0){
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        } else {
            float color = float(iterations) / 256.0;
            gl_FragColor = vec4(color, color, color, 1.0);
        }
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) return;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return;
    }

    gl.useProgram(shaderProgram);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1, -1, 1, -1, -1, 1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const aVertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(aVertexPosition);
    gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);

    const uViewport = gl.getUniformLocation(shaderProgram, 'uViewport');
    const uResolution = gl.getUniformLocation(shaderProgram, 'uResolution');

    const render = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform4f(uViewport, viewport.offsetX, viewport.offsetY, viewport.width, viewport.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    render();

  }, [viewport]);

  return <canvas ref={canvasRef} width={750} height={500} style={{ display: 'block' }} />;
};

export default MandelbrotRenderer;