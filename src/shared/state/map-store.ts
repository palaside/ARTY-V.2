export function createMapStore() {
  return {
    zoom: 1,
    roleView: 'FDC' as 'FO' | 'FDC' | 'SURVEILLANCE' | 'HOWITZER' | 'WEAPONS',
  };
}
