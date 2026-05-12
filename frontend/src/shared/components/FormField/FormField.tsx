import type { ChangeEventHandler } from 'react';
import { useId } from 'react';

type BaseProps = {
  label: string;
  name: string;
  className?: string;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
};

type InputProps = BaseProps & {
  as?: 'input';
  type?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

type TextareaProps = BaseProps & {
  as: 'textarea';
  rows?: number;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
};

type FormFieldProps = InputProps | TextareaProps;

export function FormField(props: FormFieldProps) {
  const generatedId = useId();
  const controlId = 'form-field-' + generatedId.replace(/:/g, '');
  const errorId = controlId + '-error';
  const className = ['form-field', props.className, props.error ? 'has-error' : undefined]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={className}>
      <span className="form-field-label">{props.label}</span>
      {props.as === 'textarea' ? (
        <textarea
          id={controlId}
          className="form-field-control"
          name={props.name}
          value={props.value}
          rows={props.rows || 5}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={props.error ? errorId : undefined}
          onChange={props.onChange}
        />
      ) : (
        <input
          id={controlId}
          className="form-field-control"
          name={props.name}
          type={props.type || 'text'}
          value={props.value}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={props.error ? errorId : undefined}
          onChange={props.onChange}
        />
      )}
      <small id={errorId} className="form-field-error" data-error-for={props.name} aria-live="polite">
        {props.error || ''}
      </small>
    </label>
  );
}
