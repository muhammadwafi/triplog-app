import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { AlertCircleIcon } from 'lucide-react';
import { Link } from 'react-router';

export function Register() {
  useDocumentTitle('Register');
  return (
    <div className="w-full">
      <Card className="mx-auto max-w-[400px] rounded-xl shadow">
        <CardHeader>
          <CardTitle className="text-lg leading-tight">
            Create account
          </CardTitle>
          <CardDescription>
            Enter your information below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert
            variant="destructive"
            className="border-destructive bg-destructive/5"
          >
            <AlertCircleIcon />
            <AlertTitle>Currently registration is not available</AlertTitle>
            <AlertDescription>
              <p>Please contact administrator for more detail</p>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="text-muted-foreground mt-4 flex justify-center text-sm">
          <p>
            Already have an account?{' '}
            <Link className="text-primary" to={'/auth/login'}>
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
