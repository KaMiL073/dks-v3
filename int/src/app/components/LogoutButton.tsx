// app/components/LogoutButton.tsx
'use client';

import * as React from 'react';

export function LogoutButton() {
  const [pending, setPending] = React.useState(false);

  async function onLogout() {
    try {
      setPending(true);
      const res = await fetch('/api/logout', { method: 'POST' });
      // po sukcesie przeglądarka przeładuje i middleware skieruje na "/"
      window.location.href = '/';
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={onLogout}
      disabled={pending}
      className="text-sm text-red-600 hover:underline disabled:opacity-60"
    >
      {pending ? 'Wylogowuję…' : 'Wyloguj'}
    </button>
  );
}