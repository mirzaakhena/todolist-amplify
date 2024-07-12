# todolist-vue

Simple todo list with realtime subscriptions using _VueJS_ + _DynamoDB_ + _AppSync_ + _GraphQL_

## AWS Infrastructure

![AWS Infrastructure](https://github.com/mirzaakhena/todolist2-vue/blob/main/infrastructure.png)

## GraphQL Schema

```
type Todo {
  id: ID
  title: String
  completed: Boolean
}
type Query {
  getTodos: [Todo]
}
type Mutation {
  addTodo(title: String!): Todo
  updateTodo(id: ID!, completed: Boolean!): Todo
  deleteTodo(id: ID!): Todo
}
type Subscription {
  onTodoChanged: Todo
    @aws_subscribe(mutations: ["addTodo", "updateTodo", "deleteTodo"])
}
schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
```

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Cloud Formation Setup

1. Adjust the `cloud_formation.yml` Parameters : `GitHubOwner`, `GitHubRepo`, `AmplifyAppName` and `BranchName`

2. Prepare the github repository and set the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` at github secret.

   ```
    AWS Console :
      - Goto AWS IAM Console
      - Select User name
      - Security Credentials
      - Create Access Keys
      - Copy Paste the value of `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

    Github
      Settings -> Security -> Secrets and variables -> Actions 
      Create New Repository secrets for
      - `AWS_ACCESS_KEY_ID`
      - `AWS_SECRET_ACCESS_KEY`
   ```

3. Generate (classic) Github Auth Token

   ```
   Github
    Click Picture Profile
    Settings -> Developer Settings
    Personal Access Tokens -> Tokens (classic)
    Generate new token (classic)
    Copy Paste the value of `GITHUB_AUTH_TOKEN`
   ```

4. Create a Cloud Formation stack by provide the `GITHUB_AUTH_TOKEN` value

   ```
    aws cloudformation create-stack \
      --stack-name TodoListStack \
      --template-body file://cloud_formation.yml \
      --parameters \
        ParameterKey=GitHubOAuthToken,ParameterValue=GITHUB_AUTH_TOKEN \
      --capabilities CAPABILITY_IAM
   ```

5. Push your code to github. Adjust your `GitHubOwner` and `GitHubRepo`

   ```
     git remote add origin git@github.com:<GitHubOwner>/<GitHubRepo>.git
     git branch -M main
     git push -u origin main
   ```

6. Goto `https://us-east-1.console.aws.amazon.com/amplify/apps/d2lde6f78mp8a0/overview`. Adjustment required for the region and apps id

7. 
