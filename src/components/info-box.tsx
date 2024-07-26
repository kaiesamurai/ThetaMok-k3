import type { ComponentProps, PropsWithChildren } from 'react';

import { InfoIcon, XCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

type TInfoBoxProperties = {
  type: 'info' | 'error';
} & PropsWithChildren &
  ComponentProps<'div'>;

export default function InfoBox({
  type,
  children,
  className,
  ...otherProperties
}: TInfoBoxProperties) {
  switch (type) {
    case 'info': {
      return (
        <InfoBoxContainer
          className={cn('bg-muted text-muted-foreground', className)}
          {...otherProperties}
        >
          <InfoIcon className='h-5 w-5 shrink-0' />
          <p className='text-sm'>{children}</p>
        </InfoBoxContainer>
      );
    }
    case 'error': {
      return (
        <InfoBoxContainer
          className={cn('bg-destructive text-destructive-foreground', className)}
          {...otherProperties}
        >
          <XCircle className='h-5 w-5 shrink-0' />
          <p className='text-sm'>{children}</p>
        </InfoBoxContainer>
      );
    }
    default: {
      return null;
    }
  }
}

type TInfoBoxContainerProperties = PropsWithChildren & ComponentProps<'div'>;

function InfoBoxContainer({
  className,
  children,
  ...otherProperties
}: TInfoBoxContainerProperties) {
  return (
    <div
      className={cn('flex items-center gap-x-2.5 rounded-md px-2.5 py-1.5', className)}
      {...otherProperties}
    >
      {children}
    </div>
  );
}
