export const gaduGaduCode = `'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Contact {
  id: string;
  nick: string;
  status: 'online' | 'away' | 'busy' | 'offline' | 'invisible';
  description: string;
}

interface Message {
  id: string;
  author: string;
  time: string;
  text: string;
  isOwn: boolean;
}

interface ChatHistory {
  [contactId: string]: Message[];
}

interface GaduGaduWindowProps {
  onClose: () => void;
}

export default function GaduGaduWindow({ onClose }: GaduGaduWindowProps) {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<string>('Sylwia');
  const [myStatus, setMyStatus] = useState<'online' | 'away' | 'busy' | 'offline' | 'invisible'>('online');
  const [myDescription, setMyDescription] = useState('▂ ▃ ▅ ▆ █ sLuChAm MuZy █ ▆ ▅ ▃ ▂');
  const [editingDescription, setEditingDescription] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const contacts: Contact[] = [
    { id: 'Artur', nick: '~ArTuReK~', status: 'online', description: '<<<CS 1.6>>> de_dust2 24/7!!! kto chce grać??? pisać!' },
    { id: 'Julka', nick: '•●JuLkA•●', status: 'online', description: '♪♫ TOKIO HOTEL ♫♪ BiLL jEsT mÓj <3<3<3' },
    { id: 'Kaska', nick: 'KaŚkA***', status: 'online', description: 'KOCHAM KONIE ♥♥♥' },
    { id: 'Marcin', nick: 'MaRcInXxX', status: 'online', description: '>>>www.moja-strona.prv.pl<<< WEJDŹ I PODPISZ KSIĘGĘ GOŚCI!!!' },
    { id: 'Piasek', nick: 'PiAsEcZeK', status: 'away', description: 'zaraz wracam... chyba...' },
    { id: 'Rafal', nick: 'RaFaŁeK', status: 'busy', description: 'matura 2006... NIE PISAĆ!!! uczę się' },
    { id: 'Sylwia', nick: '¤SyLwIa¤', status: 'online', description: '✿◕ ‿ ◕✿ *~PiNk GiRl~* ✿◕ ‿ ◕✿ rOżOwO Mi !!!1' },
    { id: 'Wanda', nick: 'WaNdZiA', status: 'offline', description: 'zzZZzzzZZZ... jak coś ważnego to SMS' },
    { id: 'Daniel', nick: 'DaNiEl_666', status: 'away', description: 'SLIPKNOT 4 EVER ♫♪' },
    { id: 'Ania', nick: '**AnIa**', status: 'online', description: 'jestem smutna... nikt mnie nie rozumie...' },
    { id: 'Tomek', nick: 'ToMeK_13', status: 'online', description: '☠ eMo KiD ☠ mY cHeMiCaL rOmAnCe ☠' },
    { id: 'Gosia', nick: '•GoŚkA•', status: 'busy', description: '♥♥♥ mÓj ChŁoPaK jESt nAjLePsZy ♥♥♥' },
    { id: 'Bartek', nick: 'BarTkO', status: 'online', description: '→ www.fotka.pl/bartek123 ← ZOBACZ MOJE FOTKI!!!' },
  ];

  const [chatHistory, setChatHistory] = useState<ChatHistory>({
    '¤SyLwIa¤': [
      { id: '1', author: '¤SyLwIa¤', time: '14:32', text: 'hejka! :*** co u Ciebie słychać? :)', isOwn: false },
      { id: '2', author: 'Ja', time: '14:33', text: 'cześć! wszystko spoko, a u Ciebie?', isOwn: true },
      { id: '3', author: '¤SyLwIa¤', time: '14:34', text: 'super! :) kupiłam sobie różową bluzkę <3<3', isOwn: false },
    ],
  });

  const statusColors = {
    online: '#00CC00',
    away: '#FFAA00',
    busy: '#FF4444',
    offline: '#888888',
    invisible: '#CCCCCC',
  };

  const statusLabels = {
    online: 'Dostępny',
    away: 'Zaraz wracam',
    busy: 'Nie przeszkadzać',
    offline: 'Niedostępny',
    invisible: 'Niewidoczny',
  };

  useEffect(() => {
    if (activeChat && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, activeChat]);

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact.id);
    setActiveChat(contact.nick);
  };

  const handleSendMessage = (text: string, contactNick: string) => {
    if (!text.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      author: 'Ja',
      time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
      text,
      isOwn: true,
    };
    setChatHistory((prev) => ({
      ...prev,
      [contactNick]: [...(prev[contactNick] || []), newMessage],
    }));
  };

  // Contact list view
  if (!activeChat) {
    return (
      <div style={{ width: '100%', height: '100%', backgroundColor: '#ECE9D8', display: 'flex', flexDirection: 'column', fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '11px' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #FF6600 0%, #FF9900 50%, #FFCC00 100%)', padding: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            💬
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '13px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              Gadu-Gadu
            </div>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px' }}>
              Numer: 1234567
            </div>
          </div>
        </div>

        {/* My Status Bar */}
        <div style={{ backgroundColor: '#D4D0C8', padding: '4px 8px', borderBottom: '1px solid #ACA899', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: statusColors[myStatus], border: '1px solid rgba(0,0,0,0.3)' }} />
          <span style={{ fontSize: '10px', color: '#333', flex: 1 }}>{myDescription}</span>
        </div>

        {/* Contact List */}
        <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#fff' }}>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px',
                cursor: 'pointer', borderBottom: '1px solid #F0EDE4',
                backgroundColor: selectedContact === contact.id ? '#316AC5' : 'transparent',
                color: selectedContact === contact.id ? '#fff' : '#000',
              }}
              onClick={() => handleContactClick(contact)}
              onDoubleClick={() => handleContactClick(contact)}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: statusColors[contact.status], border: '1px solid rgba(0,0,0,0.2)', flexShrink: 0 }} />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {contact.nick}
                </div>
                {contact.description && (
                  <div style={{ fontSize: '9px', opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {contact.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Status Bar */}
        <div style={{ backgroundColor: '#D4D0C8', padding: '3px 8px', borderTop: '1px solid #ACA899', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: statusColors[myStatus] }} />
          <span style={{ fontSize: '9px', color: '#333' }}>{statusLabels[myStatus]}</span>
          <span style={{ marginLeft: 'auto', fontSize: '9px', color: '#666' }}>
            {contacts.filter(c => c.status === 'online').length} online
          </span>
        </div>
      </div>
    );
  }

  // Chat view
  const messages = chatHistory[activeChat] || [];
  const [inputText, setInputText] = useState('');

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#ECE9D8', display: 'flex', flexDirection: 'column', fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '11px' }}>
      {/* Chat Header */}
      <div style={{ background: 'linear-gradient(135deg, #FF6600 0%, #FF9900 100%)', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={() => setActiveChat(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', padding: '0 4px' }}>
          ←
        </button>
        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '12px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          {activeChat}
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '8px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isOwn ? 'flex-end' : 'flex-start' }}>
            <div style={{ fontSize: '9px', color: '#888', marginBottom: '2px' }}>
              {msg.author} [{msg.time}]
            </div>
            <div style={{
              maxWidth: '80%', padding: '4px 8px', borderRadius: '4px', fontSize: '11px',
              backgroundColor: msg.isOwn ? '#DCF8C6' : '#F0EDE4',
              border: \`1px solid \${msg.isOwn ? '#B8E0A0' : '#D4D0C8'}\`,
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '6px', backgroundColor: '#ECE9D8', borderTop: '1px solid #ACA899', display: 'flex', gap: '4px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage(inputText, activeChat);
              setInputText('');
            }
          }}
          placeholder="Napisz wiadomość..."
          style={{ flex: 1, padding: '3px 6px', border: '1px solid #ACA899', fontSize: '11px', fontFamily: 'Tahoma, Arial, sans-serif' }}
        />
        <button
          onClick={() => { handleSendMessage(inputText, activeChat); setInputText(''); }}
          style={{ padding: '3px 10px', backgroundColor: '#FF6600', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
        >
          Wyślij
        </button>
      </div>
    </div>
  );
}`;
