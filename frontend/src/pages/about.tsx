import { AppLogo } from '@/components/app-logo';
import { useDocumentTitle } from '@/hooks/use-document-title';

export function About() {
  useDocumentTitle('About');
  return (
    <div className="mx-4 flex-1">
      <div
        className="mx-auto mb-8 max-w-sm py-8 sm:max-w-md md:max-w-md"
        // style={{
        //   background:
        //     'radial-gradient(125% 125% at 50% 10%, var(--background) 40%, #ff4801 100%)',
        // }}
      >
        <AppLogo className="text-primary size-10" />
        <div className="mx-auto mt-8 flex max-w-md flex-col gap-4">
          <p>
            Triplog is a prototype application built to streamline how drivers
            record and manage their trips. It features automated route tracking,
            mileage insights, and trip summaries designed for clarity and ease
            of use. The project highlights my approach to thoughtful product
            design, combining practical functionality with a strong focus on
            user experience.
          </p>
          <p>Thank you for taking the time to explore this project.</p>
        </div>
        <div className="mt-24">
          <div className="text-muted-foreground text-sm">Regards</div>
          <div>Muhammad Wafi</div>
          <div className="text-xs">mwafiez@gmail.com</div>
        </div>
      </div>
    </div>
  );
}
