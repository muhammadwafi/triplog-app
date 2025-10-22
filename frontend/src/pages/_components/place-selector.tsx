import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useGeosearch } from '@/data/use-geosearch';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, XIcon } from 'lucide-react';
import * as React from 'react';

type Option = {
  value: string;
  label: string;
  coords?: string;
};

interface PlaceSelectorProps
  extends Omit<React.ComponentProps<'button'>, 'onChange'> {
  value: string;
  onChange: (value: Option) => void;
  className?: string;
  defaultSelected?: string;
}

export function PlaceSelector({
  value,
  onChange,
  className,
  defaultSelected,
  ...props
}: PlaceSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(defaultSelected || '');
  const [search, setSearch] = React.useState(defaultSelected || '');
  const { data = [], isLoading } = useGeosearch(search);
  const selected = data.find((item) => item.label === value);

  const handleSearch = useDebouncedCallback((val: string) => {
    setSearch(val);
  }, 300);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    handleSearch(val);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          type="button"
          aria-expanded={open}
          className={cn(
            'dark:bg-input/30 dark:hover:bg-input/60 border-input w-full justify-between',
            className,
          )}
          {...props}
        >
          {selected?.label || defaultSelected ? (
            <span className="truncate">
              {selected?.label || defaultSelected}
            </span>
          ) : (
            <span className="text-muted-foreground">Search...</span>
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={isLoading ? 'Searching...' : 'Search...'}
            onValueChange={handleInputChange}
            isLoading={isLoading}
            className="pe-8"
            value={inputValue}
          />
          <Button
            variant="ghost"
            className="absolute top-1.5 right-1.5 size-6"
            type="button"
            onClick={() => {
              setSearch('');
              setInputValue('');
            }}
            disabled={!search}
          >
            <XIcon />
          </Button>
          <CommandList>
            <CommandEmpty>
              <p className="text-muted-foreground">No result.</p>
            </CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.coords}
                  value={item.value}
                  className="text-xs"
                  onSelect={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === item.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
