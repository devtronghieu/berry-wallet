import { GraphQLResolveInfo } from "graphql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Counter = {
  __typename?: "Counter";
  /** Count (start from 0) */
  count: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
};

export type CreateCounterInput = {
  name: Scalars["String"]["input"];
};

export type LoginResponse = {
  __typename?: "LoginResponse";
  accessToken: Scalars["String"]["output"];
  profile: User;
};

export type LoginUserInput = {
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type Mutation = {
  __typename?: "Mutation";
  createCounter: Counter;
  increaseCounterByName?: Maybe<Counter>;
  login: LoginResponse;
  refresh: LoginResponse;
  register: User;
  removeCounterByName?: Maybe<Counter>;
};

export type MutationCreateCounterArgs = {
  createCounterInput: CreateCounterInput;
};

export type MutationIncreaseCounterByNameArgs = {
  name: Scalars["String"]["input"];
};

export type MutationLoginArgs = {
  loginUserInput: LoginUserInput;
};

export type MutationRegisterArgs = {
  registerUserInput: RegisterUserInput;
};

export type MutationRemoveCounterByNameArgs = {
  name: Scalars["String"]["input"];
};

export type Query = {
  __typename?: "Query";
  counter?: Maybe<Counter>;
  counters: Array<Counter>;
  getTokenPricesByTokenAddresses: Array<Token>;
  user?: Maybe<User>;
};

export type QueryCounterArgs = {
  name: Scalars["String"]["input"];
};

export type QueryGetTokenPricesByTokenAddressesArgs = {
  tokenAddresses: Array<Scalars["String"]["input"]>;
};

export type RegisterUserInput = {
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type Token = {
  __typename?: "Token";
  price: Scalars["Float"]["output"];
  tokenAddress: Scalars["String"]["output"];
};

export type User = {
  __typename?: "User";
  passwordHash: Scalars["String"]["output"];
  roles: Array<UserRole>;
  username: Scalars["String"]["output"];
};

export enum UserRole {
  Admin = "Admin",
  User = "User",
}

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  Counter: ResolverTypeWrapper<Counter>;
  CreateCounterInput: CreateCounterInput;
  Float: ResolverTypeWrapper<Scalars["Float"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  LoginUserInput: LoginUserInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  RegisterUserInput: RegisterUserInput;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  Token: ResolverTypeWrapper<Token>;
  User: ResolverTypeWrapper<User>;
  UserRole: UserRole;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars["Boolean"]["output"];
  Counter: Counter;
  CreateCounterInput: CreateCounterInput;
  Float: Scalars["Float"]["output"];
  Int: Scalars["Int"]["output"];
  LoginResponse: LoginResponse;
  LoginUserInput: LoginUserInput;
  Mutation: {};
  Query: {};
  RegisterUserInput: RegisterUserInput;
  String: Scalars["String"]["output"];
  Token: Token;
  User: User;
};

export type CounterResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Counter"] = ResolversParentTypes["Counter"],
> = {
  count?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["LoginResponse"] = ResolversParentTypes["LoginResponse"],
> = {
  accessToken?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"],
> = {
  createCounter?: Resolver<
    ResolversTypes["Counter"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateCounterArgs, "createCounterInput">
  >;
  increaseCounterByName?: Resolver<
    Maybe<ResolversTypes["Counter"]>,
    ParentType,
    ContextType,
    RequireFields<MutationIncreaseCounterByNameArgs, "name">
  >;
  login?: Resolver<
    ResolversTypes["LoginResponse"],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, "loginUserInput">
  >;
  refresh?: Resolver<ResolversTypes["LoginResponse"], ParentType, ContextType>;
  register?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    RequireFields<MutationRegisterArgs, "registerUserInput">
  >;
  removeCounterByName?: Resolver<
    Maybe<ResolversTypes["Counter"]>,
    ParentType,
    ContextType,
    RequireFields<MutationRemoveCounterByNameArgs, "name">
  >;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = {
  counter?: Resolver<
    Maybe<ResolversTypes["Counter"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCounterArgs, "name">
  >;
  counters?: Resolver<Array<ResolversTypes["Counter"]>, ParentType, ContextType>;
  getTokenPricesByTokenAddresses?: Resolver<
    Array<ResolversTypes["Token"]>,
    ParentType,
    ContextType,
    RequireFields<QueryGetTokenPricesByTokenAddressesArgs, "tokenAddresses">
  >;
  user?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
};

export type TokenResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Token"] = ResolversParentTypes["Token"],
> = {
  price?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  tokenAddress?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"],
> = {
  passwordHash?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes["UserRole"]>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Counter?: CounterResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};
