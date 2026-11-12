import { FileUp, X } from 'lucide-react';
import { useId, useState, type DragEvent, type ReactNode } from 'react';
import { cn } from '../lib/cn.ts';
import { inlineIconButton } from '../lib/popup.ts';

export interface FileInputProps {
  /** Visible label, e.g. "Payout file". */
  label: ReactNode;
  /** File types, as for `<input accept>`, e.g. ".csv,.xlsx" or "image/*". */
  accept?: string;
  multiple?: boolean;
  /** Largest allowed file in bytes. Larger files are rejected with a message. */
  maxSize?: number;
  /** Help under the label, e.g. "CSV or Excel, up to 5 MB". */
  hint?: ReactNode;
  /** The chosen files (controlled). */
  value?: File[];
  onFilesChange?: (files: File[]) => void;
  /** An error from validation or the server. */
  error?: ReactNode;
  disabled?: boolean;
  name?: string;
  className?: string;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const matchesAccept = (file: File, accept?: string) =>
  !accept ||
  accept.split(',').some((rule) => {
    const type = rule.trim().toLowerCase();
    if (!type) return false;
    if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type);
    if (type.endsWith('/*')) return file.type.startsWith(type.slice(0, -1));
    return file.type === type;
  });

/**
 * Choose files by clicking, keyboard (it is a native file input) or dropping them on the zone.
 * Files are checked against `accept` and `maxSize` before `onFilesChange` runs.
 */
export function FileInput({
  label,
  accept,
  multiple = false,
  maxSize,
  hint,
  value,
  onFilesChange,
  error,
  disabled = false,
  name,
  className,
}: FileInputProps) {
  const id = useId();
  const [ownFiles, setOwnFiles] = useState<File[]>([]);
  const [rejection, setRejection] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const files = value ?? ownFiles;

  const choose = (list: FileList | File[]) => {
    const chosen = Array.from(list);
    const wrongType = chosen.filter((file) => !matchesAccept(file, accept));
    const tooBig = maxSize ? chosen.filter((file) => file.size > maxSize) : [];
    const ok = chosen.filter((file) => !wrongType.includes(file) && !tooBig.includes(file));
    const [firstWrong] = wrongType;
    const [firstBig] = tooBig;
    setRejection(
      firstWrong
        ? `${firstWrong.name} is not an accepted file type.`
        : firstBig && maxSize
          ? `${firstBig.name} is larger than ${formatFileSize(maxSize)}.`
          : null
    );
    if (!ok.length) return;
    const next = multiple ? [...files, ...ok] : ok.slice(0, 1);
    if (value === undefined) setOwnFiles(next);
    onFilesChange?.(next);
  };

  const remove = (file: File) => {
    const next = files.filter((f) => f !== file);
    if (value === undefined) setOwnFiles(next);
    onFilesChange?.(next);
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (!disabled) choose(event.dataTransfer.files);
  };

  const message = error ?? rejection;
  return (
    <div className={cn('grid gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-describedby={`${id}-hint`}
        aria-invalid={message ? true : undefined}
        className="peer sr-only"
        onChange={(event) => {
          if (event.target.files) choose(event.target.files);
          event.target.value = '';
        }}
      />
      {/* Dropping is a pointer shortcut; the native input below is the keyboard path. */}
      <div
        role="presentation"
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => {
          setDragging(false);
        }}
        onDrop={onDrop}
      >
        <label
          htmlFor={id}
          data-dragging={dragging || undefined}
          className={cn(
            'flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-dashed border-input bg-surface px-4 py-6 text-center text-sm',
            'hover:bg-surface-muted data-dragging:border-brand data-dragging:bg-brand-soft',
            'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            message && 'border-danger'
          )}
        >
          <FileUp className="size-5 text-fg-muted" aria-hidden />
          <span>
            <span className="font-medium text-fg">Choose {multiple ? 'files' : 'a file'}</span>
            <span className="text-fg-muted"> or drop {multiple ? 'them' : 'it'} here</span>
          </span>
        </label>
      </div>
      <p id={`${id}-hint`} className="text-sm text-fg-muted">
        {hint}
      </p>
      {message && (
        <p role="alert" className="text-sm text-danger">
          {message}
        </p>
      )}
      {files.length > 0 && (
        <ul
          aria-label="Chosen files"
          className="divide-y divide-border rounded-md border border-border"
        >
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`} className="flex items-center gap-2 px-3 py-2 text-sm">
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
              <span className="text-fg-muted tabular-nums">{formatFileSize(file.size)}</span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                disabled={disabled}
                onClick={() => {
                  remove(file);
                }}
                className={inlineIconButton}
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
