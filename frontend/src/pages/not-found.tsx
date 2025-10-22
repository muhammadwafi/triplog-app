import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { useDocumentTitle } from '@/hooks/use-document-title';

export function NotFound() {
  useDocumentTitle('Not found');
  return (
    <div className="mx-4 pt-12">
      <div className="mx-auto flex max-w-sm flex-col justify-center gap-6">
        <div className="text-center">
          <h3 className="text-9xl font-bold">404</h3>
          <p className="text-lg">Page not found</p>
        </div>
        <div className="text-muted-foreground max-w-sm text-center text-sm">
          The page you are looking for might have been removed, had it&apos;s
          name changed or is temporary unavailable
        </div>
        <div className="flex justify-center">
          <Button asChild variant="outline">
            <Link to={'/'}>Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
