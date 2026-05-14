type SummaryItemProps = {
  label: string;
  value: string;
};

export function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value || '-'}</dd>
    </>
  );
}
