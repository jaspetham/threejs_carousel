precision mediump float;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float time;

// uniform float uTime;
uniform sampler2D uTexture;
uniform vec4 uResolution;
uniform float uStatic;
float PI = 3.14159265358979;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123 * time * 0.01);
}

// float noise(vec2 co){
//   return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
// }

// vec2 nUv = vUv;

void main()
{
    vec2 UV = vUv;
    // float nUv = length(vUv, uMouse);
    // float n = noise(UV);
    float rnd = random(vUv);
    vec2 newUv = (vUv - vec2(0.5)) * uResolution.zw + vec2(0.5);
    
    vec4 color = texture2D(uTexture, newUv) ;
    vec4 overlay = vec4(0.62, 0.123, 0.93, 1.);

    gl_FragColor = color * overlay + vec4(rnd * sin(uStatic));
    // gl_FragColor = vec4(uMouse, 1.0, 1.0);
}