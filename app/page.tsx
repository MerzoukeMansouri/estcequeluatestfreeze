'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Config {
  freezeDays: number[];
}

export default function Home() {
  const [isFreeze, setIsFreeze] = useState<boolean | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    const checkFreeze = async () => {
      try {
        // Utiliser l'API is-freeze qui utilise la même logique partagée
        const response = await fetch('/api/is-freeze');
        const data = await response.json();

        setIsFreeze(data.isFreeze);
        setCurrentDate(new Date());

        // Appliquer la classe au body
        if (data.isFreeze) {
          document.body.classList.add('freeze');
          document.body.classList.remove('not-freeze');
        } else {
          document.body.classList.add('not-freeze');
          document.body.classList.remove('freeze');
        }
      } catch (error) {
        console.error('Failed to fetch config:', error);
      }
    };

    checkFreeze();

    // Rafraîchir toutes les minutes
    const interval = setInterval(checkFreeze, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const dayName = days[date.getDay()];
    const dateString = date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return `${dayName} ${dateString}`;
  };

  if (isFreeze === null || !currentDate) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Chargement...</h1>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        {isFreeze ? "Oui c'est freeze" : "Non c'est pas freeze"}
      </h1>
      <div style={styles.dateInfo}>{formatDate(currentDate)}</div>
      <Link href="/admin" style={styles.adminLink}>
        admin
      </Link>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '2rem',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: 'clamp(2.5rem, 8vw, 4rem)',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  dateInfo: {
    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
    marginTop: '2rem',
    opacity: 0.8,
  },
  adminLink: {
    position: 'fixed' as const,
    bottom: '20px',
    right: '20px',
    color: 'inherit',
    textDecoration: 'none',
    opacity: 0.3,
    fontSize: '0.9rem',
    transition: 'opacity 0.3s',
  },
};
