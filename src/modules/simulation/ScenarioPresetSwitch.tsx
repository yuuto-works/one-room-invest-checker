import { SCENARIOS } from '../../constants/scenarios';
import { ScenarioKey } from '../../types';

type Props = {
  activeScenario: ScenarioKey;
  onSelect: (key: ScenarioKey) => void;
};

export default function ScenarioPresetSwitch({ activeScenario, onSelect }: Props) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {SCENARIOS.map((scenario) => {
        const active = scenario.key === activeScenario;
        return (
          <button
            key={scenario.key}
            type="button"
            onClick={() => onSelect(scenario.key)}
            className={`rounded-2xl border px-4 py-4 text-left transition ${
              active ? 'border-navy bg-navy text-white shadow-soft' : 'border-line bg-white text-slate-600 hover:bg-mist'
            }`}
          >
            <div className="text-sm font-semibold sm:text-base">{scenario.label}</div>
            <div className={`mt-1 text-xs leading-5 ${active ? 'text-slate-200' : 'text-slate-500'}`}>
              {scenario.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}
