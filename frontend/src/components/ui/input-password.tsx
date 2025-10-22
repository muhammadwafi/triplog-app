import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export function InputPassword({
  className,
  groupClassName,
  btnClassName,
  ...props
}: React.ComponentProps<'input'> & {
  btnClassName?: string;
  groupClassName?: string;
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const disabled =
    props.value === '' || props.value === undefined || props.disabled;
  return (
    <>
      <InputGroup className={groupClassName}>
        <InputGroupInput
          type={showPassword ? 'text' : 'password'}
          className={cn('hide-password-toggle', className)}
          {...props}
        />
        <InputGroupAddon align="inline-end" className="pr-2">
          <InputGroupButton
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
            size="icon-sm"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            className={btnClassName}
          >
            {showPassword && !disabled ? (
              <EyeOffIcon aria-hidden="true" />
            ) : (
              <EyeIcon aria-hidden="true" />
            )}
            <span className="sr-only">
              {showPassword ? 'Hide password' : 'Show password'}
            </span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </>
  );
}
