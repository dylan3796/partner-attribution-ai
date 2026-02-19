/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agents from "../agents.js";
import type * as dashboard from "../dashboard.js";
import type * as deals from "../deals.js";
import type * as deals_mutations from "../deals/mutations.js";
import type * as deals_queries from "../deals/queries.js";
import type * as dealsCrud from "../dealsCrud.js";
import type * as emailNotifications from "../emailNotifications.js";
import type * as eventSources from "../eventSources.js";
import type * as integrations from "../integrations.js";
import type * as leads from "../leads.js";
import type * as lib_attribution from "../lib/attribution.js";
import type * as lib_attribution_calculator from "../lib/attribution/calculator.js";
import type * as lib_attribution_index from "../lib/attribution/index.js";
import type * as lib_attribution_models from "../lib/attribution/models.js";
import type * as lib_helpers from "../lib/helpers.js";
import type * as lib_validation from "../lib/validation.js";
import type * as organizations_mutations from "../organizations/mutations.js";
import type * as organizations_queries from "../organizations/queries.js";
import type * as partners from "../partners.js";
import type * as payouts from "../payouts.js";
import type * as queries_analytics from "../queries/analytics.js";
import type * as seedDemo from "../seedDemo.js";
import type * as setup from "../setup.js";
import type * as touchpoints_mutations from "../touchpoints/mutations.js";
import type * as touchpoints_queries from "../touchpoints/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agents: typeof agents;
  dashboard: typeof dashboard;
  deals: typeof deals;
  "deals/mutations": typeof deals_mutations;
  "deals/queries": typeof deals_queries;
  dealsCrud: typeof dealsCrud;
  emailNotifications: typeof emailNotifications;
  eventSources: typeof eventSources;
  integrations: typeof integrations;
  leads: typeof leads;
  "lib/attribution": typeof lib_attribution;
  "lib/attribution/calculator": typeof lib_attribution_calculator;
  "lib/attribution/index": typeof lib_attribution_index;
  "lib/attribution/models": typeof lib_attribution_models;
  "lib/helpers": typeof lib_helpers;
  "lib/validation": typeof lib_validation;
  "organizations/mutations": typeof organizations_mutations;
  "organizations/queries": typeof organizations_queries;
  partners: typeof partners;
  payouts: typeof payouts;
  "queries/analytics": typeof queries_analytics;
  seedDemo: typeof seedDemo;
  setup: typeof setup;
  "touchpoints/mutations": typeof touchpoints_mutations;
  "touchpoints/queries": typeof touchpoints_queries;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
