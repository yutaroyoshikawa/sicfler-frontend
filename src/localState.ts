import { Resolvers } from "apollo-client";
import gql from "graphql-tag";

export const initialState = {
  data: {
    targets: [],
    focusPost: {
      isFocus: false,
      geoLocation: {
        lat: 0,
        lng: 0,
        __typename: "GeoLocation"
      },
      __typename: "FocusPost"
    }
  },
  __typename: "State"
};

export const typeDefs = gql`
  enum Gender {
    male
    female
  }

  input TargetInput {
    age: Number!
    gender: Gender!
  }

  input GeoLocation {
    lat: Float!
    lng: Float!
  }

  type Target {
    age: Number!
    gender: Gender!
  }

  type GeoLocation {
    lat: Float!
    lng: Float!
  }

  type FocusPost {
    isFocus: Boolean!
    geoLocation: GeoLocation!
  }

  extend type Query {
    targets: [Target]!
    focusPost: FocusPost!
  }

  extend type Mutation {
    updateTargets(targets: [TargetInput]!): [Target]!
  }
`;

export const resolvers: Resolvers = {
  Mutation: {
    updateTargets: (_, args, { cache }) => {
      const data = {
        targets: args.targets.map((target: any) => ({
          gender: target.gender,
          age: target.age,
          __typename: "Target",
        })),
      };

      cache.writeData({ data });

      return data.targets;
    }
  }
};
