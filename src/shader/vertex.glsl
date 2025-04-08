attribute vec2 a_position;
uniform vec2 u_positionOffset;
uniform vec2 u_resolution;

void main() {
    vec2 position = a_position + u_positionOffset;
    vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;

    gl_Position = vec4(clipSpace, 0.0, 1.0);
}
