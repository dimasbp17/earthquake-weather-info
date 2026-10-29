import dataSigBmkg from './dataSigBmkg';

const SigTable = () => {
  return (
    <div className="card overflow-hidden">
      <div className="p-6 pb-4">
        <h3 className="text-base font-semibold text-slate-900">
          Skala Intensitas Gempabumi (SIG) BMKG
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Acuan tingkat guncangan dan dampaknya. Sumber:{' '}
          <a
            href="https://www.bmkg.go.id/gempabumi/skala-intensitas-gempabumi.bmkg"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-teal-700 hover:underline"
          >
            bmkg.go.id
          </a>
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Skala</th>
              <th className="px-4 py-3 font-semibold">Deskripsi</th>
              <th className="px-4 py-3 font-semibold">Dampak</th>
              <th className="px-4 py-3 font-semibold">MMI</th>
              <th className="px-6 py-3 font-semibold">PGA (gal)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dataSigBmkg.map((sig) => (
              <tr key={sig.skala}>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-2.5">
                    <span
                      className="size-3.5 rounded-full ring-1 ring-inset ring-slate-900/15"
                      style={{ backgroundColor: sig.hexa }}
                    />
                    <span className="font-semibold text-slate-900">
                      {sig.skala}
                    </span>
                    <span className="text-xs text-slate-500">{sig.warna}</span>
                  </span>
                </td>
                <td className="px-4 py-4 font-medium text-slate-800">
                  {sig.deskripsiSederhana}
                </td>
                <td className="max-w-md px-4 py-4 leading-relaxed text-slate-600">
                  {sig.deskripsiRinci}
                </td>
                <td className="tabular px-4 py-4 text-slate-600">
                  {sig.skalaMmi}
                </td>
                <td className="tabular px-6 py-4 text-slate-600">{sig.pga}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SigTable;
