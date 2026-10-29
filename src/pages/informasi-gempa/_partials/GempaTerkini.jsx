import EarthquakeTable from './EarthquakeTable';

const GempaTerkini = () => {
  return (
    <EarthquakeTable
      endpoint="gempaterkini.json"
      title="Gempa terkini M 5.0+"
      description="Kejadian gempa terakhir dengan magnitudo 5.0 atau lebih."
      variant="terkini"
    />
  );
};

export default GempaTerkini;
