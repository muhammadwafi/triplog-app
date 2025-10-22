import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlertIcon, HatGlassesIcon } from 'lucide-react';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { loginInitSchema, loginSchema } from '../_lib/validations';

import { AlertDismissable } from '@/components/ui/alert-dismissable';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/ui/input-password';
import { Spinner } from '@/components/ui/spinner';
import { env } from '@/config/constants';
import { useAuth } from '@/lib/auth-provider';

export function LoginForm() {
  const { login } = useAuth();
  const [showAlert, setShowAlert] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: loginInitSchema,
  });

  const onSubmit = async (formData: z.infer<typeof loginSchema>) => {
    try {
      await login(formData);
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage('Invalid username or password');
      setShowAlert(true);
    }
  };

  const setDemoData = () => {
    form.setValue('username', env.DEMO_ACCOUNT_USERNAME);
    form.setValue('password', env.DEMO_ACCOUNT_PASSWORD);
    form.handleSubmit(onSubmit)();
  };

  return (
    <>
      <AlertDismissable
        variant="error"
        open={showAlert}
        onOpenChange={setShowAlert}
        className="space-x-2"
      >
        <CircleAlertIcon size={16} className="min-w-4" />
        <span>{errorMessage}</span>
      </AlertDismissable>

      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
      >
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="username">Username or Email</FieldLabel>
              <Input
                {...field}
                id="username"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputPassword
                {...field}
                id="password"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="my-3">
          <Button
            type="submit"
            className="w-full"
            disabled={
              !form.formState.isDirty ||
              !form.formState.isValid ||
              form.formState.isSubmitting
            }
          >
            {form.formState.isSubmitting ? (
              <>
                <Spinner className="size-4" /> Logging you in...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
        <FieldGroup>
          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
            or continue with
          </FieldSeparator>
          <Field>
            <Button
              variant="outline"
              type="button"
              onClick={() => setDemoData()}
              disabled={form.formState.isSubmitting}
            >
              <HatGlassesIcon /> Instant Login Account
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </>
  );
}
