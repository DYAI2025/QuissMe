import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../api/hooks/useUser';

export const BirthDataPage = () => {
  const navigate = useNavigate();
  const { updateBirthData, isLoading } = useUser();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    year: new Date().getFullYear() - 25,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'location' ? value : parseInt(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.location.trim()) {
      setError('Bitte gib deinen Geburtsort ein');
      return;
    }

    try {
      await updateBirthData(formData);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to save birth data');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05060A] to-[#0a0b12] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">🌙 Geburtsdaten</h1>
          <p className="text-gray-400 text-center mb-8 text-sm">Für deine BaZi-Kompatibilität</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Jahr</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D6B25E]"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Monat</label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D6B25E]"
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Tag</label>
                <input
                  type="number"
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  min="1"
                  max="31"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D6B25E]"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Uhrzeit</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="hour"
                    value={formData.hour}
                    onChange={handleChange}
                    min="0"
                    max="23"
                    className="w-1/2 bg-white/10 border border-white/20 rounded-lg px-2 py-2 text-white focus:outline-none focus:border-[#D6B25E]"
                    required
                  />
                  <input
                    type="number"
                    name="minute"
                    value={formData.minute}
                    onChange={handleChange}
                    min="0"
                    max="59"
                    className="w-1/2 bg-white/10 border border-white/20 rounded-lg px-2 py-2 text-white focus:outline-none focus:border-[#D6B25E]"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Geburtsort</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D6B25E]"
                placeholder="z.B. Berlin, Deutschland"
                required
              />
            </div>

            {error && <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#D6B25E] to-[#e8c76f] text-black font-bold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-[#D6B25E]/50 transition disabled:opacity-50"
            >
              {isLoading ? 'Wird gespeichert...' : 'Weiter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
