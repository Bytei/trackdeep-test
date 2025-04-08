import shaderVertex from "@/shader/vertex.glsl";
import shaderFragment from "@/shader/fragment.glsl";

export const createCircleVertices = (size, numSegments) => {
    const vertices = [];
    for (let i = 0; i < numSegments; i++) {
        const angle = (i / numSegments) * 2 * Math.PI;
        const x = size * Math.cos(angle);
        const y = size * Math.sin(angle);
        vertices.push(x, y);
    }
    return vertices;
}

export const createSquareVertices = (size) => {
    const halfSize = size / 2;
    return [
        -halfSize, -halfSize,
        halfSize, -halfSize,
        halfSize, halfSize,
        -halfSize, halfSize
    ];
}

export const createTriangleVertices = (size) => {
    const halfSize = size / 2

    return [
        0, halfSize,
        -halfSize, -halfSize,
        halfSize, -halfSize
    ];
}

export const createVertexBuffer = (vertices, gl) => {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    return positionBuffer
}

export const initWebGL = (gl) => {
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, shaderVertex);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, shaderFragment);

    const shaderProgram = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(shaderProgram);

    return shaderProgram
}

export const getGlLocations = (gl, shaderProgram) => {
    return {
        positionLocation: gl.getAttribLocation(shaderProgram, "a_position"),
        resolutionLocation: gl.getUniformLocation(shaderProgram, "u_resolution"),
        colorLocation: gl.getUniformLocation(shaderProgram, "u_color"),
        positionOffsetLocation: gl.getUniformLocation(shaderProgram, "u_positionOffset")
    }
}

const compileShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error linking program:", gl.getProgramInfoLog(program));
        return null;
    }

    return program;
}