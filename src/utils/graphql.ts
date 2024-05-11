import { gql, GraphQLClient } from "graphql-request";

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

export const queryWebSummary = async (url: string) => {
  const query = gql`
    query AskGemini($url: String!) {
      askGemini(url: $url) {
        url
        response
      }
    }
  `;

  const variables = {
    url,
  };

  return qlClient.request(query, variables);
};
