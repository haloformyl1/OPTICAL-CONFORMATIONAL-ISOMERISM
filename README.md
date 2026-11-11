# PIECHEM — Stereochemistry Studio (Optical & Conformational Isomerism)

An interactive, animated, bilingual (**English & Bengali**) 3D web and mobile platform for mastering **Optical & Conformational Isomerism**:
- **Optical Isomerism**:
  - Enantiomers, Diastereomers, Identical Homomers, and *Meso* Compounds
  - Cahn-Ingold-Prelog (CIP) $(R)/(S)$ Stereodescriptors with real-time tetrahedral hand rules
  - Molecular Symmetry Analysis: Plane of Symmetry ($\sigma$ / POS), Inversion Center ($i$ / COS), and Alternating Axis of Symmetry ($S_n$)
  - Biot's Polarimeter Simulation with specific rotation $[\alpha]_\lambda^T = \frac{\alpha}{l \cdot c}$ calculations, concentration curves, and path length scaling
  - 2D Fischer cross-hair formulas, Wedge-Dash projections, and dynamic 2D $\leftrightarrow$ 3D split superpositions
- **Conformational Isomerism**:
  - Eclipsed, Staggered, Gauche, and Anti rotamers
  - Real-time Potential Energy Curves (Torsional strain, Steric van der Waals repulsion, and Dipole-dipole interactions)
  - Interactive Newman Projections & Sawhorse Formulas
  - Cyclohexane Chair-Chair Ring-Flip Simulator (Axial $\leftrightarrow$ Equatorial inversions, 1,3-diaxial strain, and A-values)
- **124+ Curated Chemical Models & Exceptions**:
  - **52 Optical Examples** (Lactic acid, Tartaric acid stereoisomers, Amino acids, Biphenyls, Allenes, Ephedrine, Thalidomide)
  - **52 Conformational Examples** (Ethane, Propane, Butane, Ethylene Glycol Gauche-effect, Cycloalkanes, Substituted cyclohexanes)
  - **20 Masterclass Exceptional Cases** (Atropisomerism in hindered biaryls, Helicenes, Paracyclophanes, Amine inversion / pyramidal umbrella flip, Tröger's base, Adamantanes)
- **Practice & Assessment**:
  - Timed Multi-mode Quiz with detailed Bengali & English explanations
  - 3D Interactive Flashcards with flip animations and recall tracking

---

## Architecture & Technology Stack
- **Frontend Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Cyber-dark scientific theme tokens
- **3D Graphics Engine**: Three.js + `@react-three/fiber` + `@react-three/drei`
- **State Management**: Zustand with persistent storage (`persist`)
- **Bilingual Engine**: Zero-overhead dual English/Bengali runtime
- **Mobile Deployment**: Progressive Web App (PWA) + Capacitor ready
- **Testing**: Vitest unit test suite covering stereochemical validation & CIP solvers

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build

# 4. Run test suite
npm test
```

---

*Designed & Prepared By: **Arghyadeep Roy** (Contact: 9830507435)*
