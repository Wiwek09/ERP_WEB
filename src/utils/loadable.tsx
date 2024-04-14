import React, { lazy, Suspense } from "react";

interface Props {
  fallback?: React.ReactNode | null;
}

/**
 * Function to make functional component lazy component
 * @param {() => Promise<{ default: T }>} importFunc - component to make lazy loading
 * @param {Props} param1 - {fallback: FallbackComponent} Component to show when component is not ready
 * @returns - Lazy component
 */
const loadable = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  { fallback = null }: Props = { fallback: null }
) => {
  const LazyComponent = lazy(importFunc);

  return (props: React.ComponentProps<T>): JSX.Element => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default loadable;
