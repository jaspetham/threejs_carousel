import "./styles.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { scroll, texIndex } from "./scroll";

import vertexShader from "../Shaders/vertex.glsl";
import fragmentShader from "../Shaders/fragment.glsl";

//img texures
import p1 from "../Imgs/p1.jpg";
import p2 from "../Imgs/p2.jpg";
import p3 from "../Imgs/p3.jpg";
import p4 from "../Imgs/p4.jpg";
import p5 from "../Imgs/p5.jpg";

const imgs = [p1, p2, p3, p4, p5];
const imgTex = [];

//SCROLL
const con = document.querySelectorAll(".H");
const h = document.querySelector(".con");

const main = () => {
  const canvas = document.getElementById("c");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });

  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 10000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 4);
  camera.lookAt(0, 0, 0);

  camera.fov = 2 * (180 / Math.PI) * Math.atan(1 / 8);
  //TEXTURE LOADER
  const loader = new THREE.TextureLoader();

  //ORBIT CONTROLLER
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();

  //Uniforms
  let uniforms = {
    uTexture: { value: imgTex[0] },
    uTime: { value: 0 },
    uResolution: {
      value: new THREE.Vector4(0, 0, 0, 0)
    },
    uZ: {
      value: 0
    },
    uWave: {
      value: 0
    },
    uStatic: {
      value: 0
    },
    uMouse: {
      value: new THREE.Vector2(0, 0)
    }
  };

  let imageAspect = 600 / 1280;
  let a1;
  let a2;

  const scene = new THREE.Scene();

  const geometry = new THREE.PlaneBufferGeometry(1, 1, 60, 60);

  const material = new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms
    // wireframe: true
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  scene.add(mesh);

  scroll(con, h, material, imgTex);

  const onMouseDown = () => {
    gsap.fromTo(
      material.uniforms.uZ,
      {
        value: -1
      },
      {
        value: 0,
        duration: 1,
        ease: "power2"
      }
    );

    gsap.to(mesh.position, {
      z: -5,
      duration: 0.4
    });

    gsap.to(material.uniforms.uWave, {
      value: 1,
      duration: 0.8
    });

    if (con) {
      con.forEach((h) => {
        h.classList.remove("none");
      });
    }
  };

  const onMouse = () => {
    gsap.to(mesh.position, {
      z: 0,
      duration: 0.4
    });

    gsap.fromTo(
      material.uniforms.uZ,
      {
        value: -1
      },
      {
        value: 0,
        duration: 1.5,
        ease: "elastic"
      }
    );

    gsap.to(material.uniforms.uWave, {
      value: 0,
      duration: 0.8
    });

    if (con) {
      con.forEach((h, index) => {
        if (texIndex !== index) {
          h.classList.add("none");
        }
      });
    }
  };

  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mouseup", onMouse);
  document.addEventListener("mousemove", (e) => {
    let x = e.clientX / window.innerWidth;
    let y = 1 - e.clientY / window.innerHeight;
    material.uniforms.uMouse.value.x = x;
    material.uniforms.uMouse.value.y = y;
  });

  renderer.render(scene, camera);

  const resizeRendererToDisplaySize = (renderer) => {
    const canvas = renderer.domElement;
    const pixleRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixleRatio) | 0;
    const height = (canvas.clientHeight * pixleRatio) | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  };

  const render = (time) => {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;

      mesh.scale.x = camera.aspect;

      material.uniforms.uResolution.value.x = canvas.clientWidth;
      material.uniforms.uResolution.value.y = canvas.clientHeight;
      if (canvas.clientHeight / canvas.clientWidth > imageAspect) {
        a1 = (canvas.clientWidth / canvas.clientHeight) * imageAspect;
        a2 = 1;
      } else {
        a1 = 1;
        a2 = (canvas.clientHeight / canvas.clientWidth) * imageAspect;
      }
      material.uniforms.uResolution.value.z = a1;
      material.uniforms.uResolution.value.w = a2;

      camera.updateProjectionMatrix();
    }

    material.uniforms.uTime.value = time;
    // material.uniforms.uTexture.value = imgTex[indexNo(con, h)];

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
};

// main();

const texLoader = new THREE.TextureLoader();

imgs.forEach((img) => {
  texLoader.load(img, (texture) => {
    imgTex.push(texture);
    if (imgTex.length === imgs.length) {
      main();
    }
  });
});
