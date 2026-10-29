const PageHeader = ({ eyebrow, title, description, image, children }) => {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {image && (
        <img
          src={image}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-25"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />
      <div className="container-page relative flex flex-col gap-6 py-12 md:flex-row md:items-end md:justify-between md:py-14">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
};

export default PageHeader;
