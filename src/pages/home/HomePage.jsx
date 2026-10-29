import { Link } from 'react-router-dom';
import {
  TbAlertTriangle,
  TbArrowRight,
  TbCloudRain,
  TbHomeShield,
  TbRun,
  TbShieldCheck,
  TbWaveSine,
} from 'react-icons/tb';
import AlertBanner from '../../components/AlertBanner';
import useAlerts from '../../hooks/useAlerts';
import LatestQuakeCard from './_partials/LatestQuakeCard';

const MODULES = [
  {
    icon: TbWaveSine,
    title: 'Informasi Gempa Bumi',
    description:
      'Gempa terbaru, daftar gempa M 5.0+, serta gempa yang dirasakan masyarakat lengkap dengan peta guncangan.',
    points: ['Pembaruan otomatis', 'Potensi tsunami', 'Skala intensitas SIG'],
    href: '/informasi-gempa',
  },
  {
    icon: TbCloudRain,
    title: 'Prakiraan Cuaca',
    description:
      'Prakiraan cuaca per 3 jam hingga tingkat kelurahan/desa di seluruh Indonesia.',
    points: ['Suhu & kelembapan', 'Arah & kecepatan angin', 'Hingga 3 hari'],
    href: '/informasi-cuaca',
  },
  {
    icon: TbAlertTriangle,
    title: 'Peringatan Dini Cuaca',
    description:
      'Peringatan cuaca ekstrem yang sedang berlaku beserta peta area dan kecamatan terdampak.',
    points: ['Tingkat keparahan', 'Masa berlaku', 'Peta area'],
    href: '/peringatan-dini',
  },
];

const SAFETY_TIPS = [
  {
    icon: TbHomeShield,
    title: 'Sebelum',
    text: 'Kenali jalur evakuasi, siapkan tas siaga, dan pastikan perabot berat terpasang kuat.',
  },
  {
    icon: TbShieldCheck,
    title: 'Saat terjadi',
    text: 'Lindungi kepala, berlindung di bawah meja kokoh, jauhi kaca dan bangunan tinggi.',
  },
  {
    icon: TbRun,
    title: 'Sesudah',
    text: 'Waspadai gempa susulan. Bila di pesisir dan guncangan kuat, segera menuju tempat tinggi.',
  },
];

const HomePage = () => {
  const { alerts } = useAlerts();

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src="/assets/images/climate.jpg"
          alt=""
          className="absolute inset-0 size-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-slate-900/60" />

        <div className="container-page relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-teal-400" />
              </span>
              Data langsung dari BMKG
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
              Pantau gempa bumi &amp; cuaca Indonesia secara real-time.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              Satu tempat untuk informasi kegempaan terkini dan prakiraan cuaca
              hingga tingkat desa — ringkas, akurat, dan mudah dibaca.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/informasi-gempa"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Lihat info gempa
                <TbArrowRight className="size-4" />
              </Link>
              <Link
                to="/informasi-cuaca"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Cek prakiraan cuaca
              </Link>
            </div>
          </div>

          <LatestQuakeCard />
        </div>
      </section>

      <section className="container-page py-16">
        {alerts.length > 0 && (
          <div className="mb-12">
            <AlertBanner
              alerts={alerts}
              title={`${alerts.length} peringatan dini cuaca sedang berlaku`}
            />
          </div>
        )}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Layanan informasi
          </h2>
          <p className="mt-2 text-slate-500">
            Pilih modul sesuai kebutuhan Anda.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {MODULES.map(
            ({ icon: Icon, title, description, points, href }) => (
              <Link
                key={href}
                to={href}
                className="card group flex flex-col p-6 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 flex-1 leading-relaxed text-slate-500">
                  {description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {points.map((point) => (
                    <li
                      key={point}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
                  Buka modul
                  <TbArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            )
          )}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="container-page py-16">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Siaga gempa bumi
            </h2>
            <p className="mt-2 text-slate-500">
              Langkah singkat yang perlu diingat setiap saat.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {SAFETY_TIPS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 p-6"
              >
                <Icon className="size-6 text-slate-400" />
                <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
