import { Resolvers } from "apollo-client";
import gql from "graphql-tag";

export const initialState = {
  data: {
    targets: [],
    loading: true,
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

  input FocusPost {
    isFocus: Boolean!
    geoLocation: GeoLo
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
    loading: Boolean!
  }

  extend type Mutation {
    updateTargets(targets: [TargetInput]!): [Target]!
    updateFocusPost(focusPost: FocusPost!): FocusPost!
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
    },
    updateFocusPost: (_, args, { cache }) => {
      const data = {
        focusPost: {
          isFocus: args.focusPost.isFocus,
          geoLocation: {
            lat: args.focusPost.geoLocation.lat,
            lng: args.focusPost.geoLocation.lng,
            __typename: "GeoLocation"
          },
          __typename: "FocusPost"
        }
      };

      cache.writeData({ data });

      return args.focusPost;
    }
  }
};
