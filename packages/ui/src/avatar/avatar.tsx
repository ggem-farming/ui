import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.ts';

const avatar = cva(
  'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-soft font-semibold text-on-brand-soft select-none',
  {
    variants: {
      size: {
        sm: 'size-6 text-[0.6875rem]',
        md: 'size-8 text-xs',
        lg: 'size-10 text-sm',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

/** "Chikondi Banda" → "CB". */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

export interface AvatarProps extends VariantProps<typeof avatar> {
  /** The person's name: used for the initials and, with `labelled`, as the accessible name. */
  name: string;
  /** Photo URL. Initials show while it loads or if it fails. */
  src?: string;
  /**
   * Announce the avatar to screen readers. Leave off (default) when the name is already shown
   * next to it, so it isn't read twice.
   */
  labelled?: boolean;
  className?: string;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, size, labelled = false, className },
  ref
) {
  return (
    <BaseAvatar.Root
      ref={ref}
      className={cn(avatar({ size }), className)}
      {...(labelled ? { role: 'img', 'aria-label': name } : { 'aria-hidden': true })}
    >
      {src && <BaseAvatar.Image src={src} alt="" className="size-full object-cover" />}
      <BaseAvatar.Fallback delay={src ? 300 : 0}>{initials(name)}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
});
