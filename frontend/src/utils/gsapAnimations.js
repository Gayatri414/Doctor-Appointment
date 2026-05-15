import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize GSAP animations - simplified for better performance
export const initGSAPAnimations = () => {
  
  // Simple fade in elements on scroll - reduced complexity
  gsap.utils.toArray('.gsap-fade-in').forEach((element) => {
    gsap.fromTo(element, 
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // Simple slide animations - reduced complexity
  gsap.utils.toArray('.gsap-slide-left').forEach((element) => {
    gsap.fromTo(element,
      {
        opacity: 0,
        x: -50
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  gsap.utils.toArray('.gsap-slide-right').forEach((element) => {
    gsap.fromTo(element,
      {
        opacity: 0,
        x: 50
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // Removed intensive animations like morphing, floating, glow pulse, etc.
  // to improve performance and prevent page instability

};

// Cleanup function
export const cleanupGSAP = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

// Refresh ScrollTrigger (useful after dynamic content changes)
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};

// Simple page transition animations
export const pageTransitionIn = () => {
  return gsap.fromTo('.page-content',
    {
      opacity: 0
    },
    {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out"
    }
  );
};

export const pageTransitionOut = () => {
  return gsap.to('.page-content',
    {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in"
    }
  );
};