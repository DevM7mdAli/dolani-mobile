import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

function Icon({
  icon: IconComponent,
  className,
  size = 24,
  color,
  ...props
}: {
  icon: LucideIcon;
  className?: string;
  size?: number;
  color?: string;
} & React.ComponentProps<LucideIcon>) {
  return (
    <IconComponent
      size={size}
      color={color ?? 'currentColor'}
      className={cn('text-foreground', className)}
      {...props}
    />
  );
}

cssInterop(Icon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: true,
      opacity: true,
    },
  },
});

export { Icon };
