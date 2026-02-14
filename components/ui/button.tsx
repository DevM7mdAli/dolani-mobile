import { Text, TouchableOpacity } from 'react-native';

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-xl bg-primary active:opacity-90',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        secondary: 'bg-secondary',
        destructive: 'bg-destructive',
        outline: 'border border-border bg-background',
        ghost: 'bg-transparent',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-12 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-14 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const buttonTextVariants = cva('text-base font-medium', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
      ghost: 'text-foreground',
      link: 'text-primary',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface ButtonProps
  extends
    React.ComponentPropsWithoutRef<typeof TouchableOpacity>,
    VariantProps<typeof buttonVariants> {
  label?: string;
  labelClassName?: string;
}

export function Button({
  className,
  variant,
  size,
  label,
  labelClassName,
  children,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {label ? (
        <Text className={cn(buttonTextVariants({ variant, className: labelClassName }))}>
          {label}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
