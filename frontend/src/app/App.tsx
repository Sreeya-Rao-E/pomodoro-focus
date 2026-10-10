import { useState, useEffect, useRef, useCallback } from 'react';
import svgPathsCatNew from "./imports/svg-8owaoe9n0a";
import svgPathsDog from "./imports/svg-iycd71sgm8";
import svgPathsDuck from "./imports/svg-wy0n9pkpwj";
import svgPathsButton from "./imports/svg-ccla7ywmlp";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import CustomCursor from "./components/CustomCursor";

type Character = 'f1car' | 'cat' | 'dog' | 'duck';
type TimerState = 'idle' | 'running' | 'paused';
type Mode = 'focus' | 'break';

const themes = {
  f1car: {
    background: '#0a0a0a',
    accent: '#E10600',
    timerBg: 'rgba(255, 255, 255, 0.055)',
    textColor: '#ffffff'
  },
  cat: {
    background: '#b92a1b',
    accent: '#181818',
    timerBg: 'rgba(255,255,255,0.4)',
    textColor: '#181818'
  },
  dog: {
    background: '#00889a',
    accent: '#21314a',
    timerBg: 'rgba(255,255,255,0.4)',
    textColor: '#21314a'
  },
  duck: {
    background: '#edbd5c',
    accent: '#372300',
    timerBg: 'rgba(255,255,255,0.4)',
    textColor: '#372300'
  }
};

const characterLabels: Record<Character, string> = {
  f1car: 'F1 Car',
  cat: 'Cat',
  dog: 'Dog',
  duck: 'Duck'
};

const presets = {
  focus: 25 * 60,
  break: 5 * 60
};

function Timer({ time, mode, theme, character }: {
  time: number;
  mode: Mode;
  theme: typeof themes.f1car;
  character: Character;
}) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isF1 = character === 'f1car';

  const modeLabel = isF1
    ? (mode === 'focus' ? 'RACE MODE' : 'PIT STOP')
    : (mode === 'focus' ? 'Focus time' : 'Break time');

  if (isF1) {
    // 100% UNTOUCHED F1 LAYOUT & STYLING
    return (
      <div
        className="box-border flex flex-col items-center justify-center not-italic px-6 py-2.5 relative rounded-[20px] shrink-0 text-center h-[200px] w-[340px]"
        style={{
          backgroundColor: theme.timerBg,
          color: theme.textColor,
          border: '1px solid rgba(225, 6, 0, 0.22)',
          boxShadow: '0 0 40px rgba(225, 6, 0, 0.07), inset 0 1px 0 rgba(255,255,255,0.05)',
          WebkitAppRegion: 'no-drag' as any
        }}
      >
        <div
          className="relative shrink-0"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '68px',
            lineHeight: '80px',
            letterSpacing: '-1px',
            height: '80px',
            width: '290px'
          }}
        >
          <p className="block">{timeString}</p>
        </div>
        <div
          className="relative shrink-0"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '17px',
            fontWeight: 600,
            letterSpacing: '0.22em',
            width: '290px',
            lineHeight: '50px'
          }}
        >
          <p className="block">{modeLabel}</p>
        </div>
      </div>
    );
  }

  // ALIGNED & CONTAINED CAT / ANIMAL TIMER
  return (
    <div
      className="box-border flex flex-col items-center justify-center not-italic px-6 py-4 relative rounded-[20px] shrink-0 text-center w-[313px] h-[190px] overflow-hidden"
      style={{
        backgroundColor: theme.timerBg,
        color: theme.textColor,
        WebkitAppRegion: 'no-drag' as any
      }}
    >
      <div
        className="flex items-center justify-center w-full"
        style={{
          fontFamily: "'Jomhuria', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: '96px',
          lineHeight: '0.9',
          letterSpacing: '-1px',
          height: '92px'
        }}
      >
        <span className="block leading-none select-none">{timeString}</span>
      </div>
      <div
        className="flex items-center justify-center w-full mt-2"
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: '24px',
          fontWeight: 500,
          lineHeight: '1.2'
        }}
      >
        <span className="block select-none">{modeLabel}</span>
      </div>
    </div>
  );
}

