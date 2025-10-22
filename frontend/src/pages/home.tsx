import { AppLogo } from '@/components/app-logo';
import { Silk } from '@/components/silk';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

export function Home() {
  return (
    <>
      <div className="relative isolate -mt-20 flex min-h-[50svh] items-center pt-20">
        <div className="absolute inset-0">
          <Silk
            speed={5}
            scale={1}
            color="#ff4801"
            noiseIntensity={1.5}
            rotation={0}
          />
        </div>

        <div className="relative z-1 mx-4 mt-auto flex-1">
          <div className="mx-auto flex max-w-sm flex-col gap-8 pb-8 sm:max-w-md md:max-w-lg">
            <AppLogo className="mx-auto size-14 text-white" />
            <h1 className="text-center text-5xl leading-none font-extrabold tracking-[-1px] text-white md:text-6xl lg:text-6xl">
              Compliance infrastructure for the open road.
            </h1>
          </div>
        </div>
      </div>
      <div className="mx-4">
        <div className="text-muted-foreground mx-auto mt-3 max-w-sm space-y-6 text-center text-base sm:max-w-md md:mt-6 md:max-w-lg md:text-lg">
          <p>
            Triplog provides a simple, reliable way to manage your electronic
            driving logs. Stay compliant and focus on the road with effortless
            trip tracking.
          </p>
          <Button asChild variant="invert">
            <Link to="/trip">Get started</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
