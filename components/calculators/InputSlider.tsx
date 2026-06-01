"use client";

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export default function InputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = "",
  suffix = "",
  decimals = 2,
}: InputSliderProps) {
  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseFloat(e.target.value);
    if (!isNaN(raw)) onChange(Math.min(max, Math.max(min, raw)));
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-gray-300 font-medium">{label}</label>
      <div className="flex items-center gap-2">
        {prefix && <span className="text-gray-400 text-sm">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={handleText}
          min={min}
          max={max}
          step={step}
          className="w-24 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
        {suffix && <span className="text-gray-400 text-sm">{suffix}</span>}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSlider}
        className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
      />
      <div className="flex justify-between text-xs text-gray-600">
        <span>{prefix}{min.toFixed(decimals)}{suffix}</span>
        <span>{prefix}{max.toFixed(decimals)}{suffix}</span>
      </div>
    </div>
  );
}
