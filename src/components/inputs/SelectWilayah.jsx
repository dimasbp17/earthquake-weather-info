import { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

const WILAYAH_API = 'https://www.emsifa.com/api-wilayah-indonesia/api';

const toOptions = (items) =>
  items.map((item) => ({ value: item.id, label: item.name }));

// Gaya react-select disamakan dengan input lain di aplikasi.
const selectClassNames = {
  control: ({ isFocused, isDisabled }) =>
    `!min-h-[42px] !rounded-lg !shadow-none ${
      isFocused
        ? '!border-teal-600 !ring-2 !ring-teal-600/15'
        : '!border-slate-200 hover:!border-slate-300'
    } ${isDisabled ? '!bg-slate-50' : '!bg-white'}`,
  placeholder: () => '!text-slate-400 !text-sm',
  singleValue: () => '!text-slate-900 !text-sm',
  input: () => '!text-sm',
  menu: () =>
    '!rounded-lg !border !border-slate-200 !shadow-lg !overflow-hidden !z-30',
  option: ({ isSelected, isFocused }) =>
    `!text-sm ${
      isSelected
        ? '!bg-slate-900 !text-white'
        : isFocused
        ? '!bg-slate-100 !text-slate-900'
        : '!text-slate-700'
    }`,
  indicatorSeparator: () => '!hidden',
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-medium text-slate-500">
      {label}
    </span>
    {children}
  </label>
);

const SelectWilayah = ({ onVillageChange }) => {
  const [options, setOptions] = useState([]); // Provinsi
  const [regencyOptions, setRegencyOptions] = useState([]); // Kabupaten/Kota
  const [districtOptions, setDistrictOptions] = useState([]); // Kecamatan
  const [villageOptions, setVillageOptions] = useState([]); // Kelurahan
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedRegency, setSelectedRegency] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);

  // Fetch provinsi saat komponen dimuat
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(`${WILAYAH_API}/provinces.json`);
        setOptions(toOptions(response.data));
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  const fetchOptions = async (path, setter) => {
    try {
      const response = await axios.get(`${WILAYAH_API}/${path}`);
      setter(toOptions(response.data));
    } catch (error) {
      console.error(`Error fetching ${path}:`, error);
    }
  };

  const handleProvinceChange = (selectedOption) => {
    setSelectedProvince(selectedOption);
    setSelectedRegency(null);
    setSelectedDistrict(null);
    setSelectedVillage(null);
    setDistrictOptions([]);
    setVillageOptions([]);
    fetchOptions(`regencies/${selectedOption.value}.json`, setRegencyOptions);
  };

  const handleRegencyChange = (selectedOption) => {
    setSelectedRegency(selectedOption);
    setSelectedDistrict(null);
    setSelectedVillage(null);
    setVillageOptions([]);
    fetchOptions(`districts/${selectedOption.value}.json`, setDistrictOptions);
  };

  const handleDistrictChange = (selectedOption) => {
    setSelectedDistrict(selectedOption);
    setSelectedVillage(null);
    fetchOptions(`villages/${selectedOption.value}.json`, setVillageOptions);
  };

  const handleVillageChange = (selectedOption) => {
    setSelectedVillage(selectedOption);
    onVillageChange?.(selectedOption);
  };

  const commonProps = {
    classNames: selectClassNames,
    noOptionsMessage: () => 'Tidak ditemukan',
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Field label="Provinsi">
        <Select
          {...commonProps}
          options={options}
          value={selectedProvince}
          onChange={handleProvinceChange}
          isLoading={loading}
          placeholder="Pilih provinsi"
        />
      </Field>
      <Field label="Kabupaten / Kota">
        <Select
          {...commonProps}
          options={regencyOptions}
          value={selectedRegency}
          onChange={handleRegencyChange}
          placeholder="Pilih kabupaten / kota"
          isDisabled={!selectedProvince}
        />
      </Field>
      <Field label="Kecamatan">
        <Select
          {...commonProps}
          options={districtOptions}
          value={selectedDistrict}
          onChange={handleDistrictChange}
          placeholder="Pilih kecamatan"
          isDisabled={!selectedRegency}
        />
      </Field>
      <Field label="Kelurahan / Desa">
        <Select
          {...commonProps}
          options={villageOptions}
          value={selectedVillage}
          onChange={handleVillageChange}
          placeholder="Pilih kelurahan / desa"
          isDisabled={!selectedDistrict}
        />
      </Field>
    </div>
  );
};

export default SelectWilayah;
