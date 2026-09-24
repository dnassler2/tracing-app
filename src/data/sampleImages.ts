import { ReferenceImage } from '../types/tracer';

// SVG 1: Botanical Rose Sketch
const roseSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <rect width="600" height="800" fill="#ffffff"/>
  <g fill="none" stroke="#111111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Rose Blossom Petals -->
    <path d="M300 240 C280 200 320 180 340 210 C360 230 330 260 300 250 Z" />
    <path d="M280 230 C260 210 250 250 270 270 C290 280 310 260 290 240" />
    <path d="M340 220 C370 210 390 250 360 280 C340 290 310 280 330 250" />
    <path d="M260 260 C230 270 240 320 280 330 C320 340 350 320 370 300 C390 280 400 240 370 220" />
    <path d="M240 300 C210 330 250 380 300 380 C350 380 410 350 410 290 C410 250 380 220 350 210" />
    <path d="M230 350 C210 400 270 430 330 420 C390 410 440 360 430 300" />
    <path d="M270 420 C290 450 340 450 370 430" />
    <!-- Calyx & Leaves -->
    <path d="M280 440 L260 490 L290 470 L300 510 L320 460 L350 490 L340 440" />
    <!-- Stem & Thorns -->
    <path d="M310 470 C310 540 295 620 305 720" stroke-width="4"/>
    <path d="M306 530 L325 540 L307 550" fill="#111111" />
    <path d="M298 610 L280 620 L297 630" fill="#111111" />
    <!-- Left Leaf -->
    <path d="M300 560 C250 540 200 560 170 600 C210 610 260 590 300 575 Z" fill="#fcfcfc" />
    <path d="M300 560 Q235 580 170 600" />
    <path d="M260 568 L250 555" />
    <path d="M240 575 L230 560" />
    <path d="M220 582 L210 570" />
    <path d="M270 572 L275 588" />
    <path d="M250 580 L255 595" />
    <path d="M230 587 L235 602" />
    <!-- Right Leaf -->
    <path d="M304 640 C350 620 410 630 440 680 C390 690 340 670 304 650 Z" fill="#fcfcfc" />
    <path d="M304 640 Q370 660 440 680" />
    <path d="M340 648 L350 635" />
    <path d="M370 658 L380 645" />
    <path d="M400 668 L410 655" />
    <path d="M330 652 L325 668" />
    <path d="M360 662 L355 678" />
    <!-- Fine Contour Hatching -->
    <path d="M285 290 Q295 305 315 310" stroke-width="1.5" />
    <path d="M275 320 Q300 335 325 330" stroke-width="1.5" />
    <path d="M295 350 Q320 365 350 355" stroke-width="1.5" />
    <path d="M330 260 Q345 270 360 265" stroke-width="1.5" />
  </g>
