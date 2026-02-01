import { useState } from 'react'


function BaziInput({ onSubmit, title }) {
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    day: '',
    hour: '12',
    isPartner: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.year && formData.month && formData.day) {
      onSubmit({
        year: parseInt(formData.year),
        month: parseInt(formData.month),
        day: parseInt(formData.day),
        hour: parseInt(formData.hour),
        isPartner: formData.isPartner
      })
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="bazi-input-page">
      <div className="container">
        <header className="header fade-in">
          <h1>🔮</h1>
          <h2>{title}</h2>
          <p>Um eure Beziehung zu verstehen, brauchen wir eure Bazi-Daten</p>
        </header>

        <form onSubmit={handleSubmit} className="bazi-form fade-in">
          <div className="input-group">
            <label>Geburtsjahr</label>
            <select 
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              required
            >
              <option value="">Jahr wählen</option>
              {Array.from({length: 100}, (_, i) => currentYear - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Monat</label>
              <select 
                value={formData.month}
                onChange={(e) => setFormData({...formData, month: e.target.value})}
                required
              >
                <option value="">Monat</option>
                {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Tag</label>
              <select 
                value={formData.day}
                onChange={(e) => setFormData({...formData, day: e.target.value})}
                required
              >
                <option value="">Tag</option>
                {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Geburtsstunde (ungefähr)</label>
            <select 
              value={formData.hour}
              onChange={(e) => setFormData({...formData, hour: e.target.value})}
            >
              <option value="0">Mitternacht (0:00-2:00)</option>
              <option value="2">Tiger (2:00-4:00)</option>
              <option value="4">Hase (4:00-6:00)</option>
              <option value="6">Drache (6:00-8:00)</option>
              <option value="8">Schlange (8:00-10:00)</option>
              <option value="10">Pferd (10:00-12:00)</option>
              <option value="12">Ziege (12:00-14:00)</option>
              <option value="14">Affe (14:00-16:00)</option>
              <option value="16">Hahn (16:00-18:00)</option>
              <option value="18">Hund (18:00-20:00)</option>
              <option value="20">Schwein (20:00-22:00)</option>
              <option value="22">Ratte (22:00-24:00)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Weiter →
          </button>
        </form>
      </div>
    </div>
  )
}

export default BaziInput
