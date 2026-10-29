const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page flex flex-col gap-2 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Sumber data:{' '}
          <a
            href="https://data.bmkg.go.id"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-700 hover:text-teal-700"
          >
            Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)
          </a>
        </p>
        <p>
          Informasi bersifat pendukung. Ikuti arahan resmi BMKG &amp; BPBD
          setempat.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
