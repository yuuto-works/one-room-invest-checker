import { useMemo } from 'react';
import { PropertyInput } from '../types';
import { calculateScore } from '../utils/calculations';
import CheckerResult from '../modules/checker/CheckerResult';
import PropertyForm from '../modules/checker/PropertyForm';

type Props = {
  value: PropertyInput;
  onChange: (next: PropertyInput) => void;
  onGoSimulation: () => void;
};

export default function CheckerPage({ value, onChange, onGoSimulation }: Props) {
  const result = useMemo(() => calculateScore(value), [value]);

  return (
    <div className="grid gap-5 xl:grid-cols-12 xl:items-start xl:gap-6">
      <div className="xl:col-span-5">
        <PropertyForm value={value} onChange={onChange} />
      </div>
      <div className="xl:col-span-7">
        <CheckerResult input={value} result={result} onGoSimulation={onGoSimulation} />
      </div>
    </div>
  );
}
