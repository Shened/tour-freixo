export default function MountainBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <svg
        className="absolute bottom-0 left-1/2 h-[55vh] w-[1600px] -translate-x-1/2 opacity-[0.06]"
        viewBox="0 0 1600 560"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
      >
        <path
          d="M0 560 L140 360 L260 460 L400 210 L520 380 L640 280 L760 480 L900 180 L1040 400 L1160 280 L1300 480 L1440 260 L1600 420 L1600 560 Z"
          fill="white"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-40 brand-swoosh opacity-[0.05]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
    </div>
  );
}
