import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { Command as CommandPrimitive } from 'cmdk';
import { Check } from 'lucide-react';
import { useMemo, useState } from 'react';

// ✅ define the shape for each option
type Option<T extends string> = {
  value: T;
  label: string;
  coords?: string;
};

type Props<T extends string> = {
  selectedValue: Option<T> | null;
  onSelectedValueChange: (value: Option<T> | null) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  items: Option<T>[] | never[];
  isLoading?: boolean;
  emptyMessage?: string;
  placeholder?: string;
};

export function AutoComplete<T extends string>({
  selectedValue,
  onSelectedValueChange,
  searchValue,
  onSearchValueChange,
  items,
  isLoading,
  emptyMessage = 'No items.',
  placeholder = 'Search...',
  ...props
}: Props<T> & React.ComponentProps<'input'>) {
  const [open, setOpen] = useState(false);

  const labels = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc[item.value] = item.label;
          return acc;
        },
        {} as Record<string, string>,
      ),
    [items],
  );

  const reset = () => {
    onSelectedValueChange(null);
    onSearchValueChange('');
  };

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const isOutsidePopover = !e.relatedTarget?.closest('[cmdk-list]');
    const isMismatch =
      searchValue && !Object.values(labels).includes(searchValue);

    if (isOutsidePopover && isMismatch) {
      reset();
    }
  };

  const onSelectItem = (inputValue: string) => {
    const selectedOption = items.find((i) => i.value === inputValue) ?? null;

    if (selectedOption?.value === selectedValue?.value) {
      reset();
    } else {
      onSelectedValueChange(selectedOption);
      onSearchValueChange(selectedOption?.label ?? '');
    }

    setOpen(false);
  };

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild className="dark:bg-input/30">
            <CommandPrimitive.Input
              asChild
              {...props}
              value={searchValue}
              onValueChange={onSearchValueChange}
              onKeyDown={(e) => setOpen(e.key !== 'Escape')}
              onMouseDown={() => setOpen((open) => !!searchValue || !open)}
              onFocus={() => setOpen(true)}
              onBlur={onInputBlur}
              className="dark:bg-input/30"
            >
              <Input placeholder={placeholder} />
            </CommandPrimitive.Input>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute('cmdk-input')
              ) {
                e.preventDefault();
              }
            }}
            className="w-[var(--radix-popover-trigger-width)] p-0"
          >
            <CommandList>
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="flex items-center justify-center gap-2 px-1 py-4 text-sm">
                    <Spinner className="size-4.5 origin-center" />
                    <span className="text-muted-foreground text-sm">
                      Searching...
                    </span>
                  </div>
                </CommandPrimitive.Loading>
              )}
              {items.length > 0 && !isLoading ? (
                <CommandGroup>
                  {items.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={onSelectItem}
                    >
                      <Check
                        className={cn(
                          'h-4 w-4',
                          selectedValue?.value === option.value
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {!isLoading ? <CommandEmpty>{emptyMessage}</CommandEmpty> : null}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
