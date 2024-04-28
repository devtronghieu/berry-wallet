import { GraphQLClient, gql } from "graphql-request";

export const qlClient = new GraphQLClient(import.meta.env.VITE_GRAPHQL_ENDPOINT, {
  errorPolicy: "all",
});

export const queryTokenPrice = async (mintAddresses: string[]) => {
  const query = gql`
    query GetTokenPricesByTokenAddresses($mintAddresses: [String!]!) {
      getTokenPricesByTokenAddresses(tokenAddresses: $mintAddresses) {
        price
        tokenAddress
      }
    }
  `;

  const variables = {
    mintAddresses,
  };

  return qlClient.request(query, variables);
};
