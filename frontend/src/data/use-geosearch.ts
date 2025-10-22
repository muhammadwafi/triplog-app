import { useDebounce } from '@/hooks/use-debounce';
import { useQuery } from '@tanstack/react-query';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider();

export function useGeosearch(searchValue: string) {
  const debouncedSearchValue = useDebounce(searchValue, 300);
  const shouldSearch = debouncedSearchValue?.length > 0;

  const { data, isLoading } = useQuery({
    queryKey: ['geosearch', debouncedSearchValue],
    queryFn: async () => {
      const res = await provider.search({ query: debouncedSearchValue });
      return res.map((item) => ({
        // label: `${item.label} (${toTitleCase(item.raw.type)})`,
        label: item.label,
        value: item.label,
        coords: `${item.raw.lat},${item.raw.lon}`,
      }));
    },
    enabled: shouldSearch,
    staleTime: 5 * 60 * 1000,
  });

  return { data: data ?? [], isLoading };
}