</svg>
`;

// SVG 2: Wise Owl Sketch
const owlSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <rect width="600" height="800" fill="#ffffff"/>
  <g fill="none" stroke="#111111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Branch -->
    <path d="M80 620 C180 610 320 630 520 600" stroke-width="6"/>
    <path d="M220 615 C260 625 340 625 380 610" stroke-width="4"/>
    <!-- Owl Body Contour -->
    <path d="M230 220 C200 160 210 130 250 160 C270 170 330 170 350 160 C390 130 400 160 370 220 C420 300 430 460 400 580 L380 630 L220 630 L200 580 C170 460 180 300 230 220 Z" />
    <!-- Feather Tufts / Ears -->
    <path d="M230 200 L210 130 L250 170" />
    <path d="M370 200 L390 130 L350 170" />
    <!-- Eyes -->
    <circle cx="260" cy="250" r="32" stroke-width="3" />
    <circle cx="260" cy="250" r="16" fill="#111111" />
    <circle cx="255" cy="245" r="5" fill="#ffffff" stroke="none" />
    <circle cx="340" cy="250" r="32" stroke-width="3" />
    <circle cx="340" cy="250" r="16" fill="#111111" />
    <circle cx="335" cy="245" r="5" fill="#ffffff" stroke="none" />
    <!-- Beak -->
    <polygon points="300,265 290,295 300,315 310,295" fill="#ffffff" stroke-width="2.5" />
    <!-- Facial Disk Radiating Rings -->
    <path d="M230 250 C230 290 280 295 290 290" stroke-dasharray="3,3" />
    <path d="M370 250 C370 290 320 295 310 290" stroke-dasharray="3,3" />
    <path d="M240 215 C280 200 320 200 360 215" />
    <!-- Chest Scallop Feathers -->
    <path d="M260 350 Q280 365 300 350 Q320 365 340 350" />
    <path d="M245 385 Q270 405 300 385 Q330 405 355 385" />
    <path d="M240 425 Q270 450 300 425 Q330 450 360 425" />
    <path d="M250 470 Q275 495 300 470 Q325 495 350 470" />
    <path d="M265 520 Q285 540 300 520 Q315 540 335 520" />
    <!-- Wings Cross-hatching -->
    <path d="M210 320 C195 400 205 520 230 580" stroke-width="2"/>
    <path d="M390 320 C405 400 395 520 370 580" stroke-width="2"/>
    <path d="M210 380 L230 420" stroke-width="1.5"/>
    <path d="M205 430 L230 470" stroke-width="1.5"/>
    <path d="M210 480 L235 520" stroke-width="1.5"/>
    <path d="M390 380 L370 420" stroke-width="1.5"/>
    <path d="M395 430 L370 470" stroke-width="1.5"/>
    <path d="M390 480 L365 520" stroke-width="1.5"/>
    <!-- Talons gripping branch -->
    <path d="M250 605 C250 630 260 635 265 615" stroke-width="3" />
    <path d="M265 605 C265 632 275 635 280 615" stroke-width="3" />
    <path d="M280 605 C280 630 290 635 295 615" stroke-width="3" />
    <path d="M305 605 C305 630 315 635 320 615" stroke-width="3" />
    <path d="M320 605 C320 632 330 635 335 615" stroke-width="3" />
    <path d="M335 605 C335 630 345 635 350 615" stroke-width="3" />
    <!-- Tail Feathers -->
    <path d="M280 630 L280 690 L320 690 L320 630" />
    <path d="M300 630 L300 700" />
  </g>
</svg>
`;

// SVG 3: Classical Hand Study (Renaissance Drawing)
const handSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <rect width="600" height="800" fill="#ffffff"/>
  <g fill="none" stroke="#221e1b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Wrist & Forearm -->
    <path d="M220 730 C230 650 235 590 220 540" stroke-width="3"/>
    <path d="M380 730 C370 650 365 590 375 520" stroke-width="3"/>
    <!-- Palm and Thenar Eminence -->
    <path d="M220 540 C200 480 180 430 190 380" />
    <path d="M375 520 C385 460 380 400 370 360" />
    <!-- Thumb -->
    <path d="M190 380 C170 340 160 300 175 270 C190 240 220 260 230 290 L260 370" />
    <path d="M178 285 Q190 280 205 295" stroke-width="1.5" />
    <!-- Thumb nail -->
    <path d="M180 270 C185 260 200 265 205 275" stroke-width="1.5" />
    <!-- Index Finger -->
    <path d="M260 370 L260 220 C260 170 285 160 295 190 L300 350" />
    <path d="M270 190 C275 180 285 180 290 190" stroke-width="1.5" />
    <path d="M262 235 Q280 245 298 235" stroke-width="1.5" />
    <path d="M262 280 Q280 290 298 280" stroke-width="1.5" />
    <!-- Middle Finger -->
    <path d="M300 350 L305 180 C305 130 335 130 340 170 L340 360" />
    <path d="M315 160 C320 150 330 150 335 160" stroke-width="1.5" />
    <path d="M307 205 Q325 215 338 205" stroke-width="1.5" />
    <path d="M307 260 Q325 270 338 260" stroke-width="1.5" />
    <!-- Ring Finger -->
    <path d="M340 360 L345 210 C345 165 370 170 372 200 L370 370" />
    <path d="M352 195 C356 185 365 185 368 195" stroke-width="1.5" />
    <path d="M346 240 Q360 250 371 240" stroke-width="1.5" />
    <path d="M346 290 Q360 300 371 290" stroke-width="1.5" />
    <!-- Little Finger -->
    <path d="M370 370 L380 260 C380 220 405 230 405 260 L395 400" />
    <path d="M388 245 C392 238 400 240 402 248" stroke-width="1.5" />
    <path d="M382 290 Q392 298 402 290" stroke-width="1.5" />
    <path d="M382 335 Q392 342 400 335" stroke-width="1.5" />
    <!-- Knuckle and Palm Creases -->
    <path d="M260 370 C280 390 340 390 370 370" stroke-width="1.8" />
    <path d="M240 450 C280 460 330 430 365 440" stroke-width="1.8" />
    <path d="M230 490 C270 510 320 490 350 495" stroke-width="1.8" />
    <path d="M240 400 C250 470 280 520 290 540" stroke-width="1.5" stroke-dasharray="3,2" />
    <!-- Renaissance Shading / Hatching lines -->
    <g stroke-width="1" opacity="0.6">
      <line x1="225" y1="430" x2="245" y2="445" />
      <line x1="220" y1="445" x2="240" y2="460" />
      <line x1="215" y1="460" x2="238" y2="475" />
      <line x1="210" y1="480" x2="235" y2="495" />
      <line x1="365" y1="460" x2="380" y2="445" />
      <line x1="368" y1="480" x2="382" y2="465" />
      <line x1="365" y1="500" x2="380" y2="485" />
    </g>
  </g>
