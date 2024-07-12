/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addTodo = /* GraphQL */ `
  mutation AddTodo($title: String!, $randomId: String!) {
    addTodo(title: $title, randomId: $randomId) {
      id
      title
      completed
      randomId
      createdDate
      __typename
    }
  }
`;

export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo($id: ID!, $completed: Boolean!, $randomId: String!) {
    updateTodo(id: $id, completed: $completed, randomId: $randomId) {
      id
      title
      completed
      randomId
      createdDate
      __typename
    }
  }
`;

export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo($id: ID!, $randomId: String!) {
    deleteTodo(id: $id, randomId: $randomId) {
      id
      title
      completed
      randomId
      createdDate
      __typename
    }
  }
`;
