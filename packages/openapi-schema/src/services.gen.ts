// This file is auto-generated by @hey-api/openapi-ts

import { client, type Options } from '@hey-api/client-fetch';
import type {
  ListResourcesData,
  ListResourcesError,
  ListResourcesResponse,
  GetResourceDetailData,
  GetResourceDetailError,
  GetResourceDetailResponse2,
  UpdateResourceData,
  UpdateResourceError,
  UpdateResourceResponse,
  CreateResourceData,
  CreateResourceError,
  CreateResourceResponse,
  DeleteResourceData,
  DeleteResourceError,
  DeleteResourceResponse,
  ListCollectionsData,
  ListCollectionsError,
  ListCollectionsResponse,
  GetCollectionDetailData,
  GetCollectionDetailError,
  GetCollectionDetailResponse2,
  UpdateCollectionData,
  UpdateCollectionError,
  UpdateCollectionResponse,
  CreateCollectionData,
  CreateCollectionError,
  CreateCollectionResponse,
  DeleteCollectionData,
  DeleteCollectionError,
  DeleteCollectionResponse,
  ListSkillTemplatesData,
  ListSkillTemplatesError,
  ListSkillTemplatesResponse,
  ListSkillsData,
  ListSkillsError,
  ListSkillsResponse,
  CreateSkillData,
  CreateSkillError,
  CreateSkillResponse,
  UpdateSkillData,
  UpdateSkillError,
  UpdateSkillResponse,
  DeleteSkillData,
  DeleteSkillError,
  DeleteSkillResponse,
  InvokeSkillData,
  InvokeSkillError,
  InvokeSkillResponse2,
  StreamInvokeSkillData,
  StreamInvokeSkillError,
  StreamInvokeSkillResponse,
  ListSkillTriggersData,
  ListSkillTriggersError,
  ListSkillTriggersResponse,
  CreateSkillTriggerData,
  CreateSkillTriggerError,
  CreateSkillTriggerResponse,
  UpdateSkillTriggerData,
  UpdateSkillTriggerError,
  UpdateSkillTriggerResponse,
  DeleteSkillTriggerData,
  DeleteSkillTriggerError,
  DeleteSkillTriggerResponse,
  ListSkillLogsData,
  ListSkillLogsError,
  ListSkillLogsResponse,
  ListConversationsError,
  ListConversationsResponse,
  ChatData,
  ChatError,
  ChatResponse,
  CreateConversationData,
  CreateConversationError,
  CreateConversationResponse2,
  GetConversationDetailData,
  GetConversationDetailError,
  GetConversationDetailResponse2,
  PingWeblinkData2,
  PingWeblinkError,
  PingWeblinkResponse2,
  StoreWeblinkData,
  StoreWeblinkError,
  StoreWeblinkResponse,
  ListWeblinksData,
  ListWeblinksError,
  ListWeblinksResponse,
  GetFeedListData,
  GetFeedListError,
  GetFeedListResponse,
  GetDigestListData,
  GetDigestListError,
  GetDigestListResponse,
  GetContentDetailData,
  GetContentDetailError,
  GetContentDetailResponse2,
  GetSettingsError,
  GetSettingsResponse,
  UpdateSettingsData,
  UpdateSettingsError,
  UpdateSettingsResponse,
  GetUserTopicsError,
  GetUserTopicsResponse2,
} from './types.gen';

/**
 * List resources
 * List all resources
 */
export const listResources = (options?: Options<ListResourcesData>) => {
  return (options?.client ?? client).get<ListResourcesResponse, ListResourcesError>({
    ...options,
    url: '/knowledge/resource/list',
  });
};

/**
 * Get resource detail
 * Return resource detail along with its document content
 */
export const getResourceDetail = (options: Options<GetResourceDetailData>) => {
  return (options?.client ?? client).get<GetResourceDetailResponse2, GetResourceDetailError>({
    ...options,
    url: '/knowledge/resource/detail',
  });
};

/**
 * Update resource
 * Update an existing resource
 */
export const updateResource = (options: Options<UpdateResourceData>) => {
  return (options?.client ?? client).post<UpdateResourceResponse, UpdateResourceError>({
    ...options,
    url: '/knowledge/resource/update',
  });
};

/**
 * Create new resource
 * Create a new resource
 */
export const createResource = (options: Options<CreateResourceData>) => {
  return (options?.client ?? client).post<CreateResourceResponse, CreateResourceError>({
    ...options,
    url: '/knowledge/resource/new',
  });
};

