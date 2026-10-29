import { useState } from 'react';
import { TbMapSearch } from 'react-icons/tb';
import PageHeader from '../../components/PageHeader';
import SelectWilayah from '../../components/inputs/SelectWilayah';
import { DEFAULT_ADM4, toAdm4 } from '../../utils/cuaca';
import PrakiraanCuaca from './_partials/PrakiraanCuaca';

const InformasiCuaca = () => {
  const [adm4, setAdm4] = useState(DEFAULT_ADM4);

  return (
    <>
      <PageHeader
        eyebrow="Meteorologi"
        title="Prakiraan Cuaca"
        description="Prakiraan cuaca per 3 jam hingga tingkat kelurahan/desa untuk tiga hari ke depan."
        image="/assets/images/climate.jpg"
      />

      <div className="container-page space-y-6 py-8">
        <div className="card p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <TbMapSearch className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Pilih lokasi
              </h2>
              <p className="text-sm text-slate-500">
                Tentukan wilayah hingga tingkat kelurahan/desa untuk melihat
                prakiraannya.
              </p>
            </div>
          </div>
          <SelectWilayah
            onVillageChange={(village) => setAdm4(toAdm4(village.value))}
          />
        </div>

        <PrakiraanCuaca
          key={adm4}
          adm4={adm4}
        />
      </div>
    </>
  );
};

export default InformasiCuaca;
