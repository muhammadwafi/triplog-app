import { cn } from '@/lib/utils';

type MapsPopupContentProps = {
  properties: { [key: string]: string | number | boolean | null } | null;
  isPrimary?: boolean;
};

export function MapsPopupContent({ properties }: MapsPopupContentProps) {
  // If null or undefined, fallback to an empty object
  const safeProps = properties ?? {};

  // Determine title (or 'Unknown')
  const title =
    safeProps['name'] ||
    safeProps['NAMOBJ'] ||
    safeProps['namobj'] ||
    'Unknown';

  // Build entries safely
  const entries = Object.entries(safeProps).filter(
    ([key, value]) =>
      value !== null &&
      value !== '' &&
      value !== 0 &&
      ![
        '_style',
        'Id',
        'id',
        'ogc_fid',
        'orig_fid',
        'kode',
        'fcode',
        'srs_id',
        'objectid',
        'objectid_1',
        'konrjl', // kondisi ruas jalan
        'wlyrjl', // wilayah ruas jalan
        'image',
        'OBJECTID',
        'standalone',
        'metadata',
      ].includes(key),
  );

  const hasEntries = entries.length > 0;

  return (
    <div className={cn('min-w-2xs', { 'min-w-52': !hasEntries })}>
      <div className="px-3 py-2 text-[.875rem] font-semibold text-white">
        {title}
      </div>
      <div className="rounded-lg bg-white p-1 shadow-md">
        <div className="max-h-64 overflow-y-auto p-2 pt-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-400 [&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-track]:bg-transparent">
          {hasEntries ? (
            entries.map(([key, value]) => (
              <div key={key} className="border-b border-zinc-300 py-1.5">
                <div className="flex flex-col gap-0">
                  <div className="text-sm font-medium">{key}:</div>
                  <div className="text-sm">{value || 'N/A'}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-2 text-center text-sm text-zinc-500">
              Unknown location
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
