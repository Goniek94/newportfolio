export const heroTitleCode = `// Hero title component with elegant typography
// Features: responsive text sizing, decorative line accent
export default function HeroTitle() {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
      <h1 className="relative leading-none text-[#F4FFD9]">
        <span className="block text-[clamp(3rem,8vw,8rem)] font-serif tracking-tight">
          Czysta energia
        </span>

        <span className="block text-[clamp(3.5rem,9vw,9.5rem)] italic font-serif">
          natury
        </span>

        <span className="mt-4 block text-sm tracking-[0.3em] text-[#FFD966] uppercase">
          Od nasion do zdrowia
        </span>

        {/* Decorative line - AXIOM style */}
        <span className="absolute top-1/2 left-full ml-6 h-px w-32 bg-[#FFD966]/70" />
      </h1>
    </div>
  );
}`;
