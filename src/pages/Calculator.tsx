import { useState } from 'react';
import { Delete, RotateCcw } from 'lucide-react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setWaitingForNewValue(false);
    }
  };

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display);

    if (memory !== null && operation && !waitingForNewValue) {
      const result = calculate(memory, currentValue, operation);
      setDisplay(String(result));
      setMemory(result);
    } else {
      setMemory(currentValue);
    }

    setOperation(op);
    setWaitingForNewValue(true);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+': return prev + current;
      case '-': return prev - current;
      case '×': return prev * current;
      case '÷': return prev / current;
      case '%': return prev % current;
      case '^': return Math.pow(prev, current);
      default: return current;
    }
  };

  const handleEquals = () => {
    if (memory !== null && operation) {
      const result = calculate(memory, parseFloat(display), operation);
      setDisplay(String(result));
      setMemory(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleScientific = (func: string) => {
    const value = parseFloat(display);
    const factor = angleMode === 'deg' ? Math.PI / 180 : 1;
    let result: number;

    switch (func) {
      case 'sin': result = Math.sin(value * factor); break;
      case 'cos': result = Math.cos(value * factor); break;
      case 'tan': result = Math.tan(value * factor); break;
      case 'log': result = Math.log10(value); break;
      case 'ln': result = Math.log(value); break;
      case 'sqrt': result = Math.sqrt(value); break;
      case '1/x': result = 1 / value; break;
      case 'x²': result = value * value; break;
      case 'x³': result = value * value * value; break;
      case 'e^x': result = Math.exp(value); break;
      case '10^x': result = Math.pow(10, value); break;
      case 'π': result = Math.PI; break;
      case 'e': result = Math.E; break;
      case '|x|': result = Math.abs(value); break;
      default: result = value;
    }

    setDisplay(String(result));
    setWaitingForNewValue(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setMemory(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleToggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Scientific Calculator</h1>
          <p className="text-slate-400">Advanced calculations at your fingertips</p>
        </div>

        {/* Calculator Body */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
          {/* Display */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-lg p-6 mb-4 border border-slate-700">
            <div className="text-right text-4xl font-mono font-bold text-cyan-400 break-words">
              {display}
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setAngleMode('deg')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                angleMode === 'deg'
                  ? 'bg-cyan-500 text-slate-900'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              DEG
            </button>
            <button
              onClick={() => setAngleMode('rad')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                angleMode === 'rad'
                  ? 'bg-cyan-500 text-slate-900'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              RAD
            </button>
          </div>

          {/* Scientific Functions Grid */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {['sin', 'cos', 'tan', 'log'].map((func) => (
              <button
                key={func}
                onClick={() => handleScientific(func)}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
              >
                {func}
              </button>
            ))}
            {['ln', 'sqrt', '1/x', 'x²'].map((func) => (
              <button
                key={func}
                onClick={() => handleScientific(func)}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
              >
                {func}
              </button>
            ))}
            {['x³', 'e^x', '10^x', 'π'].map((func) => (
              <button
                key={func}
                onClick={() => handleScientific(func)}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
              >
                {func}
              </button>
            ))}
            {['e', '|x|', '+/-', '^'].map((func) => (
              <button
                key={func}
                onClick={() => func === '+/-' ? handleToggleSign() : handleScientific(func)}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
              >
                {func}
              </button>
            ))}
          </div>

          {/* Main Calculator Grid */}
          <div className="grid grid-cols-4 gap-2">
            {/* Row 1 */}
            <button
              onClick={handleClear}
              className="col-span-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} /> Clear
            </button>
            <button
              onClick={handleBackspace}
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              <Delete size={20} />
            </button>
            <button
              onClick={() => handleOperation('÷')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors text-xl"
            >
              ÷
            </button>

            {/* Row 2 */}
            {['7', '8', '9'].map((num) => (
              <button
                key={num}
                onClick={() => handleNumber(num)}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors text-xl"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleOperation('×')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors text-xl"
            >
              ×
            </button>

            {/* Row 3 */}
            {['4', '5', '6'].map((num) => (
              <button
                key={num}
                onClick={() => handleNumber(num)}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors text-xl"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleOperation('-')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors text-xl"
            >
              −
            </button>

            {/* Row 4 */}
            {['1', '2', '3'].map((num) => (
              <button
                key={num}
                onClick={() => handleNumber(num)}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors text-xl"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleOperation('+')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors text-xl"
            >
              +
            </button>

            {/* Row 5 */}
            <button
              onClick={() => handleNumber('0')}
              className="col-span-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors text-xl"
            >
              0
            </button>
            <button
              onClick={handleDecimal}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors text-xl"
            >
              .
            </button>
            <button
              onClick={handleEquals}
              className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-colors text-xl"
            >
              =
            </button>
          </div>

          {/* Additional Operations */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => handleOperation('%')}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition-colors"
            >
              %
            </button>
            <button
              onClick={() => handleOperation('^')}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition-colors"
            >
              x^y
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Click buttons or use keyboard for calculations
        </p>
      </div>
    </div>
  );
}
