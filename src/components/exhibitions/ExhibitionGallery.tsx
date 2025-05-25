/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { getExhibitionDetailsById } from "@/services/exhibitionService";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader, FirstPersonControls } from 'three-stdlib';

type DetailsData = {
  _id: string;
  name: string;
  gallery: {
    _id: string;
    modelUrl: string;
  };
  artImages: string[];
};


type ImageData = {
  url: string;
  title: string;
};

export default function ExhibitionGallery() {
  const mountRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [activeTitle, setActiveTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState<DetailsData | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (id) {
          const data = await getExhibitionDetailsById(id);
          console.log("response?",data);
          setDetails(data);
        }

      } catch (error) {
        console.error("Failed to load exhibitions:", error);
      }
    };


    if (id) fetchDetails();
  }, [id]);

  useEffect(() => {

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const loader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let galleryModel: THREE.Object3D;
    let camera: THREE.PerspectiveCamera | null = null;

    if (!details) return;



    loader.load("/assets/threeD/test7/scene.gltf", //hereeeeeeeeeeeeeeeeee
      (gltf) => {
        setIsLoading(false);
        const model = gltf.scene;
        galleryModel = model;
        scene.add(model);

        if (gltf.cameras && gltf.cameras.length > 0) {
          camera = gltf.cameras[0] as THREE.PerspectiveCamera;
        }

        if (camera) {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          camera.position.y = 1.6;

          const box = new THREE.Box3().setFromObject(model);
          const minY = box.min.y;
          model.position.set(0, -minY, 0);
          model.scale.set(1, 1, 1);

          const controls = new FirstPersonControls(camera, renderer.domElement);
          controls.lookSpeed = 0.003;
          controls.movementSpeed = 0.4;
          controls.lookVertical = true;
          controls.constrainVertical = true;
          controls.verticalMin = 1.0;
          controls.verticalMax = 2.0;

          const createFrameAtMarker = (marker: THREE.Object3D, imageData: ImageData, name: string) => {
            const frameDepth = 0.05;
            const frameGeometry = new THREE.BoxGeometry(2, 2, frameDepth);
            const imageTexture = textureLoader.load(imageData.url);

            const materials = [
              new THREE.MeshBasicMaterial({ color: 0x000000 }),
              new THREE.MeshBasicMaterial({ color: 0x000000 }),
              new THREE.MeshBasicMaterial({ color: 0x000000 }),
              new THREE.MeshBasicMaterial({ color: 0x000000 }),
              new THREE.MeshBasicMaterial({ map: imageTexture }),
              new THREE.MeshBasicMaterial({ map: imageTexture }),
            ];

            const frameMesh = new THREE.Mesh(frameGeometry, materials);
            frameMesh.name = name;
            frameMesh.userData.title = imageData.title;
            frameMesh.position.copy(marker.position);
            frameMesh.rotation.copy(marker.rotation);
            frameMesh.position.z += 0.1;
            scene.add(frameMesh);
          };

          const imageData: ImageData[] = details.artImages.map((url: string, index: number) => ({//hereeeeeeeee
            url,
            title: `Artwork ${index + 1}`
          }));


          let frameIndex = 0;
          model.traverse((child) => {
            if (child.isObject3D && child.name.startsWith("FramePoint")) {
              createFrameAtMarker(child, imageData[frameIndex % imageData.length], child.name);
              frameIndex++;
            }
          });

          const raycaster = new THREE.Raycaster();
          const moveDirection = new THREE.Vector3();

          const checkCollision = () => {
            const directions = [
              new THREE.Vector3(1, 0, 0),
              new THREE.Vector3(-1, 0, 0),
              new THREE.Vector3(0, 0, 1),
              new THREE.Vector3(0, 0, -1)
            ];

            for (const direction of directions) {
              raycaster.set(camera!.position, direction);
              const intersects = raycaster.intersectObjects(scene.children, true);
              if (intersects.length > 0 && intersects[0].distance < 0.5) {
                moveDirection.copy(direction).negate();
                camera!.position.add(moveDirection.multiplyScalar(0.1));
              }
            }
          };

          const detectFrameProximity = () => {
            raycaster.setFromCamera(new THREE.Vector2(0, 0), camera!);
            raycaster.far = 3;
            const intersects = raycaster.intersectObjects(scene.children, true);

            let foundTitle: string | null = null;
            intersects.forEach((intersect) => {
              if (intersect.object.userData.title) {
                foundTitle = intersect.object.userData.title;
              }
            });

            setActiveTitle(foundTitle);
          };

          const animate = () => {
            requestAnimationFrame(animate);
            controls.update(0.1);
            checkCollision();
            detectFrameProximity();
            camera!.position.y = 1.6;
            renderer.render(scene, camera!);
          };

          animate();
        }
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
      }
    );

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [id]);

  return (
    <div className="canvasScene relative h-screen w-screen">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Close Button */}
      {!isLoading && (
        <button
          onClick={() => router.back()}
          className="fixed top-4 right-4 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Artwork Title Display */}
      {!isLoading && activeTitle && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 p-4 bg-black/80 text-white rounded-lg text-center backdrop-blur-sm">
          {activeTitle}
        </div>
      )}

      <div ref={mountRef} className="h-full w-full" />
    </div>
  );
}