import { TabKey } from '../types';

const tabs: { key: TabKey; label: string; description: string }[] = [
  { key: 'checker', label: '危険度チェック', description: '入口の条件を見る' },
  { key: 'simulation', label: '長期シミュレーション', description: '出口まで見る' },
];

type Props = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

export default function TabSwitch({ activeTab, onChange }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-line bg-white/95 p-2 shadow-panel">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`rounded-xl px-4 py-4 text-left transition sm:px-5 ${
                active ? 'bg-navy text-white shadow-soft' : 'bg-white text-slate-600 hover:bg-mist'
              }`}
            >
              <div className="text-sm font-semibold sm:text-base">{tab.label}</div>
              <div className={`mt-1 text-xs ${active ? 'text-slate-200' : 'text-slate-400'}`}>{tab.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
