import * as React from 'react';

interface WhenProps {
  condition: boolean;
  children: React.ReactNode;
}

interface ElseProps {
  render?: React.ReactNode;
  children?: React.ReactNode;
}

// Type guard to check if element has the expected props
function isWhenElement(
  element: React.ReactElement,
): element is React.ReactElement<WhenProps> {
  return (
    typeof element.props === 'object' &&
    element.props !== null &&
    'condition' in element.props
  );
}

function isElseElement(
  element: React.ReactElement,
): element is React.ReactElement<ElseProps> {
  return (
    typeof element.props === 'object' &&
    element.props !== null &&
    !('condition' in element.props)
  );
}

export function Show(props: React.PropsWithChildren) {
  let when: React.ReactElement<WhenProps> | null = null;
  let otherwise: React.ReactElement<ElseProps> | null = null;

  React.Children.forEach(props.children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (isWhenElement(child)) {
      if (!when && child.props.condition === true) {
        when = child;
      }
    } else if (isElseElement(child)) {
      otherwise = child;
    }
  });

  return when || otherwise;
}

Show.When = ({ condition, children }: WhenProps) => condition && children;
Show.Else = ({ render, children }: ElseProps) => render ?? children;
