import { useState } from 'react';
import Header from './components/Header';
import TabSwitch from './components/TabSwitch';
import { DEFAULT_PROPERTY_INPUT, DEFAULT_SIMULATION_INPUT } from './constants/defaults';
import { SCENARIOS } from './constants/scenarios';
import CheckerPage from './pages/CheckerPage';
import SimulationPage from './pages/SimulationPage';
import { PropertyInput, ScenarioKey, SimulationInput, TabKey } from './types';

function toSimulationInputFromProperty(property: PropertyInput, current: SimulationInput): SimulationInput {
  return {
    ...current,
    purchasePriceManYen: property.priceManYen,
    initialMonthlyRent: property.monthlyRent,
    managementFeeMonthly: property.managementFee,
    repairReserveMonthly: property.repairReserve,
  };
}

function applyScenarioPreset(current: SimulationInput, key: ScenarioKey): SimulationInput {
  const preset = SCENARIOS.find((item) => item.key === key)!;
  return {
    ...current,
    annualRentDeclineRate: preset.annualRentDeclineRate,
    vacancyRate: preset.vacancyRate,
    annualInterestRate: preset.annualInterestRate,
    annualCostGrowthRate: preset.annualCostGrowthRate,
    annualPriceDeclineRate: preset.annualPriceDeclineRate,
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('checker');
  const [propertyInput, setPropertyInput] = useState<PropertyInput>(DEFAULT_PROPERTY_INPUT);
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>('base');
  const [simulationInput, setSimulationInput] = useState<SimulationInput>(
    applyScenarioPreset(DEFAULT_SIMULATION_INPUT, 'base'),
  );

  const moveToSimulation = () => {
    setSimulationInput((current) => toSimulationInputFromProperty(propertyInput, current));
    setActiveTab('simulation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyScenario = (key: ScenarioKey) => {
    setActiveScenario(key);
    setSimulationInput((current) => applyScenarioPreset(current, key));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(238,243,251,0.98)_52%,_rgba(233,239,248,1)_100%)] px-3 py-4 text-ink sm:px-4 md:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 lg:gap-6">
        <Header />
        <TabSwitch activeTab={activeTab} onChange={setActiveTab} />
        <main className="w-full">
          {activeTab === 'checker' ? (
            <CheckerPage value={propertyInput} onChange={setPropertyInput} onGoSimulation={moveToSimulation} />
          ) : (
            <SimulationPage
              value={simulationInput}
              onChange={setSimulationInput}
              activeScenario={activeScenario}
              onApplyScenario={handleApplyScenario}
            />
          )}
        </main>
      </div>
    </div>
  );
}
