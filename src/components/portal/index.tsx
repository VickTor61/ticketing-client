import {
  CurrentUser,
  Priority,
  Status,
  Ticket as TicketType,
  TICKETS_QUERY,
  COMMENTS_QUERY,
  Comment,
} from "../../graphql/query";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { CreateTicket } from "./create_ticket";
import { useState } from "react";
import {
  CREATE_COMMENT_MUTATION,
  CREATE_TICKET_MUTATION,
  EXPORT_CLOSED_TICKETS_MUTATION,
  UPDATE_TICKET_MUTATION,
} from "../../graphql/mutation";
import { Ticket } from "./ticket";
import { Tickets } from "./tickets";
import {
  getPriorityColor,
  getStatusColor,
  formatDate,
} from "../../utils/helpers";

export interface TicketUpdateProps {
  id: string;
  status: Status;
  priority: Priority;
}

const Portal = ({ currentUser }: { currentUser: CurrentUser }) => {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const { loading } = useQuery(TICKETS_QUERY, {
    onCompleted: (data) => {
      setTickets(data.tickets);
    },
    onError: (error) => {
      console.error("fetch error", error);
    },
  });

  const [create_ticket, { loading: TicketCreationLoading }] = useMutation(
    CREATE_TICKET_MUTATION,
    {
      onCompleted: (data) => {
        const result = data.createTicket.ticket;

        if (result) {
          setTickets((prevTickets: TicketType[]) => [result, ...prevTickets]);
          setShowCreateForm(false);
        }
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const handleCreateTicket = async (formData: any) => {
    try {
      await create_ticket({
        variables: {
          input: { ...formData, userId: Number(currentUser.id) },
        },
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const [update_ticket] = useMutation(UPDATE_TICKET_MUTATION, {
    onCompleted: (data) => {
      const updatedTicket: TicketType = data.updateTicket.ticket;
      if (updatedTicket) {
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id === updatedTicket.id ? updatedTicket : ticket
          )
        );
        setSelectedTicket(updatedTicket);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleTicketUpdate = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    type: "priority" | "status",
    id: string
  ) => {
    const value = e.target.value;
    const payload = { id: Number(id), [type]: value };

    await update_ticket({
      variables: {
        input: payload,
      },
    });
  };

  const [export_tickets, { loading: downloading }] = useMutation(
    EXPORT_CLOSED_TICKETS_MUTATION,
    {
      onCompleted: ({ closedTickets }) => {
        const { content, filename, content_type } = closedTickets;

        const blob = new Blob([atob(content)], { type: content_type });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
      },
      onError: (error) => {
        console.error("fetch error", error);
      },
    }
  );

  const downloadClosedTickets = async () => {
    await export_tickets();
  };

  const [create_comment, { loading: commentLoading }] = useMutation(
    CREATE_COMMENT_MUTATION,
    {
      onCompleted: (data) => {
        const comment = data.createComment.comment;

        if (comment) {
          setComments((comments) => [...comments, comment]);
        }
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const handleAddComment = async (comment: string, ticketId: string) => {
    try {
      await create_comment({
        variables: {
          input: {
            ticketId: Number(ticketId),
            content: comment,
            userId: Number(currentUser.id),
          },
        },
      });

      setTickets((prevTickets) =>
        prevTickets.map((ticket) => {
          if (ticket.id === ticketId) {
            return {
              ...ticket,
              commentsCount: ticket.commentsCount + 1,
            };
          }
          return ticket;
        })
      );
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const [getComments] = useLazyQuery(COMMENTS_QUERY, {
    onCompleted: (data) => {
      setComments(data.comments);
    },
  });

  const handleTicketSelected = (ticket: TicketType) => {
    setSelectedTicket(ticket);
    getComments({
      variables: { ticketId: ticket.id },
      fetchPolicy: "network-only",
    });
  };

  return (
    <div className="max-w-6xl p-4 mx-auto mt-2">
      <header className="flex items-center justify-end gap-x-2">
        {currentUser.role === "customer" ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="text-sm bg-black text-white font-medium py-1.5 px-2.5 capitalize rounded-md cursor-pointer"
          >
            new Ticket
          </button>
        ) : (
          <button
            onClick={downloadClosedTickets}
            className="text-sm bg-black text-white font-medium py-1.5 px-2.5 capitalize rounded-md cursor-pointer"
          >
            {downloading ? "Downloading" : "Export closed tickets"}
          </button>
        )}
        {}
      </header>

      {showCreateForm && (
        <CreateTicket
          onCancel={() => setShowCreateForm(false)}
          onSubmit={handleCreateTicket}
          loading={TicketCreationLoading}
        />
      )}

      {selectedTicket ? (
        <Ticket
          ticket={selectedTicket}
          onBack={() => setSelectedTicket(null)}
          getStatusColor={(status) => getStatusColor[status]}
          getPriorityColor={(priority) => getPriorityColor[priority]}
          formatDate={formatDate}
          currentUser={currentUser}
          onTicketUpdate={handleTicketUpdate}
          onAddComment={handleAddComment}
          commentLoading={commentLoading}
          comments={comments}
        />
      ) : tickets.length > 0 ? (
        <Tickets
          tickets={tickets}
          loading={loading}
          onSelectTicket={handleTicketSelected}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
          formatDate={formatDate}
        />
      ) : (
        <div className="flex items-center justify-center my-4 text-sm font-semibold h-1/2">
          {currentUser.role === "customer"
            ? "No tickets yet!. Click the button above to create a new support request."
            : "No tickets Yet. Please check back after a customer has created a ticket."}
        </div>
      )}
    </div>
  );
};

export default Portal;
