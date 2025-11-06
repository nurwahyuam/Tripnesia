// src/hooks/useActiveSection.js
import { useState, useEffect } from "react";

export const useActiveSection = (sectionIds) => {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || "");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3; // titik referensi lebih halus

      let currentSection = sectionIds[0];
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // panggil sekali di awal

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  return activeSection;
};
