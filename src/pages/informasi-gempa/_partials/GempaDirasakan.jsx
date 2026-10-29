import EarthquakeTable from './EarthquakeTable';

const GempaDirasakan = () => {
  return (
    <EarthquakeTable
      endpoint="gempadirasakan.json"
      title="Gempa dirasakan"
      description="Kejadian gempa terakhir yang guncangannya dirasakan masyarakat."
      variant="dirasakan"
    />
  );
};

export default GempaDirasakan;
