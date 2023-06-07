<template>
  <div></div>
</template>

<script setup>
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three'
// 场景
const scene = new Scene()
// 相机
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 渲染器
const renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new BoxGeometry( 1, 1, 1 );
const material = new MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

const animate = () => {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
};
animate()
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
</style>
