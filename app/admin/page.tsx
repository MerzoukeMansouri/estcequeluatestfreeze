'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Config {
  freezeDays: number[];
}

const DAYS = [
  { id: 1, name: 'Lundi' },
  { id: 2, name: 'Mardi' },
  { id: 3, name: 'Mercredi' },
  { id: 4, name: 'Jeudi' },
  { id: 5, name: 'Vendredi' },
  { id: 6, name: 'Samedi' },
  { id: 7, name: 'Dimanche' },
];

export default function AdminPage() {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/config');
      const config: Config = await response.json();
      setSelectedDays(config.freezeDays);
      updateCurrentStatus(config.freezeDays);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load config:', error);
      setLoading(false);
    }
  };

  const updateCurrentStatus = (freezeDays: number[]) => {
    const now = new Date();
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
    const freeze = freezeDays.includes(dayOfWeek);
    setCurrentStatus(freeze ? 'Freeze' : 'Pas freeze');
  };

  const handleDayToggle = (dayId: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((d) => d !== dayId)
        : [...prev, dayId].sort((a, b) => a - b)
    );
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ freezeDays: selectedDays }),
      });

      if (response.ok) {
        setStatusMessage('Configuration enregistrée avec succès!');
        updateCurrentStatus(selectedDays);
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        setStatusMessage('Erreur lors de l\'enregistrement');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to save config:', error);
      setStatusMessage('Erreur lors de l\'enregistrement');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleReset = () => {
    setSelectedDays([2, 3]); // Default: Mardi, Mercredi
    setStatusMessage('Configuration réinitialisée (Mardi-Mercredi)');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const formatDate = () => {
    const now = new Date();
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const dayName = days[now.getDay()];
    const dateString = now.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return `${dayName} ${dateString}`;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h1>Chargement...</h1>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>Configuration Freeze</h1>

        <div style={styles.currentInfo}>
          <p>
            <strong>Aujourd'hui:</strong> {formatDate()}
          </p>
          <p>
            <strong>Statut actuel:</strong> {currentStatus}
          </p>
        </div>

        <div style={styles.instruction}>
          Sélectionnez les jours de la semaine où le freeze est actif:
        </div>

        <div style={styles.daysGrid}>
          {DAYS.map((day) => (
            <div key={day.id} style={styles.dayCheckbox}>
              <input
                type="checkbox"
                id={`day${day.id}`}
                checked={selectedDays.includes(day.id)}
                onChange={() => handleDayToggle(day.id)}
                style={styles.hiddenCheckbox}
              />
              <label
                htmlFor={`day${day.id}`}
                style={{
                  ...styles.dayLabel,
                  ...(selectedDays.includes(day.id) ? styles.dayLabelChecked : {}),
                }}
              >
                {day.name}
              </label>
            </div>
          ))}
        </div>

        <div style={styles.buttonGroup}>
          <button onClick={handleSave} style={styles.button}>
            Enregistrer
          </button>
          <button onClick={handleReset} style={{ ...styles.button, ...styles.buttonSecondary }}>
            Réinitialiser (Mar-Mer)
          </button>
        </div>

        {statusMessage && (
          <div style={styles.status}>
            {statusMessage}
          </div>
        )}

        <div style={styles.linksContainer}>
          <Link href="/" style={styles.backLink}>
            ← Retour à l'accueil
          </Link>
          <a href="/swagger.html" style={styles.swaggerLink} target="_blank" rel="noopener noreferrer">
            Documentation API (Swagger)
          </a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#fff',
    color: '#000',
    padding: '2rem',
  },
  box: {
    maxWidth: '600px',
    width: '100%',
    border: '2px solid #000',
    padding: '2rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    textAlign: 'center' as const,
  },
  currentInfo: {
    marginBottom: '2rem',
    padding: '1rem',
    border: '2px solid #000',
    backgroundColor: '#f9f9f9',
  },
  instruction: {
    marginBottom: '1.5rem',
    padding: '1rem',
    border: '2px solid #000',
    backgroundColor: '#f9f9f9',
    fontSize: '0.9rem',
  },
  daysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  dayCheckbox: {
    position: 'relative' as const,
  },
  hiddenCheckbox: {
    position: 'absolute' as const,
    opacity: 0,
    cursor: 'pointer',
  },
  dayLabel: {
    display: 'block',
    padding: '1rem',
    border: '2px solid #000',
    backgroundColor: '#fff',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontWeight: 'bold',
  },
  dayLabelChecked: {
    backgroundColor: '#000',
    color: '#fff',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },
  button: {
    flex: 1,
    padding: '1rem',
    border: '2px solid #000',
    backgroundColor: '#000',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    color: '#000',
  },
  status: {
    marginTop: '1.5rem',
    padding: '1rem',
    border: '2px solid #000',
    backgroundColor: '#000',
    color: '#fff',
    textAlign: 'center' as const,
  },
  linksContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    marginTop: '2rem',
    alignItems: 'center',
  },
  backLink: {
    color: '#000',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  swaggerLink: {
    padding: '0.75rem 1.5rem',
    border: '2px solid #000',
    backgroundColor: '#fff',
    color: '#000',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    display: 'inline-block',
  },
};
