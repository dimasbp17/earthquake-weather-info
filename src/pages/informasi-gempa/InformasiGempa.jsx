import { useState } from 'react';
import { TbActivity, TbListDetails, TbUsersGroup } from 'react-icons/tb';
import PageHeader from '../../components/PageHeader';
import GempaUpdate from './_partials/GempaUpdate';
import GempaDirasakan from './_partials/GempaDirasakan';
import GempaTerkini from './_partials/GempaTerkini';

const TABS = [
  { id: 'update', label: 'Gempa Terbaru', icon: TbActivity, component: GempaUpdate },
  { id: 'terkini', label: 'Gempa M 5.0+', icon: TbListDetails, component: GempaTerkini },
  { id: 'dirasakan', label: 'Gempa Dirasakan', icon: TbUsersGroup, component: GempaDirasakan },
];

const InformasiGempa = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const ActiveComponent = TABS.find((tab) => tab.id === activeTab).component;

  return (
    <>
      <PageHeader
        eyebrow="Geofisika"
        title="Informasi Gempa Bumi"
        description="Data kegempaan terkini di wilayah Indonesia dari sistem Tsunami Early Warning System (TEWS) BMKG."
        image="/assets/images/gempa-wp.jpg"
      />

      <div className="container-page py-8">
        <div
          role="tablist"
          className="mb-6 inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-card scrollbar-hide"
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        <ActiveComponent />
      </div>
    </>
  );
};

export default InformasiGempa;
