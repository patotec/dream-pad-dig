export function GlassBackdrop() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 700px at 15% -10%, rgba(56,189,248,0.35), transparent 60%), radial-gradient(1000px 700px at 100% 0%, rgba(14,165,233,0.28), transparent 55%), linear-gradient(180deg, #eef4fb 0%, #f7fafc 60%, #eef3f8 100%)",
          }}
        />
        <div className="anim-drift absolute -top-40 -left-24 h-[620px] w-[620px] rounded-full bg-sky-300/40 blur-3xl" />
        <div className="anim-drift2 absolute top-10 right-[-160px] h-[560px] w-[560px] rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="absolute bottom-[-220px] left-1/3 h-[520px] w-[520px] rounded-full bg-sky-200/50 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute top-[-8%] left-[58%] h-[150%] w-[420px] rotate-[16deg] rounded-[40px] border border-white/60 bg-white/25 shadow-2xl shadow-sky-900/10 backdrop-blur-2xl" />
      <div className="pointer-events-none absolute top-[-4%] left-[46%] h-[150%] w-[180px] rotate-[16deg] rounded-[40px] border border-white/50 bg-white/15 backdrop-blur-xl" />
    </>
  );
}