</svg>
`;

// SVG 4: Architectural Perspective & Geometric Study
const architectureSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <rect width="600" height="800" fill="#ffffff"/>
  <g fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Horizon & Vanishing Lines -->
    <line x1="40" y1="560" x2="560" y2="560" stroke-width="1" stroke-dasharray="4,4" opacity="0.4"/>
    <!-- Classical Archway / Temple Facade -->
    <!-- Base Pedestal Steps -->
    <polygon points="100,680 500,680 480,650 120,650" fill="#fafafa"/>
    <polygon points="120,650 480,650 465,625 135,625" fill="#fafafa"/>
    <polygon points="135,625 465,625 450,600 150,600" fill="#fafafa"/>
    <!-- Four Classical Columns -->
    <!-- Col 1 -->
    <rect x="160" y="320" width="36" height="280" />
    <path d="M152 320 L204 320 L198 300 L158 300 Z" />
    <line x1="172" y1="320" x2="172" y2="600" stroke-width="1"/>
    <line x1="184" y1="320" x2="184" y2="600" stroke-width="1"/>
    <!-- Col 2 -->
    <rect x="230" y="320" width="36" height="280" />
    <path d="M222 320 L274 320 L268 300 L228 300 Z" />
    <line x1="242" y1="320" x2="242" y2="600" stroke-width="1"/>
    <line x1="254" y1="320" x2="254" y2="600" stroke-width="1"/>
    <!-- Col 3 -->
    <rect x="334" y="320" width="36" height="280" />
    <path d="M326 320 L378 320 L372 300 L332 300 Z" />
    <line x1="346" y1="320" x2="346" y2="600" stroke-width="1"/>
    <line x1="358" y1="320" x2="358" y2="600" stroke-width="1"/>
    <!-- Col 4 -->
    <rect x="404" y="320" width="36" height="280" />
    <path d="M396 320 L448 320 L442 300 L402 300 Z" />
    <line x1="416" y1="320" x2="416" y2="600" stroke-width="1"/>
    <line x1="428" y1="320" x2="428" y2="600" stroke-width="1"/>
    <!-- Central Arch Portal Behind Columns -->
    <path d="M266 600 L266 430 C266 390 334 390 334 430 L334 600" stroke-width="2.5" />
    <path d="M276 600 L276 435 C276 405 324 405 324 435 L324 600" stroke-width="1.5" stroke-dasharray="3,3" />
    <!-- Entablature Beam -->
    <rect x="140" y="270" width="320" height="30" />
    <rect x="130" y="255" width="340" height="15" />
    <!-- Classical Pediment (Triangle Roof) -->
    <polygon points="120,255 480,255 300,140" fill="#fafafa" stroke-width="3"/>
    <polygon points="145,245 455,245 300,160" stroke-width="1.5"/>
    <!-- Tympanum Rosette / Medallion -->
    <circle cx="300" cy="215" r="22" stroke-width="2" />
    <circle cx="300" cy="215" r="10" stroke-width="1.5" />
    <!-- Roof Statuary Finial -->
    <path d="M300 140 L300 100 L308 108 L300 80 L292 108 L300 100" stroke-width="2" fill="#fafafa"/>
  </g>
</svg>
`;

function toDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const SAMPLE_IMAGES: ReferenceImage[] = [
  {
    id: 'sample-rose',
    name: 'Botanical Rose',
    url: toDataUrl(roseSvg),
    source: 'sample',
  },
  {
    id: 'sample-owl',
    name: 'Great Horned Owl',
    url: toDataUrl(owlSvg),
    source: 'sample',
  },
  {
    id: 'sample-hand',
    name: 'Classical Hand Study',
    url: toDataUrl(handSvg),
    source: 'sample',
  },
  {
    id: 'sample-arch',
    name: 'Classical Architecture',
    url: toDataUrl(architectureSvg),
    source: 'sample',
  },
];
