'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';

export default function SwaggerPage() {
  useEffect(() => {
    // Cette fonction sera appelée après le chargement des scripts
    const initSwagger = () => {
      const SwaggerUIBundle = (window as any).SwaggerUIBundle;
      const SwaggerUIStandalonePreset = (window as any).SwaggerUIStandalonePreset;

      if (SwaggerUIBundle && SwaggerUIStandalonePreset) {
        (window as any).ui = SwaggerUIBundle({
          url: '/openapi.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset,
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl,
          ],
          layout: 'StandaloneLayout',
        });
      }
    };

    // Vérifier si les scripts sont déjà chargés
    if ((window as any).SwaggerUIBundle) {
      initSwagger();
    } else {
      // Attendre que les scripts soient chargés
      (window as any).initSwagger = initSwagger;
    }
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css"
      />

      <Script
        src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"
        strategy="afterInteractive"
        onLoad={() => {
          if ((window as any).initSwagger) {
            (window as any).initSwagger();
          }
        }}
      />

      <Script
        src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"
        strategy="afterInteractive"
        onLoad={() => {
          if ((window as any).initSwagger) {
            (window as any).initSwagger();
          }
        }}
      />

      <div style={styles.header}>
        <Link href="/admin" style={styles.backLink}>
          ← Retour à l'admin
        </Link>
        <h1 style={styles.title}>Documentation API</h1>
      </div>
      <div id="swagger-ui" style={styles.swaggerContainer}></div>
    </>
  );
}

const styles = {
  header: {
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    borderBottom: '2px solid #000',
  },
  backLink: {
    color: '#000',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  title: {
    marginTop: '1rem',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  swaggerContainer: {
    padding: '0',
  },
};
