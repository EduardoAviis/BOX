// Configurar la escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("contenedor-3d").appendChild(renderer.domElement);

// Agregar luz
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// Cargar el modelo GLB
const loader = new THREE.GLTFLoader();
let brain;
loader.load('cerebro.glb', function (gltf) {
    brain = gltf.scene;
    brain.scale.set(1, 1, 1);
    brain.position.set(0, -1, 0);
    scene.add(brain);
}, undefined, function (error) {
    console.error("Error al cargar el modelo", error);
});

// Posicionar la cámara
camera.position.z = 3;

// Raycaster para detectar clics en el modelo
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoBox = document.getElementById("info-box");

// Datos de las regiones del cerebro
const brainRegions = {
    "Corteza Motora": "Controla los movimientos voluntarios.",
    "Corteza Sensorial": "Procesa la información del tacto.",
    "Tronco Encefálico": "Regula funciones vitales como la respiración.",
};

// Evento de clic para mostrar información
function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    
    if (brain) {
        const intersects = raycaster.intersectObjects(brain.children, true);
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            const objectName = clickedObject.name;
            if (brainRegions[objectName]) {
                infoBox.innerText = brainRegions[objectName];
                infoBox.style.display = "block";
            }
        }
    }
}

window.addEventListener("click", onMouseClick);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();