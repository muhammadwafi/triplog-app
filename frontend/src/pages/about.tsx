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
            Triplog prototype was conceptualized and developed specifically for
            the <b>Spotter AI</b> hiring team. It serves as a tangible
            demonstration of my skills in product thinking, and user-centric
            design, created expressly for this application process.
          </p>
          <p>
            Thank you for your time and for the opportunity to share my work, I
            greatly appreciate the chance to be considered for a role on your
            team.
          </p>
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
