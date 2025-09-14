import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockTickets } from '../../data/mockData';

const TicketsContext = createContext();

export function useTickets() {
  return useContext(TicketsContext);
}

export function TicketsProvider({ children }) {
  const [tickets, setTickets] = useState(() => {
    const savedTickets = localStorage.getItem('tickets');
    return savedTickets ? JSON.parse(savedTickets) : mockTickets;
  });

  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = (ticket) => {
    setTickets(prev => [...prev, ticket]);
  };

  const updateTicket = (id, updatedTicket) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === id ? { ...ticket, ...updatedTicket } : ticket
    ));
  };

  const deleteTicket = (id) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
  };

  const value = {
    tickets,
    addTicket,
    updateTicket,
    deleteTicket
  };

  return (
    <TicketsContext.Provider value={value}>
      {children}
    </TicketsContext.Provider>
  );
}