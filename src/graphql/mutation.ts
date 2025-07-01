import { gql } from "@apollo/client";

export enum Role {
  CUSTOMER = "customer",
  AGENT = "agent",
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface CreateUserInput {
  userInput: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    role: Role.CUSTOMER | Role.AGENT;
  };
}

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginUserInput!) {
    login(input: $input) {
      user {
        firstName
        lastName
        email
        role
      }
      token
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation SignUp($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        firstName
        lastName
        email
        role
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const CREATE_TICKET_MUTATION = gql`
  mutation createTicket($input: TicketInput!) {
    createTicket(input: $input) {
      ticket {
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
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
      comment {
        id
        content
        createdAt
        ticketId
        user {
          id
          email
          firstName
          lastName
          role
        }
      }
    }
  }
`;

export const UPDATE_TICKET_MUTATION = gql`
  mutation UpdateTicket($input: UpdateTicketInput!) {
    updateTicket(input: $input) {
      ticket {
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
  }
`;

export const EXPORT_CLOSED_TICKETS_MUTATION = gql`
  mutation ExportClosedTickets {
    closedTickets {
      content
      filename
      contentType
    }
  }
`;