function F1CarCharacter({ mousePos, cardRef }: { mousePos: { x: number; y: number }; cardRef: React.RefObject<HTMLDivElement> }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;
    const handleChange = () => { prefersReducedMotion.current = mediaQuery.matches; };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const updatePosition = useCallback(() => {
    if (prefersReducedMotion.current) {
      setPosition({ x: 0, y: 0 });
      return;
    }
    if (!cardRef.current || (mousePos.x === 0 && mousePos.y === 0)) {
      setPosition(prev => ({
        x: prev.x + (0 - prev.x) * 0.08,
        y: prev.y + (0 - prev.y) * 0.08
      }));
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = mousePos.x - centerX;
    const offsetY = mousePos.y - centerY;
    const maxMovement = 28;
    const targetX = Math.max(-maxMovement, Math.min(maxMovement, offsetX * 0.1));
    const targetY = Math.max(-maxMovement, Math.min(maxMovement, offsetY * 0.1));
    setPosition(prev => ({
      x: prev.x + (targetX - prev.x) * 0.1,
      y: prev.y + (targetY - prev.y) * 0.1
    }));
  }, [mousePos.x, mousePos.y, cardRef]);

  useEffect(() => {
    const animate = () => {
      updatePosition();
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [updatePosition]);

  return (
    <div
      className="absolute left-[52px] top-[14px] w-[360px] h-[420px] will-change-transform"
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      <svg viewBox="0 0 360 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="block size-full">
        <defs>
          <radialGradient id="f1glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E10600" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#E10600" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="tireSheen" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="100%" stopColor="#141414" />
          </radialGradient>
        </defs>

        <ellipse cx="180" cy="215" rx="115" ry="160" fill="url(#f1glow)" />

        <rect x="50" y="10" width="11" height="52" rx="3" fill="#B00000" />
        <rect x="299" y="10" width="11" height="52" rx="3" fill="#B00000" />
        <rect x="61" y="10" width="238" height="28" rx="2" fill="#E10600" />
        <rect x="61" y="36" width="238" height="8" rx="2" fill="#C50000" />
        <rect x="50" y="44" width="62" height="11" rx="2" fill="#B00000" />
        <rect x="248" y="44" width="62" height="11" rx="2" fill="#B00000" />

        <path d="M 163 36 Q 180 32 197 36 L 208 80 Q 202 90 180 91 Q 158 90 152 80 Z" fill="#C50000" />

        <rect x="110" y="82" width="42" height="6" rx="3" fill="#1E1E1E" />
        <rect x="208" y="82" width="42" height="6" rx="3" fill="#1E1E1E" />

        <ellipse cx="82" cy="112" rx="27" ry="43" fill="url(#tireSheen)" />
        <ellipse cx="82" cy="112" rx="17" ry="17" fill="#232323" />
        <circle cx="82" cy="112" r="6.5" fill="#E10600" />
        <circle cx="82" cy="112" r="2.5" fill="rgba(255,255,255,0.5)" />

        <ellipse cx="278" cy="112" rx="27" ry="43" fill="url(#tireSheen)" />
        <ellipse cx="278" cy="112" rx="17" ry="17" fill="#232323" />
        <circle cx="278" cy="112" r="6.5" fill="#E10600" />
        <circle cx="278" cy="112" r="2.5" fill="rgba(255,255,255,0.5)" />

        <path d="
          M 152 80
          C 144 104 140 130 138 163
          L 96 183 C 84 199 80 224 82 250
          C 84 274 95 292 113 302
          L 149 313
          C 149 339 151 363 157 375
          C 163 389 171 397 180 397
          C 189 397 197 389 203 375
          C 209 363 211 339 211 313
          L 247 302
          C 265 292 276 274 278 250
          C 280 224 276 199 264 183
          L 222 163
          C 220 130 216 104 208 80 Z
        " fill="#E10600" />

        <path d="M 138 163 L 96 183 C 84 199 80 224 82 250 C 84 270 93 287 110 296 L 149 309 L 143 198 Z" fill="#C50000" />
        <path d="M 222 163 L 264 183 C 276 199 280 224 278 250 C 276 270 267 287 250 296 L 211 309 L 217 198 Z" fill="#C50000" />

        <path d="M 125 175 L 138 165 L 143 198 L 130 205 Z" fill="#0A0A0A" opacity="0.6" />
        <path d="M 235 175 L 222 165 L 217 198 L 230 205 Z" fill="#0A0A0A" opacity="0.6" />

        <rect x="177" y="80" width="6" height="317" rx="3" fill="rgba(255,100,80,0.1)" />

        <path d="M 167 120 L 193 120 L 196 148 L 164 148 Z" fill="#080808" />

        <rect x="178" y="146" width="4" height="20" rx="2" fill="#111" />

        <path d="M 157 163 C 157 155 168 149 180 149 C 192 149 203 155 203 163 L 199 167 C 191 161 169 161 161 167 Z" fill="#111" />

        <ellipse cx="180" cy="202" rx="22" ry="39" fill="#080808" />

        <ellipse cx="180" cy="198" rx="17" ry="23" fill="#E10600" />
        <path d="M 165 191 C 167 180 193 180 195 191 C 196 198 190 205 180 205 C 170 205 164 198 165 191 Z" fill="#1A3658" />
        <path d="M 171 183 C 174 177 186 177 189 183" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <ellipse cx="175" cy="190" rx="5" ry="3" fill="rgba(255,255,255,0.12)" transform="rotate(-20 175 190)" />

        <text
          x="180"
          y="268"
          textAnchor="middle"
          fontSize="22"
          fontFamily="'Arial Black', Arial, sans-serif"
          fontWeight="900"
          fill="white"
          opacity="0.72"
        >1</text>

        <rect x="110" y="293" width="42" height="6" rx="3" fill="#1E1E1E" />
        <rect x="208" y="293" width="42" height="6" rx="3" fill="#1E1E1E" />

        <ellipse cx="82" cy="335" rx="27" ry="43" fill="url(#tireSheen)" />
        <ellipse cx="82" cy="335" rx="17" ry="17" fill="#232323" />
        <circle cx="82" cy="335" r="6.5" fill="#E10600" />
        <circle cx="82" cy="335" r="2.5" fill="rgba(255,255,255,0.5)" />

        <ellipse cx="278" cy="335" rx="27" ry="43" fill="url(#tireSheen)" />
        <ellipse cx="278" cy="335" rx="17" ry="17" fill="#232323" />
        <circle cx="278" cy="335" r="6.5" fill="#E10600" />
        <circle cx="278" cy="335" r="2.5" fill="rgba(255,255,255,0.5)" />

        <rect x="149" y="342" width="10" height="40" rx="2" fill="#C50000" />
        <rect x="201" y="342" width="10" height="40" rx="2" fill="#C50000" />
        <rect x="58" y="377" width="244" height="7" rx="2" fill="#C50000" />
        <rect x="58" y="382" width="244" height="26" rx="2" fill="#E10600" />
        <rect x="50" y="371" width="11" height="45" rx="3" fill="#B00000" />
        <rect x="299" y="371" width="11" height="45" rx="3" fill="#B00000" />
      </svg>
    </div>
  );
}

function CatCharacter({ mousePos, cardRef }: { mousePos: { x: number; y: number }; cardRef: React.RefObject<HTMLDivElement> }) {
  const [leftPupilPos, setLeftPupilPos] = useState({ x: 138.748, y: 172.247 });
  const [rightPupilPos, setRightPupilPos] = useState({ x: 323.562, y: 172.247 });
  const animationRef = useRef<number>();

  const updatePupils = useCallback(() => {
    if (!cardRef.current || (mousePos.x === 0 && mousePos.y === 0)) {
      setLeftPupilPos({ x: 138.748, y: 172.247 });
      setRightPupilPos({ x: 323.562, y: 172.247 });
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const leftEyeCenter = { x: 127.659, y: 172.583 };
    const rightEyeCenter = { x: 306.425, y: 172.583 };
    const eyeRadius = 49.0601;
    const pupilRadius = 31.9227;

    const svgRect = {
      left: rect.left + (42.02 / 464) * rect.width,
      top: rect.top + (193 / 447) * rect.height,
      width: (409.979 / 464) * rect.width,
      height: (245.199 / 447) * rect.height
    };

    const scaleX = 418 / svgRect.width;
    const scaleY = 254 / svgRect.height;

    const mouseSvgX = (mousePos.x - svgRect.left) * scaleX;
    const mouseSvgY = (mousePos.y - svgRect.top) * scaleY;

    const maxMovement = eyeRadius - pupilRadius;

    const leftDx = mouseSvgX - leftEyeCenter.x;
    const leftDy = mouseSvgY - leftEyeCenter.y;
    const leftDistance = Math.sqrt(leftDx * leftDx + leftDy * leftDy);

    let newLeftX = leftEyeCenter.x;
    let newLeftY = leftEyeCenter.y;

    if (leftDistance > 0) {
      const leftMovement = Math.min(leftDistance * 0.4, maxMovement);
      newLeftX = leftEyeCenter.x + (leftDx / leftDistance) * leftMovement;
      newLeftY = leftEyeCenter.y + (leftDy / leftDistance) * leftMovement;
    }

    const rightDx = mouseSvgX - rightEyeCenter.x;
    const rightDy = mouseSvgY - rightEyeCenter.y;
    const rightDistance = Math.sqrt(rightDx * rightDx + rightDy * rightDy);

    let newRightX = rightEyeCenter.x;
    let newRightY = rightEyeCenter.y;

    if (rightDistance > 0) {
      const rightMovement = Math.min(rightDistance * 0.4, maxMovement);
      newRightX = rightEyeCenter.x + (rightDx / rightDistance) * rightMovement;
      newRightY = rightEyeCenter.y + (rightDy / rightDistance) * rightMovement;
    }

    setLeftPupilPos(prev => ({
      x: prev.x + (newLeftX - prev.x) * 0.15,
      y: prev.y + (newLeftY - prev.y) * 0.15
    }));

    setRightPupilPos(prev => ({
      x: prev.x + (newRightX - prev.x) * 0.15,
      y: prev.y + (newRightY - prev.y) * 0.15
    }));
  }, [mousePos.x, mousePos.y, cardRef]);

  useEffect(() => {
    const animate = () => {
      updatePupils();
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [updatePupils]);

  return (
    <div className="absolute h-[245.199px] left-[42.02px] top-[193px] w-[409.979px]" data-name="Cat">
      <div className="absolute inset-[-1.63%_-0.98%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 418 254">
          <g id="Cat">
            <g filter="url(#filter0_g_1_1352)" id="Union">
              <path d={svgPathsCatNew.p1b1d6100} fill="var(--fill-0, #181818)" />
            </g>
            <circle cx="127.659" cy="172.583" fill="var(--fill-0, white)" id="Ellipse 80" r="49.0601" />
            <circle cx={leftPupilPos.x} cy={leftPupilPos.y} fill="var(--fill-0, #181818)" id="Ellipse 82" r="31.9227" />
            <circle cx="306.425" cy="172.583" fill="var(--fill-0, white)" id="Ellipse 81" r="49.0601" />
            <circle cx={rightPupilPos.x} cy={rightPupilPos.y} fill="var(--fill-0, #181818)" id="Ellipse 83" r="31.9227" />
          </g>
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="253.199"
              id="filter0_g_1_1352"
              width="417.979"
              x="0"
              y="-7.11803e-05"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.25 0.25" numOctaves="3" seed="4389" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="8" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_1_1352">
                <feMergeNode in="displacedImage" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function DuckCharacter({ mousePos, cardRef }: { mousePos: { x: number; y: number }; cardRef: React.RefObject<HTMLDivElement> }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;
    const handleChange = () => { prefersReducedMotion.current = mediaQuery.matches; };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const updatePosition = useCallback(() => {
    if (prefersReducedMotion.current) {
      setPosition({ x: 0, y: 0 });
      return;
    }
    if (!cardRef.current || (mousePos.x === 0 && mousePos.y === 0)) {
      setPosition(prev => ({
        x: prev.x + (0 - prev.x) * 0.08,
        y: prev.y + (0 - prev.y) * 0.08
      }));
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = mousePos.x - centerX;
    const offsetY = mousePos.y - centerY;
    const maxMovement = 32;
    const scaleFactor = 0.15;
    const targetX = Math.max(-maxMovement, Math.min(maxMovement, offsetX * scaleFactor));
    const targetY = Math.max(-maxMovement, Math.min(maxMovement, offsetY * scaleFactor));
    setPosition(prev => ({
      x: prev.x + (targetX - prev.x) * 0.12,
      y: prev.y + (targetY - prev.y) * 0.12
    }));
  }, [mousePos.x, mousePos.y, cardRef]);

  useEffect(() => {
    const animate = () => {
      updatePosition();
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [updatePosition]);

  return (
    <div
      className="absolute h-[267.512px] left-[136px] top-[126px] w-[261.383px] will-change-transform"
      data-name="Duck"
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      <div className="absolute bottom-[-0.49%] left-[-0.5%] right-0 top-[-0.49%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 264 271">
          <g id="Duck">
            <g filter="url(#filter0_g_8_1202)" id="Union">
              <path d={svgPathsDuck.p3e6ffd00} fill="var(--fill-0, #FFFDF3)" />
            </g>
            <path d={svgPathsDuck.p29b0d100} fill="var(--fill-0, #FAE58F)" id="Union_2" />
            <path d={svgPathsDuck.p347efa00} fill="var(--fill-0, #FAE58F)" id="Union_3" />
            <g filter="url(#filter1_g_8_1202)" id="Ellipse 51">
              <ellipse cx="41.4204" cy="48.9379" fill="var(--fill-0, #6E4905)" rx="3.61123" ry="6.97523" transform="rotate(-40.3453 41.4204 48.9379)" />
            </g>
            <g filter="url(#filter2_g_8_1202)" id="Ellipse 52">
              <ellipse cx="73.0801" cy="26.152" fill="var(--fill-0, #6E4905)" rx="2.56028" ry="4.94529" transform="rotate(-40.3453 73.0801 26.152)" />
            </g>
            <path d={svgPathsDuck.p4917880} fill="var(--fill-0, #FAE58F)" id="Vector 3" />
            <g filter="url(#filter3_g_8_1202)" id="Ellipse 54">
              <ellipse cx="83.7525" cy="51.3347" fill="var(--fill-0, #6E4905)" rx="0.931561" ry="1.79935" transform="rotate(-40.3453 83.7525 51.3347)" />
            </g>
            <g filter="url(#filter4_g_8_1202)" id="Ellipse 55">
              <ellipse cx="72.739" cy="60.8798" fill="var(--fill-0, #6E4905)" rx="0.931561" ry="1.79935" transform="rotate(-40.3453 72.739 60.8798)" />
            </g>
            <g filter="url(#filter5_g_8_1202)" id="Ellipse 53">
              <circle cx="208.9" cy="223.374" fill="var(--fill-0, #FFFDF3)" r="33.0406" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="270.112" id="filter0_g_8_1202" width="255.036" x="0.700508" y="0.70055">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.034674063324928284 0.034674063324928284" numOctaves="3" seed="1425" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="2.5999999046325684" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_8_1202"><feMergeNode in="displacedImage" /></feMerge>
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="12.6181" id="filter1_g_8_1202" width="11.5783" x="35.6313" y="42.6289">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.25 0.25" numOctaves="3" seed="8847" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="1" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_8_1202"><feMergeNode in="displacedImage" /></feMerge>
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="9.23696" id="filter2_g_8_1202" width="8.49977" x="68.8302" y="21.5335">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.25 0.25" numOctaves="3" seed="8847" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="1" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_8_1202"><feMergeNode in="displacedImage" /></feMerge>
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="3.99702" id="filter3_g_8_1202" width="3.7288" x="81.8881" y="49.3362">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.25 0.25" numOctaves="3" seed="8847" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="1" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_8_1202"><feMergeNode in="displacedImage" /></feMerge>
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="3.99702" id="filter4_g_8_1202" width="3.7288" x="70.8746" y="58.8813">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.25 0.25" numOctaves="3" seed="8847" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="1" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_8_1202"><feMergeNode in="displacedImage" /></feMerge>
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="70.5811" id="filter5_g_8_1202" width="70.5811" x="173.61" y="188.083">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.079365074634552002 0.079365074634552002" numOctaves="3" seed="2471" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="4.5" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_8_1202"><feMergeNode in="displacedImage" /></feMerge>
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function DogCharacter({ mousePos, cardRef }: { mousePos: { x: number; y: number }; cardRef: React.RefObject<HTMLDivElement> }) {
  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const updatePupils = useCallback(() => {
    if (!cardRef.current || (mousePos.x === 0 && mousePos.y === 0)) {
      setLeftPupil({ x: 0, y: 0 });
      setRightPupil({ x: 0, y: 0 });
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();

    const leftEyeCenter = {
      x: rect.left + (41.1368 / 265 * rect.width) + 190,
      y: rect.top + (66.7967 / 216 * rect.height) + 224
    };
    const rightEyeCenter = {
      x: rect.left + (88.0823 / 265 * rect.width) + 190,
      y: rect.top + (66.7967 / 216 * rect.height) + 224
    };

    const maxDistance = 4.8;

    const leftAngle = Math.atan2(mousePos.y - leftEyeCenter.y, mousePos.x - leftEyeCenter.x);
    const rightAngle = Math.atan2(mousePos.y - rightEyeCenter.y, mousePos.x - rightEyeCenter.x);

    const leftDist = Math.sqrt(Math.pow(mousePos.x - leftEyeCenter.x, 2) + Math.pow(mousePos.y - leftEyeCenter.y, 2));
    const rightDist = Math.sqrt(Math.pow(mousePos.x - rightEyeCenter.x, 2) + Math.pow(mousePos.y - rightEyeCenter.y, 2));

    const newLeft = {
      x: Math.cos(leftAngle) * Math.min(leftDist * 0.3, maxDistance),
      y: Math.sin(leftAngle) * Math.min(leftDist * 0.3, maxDistance)
    };
    const newRight = {
      x: Math.cos(rightAngle) * Math.min(rightDist * 0.3, maxDistance),
      y: Math.sin(rightAngle) * Math.min(rightDist * 0.3, maxDistance)
    };

    setLeftPupil(prev => ({
      x: prev.x + (newLeft.x - prev.x) * 0.15,
      y: prev.y + (newLeft.y - prev.y) * 0.15
    }));
    setRightPupil(prev => ({
      x: prev.x + (newRight.x - prev.x) * 0.15,
      y: prev.y + (newRight.y - prev.y) * 0.15
    }));
  }, [mousePos.x, mousePos.y, cardRef]);

  useEffect(() => {
    const animate = () => {
      updatePupils();
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [updatePupils]);

  return (
    <div className="absolute h-[215.88px] left-[190px] top-56 w-[264.335px]" data-name="Dog">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 265 216">
        <g id="Dog">
          <path d={svgPathsDog.p3de7b800} fill="var(--fill-0, #E6E3D7)" id="Rectangle 15" />
          <path d={svgPathsDog.p79f4040} fill="var(--fill-0, #E6E3D7)" id="Rectangle 14" />
          <path d={svgPathsDog.pd215100} fill="var(--fill-0, #FBFBF4)" id="Union" />
          <path d={svgPathsDog.p1c0bc280} fill="var(--fill-0, #E6E3D7)" id="Exclude" />
          <path d={svgPathsDog.p3f68cd80} fill="var(--fill-0, #3F2749)" id="Polygon 11" />
          <path d={svgPathsDog.p3c8f4690} fill="var(--fill-0, #E6E3D7)" fillOpacity="0.51" id="Vector 9" />
        </g>
      </svg>
      <div
        className="absolute w-[19px] h-[19px] bg-white rounded-full overflow-hidden"
        style={{ left: 31.6, top: 57.3 }}
      >
        <div
          className="w-[9.5px] h-[9.5px] bg-[#3F2749] rounded-full transition-transform duration-75 ease-out"
          style={{ transform: `translate(${leftPupil.x}px, ${leftPupil.y}px)`, margin: '4.75px' }}
        />
      </div>
      <div
        className="absolute w-[19px] h-[19px] bg-white rounded-full overflow-hidden"
        style={{ left: 78.6, top: 57.3 }}
      >
        <div
          className="w-[9.5px] h-[9.5px] bg-[#3F2749] rounded-full transition-transform duration-75 ease-out"
          style={{ transform: `translate(${rightPupil.x}px, ${rightPupil.y}px)`, margin: '4.75px' }}
        />
      </div>
    </div>
  );
}

function CharacterCard({ character, mousePos, cardRef }: {
  character: Character;
  mousePos: { x: number; y: number };
  cardRef: React.RefObject<HTMLDivElement>;
}) {
  const isF1 = character === 'f1car';

  return (
    <div
      ref={cardRef}
      className="h-[447px] relative shrink-0 w-[464px]"
      data-name="scene-wrap"
      style={{ WebkitAppRegion: 'no-drag' as any }}
    >
      <div className="absolute h-[447px] left-0 top-0 w-[464px]" data-name="Character">
        <div className="h-[447px] overflow-clip relative w-[464px]">
          {character === 'f1car' && <F1CarCharacter mousePos={mousePos} cardRef={cardRef} />}
          {character === 'cat' && <CatCharacter mousePos={mousePos} cardRef={cardRef} />}
          {character === 'dog' && <DogCharacter mousePos={mousePos} cardRef={cardRef} />}
          {character === 'duck' && <DuckCharacter mousePos={mousePos} cardRef={cardRef} />}
        </div>
        <div
          aria-hidden="true"
          className="absolute border-solid inset-0 pointer-events-none"
          style={{
            borderColor: isF1 ? 'rgba(225, 6, 0, 0.18)' : '#ffffff',
            borderWidth: isF1 ? '1px' : '15px'
          }}
        />
      </div>
      <div className="absolute h-0 left-[-22px] top-[15px] w-[508px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-15px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 508 15">
            <line
              id="Line 4"
              stroke={isF1 ? '#E10600' : 'white'}
              strokeWidth={isF1 ? '1.5' : '15'}
              strokeOpacity={isF1 ? '0.4' : '1'}
              x2="508"
              y1="7.5"
              y2="7.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Controls({
  timerState,
  onStart,
  onPause,
  onReset,
  onBreak,
  onFocus,
  theme,
  character,
  onCharacterChange,
  mode
}: {
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onBreak: () => void;
  onFocus: () => void;
  theme: typeof themes.f1car;
  character: Character;
  onCharacterChange: (char: Character) => void;
  mode: Mode;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isF1 = character === 'f1car';

  const handleCharacterSelect = (char: Character) => {
    onCharacterChange(char);
    setDialogOpen(false);
  };

  const breakLabel = isF1 ? 'Pit Stop' : 'Break';
  const focusLabel = isF1 ? 'Race' : 'Focus';

  return (
    <div
      className="box-border content-stretch flex flex-row gap-[9px] items-center justify-start p-0 relative shrink-0"
      data-name="controls"
      style={{ WebkitAppRegion: 'no-drag' as any }}
    >
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0">
            <div className="bg-[#ffffff] relative rounded-[100px] shrink-0">
              <div className="box-border content-stretch flex flex-col items-center justify-center overflow-clip p-0 relative">
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-6 py-4 relative shrink-0">
                  <svg className="relative shrink-0 size-6" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <path d={svgPathsButton.p8cbf100} fill={theme.accent} />
                  </svg>
                </div>
              </div>
              <div
                aria-hidden="true"
                className="absolute border border-solid inset-0 pointer-events-none rounded-[100px]"
                style={{ borderColor: theme.accent }}
              />
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="bg-[#ffffff] max-w-[600px] min-w-[200px] rounded-3xl p-0 border-neutral-200 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]">
          <DialogHeader className="sr-only">
            <DialogTitle>Choose character</DialogTitle>
            <DialogDescription>Each character has its own theme and appearance.</DialogDescription>
          </DialogHeader>
          <div className="box-border content-stretch flex flex-col items-center justify-start max-w-inherit min-w-inherit overflow-clip p-0 relative w-full">
            <div className="relative shrink-0 w-full">
              <div
                aria-hidden="true"
                className="absolute border-[0px_0px_1px] border-neutral-200 border-solid inset-0 pointer-events-none"
              />
              <div className="flex flex-col items-center relative size-full">
                <div className="box-border content-stretch flex flex-col gap-6 items-center justify-start p-[24px] relative w-full">
                  <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start leading-[0] p-0 relative shrink-0 text-left text-neutral-900 w-full">
                    <div
                      className="font-['Roboto:Medium',_sans-serif] font-medium relative shrink-0 text-[16px] tracking-[0.15px] w-full"
                      style={{ fontVariationSettings: "'wdth' 100" }}
                    >
                      <p className="block leading-[24px]">Choose character</p>
                    </div>
                    <div
                      className="font-['Roboto:Regular',_sans-serif] font-normal relative shrink-0 text-[14px] tracking-[0.25px] w-full"
                      style={{ fontVariationSettings: "'wdth' 100" }}
                    >
                      <p className="block leading-[20px]">Each character has its own theme and appearance.</p>
                    </div>
                  </div>
                  <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
                    {(['f1car', 'cat', 'dog', 'duck'] as const).map((char) => {
                      const isSelected = character === char;
                      return (
                        <button
                          key={char}
                          onClick={() => handleCharacterSelect(char)}
                          className="bg-[#ffffff] h-10 relative rounded-lg shrink-0"
                          data-name="Button"
                        >
                          <div className="box-border content-stretch flex flex-row gap-2 h-10 items-center justify-center overflow-clip px-8 py-2 relative">
                            <div className="flex flex-col font-['Geist:Medium',_sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-left text-neutral-950 text-nowrap">
                              <p className="block leading-[20px] whitespace-pre">{characterLabels[char]}</p>
                            </div>
                          </div>
                          <div
                            aria-hidden="true"
                            className={`absolute border border-solid inset-0 pointer-events-none rounded-lg ${
                              isSelected
                                ? 'border-neutral-400 shadow-[0px_0px_0px_3px_rgba(163,163,163,0.5)]'
                                : 'border-neutral-200 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {mode === 'focus' ? (
        <button
          onClick={onBreak}
          className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
        >
          <div className="bg-[#ffffff] relative rounded-[100px] shrink-0">
            <div className="box-border content-stretch flex flex-col items-center justify-center overflow-clip p-0 relative">
              <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-6 py-4 relative shrink-0">
                <div
                  className="flex flex-col font-['Roboto:Medium',_sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[16px] text-left text-nowrap tracking-[0.15px]"
                  style={{ fontVariationSettings: "'wdth' 100", color: theme.accent }}
                >
                  <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">{breakLabel}</p>
                </div>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute border border-solid inset-0 pointer-events-none rounded-[100px]"
              style={{ borderColor: theme.accent }}
            />
          </div>
        </button>
      ) : (
        <button
          onClick={onFocus}
          className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
        >
          <div className="bg-[#ffffff] relative rounded-[100px] shrink-0">
            <div className="box-border content-stretch flex flex-col items-center justify-center overflow-clip p-0 relative">
              <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-6 py-4 relative shrink-0">
                <div
                  className="flex flex-col font-['Roboto:Medium',_sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[16px] text-left text-nowrap tracking-[0.15px]"
                  style={{ fontVariationSettings: "'wdth' 100", color: theme.accent }}
                >
                  <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">{focusLabel}</p>
                </div>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute border border-solid inset-0 pointer-events-none rounded-[100px]"
              style={{ borderColor: theme.accent }}
            />
          </div>
        </button>
      )}

      <button
        onClick={onReset}
        className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      >
        <div className="bg-[#ffffff] relative rounded-[100px] shrink-0">
          <div className="box-border content-stretch flex flex-col items-center justify-center overflow-clip p-0 relative">
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-6 py-4 relative shrink-0">
              <svg className="relative shrink-0 size-6" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill={theme.accent} />
              </svg>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute border border-solid inset-0 pointer-events-none rounded-[100px]"
            style={{ borderColor: theme.accent }}
          />
        </div>
      </button>

      <button
        onClick={timerState === 'running' ? onPause : onStart}
        className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      >
        <div
          className="box-border content-stretch flex flex-row items-center justify-center overflow-clip p-0 relative rounded-[100px] shrink-0"
          style={{ backgroundColor: theme.accent }}
        >
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-6 py-4 relative shrink-0">
            <svg className="relative shrink-0 size-6" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              {timerState === 'running' ? (
                <>
                  <rect x="8" y="5" width="2" height="14" fill="white" />
                  <rect x="14" y="5" width="2" height="14" fill="white" />
                </>
              ) : (
                <path d="M8 19V5L19 12L8 19Z" fill="white" />
              )}
            </svg>
            <div
              className="flex flex-col font-['Roboto:Medium',_sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap tracking-[0.15px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                {timerState === 'running' ? 'Pause' : 'Start'}
              </p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

const playAlarm = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.5);
  } catch {
    console.log('Timer completed!');
  }
};

export default function App() {
  const [character, setCharacter] = useState<Character>('f1car');
  const [mode, setMode] = useState<Mode>('focus');
  const [time, setTime] = useState(presets.focus);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const cardRef = useRef<HTMLDivElement>(null);
  const theme = themes[character];
  const isF1 = character === 'f1car';

  useEffect(() => {
    if (timerState !== 'running') return;
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          playAlarm();
          setTimerState('idle');
          const newMode = mode === 'focus' ? 'break' : 'focus';
          setMode(newMode);
          return presets[newMode];
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerState, mode]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });
    const handlePageBlur = () => setMousePos({ x: 0, y: 0 });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handlePageBlur);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handlePageBlur);
    };
  }, [character]);

  const handleStart = useCallback(() => setTimerState('running'), []);
  const handlePause = useCallback(() => setTimerState('paused'), []);
  const handleReset = useCallback(() => {
    setTimerState('idle');
    setTime(presets[mode]);
  }, [mode]);
  const handleBreak = useCallback(() => {
    setMode('break');
    setTime(presets.break);
    setTimerState('idle');
  }, []);
  const handleFocus = useCallback(() => {
    setMode('focus');
    setTime(presets.focus);
    setTimerState('idle');
  }, []);
  const handleCharacterChange = useCallback((newCharacter: Character) => {
    setCharacter(newCharacter);
  }, []);

  return (
    <div
      className="relative size-full flex items-center justify-center cursor-none select-none overflow-hidden"
      style={{
        backgroundColor: theme.background,
        backgroundImage: isF1
          ? 'radial-gradient(ellipse 70% 55% at 50% 38%, rgba(225,6,0,0.07) 0%, transparent 70%)'
          : undefined,
        WebkitAppRegion: 'drag' as any
      }}
    >
      <CustomCursor />
      <div className="flex flex-col gap-8 items-center justify-center min-h-screen py-8 px-4">
        <Timer time={time} mode={mode} theme={theme} character={character} />
        <CharacterCard character={character} mousePos={mousePos} cardRef={cardRef} />
        <Controls
          timerState={timerState}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onBreak={handleBreak}
          onFocus={handleFocus}
          theme={theme}
          character={character}
          onCharacterChange={handleCharacterChange}
          mode={mode}
        />
      </div>
    </div>
  );
}