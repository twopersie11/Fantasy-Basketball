import React, { useEffect, useState } from 'react';
import { getYahooStatus } from '../services/api';
import './YahooConnectButton.css';

function YahooConnectButton({ className = '' }) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      try {
        const status = await getYahooStatus();
        if (isMounted) {
          setConnected(Boolean(status?.connected));
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Unable to retrieve Yahoo auth status', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const statusClass = connected ? 'is-connected' : 'is-disconnected';
  const label = loading ? 'Durum kontrol ediliyor…' : connected ? 'Yahoo Bağlandı' : 'Yahoo ile Bağlan';

  return (
    <a className={`yahoo-connect ${statusClass} ${className}`.trim()} href="/api/auth/yahoo/login">
      {label}
    </a>
  );
}

export default YahooConnectButton;
