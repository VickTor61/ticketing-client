import { Loader } from "lucide-react";
import { Ticket } from "../../graphql/query";
import { getStatusColor, getPriorityColor, formatDate } from "../../utils/displayHelpers";


export const Tickets = ({
  tickets,
  loading,
  onSelectTicket,
}: any) => {
  return (
    <main>
      <h1 className="block text-xl font-semibold">Tickets</h1>

      <div className="grid items-start grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && <Loader />}
        {tickets.map((ticket: Ticket) => (
          <div
            key={ticket.id}
            onClick={() => onSelectTicket(ticket)}
            className="cursor-pointer"
          >
            <div className="p-4 border border-gray-100 rounded-md shadow">
              <div className="flex items-start justify-between">
                <div className="text-sm font-semibold text-ellipsis">
                  {ticket.title}
                </div>
                <div className="flex items-center gap-x-2">
                  <span
                    className={`py-1 text-xs px-1.5 rounded bg-black text-white ${
                      getPriorityColor(ticket.priority)
                    }`}
                  >
                    {ticket.priority}
                  </span>
                  <span
                    className={`py-1 text-xs px-1.5 rounded text-white text-nowrap ${
                      getStatusColor(ticket.status) || "bg-gray-500"
                    }`}
                  >
                    {ticket.status.replace("_", " ")}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-sm text-left text-gray-500 text-wrap">
                {ticket.description}
              </div>

              <div className="flex items-start mt-2 text-gray-500 gap-x-2 text-wrap">
                <span className="text-xs truncate">
                  created on: {formatDate(ticket.createdAt)}
                </span>
                <span className="text-xs text-nowrap">
                  {ticket.commentsCount} comment
                  {ticket.commentsCount > 0 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
