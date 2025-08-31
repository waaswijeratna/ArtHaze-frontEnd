/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"; 

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader, FirstPersonControls } from 'three-stdlib';
import { getExhibitionDetailsById } from "@/services/exhibitionService";

interface Exhibition {
  _id: string;
  name: string;
  gallery: {
    _id: string;
    modelUrl: string;
  };
  artImages: string[];
}

type ImageData = {
  url: string;
  title: string;
};


export default function ExhibitionGallery() {
  const mountRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams?.get("id");
  const [activeTitle, setActiveTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  // Music controls
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  // Sync mute/volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.volume = volume;
    }
  }, [isMuted, volume]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!id) {
          console.error("No exhibition ID provided");
          setIsLoading(false);
          return;
        }
        
        const data = await getExhibitionDetailsById(id);
        setExhibition(data);
      } catch (err) {
        console.error("Failed to load exhibition details", err);
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  useEffect(() => {
    // Don't initialize the 3D scene until we have exhibition data
    if (!exhibition) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const loader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    let galleryModel: THREE.Object3D;
    let camera: THREE.PerspectiveCamera | null = null;

    // Use the modelUrl from the API response
    loader.load(exhibition.gallery.modelUrl,
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

          // Create imageData from API response
          const imageData: ImageData[] = exhibition.artImages.map((url, index) => ({
            url,
            title: `Artwork ${index + 1}`, // You can modify this to use actual titles if available
          }));

          // If no images are available, show a message or use fallback
          if (imageData.length === 0) {
            console.warn("No art images available for this exhibition");
          }

          let frameIndex = 0;
          model.traverse((child) => {
            if (child.isObject3D && child.name.startsWith("FramePoint")) {
              // Only create frame if we have images available
              if (imageData.length > 0) {
                createFrameAtMarker(child, imageData[frameIndex % imageData.length], child.name);
                frameIndex++;
              }
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
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [exhibition]); // Now depends on exhibition data

  return (
    <div className="canvasScene relative h-screen w-screen">
      {/* Background Music */}
      <audio
        ref={audioRef}
        src="/audio/peaceMusic.mp3"
        autoPlay
        loop
        style={{ display: 'none' }}
      />
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Error state */}
      {!isLoading && !exhibition && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 text-white">
          <div className="text-center">
            <p className="text-xl mb-4">Failed to load exhibition</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* Close Button */}
      {!isLoading && exhibition && (
        <button
          onClick={() => router.back()}
          className="fixed top-4 right-4 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-800"
            fill="none"
            viewBox="0 24 24"
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

      {/* Exhibition Title */}
      {!isLoading && exhibition && (
        <div className="fixed top-4 left-4 z-50 p-3 bg-black/80 text-white rounded-lg backdrop-blur-sm">
          <h1 className="text-lg font-semibold">{exhibition.name}</h1>
        </div>
      )}

      {/* Artwork Title Display */}
      {!isLoading && activeTitle && exhibition && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 p-4 bg-black/80 text-white rounded-lg text-center backdrop-blur-sm">
          {activeTitle}
        </div>
      )}

      <div ref={mountRef} className="h-full w-full" />

      {/* Music Controls - bottom left */}
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 bg-black/70 p-2 rounded-lg shadow-lg">
        <button
          onClick={() => setIsMuted(m => !m)}
          className="text-white focus:outline-none"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l6 6m0-6l-6 6M15 12a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l-7 7h4a1 1 0 001 1h3a1 1 0 001-1h4l-7-7v13z" />
            </svg>
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          className="w-24 accent-third"
        />
      </div>
    </div>
  );
}