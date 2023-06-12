<template>
    <div></div>
</template>

<script setup>
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, LineBasicMaterial, Vector3, BufferGeometry, Line } from 'three'
// 场景
const scene = new Scene()
// 相机
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
// 渲染器
const renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// const geometry = new BoxGeometry( 1, 1, 1 );
// const material = new MeshBasicMaterial( { color: '0x00ff00' } );
// const cube = new Mesh( geometry, material );
// scene.add( cube );
// camera.position.z = 5;

const material = new LineBasicMaterial( { color: 0x00ff00 } );
const points = [];
points.push(new Vector3( - 10, 0, 0 ));
points.push(new Vector3( 0, 10, 0 ));
points.push(new Vector3( 10, 0, 0 ));
const geometry = new BufferGeometry().setFromPoints( points );
const line = new Line( geometry, material )
scene.add( line )

renderer.render( scene, camera )
</script>

<style>
*{
margin: 0;
padding: 0;
}
</style>
  