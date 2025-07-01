import { gql } from "@apollo/client";
import { Role } from "./mutation";

export type Status = "open" | "in_progress" | "resolved" | "closed";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface CurrentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role.CUSTOMER | Role.AGENT;
}
type CurrentUserPick = Pick<
  CurrentUser,
  "email" | "firstName" | "lastName" | "role"
>;

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: CurrentUser;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  closedAt: string | null;
  createdAt: string;
  canComment: boolean;
  customer: CurrentUserPick;
  commentsCount: number;
}

export const CURRENT_USER_QUERY = gql`
  query getCurrentUser {
    me {
      id
      email
      firstName
      lastName
      role
    }
  }
`;

export const TICKETS_QUERY = gql`
  query GetTickets {
    tickets {
      id
      title
      description
      closedAt
      createdAt
      status
      priority
      canComment
      customer {
        email
        firstName
        lastName
      }
      commentsCount
    }
  }
`;

export const COMMENTS_QUERY = gql`
  query Comments($ticketId: ID!) {
    comments(ticketId: $ticketId) {
      id
      content
      createdAt
      user {
        id
        email
        firstName
        role
        lastName
      }
    }
  }
`;