/**
 * Delete resource
 * Delete an existing resource
 */
export const deleteResource = (options: Options<DeleteResourceData>) => {
  return (options?.client ?? client).post<DeleteResourceResponse, DeleteResourceError>({
    ...options,
    url: '/knowledge/resource/delete',
  });
};

/**
 * List user collections
 * List all collections for a user
 */
export const listCollections = (options?: Options<ListCollectionsData>) => {
  return (options?.client ?? client).get<ListCollectionsResponse, ListCollectionsError>({
    ...options,
    url: '/knowledge/collection/list',
  });
};

/**
 * Get collection detail
 * Return collection details along with its resources
 */
export const getCollectionDetail = (options: Options<GetCollectionDetailData>) => {
  return (options?.client ?? client).get<GetCollectionDetailResponse2, GetCollectionDetailError>({
    ...options,
    url: '/knowledge/collection/detail',
  });
};

/**
 * Update collection
 * Update an existing collection
 */
export const updateCollection = (options: Options<UpdateCollectionData>) => {
  return (options?.client ?? client).post<UpdateCollectionResponse, UpdateCollectionError>({
    ...options,
    url: '/knowledge/collection/update',
  });
};

/**
 * Create new collection
 * Create a new collection
 */
export const createCollection = (options: Options<CreateCollectionData>) => {
  return (options?.client ?? client).post<CreateCollectionResponse, CreateCollectionError>({
    ...options,
    url: '/knowledge/collection/new',
  });
};

/**
 * Delete collection
 * Delete an existing collection
 */
export const deleteCollection = (options: Options<DeleteCollectionData>) => {
  return (options?.client ?? client).post<DeleteCollectionResponse, DeleteCollectionError>({
    ...options,
    url: '/knowledge/collection/delete',
  });
};

/**
 * List skill templates
 * List all skill templates
 */
export const listSkillTemplates = (options?: Options<ListSkillTemplatesData>) => {
  return (options?.client ?? client).get<ListSkillTemplatesResponse, ListSkillTemplatesError>({
    ...options,
    url: '/skill/template/list',
  });
};

/**
 * List skills
 * List all skills
 */
export const listSkills = (options?: Options<ListSkillsData>) => {
  return (options?.client ?? client).get<ListSkillsResponse, ListSkillsError>({
    ...options,
    url: '/skill/instance/list',
  });
};

/**
 * Create new skill
 * Create a new skill
 */
export const createSkill = (options: Options<CreateSkillData>) => {
  return (options?.client ?? client).post<CreateSkillResponse, CreateSkillError>({
    ...options,
    url: '/skill/instance/new',
  });
};

/**
 * Update skill
 * Update an existing skill
 */
export const updateSkill = (options: Options<UpdateSkillData>) => {
  return (options?.client ?? client).post<UpdateSkillResponse, UpdateSkillError>({
    ...options,
    url: '/skill/instance/update',
  });
};

/**
 * Delete skill
 * Delete an existing skill
 */
export const deleteSkill = (options: Options<DeleteSkillData>) => {
  return (options?.client ?? client).post<DeleteSkillResponse, DeleteSkillError>({
    ...options,
    url: '/skill/instance/delete',
  });
};

/**
 * Invoke skill
 * Invoke a skill
 */
export const invokeSkill = (options: Options<InvokeSkillData>) => {
  return (options?.client ?? client).post<InvokeSkillResponse2, InvokeSkillError>({
    ...options,
    url: '/skill/invoke',
  });
};

/**
 * Stream invoke skill
 * Invoke a skill and return SSE stream
 */
export const streamInvokeSkill = (options: Options<StreamInvokeSkillData>) => {
  return (options?.client ?? client).post<StreamInvokeSkillResponse, StreamInvokeSkillError>({
    ...options,
    url: '/skill/streamInvoke',
  });
};

/**
 * List skill triggers
 * List all skill triggers
 */
export const listSkillTriggers = (options?: Options<ListSkillTriggersData>) => {
  return (options?.client ?? client).get<ListSkillTriggersResponse, ListSkillTriggersError>({
    ...options,
    url: '/skill/trigger/list',
  });
};

/**
 * Create new trigger
 * Create a new trigger
 */
export const createSkillTrigger = (options: Options<CreateSkillTriggerData>) => {
  return (options?.client ?? client).post<CreateSkillTriggerResponse, CreateSkillTriggerError>({
    ...options,
    url: '/skill/trigger/new',
  });
};

/**
 * Update trigger
 * Update an existing trigger
 */
