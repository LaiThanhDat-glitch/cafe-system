// Lightweight helper to fetch and cache dvhcvn.json from GitHub raw URL.
const URL =
  "https://raw.githubusercontent.com/daohoangson/dvhcvn/master/data/dvhcvn.json";

let cache = null;
let fetching = null;

export async function loadDvHcData() {
  if (cache) return cache;
  if (fetching) return fetching;
  fetching = fetch(URL)
    .then(async (res) => {
      if (!res.ok) throw new Error("Failed to fetch dvhcvn.json");
      const data = await res.json();
      cache = data;
      fetching = null;
      return cache;
    })
    .catch((err) => {
      fetching = null;
      throw err;
    });
  return fetching;
}

export function findProvinceByCode(code, data) {
  if (!data) return null;
  return (
    data.find(
      (p) => String(p.code) === String(code) || String(p.id) === String(code),
    ) || null
  );
}

export function findDistrictByCode(code, province) {
  if (!province || !province.districts) return null;
  return (
    province.districts.find(
      (d) => String(d.code) === String(code) || String(d.id) === String(code),
    ) || null
  );
}

export function findWardByCode(code, district) {
  if (!district || !district.wards) return null;
  return (
    district.wards.find(
      (w) => String(w.code) === String(code) || String(w.id) === String(code),
    ) || null
  );
}

export default {
  loadDvHcData,
  findProvinceByCode,
  findDistrictByCode,
  findWardByCode,
};
const DVHC_URL =
  "https://raw.githubusercontent.com/daohoangson/dvhcvn/master/data/dvhcvn.json";
let _cache = null;

async function loadData() {
  if (_cache) return _cache;
  try {
    const ls =
      typeof window !== "undefined"
        ? window.localStorage.getItem("dvhcvn_cache_v1")
        : null;
    if (ls) {
      _cache = JSON.parse(ls);
      return _cache;
    }
  } catch (e) {
    // ignore localStorage errors
  }

  const res = await fetch(DVHC_URL);
  if (!res.ok) throw new Error("Failed to fetch dvhcvn data");
  const data = await res.json();
  _cache = data;
  try {
    if (typeof window !== "undefined")
      window.localStorage.setItem("dvhcvn_cache_v1", JSON.stringify(data));
  } catch (e) {}
  return _cache;
}

export async function getProvinces() {
  const data = await loadData();
  // dvhcvn.json might be either an array of provinces or an object with `provinces` key
  if (Array.isArray(data)) return data;
  if (data && data.provinces) return data.provinces;
  return [];
}

export async function getDistricts(provinceCode) {
  const provinces = await getProvinces();
  const p = provinces.find(
    (x) =>
      String(x.code) === String(provinceCode) ||
      String(x.id) === String(provinceCode),
  );
  if (!p) return [];
  return p.districts || p.d || [];
}

export async function getWards(districtCode) {
  const provinces = await getProvinces();
  for (const p of provinces) {
    const districts = p.districts || p.d || [];
    const d = districts.find(
      (x) =>
        String(x.code) === String(districtCode) ||
        String(x.id) === String(districtCode),
    );
    if (d) return d.wards || d.w || [];
  }
  return [];
}

export async function findProvinceName(code) {
  const provinces = await getProvinces();
  const p = provinces.find(
    (x) => String(x.code) === String(code) || String(x.id) === String(code),
  );
  return p ? p.name || p.title || null : null;
}

export async function findDistrictName(provinceCode, districtCode) {
  const districts = await getDistricts(provinceCode);
  const d = districts.find(
    (x) =>
      String(x.code) === String(districtCode) ||
      String(x.id) === String(districtCode),
  );
  return d ? d.name || d.title || null : null;
}

export async function findWardName(districtCode, wardCode) {
  const wards = await getWards(districtCode);
  const w = wards.find(
    (x) =>
      String(x.code) === String(wardCode) || String(x.id) === String(wardCode),
  );
  return w ? w.name || w.title || null : null;
}
