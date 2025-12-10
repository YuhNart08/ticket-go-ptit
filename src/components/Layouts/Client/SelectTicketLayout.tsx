import React from "react";
import TicketCardItem from "./TicketCardItem";

interface Ticket {
  ticket_id: string;
  event_name: string;
  event_date: string;
  event_location?: string;
  event_duration?: string;
  status: string;
}

interface SelectTicketLayoutProps {
  tickets: Ticket[];
}

const SelectTicketLayout: React.FC<SelectTicketLayoutProps> = ({ tickets }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
      {tickets.map((ticket) => {
        if (!ticket) return null;

        return (
          <TicketCardItem key={ticket.ticket_id} ticket={ticket} />
        );
      })}
    </div>
  );
};

export default SelectTicketLayout;