uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform float uTime;
uniform float uZ;
uniform float uWave;

varying float time;

void main()
{

    vec3 pos = position;
    float dist = length(uv - vec2(0.5));
    float maxDist = length(vec2(0.5));
    float normalizeDist = 1.0 - dist/maxDist;

     
    pos.z += normalizeDist * uZ * 6.0;
    pos.z += (sin(uv.x * 8.+uTime * 7.) * .1) * uWave ;
    pos.z += (sin(uv.y * 8.+uTime * 7.) * .1) * uWave ;

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition =  projectionMatrix * viewPosition ;

    gl_Position = projectionPosition;
    vPosition = pos;
    vUv = uv ;
    vNormal = normal;
    time = uTime;
}