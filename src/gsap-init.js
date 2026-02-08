/**
 * Register GSAP plugins once at app boot so components don't re-register on every mount.
 * Reduces work and avoids duplicate plugin registration.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(ScrollTrigger, Observer);
