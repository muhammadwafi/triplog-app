import { useDocumentTitle } from '@/hooks/use-document-title';
import { LoginForm } from '@/pages/auth/forms/login-form';
import { Link } from 'react-router';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function Login() {
  useDocumentTitle('Login');
  return (
    <div className="w-full">
      <Card className="mx-auto max-w-[400px] rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg leading-tight">
            Sign in to your account
          </CardTitle>
          <CardDescription>
            Enter your credentials below to login
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="text-muted-foreground mt-4 flex justify-center text-sm">
          <p>
            New to TripLog?{' '}
            <Link className="text-primary" to={'/auth/register'}>
              Create account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