export const updateSkillTrigger = (options: Options<UpdateSkillTriggerData>) => {
  return (options?.client ?? client).post<UpdateSkillTriggerResponse, UpdateSkillTriggerError>({
    ...options,
    url: '/skill/trigger/update',
  });
};

/**
 * Delete trigger
 * Delete an existing trigger
 */
export const deleteSkillTrigger = (options: Options<DeleteSkillTriggerData>) => {
  return (options?.client ?? client).post<DeleteSkillTriggerResponse, DeleteSkillTriggerError>({
    ...options,
    url: '/skill/trigger/delete',
  });
};

/**
 * Get skill logs
 * Get skill logs
 */
export const listSkillLogs = (options?: Options<ListSkillLogsData>) => {
  return (options?.client ?? client).get<ListSkillLogsResponse, ListSkillLogsError>({
    ...options,
    url: '/skill/log/list',
  });
};

/**
 * List conversations
 * List all conversations
 */
export const listConversations = (options?: Options) => {
  return (options?.client ?? client).get<ListConversationsResponse, ListConversationsError>({
    ...options,
    url: '/conversation/list',
  });
};

/**
 * Chat in a streaming style
 * Chat in a streaming style
 */
export const chat = (options: Options<ChatData>) => {
  return (options?.client ?? client).post<ChatResponse, ChatError>({
    ...options,
    url: '/conversation/chat',
  });
};

/**
 * Create new conversation
 * Create a new conversation
 */
export const createConversation = (options: Options<CreateConversationData>) => {
  return (options?.client ?? client).post<CreateConversationResponse2, CreateConversationError>({
    ...options,
    url: '/conversation/new',
  });
};

/**
 * Get conversation
 * Get conversation detail
 */
export const getConversationDetail = (options: Options<GetConversationDetailData>) => {
  return (options?.client ?? client).get<GetConversationDetailResponse2, GetConversationDetailError>({
    ...options,
    url: '/conversation/{convId}',
  });
};

/**
 * Ping a weblink
 * Find out the processing status for a given weblink
 */
export const pingWeblink = (options: Options<PingWeblinkData2>) => {
  return (options?.client ?? client).get<PingWeblinkResponse2, PingWeblinkError>({
    ...options,
    url: '/weblink/ping',
  });
};

/**
 * Store a weblink
 * Store a weblink
 */
export const storeWeblink = (options: Options<StoreWeblinkData>) => {
  return (options?.client ?? client).post<StoreWeblinkResponse, StoreWeblinkError>({
    ...options,
    url: '/weblink/store',
  });
};

/**
 * List weblinks
 * List all weblinks
 */
export const listWeblinks = (options?: Options<ListWeblinksData>) => {
  return (options?.client ?? client).get<ListWeblinksResponse, ListWeblinksError>({
    ...options,
    url: '/weblink/list',
  });
};

/**
 * Get AIGC feed
 * Get AIGC feed
 */
export const getFeedList = (options?: Options<GetFeedListData>) => {
  return (options?.client ?? client).get<GetFeedListResponse, GetFeedListError>({
    ...options,
    url: '/aigc/feed',
  });
};

/**
 * Get AIGC digest
 * Get AIGC digest
 */
export const getDigestList = (options: Options<GetDigestListData>) => {
  return (options?.client ?? client).post<GetDigestListResponse, GetDigestListError>({
    ...options,
    url: '/aigc/digest',
  });
};

/**
 * Get AIGC content detail
 * Get AIGC content detail
 */
export const getContentDetail = (options: Options<GetContentDetailData>) => {
  return (options?.client ?? client).get<GetContentDetailResponse2, GetContentDetailError>({
    ...options,
    url: '/aigc/content/{cid}',
  });
};

/**
 * Get user settings
 * Return settings for current user
 */
export const getSettings = (options?: Options) => {
  return (options?.client ?? client).get<GetSettingsResponse, GetSettingsError>({
    ...options,
    url: '/user/settings',
  });
};

/**
 * Update user settings
 * Update settings for current user
 */
export const updateSettings = (options: Options<UpdateSettingsData>) => {
  return (options?.client ?? client).put<UpdateSettingsResponse, UpdateSettingsError>({
    ...options,
    url: '/user/settings',
  });
};

/**
 * Get user topics
 * Return topics for current user
 */
export const getUserTopics = (options?: Options) => {
  return (options?.client ?? client).get<GetUserTopicsResponse2, GetUserTopicsError>({
    ...options,
    url: '/user/topics',
  });
};
